
import React from 'react';

interface RewardsCenterProps {
  xp: number;
  onBack: () => void;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  xpRequired: number;
  description: string;
  color: string;
}

const BADGES: Badge[] = [
  { id: '1', name: 'Starter Scout', icon: 'hiking', xpRequired: 0, description: 'Started the adventure with Pratyush Raj!', color: 'bg-green-500' },
  { id: '2', name: 'Story Weaver', icon: 'auto_stories', xpRequired: 500, description: 'Generated 10 magic stories in the lab.', color: 'bg-blue-500' },
  { id: '3', name: 'Logic Ninja', icon: 'psychology', xpRequired: 1500, description: 'Mastered the logical lessons with 100% accuracy.', color: 'bg-purple-500' },
  { id: '4', name: 'Gaming Pro', icon: 'sports_esports', xpRequired: 3000, description: 'Reached a high streak in Math Quest.', color: 'bg-orange-500' },
  { id: '5', name: 'Grand Explorer', icon: 'diamond', xpRequired: 5000, description: 'Unlocked the final frontier of Joyful 2026.', color: 'bg-accent-yellow' },
  { id: '6', name: 'Joyful Legend', icon: 'star', xpRequired: 10000, description: 'The ultimate badge of honor!', color: 'bg-accent-pink' },
];

const RewardsCenter: React.FC<RewardsCenterProps> = ({ xp, onBack }) => {
  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <div className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">
            Trophy Room by Pratyush Raj • 2026
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-[#0d171c] dark:text-white mb-4">Your Rewards Gallery</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="px-6 py-3 bg-white dark:bg-white/5 rounded-full shadow-xl border-2 border-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">stars</span>
              <span className="text-2xl font-black text-primary">{xp} XP Earned</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BADGES.map((badge) => {
            const isUnlocked = xp >= badge.xpRequired;
            const progress = Math.min(100, (xp / badge.xpRequired) * 100);

            return (
              <div 
                key={badge.id} 
                className={`relative group bg-white dark:bg-white/5 p-8 rounded-3xl border-2 transition-all duration-500 ${
                  isUnlocked ? 'border-primary shadow-2xl scale-100 opacity-100' : 'border-gray-200 dark:border-white/10 opacity-60 grayscale'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 text-gray-400">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                )}
                
                <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${isUnlocked ? badge.color : 'bg-gray-300'}`}>
                  <span className="material-symbols-outlined text-4xl">{badge.icon}</span>
                </div>

                <h3 className="text-2xl font-black text-[#0d171c] dark:text-white mb-2">{badge.name}</h3>
                <p className="text-[#49819c] font-medium mb-6">{badge.description}</p>

                {isUnlocked ? (
                  <div className="flex items-center gap-2 text-green-500 font-black uppercase text-xs tracking-widest">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Unlocked
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#49819c] mb-2">
                      <span>Progress</span>
                      <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/10 h-3 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase">Requires {badge.xpRequired} XP</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RewardsCenter;
