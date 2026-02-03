
import React, { useState } from 'react';
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
  const [history, setHistory] = useState<GeneratedContent[]>([]);

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
        title: config.topic.length > 20 ? config.topic.substring(0, 20) + '...' : config.topic,
        text: result,
        timestamp: Date.now()
      };
      setHistory([newContent, ...history]);
      onEarnXP(50); // Earn 50 XP for every magic generation
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-[1200px]">
        {/* Breadcrumbs / Back */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <div className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">
            Developed by Pratyush Raj • 2026
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Creator Panel */}
          <div className="flex flex-col gap-8 bg-white dark:bg-white/5 p-8 rounded-2xl shadow-xl border-2 border-primary/10">
            <div>
              <h2 className="text-3xl font-black text-primary mb-2">Magic Story Lab</h2>
              <p className="text-[#49819c] font-medium">Use the power of AI to write your next adventure in 2026!</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">What's the story about?</label>
                <input 
                  type="text" 
                  value={config.topic}
                  onChange={(e) => setConfig({...config, topic: e.target.value})}
                  placeholder="e.g., A robot who discovers a secret forest"
                  className="w-full p-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-0 transition-all text-lg font-medium dark:bg-background-dark dark:border-white/10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Main Characters</label>
                  <input 
                    type="text" 
                    value={config.characters}
                    onChange={(e) => setConfig({...config, characters: e.target.value})}
                    placeholder="e.g., Sparky the robot"
                    className="w-full p-4 rounded-xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">The Setting</label>
                  <input 
                    type="text" 
                    value={config.setting}
                    onChange={(e) => setConfig({...config, setting: e.target.value})}
                    placeholder="e.g., Planet Zog or Underwater City"
                    className="w-full p-4 rounded-xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Story Tone</label>
                  <select 
                    value={config.tone}
                    onChange={(e) => setConfig({...config, tone: e.target.value as any})}
                    className="w-full p-4 rounded-xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10"
                  >
                    <option value="Adventurous">Adventurous 🚀</option>
                    <option value="Funny">Funny 😂</option>
                    <option value="Educational">Educational 📚</option>
                    <option value="Magical">Magical ✨</option>
                    <option value="Bedtime">Bedtime 🌙</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">I want to write a...</label>
                  <select 
                    value={config.length}
                    onChange={(e) => setConfig({...config, length: e.target.value as any})}
                    className="w-full p-4 rounded-xl border-2 border-primary/20 focus:border-primary transition-all dark:bg-background-dark dark:border-white/10"
                  >
                    <option value="Paragraph">Cool Paragraph</option>
                    <option value="Short Story">Full Short Story</option>
                    <option value="Book Chapter">A Book Chapter</option>
                    <option value="Outline">Book Outline</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-200">
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
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Panel */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-black text-[#0d171c] dark:text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span>
                Your Story History
              </div>
              <span className="text-[10px] font-black opacity-30 uppercase tracking-tighter">PR 2026</span>
            </h3>
            
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[700px] pr-2">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#49819c] bg-white dark:bg-white/5 rounded-2xl border-2 border-dashed border-primary/20">
                  <span className="material-symbols-outlined text-6xl mb-4 opacity-20">edit_note</span>
                  <p className="font-bold text-xl">Your stories will appear here!</p>
                  <p className="max-w-[250px] mx-auto opacity-70">Fill out the form on the left to start your writing journey with Pratyush Raj's engine.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.timestamp} className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-lg border-l-8 border-primary animate-in slide-in-from-right duration-500">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-2xl font-black text-primary">{item.title}</h4>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="prose prose-blue dark:prose-invert max-w-none">
                      <p className="text-lg leading-relaxed text-[#49819c] dark:text-gray-300 whitespace-pre-wrap font-medium">
                        {item.text}
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex gap-4">
                      <button 
                        onClick={() => navigator.clipboard.writeText(item.text)}
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-pink transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">content_copy</span>
                        Copy Text
                      </button>
                      <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent-pink transition-colors">
                        <span className="material-symbols-outlined text-lg">share</span>
                        Share Story
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
