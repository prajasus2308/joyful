
import React, { useState, useEffect, useMemo } from 'react';
import { StoryConfig, GeneratedContent } from '../types';
import { generateStoryContent } from '../services/geminiService';

interface AIStoryLabProps {
  onBack: () => void;
  onEarnXP: (amount: number) => void;
}

type SortOption = 'newest' | 'rating';

const AIStoryLab: React.FC<AIStoryLabProps> = ({ onBack, onEarnXP }) => {
  const [config, setConfig] = useState<StoryConfig>({
    topic: '',
    characters: '',
    setting: '',
    tone: 'Adventurous',
    length: 'Paragraph'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Initialize history from localStorage
  const [history, setHistory] = useState<GeneratedContent[]>(() => {
    const saved = localStorage.getItem('joyful_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState<string | null>(null);

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('joyful_stories', JSON.stringify(history));
  }, [history]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = async () => {
    if (!config.topic.trim()) {
      setError("Please tell us what the story should be about!");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateStoryContent(config);
      const newContent: GeneratedContent = {
        title: config.topic.length > 30 ? config.topic.substring(0, 30) + '...' : config.topic,
        text: result,
        timestamp: Date.now(),
        rating: 0,
        config: { ...config } // Store a snapshot of the config
      };
      
      setHistory([newContent, ...history]);
      onEarnXP(50);
      showToast("Magic Created & Saved! +50 XP");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Story copied to clipboard! ✨");
  };

  const handleDelete = (timestamp: number) => {
    setHistory(history.filter(item => item.timestamp !== timestamp));
    showToast("Story removed from library.");
  };

  const handleClearAll = () => {
    setHistory([]);
    setShowClearConfirm(false);
    showToast("Library cleared! Time for new magic.");
  };

  const handleShare = async (item: GeneratedContent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      handleCopy(item.text);
      showToast("Sharing not supported - copied text instead!");
    }
  };

  const handleSetRating = (timestamp: number, rating: number) => {
    setHistory(prev => prev.map(item => 
      item.timestamp === timestamp ? { ...item, rating } : item
    ));
    showToast(`Rated ${rating} stars! 🌟`);
  };

  const handleReloadConfig = (oldConfig: StoryConfig) => {
    setConfig({ ...oldConfig });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast("Magic settings restored! 🪄");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateReadingTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const time = Math.ceil(words / 200); // Average 200 wpm
    return { words, time };
  };

  // Memoized filtered and sorted history
  const filteredHistory = useMemo(() => {
    let result = history.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      result = [...result].sort((a, b) => b.timestamp - a.timestamp);
    }

    return result;
  }, [history, searchQuery, sortBy]);

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-[#fff9eb] dark:bg-background-dark">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-8 py-3 rounded-full font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">magic_button</span>
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-[1200px]">
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <div className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">
            Magic Lab by Pratyush Raj • 2026
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Creator Panel */}
          <div className="flex flex-col gap-8 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] shadow-xl border-2 border-primary/10 relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div>
              <h2 className="text-3xl font-black text-primary mb-2">Magic Story Lab</h2>
              <p className="text-[#49819c] font-medium">What magic will you write today?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">What's the story about?</label>
                <input 
                  type="text" 
                  value={config.topic}
                  onChange={(e) => setConfig({...config, topic: e.target.value})}
                  placeholder="e.g., A robot who discovers a secret forest"
                  className="w-full p-5 rounded-2xl border-2 border-primary/20 focus:border-primary focus:ring-0 transition-all text-lg font-medium dark:bg-background-dark dark:border-white/10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Main Characters</label>
                  <input 
                    type="text" 
                    value={config.characters}
                    onChange={(e) => setConfig({...config, characters: e.target.value})}
                    placeholder="e.g., Sparky the robot"
                    className="w-full p-5 rounded-2xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">The Setting</label>
                  <input 
                    type="text" 
                    value={config.setting}
                    onChange={(e) => setConfig({...config, setting: e.target.value})}
                    placeholder="e.g., Planet Zog"
                    className="w-full p-5 rounded-2xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Story Tone</label>
                  <select 
                    value={config.tone}
                    onChange={(e) => setConfig({...config, tone: e.target.value as any})}
                    className="w-full p-5 rounded-2xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3Ryb2tlPSIjNDk4MTljIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNiA4bDQgNCA0LTQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_1.25rem_center] bg-[length:1.5rem]"
                  >
                    <option value="Adventurous">Adventurous 🚀</option>
                    <option value="Funny">Funny 😂</option>
                    <option value="Educational">Educational 📚</option>
                    <option value="Magical">Magical ✨</option>
                    <option value="Bedtime">Bedtime 🌙</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Length</label>
                  <select 
                    value={config.length}
                    onChange={(e) => setConfig({...config, length: e.target.value as any})}
                    className="w-full p-5 rounded-2xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3Ryb2tlPSIjNDk4MTljIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNiA4bDQgNCA0LTQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_1.25rem_center] bg-[length:1.5rem]"
                  >
                    <option value="Paragraph">Cool Paragraph</option>
                    <option value="Short Story">Full Short Story</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Outline">Book Outline</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-200 animate-shake">
                  {error}
                </div>
              )}

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full h-16 rounded-full text-white font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#1d91cc] bouncy-hover shadow-primary/40'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Brewing Magic...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_fix_high</span>
                    Generate Magic
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6 flex items-center gap-4 p-5 bg-[#fff9eb] dark:bg-white/5 rounded-2xl border border-primary/10">
               <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=200" alt="Child studying" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
               <p className="text-xs font-bold text-[#49819c]">Crafted with love by Pratyush Raj • 2026</p>
            </div>
          </div>

          {/* Result Panel / History Library */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-black text-[#0d171c] dark:text-white flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Magic Library
                  <span className="ml-2 text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full">{history.length}</span>
                </div>
                
                {history.length > 0 && (
                  <div className="flex gap-2">
                    {showClearConfirm ? (
                      <div className="flex gap-2 animate-in slide-in-from-right">
                        <button onClick={handleClearAll} className="text-[10px] font-black bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">YES, CLEAR</button>
                        <button onClick={() => setShowClearConfirm(false)} className="text-[10px] font-black bg-gray-200 text-gray-600 px-3 py-1 rounded-full">CANCEL</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowClearConfirm(true)}
                        className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest border border-gray-200 px-3 py-1 rounded-full transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                )}
              </h3>

              {/* History Search & Filter Bar */}
              {history.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 px-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg">search</span>
                    <input 
                      type="text"
                      placeholder="Search your stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 focus:border-primary outline-none bg-white dark:bg-white/5 text-sm font-bold transition-all"
                    />
                  </div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-3 rounded-xl border-2 border-primary/10 bg-white dark:bg-white/5 text-xs font-black uppercase tracking-wider text-[#49819c] outline-none cursor-pointer hover:border-primary transition-all appearance-none pr-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3Ryb2tlPSIjNDk4MTljIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNiA4bDQgNCA0LTQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar pb-10">
              {filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#49819c] bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-primary/20 overflow-hidden px-10 shadow-inner">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                    <span className="material-symbols-outlined text-5xl">
                      {searchQuery ? 'search_off' : 'edit_note'}
                    </span>
                  </div>
                  <p className="font-black text-2xl mb-2 text-[#0d171c] dark:text-white">
                    {searchQuery ? 'No Matches Found' : 'Empty Library'}
                  </p>
                  <p className="max-w-[300px] mx-auto opacity-70 mb-10 font-medium">
                    {searchQuery ? `We couldn't find any stories matching "${searchQuery}".` : 'Use the lab to start your first story or book chapter!'}
                  </p>
                  {!searchQuery && (
                    <div className="w-full max-w-[420px] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-white/10 group transition-transform hover:scale-[1.02]">
                      <img 
                        src="https://images.unsplash.com/photo-1543004218-ee1411049754?auto=format&fit=crop&q=80&w=1000" 
                        alt="Dreamy library" 
                        className="w-full h-64 object-cover opacity-95 grayscale-[20%]" 
                      />
                    </div>
                  )}
                </div>
              ) : (
                filteredHistory.map((item) => {
                  const { words, time } = calculateReadingTime(item.text);
                  return (
                    <div key={item.timestamp} className="bg-white dark:bg-white/5 p-8 rounded-[2rem] shadow-lg border-l-8 border-primary animate-in slide-in-from-right duration-500 hover:shadow-xl transition-all group/card">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xl font-black text-primary leading-tight truncate max-w-[200px] sm:max-w-none">{item.title}</h4>
                            <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap">{formatDate(item.timestamp)}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-gray-400 text-[9px] font-black rounded-md border border-gray-100 dark:border-white/10 uppercase">
                              {words} words • {time} min read
                            </span>
                            {item.config && (
                              <>
                                <span className="px-2 py-0.5 bg-primary/5 text-primary text-[9px] font-black rounded-md border border-primary/10 uppercase">{item.config.tone}</span>
                                <span className="px-2 py-0.5 bg-accent-pink/5 text-accent-pink text-[9px] font-black rounded-md border border-accent-pink/10 uppercase">{item.config.length}</span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleSetRating(item.timestamp, star)}
                                className={`material-symbols-outlined text-lg transition-all hover:scale-125 ${
                                  (item.rating || 0) >= star ? 'text-accent-yellow' : 'text-gray-200 dark:text-gray-600'
                                }`}
                                style={{ fontVariationSettings: `'FILL' ${(item.rating || 0) >= star ? 1 : 0}` }}
                              >
                                star
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {item.config && (
                            <button 
                              onClick={() => handleReloadConfig(item.config!)}
                              className="w-8 h-8 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all opacity-0 group-hover/card:opacity-100"
                              title="Restore Settings"
                            >
                              <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(item.timestamp)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-300 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/card:opacity-100"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="prose prose-blue dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed text-[#49819c] dark:text-gray-300 whitespace-pre-wrap font-medium line-clamp-4 group-hover/card:line-clamp-none transition-all duration-700">
                          {item.text}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-50 dark:border-white/5 flex flex-wrap gap-4">
                        <button 
                          onClick={() => handleCopy(item.text)}
                          className="flex items-center gap-1.5 text-[11px] font-black text-primary hover:text-accent-pink transition-colors group/btn"
                        >
                          <span className="material-symbols-outlined text-base group-hover/btn:scale-110 transition-transform">content_copy</span>
                          Copy
                        </button>
                        <button 
                          onClick={() => handleShare(item)}
                          className="flex items-center gap-1.5 text-[11px] font-black text-primary hover:text-accent-pink transition-colors group/btn"
                        >
                          <span className="material-symbols-outlined text-base group-hover/btn:scale-110 transition-transform">share</span>
                          Share
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIStoryLab;
