
import React, { useState, useEffect } from 'react';
import { StoryConfig, GeneratedContent } from '../types';
import { generateStoryContent } from '../services/geminiService';

interface AIStoryLabProps {
  onBack: () => void;
  onEarnXP: (amount: number) => void;
}

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
        timestamp: Date.now()
      };
      
      // Prepends to history, which triggers the useEffect to save to localStorage
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

          {/* Result Panel */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-black text-[#0d171c] dark:text-white flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Your Library
              </div>
              <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Saved in Browser</span>
            </h3>
            
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[750px] pr-2 custom-scrollbar pb-10">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#49819c] bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-primary/20 overflow-hidden px-10 shadow-inner">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                    <span className="material-symbols-outlined text-5xl">edit_note</span>
                  </div>
                  <p className="font-black text-2xl mb-2 text-[#0d171c] dark:text-white">Empty Library</p>
                  <p className="max-w-[300px] mx-auto opacity-70 mb-10 font-medium">Use the lab to start your first story or book chapter!</p>
                  <div className="w-full max-w-[420px] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white dark:border-white/10 group transition-transform hover:scale-[1.02]">
                    <img 
                      src="https://images.unsplash.com/photo-1543004218-ee1411049754?auto=format&fit=crop&q=80&w=1000" 
                      alt="Dreamy library" 
                      className="w-full h-64 object-cover opacity-95 grayscale-[20%]" 
                    />
                  </div>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.timestamp} className="bg-white dark:bg-white/5 p-10 rounded-[2rem] shadow-lg border-l-8 border-primary animate-in slide-in-from-right duration-500 hover:shadow-xl transition-all group/card">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <h4 className="text-2xl font-black text-primary leading-tight">{item.title}</h4>
                        <span className="text-[10px] font-bold text-gray-400 mt-1">ID: {item.timestamp}</span>
                      </div>
                      <button 
                        onClick={() => handleDelete(item.timestamp)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover/card:opacity-100"
                        title="Delete Story"
                      >
                        <span className="material-symbols-outlined">delete_sweep</span>
                      </button>
                    </div>
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                      <p className="text-lg leading-relaxed text-[#49819c] dark:text-gray-300 whitespace-pre-wrap font-medium font-serif italic">
                        {item.text}
                      </p>
                    </div>
                    <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap gap-6">
                      <button 
                        onClick={() => handleCopy(item.text)}
                        className="flex items-center gap-2 text-sm font-black text-primary hover:text-accent-pink transition-colors group"
                      >
                        <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">content_copy</span>
                        Copy Text
                      </button>
                      <button 
                        onClick={() => handleShare(item)}
                        className="flex items-center gap-2 text-sm font-black text-primary hover:text-accent-pink transition-colors group"
                      >
                        <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">share</span>
                        Share Story
                      </button>
                      <button 
                        onClick={() => showToast("Already stored safely in your magic library! ✨")}
                        className="flex items-center gap-2 text-sm font-black text-emerald-500 hover:text-emerald-600 transition-colors group"
                      >
                        <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">bookmark_added</span>
                        Save Story
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIStoryLab;
