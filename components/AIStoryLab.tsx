
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const [isListening, setIsListening] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);

  const [history, setHistory] = useState<GeneratedContent[]>(() => {
    const saved = localStorage.getItem('joyful_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('joyful_stories', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const field = recognition.activeField;
        if (field) {
          setConfig(prev => ({ ...prev, [field]: transcript }));
          showToast(`Heard: "${transcript}"`);
        }
        setIsListening(null);
      };

      recognition.onerror = () => setIsListening(null);
      recognition.onend = () => setIsListening(null);
      recognitionRef.current = recognition;
    }
  }, []);

  const handleStartListening = (field: keyof StoryConfig) => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(null);
    } else {
      setIsListening(field);
      recognitionRef.current.activeField = field;
      recognitionRef.current.start();
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleGenerate = async () => {
    if (!config.topic.trim()) {
      setError("What should we write today? Tell Professor Owl!");
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
        config: { ...config }
      };
      
      setHistory([newContent, ...history]);
      onEarnXP(config.length === 'Book Chapter' ? 100 : 50);
      showToast(`Masterpiece Saved to Portfolio! +${config.length === 'Book Chapter' ? 100 : 50} XP`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard! ✨");
  };

  const handleDelete = (timestamp: number) => {
    setHistory(history.filter(item => item.timestamp !== timestamp));
    showToast("Removed from library.");
  };

  const handleShare = async (item: GeneratedContent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.text,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      handleCopy(item.text);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-8 py-3 rounded-full font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">edit_note</span>
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-[1200px]">
        <div className="flex justify-between items-center mb-10">
          <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold hover:underline">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <div className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">Universal Writing Studio</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Creator Panel */}
          <div className="flex flex-col gap-8 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] shadow-xl border-2 border-primary/10 relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div>
              <h2 className="text-3xl font-black text-primary mb-2">Universal Writer</h2>
              <p className="text-[#49819c] font-medium text-sm">Draft paragraphs, full books, or magical poems! 🪄</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Main Topic / Idea</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={config.topic}
                    onChange={(e) => setConfig({...config, topic: e.target.value})}
                    placeholder="e.g., A journey through a black hole"
                    className="w-full p-5 pr-16 rounded-2xl border-2 border-primary/20 focus:border-primary outline-none text-lg font-medium dark:bg-background-dark dark:border-white/10"
                  />
                  <button onClick={() => handleStartListening('topic')} className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening === 'topic' ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}>
                    <span className="material-symbols-outlined">{isListening === 'topic' ? 'mic' : 'mic_none'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Writing Type</label>
                  <select 
                    value={config.length}
                    onChange={(e) => setConfig({...config, length: e.target.value as any})}
                    className="w-full p-5 rounded-2xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3Ryb2tlPSIjNDk4MTljIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNiA4bDQgNCA0LTQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_1.25rem_center] bg-[length:1.5rem]"
                  >
                    <option value="Paragraph">Cool Paragraph</option>
                    <option value="Short Story">Full Short Story</option>
                    <option value="Book Chapter">Book Chapter</option>
                    <option value="Outline">Full Book Outline</option>
                    <option value="Poem">Whimsical Poem</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Tone</label>
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
              </div>

              {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-200">{error}</div>}

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full h-16 rounded-full text-white font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#1d91cc] shadow-primary/40 bouncy-hover'}`}
              >
                {isLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <><span className="material-symbols-outlined">auto_fix_high</span> Draft My Idea</>}
              </button>
            </div>
          </div>

          {/* Library Section */}
          <div className="flex flex-col gap-6 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
            <h3 className="text-2xl font-black text-primary flex items-center gap-3">
              <span className="material-symbols-outlined">menu_book</span>
              My Drafts
            </h3>
            {filteredHistory.length === 0 ? (
              <div className="py-20 text-center border-4 border-dashed border-primary/10 rounded-[3rem]">
                <p className="text-[#49819c] font-black">Your creative library is empty.</p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.timestamp} className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border-l-8 border-primary shadow-lg hover:shadow-xl transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-primary">{item.title}</h4>
                    <button onClick={() => handleDelete(item.timestamp)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  <p className="text-sm text-[#49819c] dark:text-gray-300 font-medium whitespace-pre-wrap mb-6 line-clamp-3 group-hover:line-clamp-none">
                    {item.text}
                  </p>
                  <div className="flex gap-4 border-t border-gray-50 dark:border-white/5 pt-4">
                    <button onClick={() => handleCopy(item.text)} className="text-[10px] font-black uppercase text-primary hover:text-accent-pink">Copy</button>
                    <button onClick={() => handleShare(item)} className="text-[10px] font-black uppercase text-primary hover:text-accent-pink">Share</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIStoryLab;
