
import React from 'react';

interface HeaderProps {
  xp: number;
  gender: 'boy' | 'girl' | null;
  userName: string;
  onLogoClick: () => void;
  onStartClick: () => void;
  onMagicStudioClick: () => void;
  onGamesClick: () => void;
  onLessonsClick: () => void;
  onRewardsClick: () => void;
  onProfileClick: () => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ 
  xp, 
  gender, 
  userName,
  onLogoClick, 
  onStartClick, 
  onMagicStudioClick, 
  onGamesClick, 
  onLessonsClick, 
  onRewardsClick, 
  onProfileClick,
  currentView 
}) => {
  const xpPerLevel = 1000;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const progressInLevel = (xp % xpPerLevel) / xpPerLevel * 100;
  
  const avatars = {
    boy: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    girl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format&fit=crop"
  };

  const navClass = (view: string) => `text-sm font-bold uppercase tracking-widest transition-colors ${
    currentView === view ? 'text-primary border-b-2 border-primary' : 'text-[#0d171c] dark:text-white hover:text-primary'
  }`;

  const activeMilestones = Math.min(10, Math.floor(xp / 250));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7eff4] dark:border-white/10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 md:px-20 py-4">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>
          <div className="flex flex-col items-start leading-none text-left">
            <h2 className="text-2xl font-black tracking-tighter text-primary">Joyful</h2>
            <span className="text-[10px] font-bold text-[#49819c] uppercase tracking-tighter">by Pratyush Raj</span>
          </div>
        </button>
        
        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={onStartClick} className={navClass('story_lab')}>Stories</button>
          <button onClick={onMagicStudioClick} className={navClass('magic_studio')}>Magic Studio</button>
          <button onClick={onGamesClick} className={navClass('games')}>Games</button>
          <button onClick={onLessonsClick} className={navClass('lessons')}>Lessons</button>
          <button onClick={onRewardsClick} className={navClass('rewards')}>Rewards</button>
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Portfolio Dashboard Button */}
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-3 md:gap-4 bg-white dark:bg-white/5 pl-2 pr-4 md:pr-6 py-1.5 rounded-full border-2 border-primary/10 hover:border-primary hover:shadow-2xl transition-all group relative"
          >
            {/* Avatar & Ring */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-12 h-12 md:w-16 md:h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - progressInLevel / 100)}
                  className="text-primary transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-inner bg-gray-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img src={gender ? avatars[gender] : avatars.default} alt="My Avatar" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* User Info & Badges */}
            <div className="flex flex-col items-start min-w-[80px] md:min-w-[120px]">
              <div className="flex items-center justify-between w-full mb-0.5">
                <span className="text-sm md:text-base font-black text-primary truncate max-w-[80px] md:max-w-[120px]">
                  {userName || 'New Explorer'}
                </span>
                <span className="hidden md:inline-flex text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-2">LVL {level}</span>
              </div>
              
              {/* GitHub-Style Progress Squares */}
              <div className="flex gap-0.5 mb-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-[1px] shadow-sm ${
                      i < activeMilestones ? 'bg-primary' : 'bg-gray-200 dark:bg-white/10'
                    }`} 
                    title={`Achievement Level ${i+1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-accent-yellow text-[12px] md:text-[14px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span className="text-[9px] font-black text-[#49819c] dark:text-gray-400 uppercase tracking-widest truncate">
                  {xp} XP Earned
                </span>
              </div>
            </div>
          </button>

          <button 
            onClick={onStartClick}
            className="hidden xl:flex min-w-[140px] bouncy-hover cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-primary text-white text-sm font-black shadow-xl shadow-primary/20"
          >
            Start Magic
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
