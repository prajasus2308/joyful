
import React, { useState } from 'react';
import { getRandomFact, getQuickExplanation } from '../services/geminiService';

interface LandingPageProps {
  onGetStarted: () => void;
  onMagicStudioClick: () => void;
  onGamesClick: () => void;
  onLessonsClick: () => void;
  onRewardsClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onMagicStudioClick, onGamesClick, onLessonsClick, onRewardsClick }) => {
  const [fact, setFact] = useState<string | null>(null);
  const [isFactLoading, setIsFactLoading] = useState(false);
  const [doubt, setDoubt] = useState('');
  const [explanation, setExplanation] = useState<{ brief: string, detailed: string, sources: any[] } | null>(null);
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [showDetailed, setShowDetailed] = useState(false);

  const handleGetFact = async () => {
    setIsFactLoading(true);
    const result = await getRandomFact();
    setFact(result);
    setIsFactLoading(false);
  };

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubt.trim() || isAnswerLoading) return;
    setIsAnswerLoading(true);
    const result = await getQuickExplanation(doubt);
    setExplanation(result);
    setShowDetailed(false);
    setIsAnswerLoading(false);
  };

  return (
    <>
      <section className="relative px-6 py-20 md:py-32 overflow-hidden bg-[#fff9eb] dark:bg-background-dark/20">
        <div className="absolute inset-0 hero-glow -z-10"></div>
        <div className="mx-auto max-w-[960px] text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4 animate-bounce">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Created by Pratyush Raj • 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6 bg-gradient-to-r from-primary via-[#ff6fb5] to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
            Learn & Play <br/>Together!
          </h1>
          <p className="text-lg md:text-xl text-[#49819c] dark:text-gray-400 max-w-[600px] mx-auto mb-10 leading-relaxed font-medium">
            The fun way to grow, discover, and make new friends in a safe, colorful world designed just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onGetStarted} className="group flex min-w-[200px] bouncy-hover items-center justify-center gap-2 rounded-full h-16 px-8 bg-primary text-white text-lg font-black shadow-xl shadow-primary/40">
              Get Started
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            <button onClick={handleGetFact} disabled={isFactLoading} className="min-w-[200px] bouncy-hover h-16 px-8 rounded-full border-2 border-primary/20 bg-white dark:bg-white/5 text-primary text-lg font-black hover:bg-primary/5 flex items-center justify-center gap-2 disabled:opacity-50">
              <span className="material-symbols-outlined">{isFactLoading ? 'autorenew' : 'auto_stories'}</span>
              {isFactLoading ? 'Thinking...' : 'Fun Fact!'}
            </button>
          </div>
          {fact && <div className="mt-8 max-w-[500px] mx-auto p-6 bg-white dark:bg-white/5 rounded-[2rem] border-2 border-primary/10 shadow-lg text-primary font-bold italic animate-in zoom-in">✨ {fact}</div>}
        </div>
      </section>

      <section className="px-6 py-20 bg-[#fffdf7] dark:bg-background-dark/40 border-y border-primary/5">
        <div className="mx-auto max-w-[800px] text-center">
          <div className="flex flex-col items-center gap-4 mb-10">
            <div className="h-20 w-20 bg-accent-yellow rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
              <span className="material-symbols-outlined text-5xl">psychology_alt</span>
            </div>
            <h2 className="text-4xl font-black text-[#0d171c] dark:text-white">Ask Professor Owl!</h2>
            <p className="text-[#49819c] font-medium text-lg">Now with Real-World Knowledge! 🌍</p>
          </div>

          <form onSubmit={handleAskDoubt} className="relative group">
            <input 
              type="text" 
              value={doubt}
              onChange={(e) => setDoubt(e.target.value)}
              placeholder="Who won the Super Bowl?"
              className="w-full h-20 px-10 rounded-full border-4 border-primary/10 focus:border-primary outline-none text-xl font-bold dark:bg-background-dark shadow-xl transition-all pr-40"
            />
            <button type="submit" disabled={isAnswerLoading || !doubt.trim()} className="absolute right-4 top-4 h-12 px-8 bg-primary text-white font-black rounded-full bouncy-hover shadow-lg flex items-center gap-2 disabled:opacity-50">
              {isAnswerLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><span className="material-symbols-outlined">send</span> Ask</>}
            </button>
          </form>

          {explanation && (
            <div className="mt-10 p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border-4 border-accent-yellow/10 shadow-2xl text-left animate-in slide-in-from-bottom-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex bg-background-light dark:bg-white/10 rounded-full p-1">
                  <button onClick={() => setShowDetailed(false)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!showDetailed ? 'bg-accent-yellow text-white shadow-md' : 'text-[#49819c]'}`}>Short</button>
                  <button onClick={() => setShowDetailed(true)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${showDetailed ? 'bg-accent-yellow text-white shadow-md' : 'text-[#49819c]'}`}>Detailed</button>
                </div>
              </div>

              <div className="relative min-h-[80px] mb-6">
                <p className="text-xl font-bold text-[#0d171c] dark:text-white leading-relaxed">
                  "{showDetailed ? explanation.detailed : explanation.brief}"
                </p>
              </div>

              {explanation.sources.length > 0 && (
                <div className="pt-6 border-t border-gray-100 dark:border-white/10">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Owl's Sources:</p>
                   <div className="flex flex-wrap gap-3">
                     {explanation.sources.map((s: any, i: number) => (
                       <a key={i} href={s.web?.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1 bg-primary/5 hover:bg-primary/20 rounded-lg text-primary text-[10px] font-bold transition-all">
                         <span className="material-symbols-outlined text-xs">link</span>
                         {s.web?.title || 'Source'}
                       </a>
                     ))}
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="features" className="px-6 py-24 bg-white dark:bg-background-dark/30">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center text-center gap-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[#0d171c] dark:text-white">Discover the Fun</h2>
            <p className="text-[#49819c] dark:text-gray-400 text-lg max-w-[600px]">We've combined education with pure excitement to create the ultimate learning experience in 2026.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon="auto_fix_high" title="Magic Studio" description="Turn your words into colorful art with our magic AI paintbrush!" color="primary" onClick={onMagicStudioClick} />
            <FeatureCard icon="videogame_asset" title="Arcade Zone" description="Master new skills through interactive challenges and level up your avatar." color="accent-pink" onClick={onGamesClick} />
            <FeatureCard icon="workspace_premium" title="Rewards" description="Collect rare, shiny badges for every goal you reach in your gallery." color="accent-yellow" onClick={onRewardsClick} />
            <FeatureCard icon="group" title="Lessons" description="Learn logic and grammar with Professor Owl in a safe environment." color="primary" onClick={onLessonsClick} />
          </div>
        </div>
      </section>
    </>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string; color: string; onClick: () => void }> = ({ icon, title, description, color, onClick }) => (
  <button onClick={onClick} className={`group bouncy-hover text-left flex flex-col gap-6 rounded-[2.5rem] border-2 bg-white dark:bg-white/5 p-8 transition-all hover:shadow-[0_20px_60px_rgba(37,175,244,0.1)] cursor-pointer w-full border-primary/20 hover:border-primary`}>
    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg`}>
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-black text-[#0d171c] dark:text-white">{title}</h3>
      <p className="text-sm text-[#49819c] dark:text-gray-400 font-medium leading-relaxed">{description}</p>
    </div>
  </button>
);

export default LandingPage;
