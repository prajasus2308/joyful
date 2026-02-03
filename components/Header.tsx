
import React from 'react';

interface HeaderProps {
  xp: number;
  onLogoClick: () => void;
  onStartClick: () => void;
  onGamesClick: () => void;
  onLessonsClick: () => void;
  onRewardsClick: () => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ xp, onLogoClick, onStartClick, onGamesClick, onLessonsClick, onRewardsClick, currentView }) => {
  const level = Math.floor(xp / 1000) + 1;

  const navClass = (view: string) => `text-sm font-bold uppercase tracking-widest transition-colors ${
    currentView === view ? 'text-primary border-b-2 border-primary' : 'text-[#0d171c] dark:text-white hover:text-primary'
  }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7eff4] dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-20 py-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <div className="flex flex-col items-start leading-none">
            <h2 className="text-2xl font-black tracking-tighter text-primary">Joyful</h2>
            <span className="text-[10px] font-bold text-[#49819c] uppercase tracking-tighter">by Pratyush Raj</span>
          </div>
        </button>
        
        <nav className="hidden md:flex items-center gap-10">
          <button onClick={onGamesClick} className={navClass('games')}>Games</button>
          <button onClick={onLessonsClick} className={navClass('lessons')}>Lessons</button>
          <button onClick={onRewardsClick} className={navClass('rewards')}>Rewards</button>
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end leading-none">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm font-bold">stars</span>
              <span className="text-sm font-black">{xp} XP</span>
            </div>
            <span className="text-[10px] font-bold text-[#49819c] uppercase">Level {level}</span>
          </div>
          <button 
            onClick={onStartClick}
            className="flex min-w-[120px] bouncy-hover cursor-pointer items-center justify-center rounded-full h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20"
          >
            Start Learning
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
