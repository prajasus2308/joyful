
import React, { useMemo } from 'react';
import { GeneratedContent, GeneratedImage } from '../types';

interface PortfolioViewProps {
  xp: number;
  userName: string;
  userBio: string;
  gender: 'boy' | 'girl' | null;
  onEdit: () => void;
  onBack: () => void;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ xp, userName, userBio, gender, onEdit, onBack }) => {
  const stories: GeneratedContent[] = useMemo(() => {
    const saved = localStorage.getItem('joyful_stories');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const artworks: GeneratedImage[] = useMemo(() => {
    // In a real app, images would be in local storage too
    // For now we look for any generated images in session or display a placeholder
    return []; 
  }, []);

  const level = Math.floor(xp / 1000) + 1;
  const avatars = {
    boy: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop",
    girl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400&auto=format&fit=crop"
  };

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-[1200px]">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold hover:underline">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <button onClick={onEdit} className="flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Portfolio
          </button>
        </div>

        {/* Portfolio Hero Card */}
        <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl border-4 border-primary/10 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
            {/* Left: Avatar & Rank */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-8 border-white dark:border-white/10 shadow-2xl overflow-hidden flex items-center justify-center bg-gray-100">
                  <img src={gender ? avatars[gender] : avatars.default} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent-yellow rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg text-xl font-black">
                  {level}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">
                  Master Creator
                </span>
              </div>
            </div>

            {/* Right: Info & Stats */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-black text-[#0d171c] dark:text-white mb-4">{userName || 'Anonymous Explorer'}</h1>
              <p className="text-xl text-[#49819c] font-medium italic mb-8 max-w-[600px]">
                "{userBio || 'Just a happy child learning the magic of the world through Joyful!'}"
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total XP" value={xp.toLocaleString()} icon="stars" />
                <StatCard label="Stories" value={stories.length} icon="menu_book" />
                <StatCard label="Badges" value={Math.floor(xp / 500)} icon="workspace_premium" />
                <StatCard label="Rank" value="Gold" icon="military_tech" />
              </div>
            </div>
          </div>
        </div>

        {/* My Work Sections */}
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-black text-primary mb-8 flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl">auto_stories</span>
              My Published Works
            </h2>
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story, i) => (
                  <div key={i} className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border-2 border-primary/5 shadow-xl hover:scale-[1.02] transition-all">
                    <h3 className="text-xl font-black text-primary mb-3 truncate">{story.title}</h3>
                    <p className="text-sm text-[#49819c] line-clamp-4 font-medium mb-6">
                      {story.text}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-300">
                      <span>{new Date(story.timestamp).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-primary/5 rounded">{story.config?.length || 'Story'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-[3rem] border-4 border-dashed border-primary/10">
                <p className="text-[#49819c] font-black text-xl">No stories published yet!</p>
                <p className="text-sm text-gray-400 mt-2">Head to the Story Lab to start your first book.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-background-light dark:bg-white/5 p-6 rounded-3xl border border-primary/10 flex flex-col items-center md:items-start">
    <div className="flex items-center gap-2 mb-2">
      <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</span>
    </div>
    <span className="text-2xl font-black text-primary">{value}</span>
  </div>
);

export default PortfolioView;
