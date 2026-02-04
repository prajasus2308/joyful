
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AIStoryLab from './components/AIStoryLab';
import MagicStudio from './components/MagicStudio';
import GamesCenter from './components/GamesCenter';
import LessonsCenter from './components/LessonsCenter';
import RewardsCenter from './components/RewardsCenter';
import LegalCenter from './components/LegalCenter';
import ChatBot from './components/ChatBot';

enum View {
  LANDING = 'landing',
  STORY_LAB = 'story_lab',
  MAGIC_STUDIO = 'magic_studio',
  GAMES = 'games',
  LESSONS = 'lessons',
  REWARDS = 'rewards',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  PARENTS = 'parents',
  CONTACT = 'contact'
}

type UserGender = 'boy' | 'girl' | null;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [gender, setGender] = useState<UserGender>(() => {
    return localStorage.getItem('joyful_gender') as UserGender;
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('joyful_name') || '';
  });
  const [userBio, setUserBio] = useState<string>(() => {
    return localStorage.getItem('joyful_bio') || '';
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('joyful_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('joyful_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    if (gender) localStorage.setItem('joyful_gender', gender);
    if (userName) localStorage.setItem('joyful_name', userName);
    if (userBio) localStorage.setItem('joyful_bio', userBio);
  }, [gender, userName, userBio]);

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const earnXP = (amount: number) => {
    setXp(prev => prev + amount);
  };

  const handleSaveProfile = () => {
    if (userName.trim() && gender) {
      setShowProfileModal(false);
    }
  };

  const isProfileComplete = !!(userName && gender);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header 
        xp={xp}
        gender={gender}
        userName={userName}
        onLogoClick={() => navigateTo(View.LANDING)} 
        onStartClick={() => navigateTo(View.STORY_LAB)} 
        onMagicStudioClick={() => navigateTo(View.MAGIC_STUDIO)}
        onGamesClick={() => navigateTo(View.GAMES)}
        onLessonsClick={() => navigateTo(View.LESSONS)}
        onRewardsClick={() => navigateTo(View.REWARDS)}
        onProfileClick={() => setShowProfileModal(true)}
        currentView={currentView}
      />
      
      <main className="flex-1">
        {currentView === View.LANDING && (
          <LandingPage 
            onGetStarted={() => navigateTo(View.STORY_LAB)} 
            onMagicStudioClick={() => navigateTo(View.MAGIC_STUDIO)}
            onGamesClick={() => navigateTo(View.GAMES)}
            onLessonsClick={() => navigateTo(View.LESSONS)}
            onRewardsClick={() => navigateTo(View.REWARDS)}
          />
        )}
        {currentView === View.STORY_LAB && (
          <AIStoryLab onBack={() => navigateTo(View.LANDING)} onEarnXP={earnXP} />
        )}
        {currentView === View.MAGIC_STUDIO && (
          <MagicStudio onBack={() => navigateTo(View.LANDING)} onEarnXP={earnXP} />
        )}
        {currentView === View.GAMES && (
          <GamesCenter onBack={() => navigateTo(View.LANDING)} onEarnXP={earnXP} />
        )}
        {currentView === View.LESSONS && (
          <LessonsCenter onBack={() => navigateTo(View.LANDING)} onEarnXP={earnXP} />
        )}
        {currentView === View.REWARDS && (
          <RewardsCenter xp={xp} onBack={() => navigateTo(View.LANDING)} />
        )}
        {(currentView === View.PRIVACY || currentView === View.TERMS || currentView === View.PARENTS || currentView === View.CONTACT) && (
          <LegalCenter type={currentView as unknown as any} onBack={() => navigateTo(View.LANDING)} />
        )}
      </main>

      <ChatBot />

      {/* Profile/Onboarding Modal */}
      {(showProfileModal || !isProfileComplete) && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1a2b34] w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-primary/20 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-primary mb-2">My Creative Portfolio</h2>
              <p className="text-[#49819c] font-medium">Tell us about yourself, explorer! ✨</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Details */}
              <div className="space-y-6 text-left">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-primary mb-2">What is your name?</label>
                  <input 
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-primary/10 focus:border-primary outline-none text-lg font-bold dark:bg-background-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-primary mb-2">Choose your avatar</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setGender('boy')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-4 transition-all ${gender === 'boy' ? 'border-primary bg-primary/10 shadow-lg scale-105' : 'border-transparent bg-gray-50 dark:bg-white/5 opacity-60'}`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=250&auto=format&fit=crop" alt="Boy" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-black">Boy</span>
                    </button>
                    <button 
                      onClick={() => setGender('girl')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-4 transition-all ${gender === 'girl' ? 'border-accent-pink bg-accent-pink/10 shadow-lg scale-105' : 'border-transparent bg-gray-50 dark:bg-white/5 opacity-60'}`}
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop" alt="Girl" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-black">Girl</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-primary mb-2">About me (Bio)</label>
                  <textarea 
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    placeholder="I love space and magic robots!"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-primary/10 focus:border-primary outline-none text-md font-medium dark:bg-background-dark h-32 resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Badges & Preview */}
              <div className="flex flex-col gap-6">
                <div className="bg-background-light dark:bg-white/5 p-8 rounded-[2rem] border-2 border-primary/5 text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                  <h3 className="text-xs font-black text-[#49819c] uppercase tracking-[0.2em] mb-6">Achievement Showcase</h3>
                  
                  {/* Badge Grid - GitHub Style */}
                  <div className="grid grid-cols-4 gap-3 mb-8">
                    {[...Array(12)].map((_, i) => {
                      const isUnlocked = xp >= (i + 1) * 500;
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-xl flex items-center justify-center transition-all ${isUnlocked ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-white/5 text-gray-300'}`}
                          title={isUnlocked ? `Achievement ${i+1}` : `Locked (Needs ${(i+1)*500} XP)`}
                        >
                          <span className="material-symbols-outlined text-sm">{isUnlocked ? 'stars' : 'lock'}</span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase text-[#49819c]">Power Level</span>
                      <span className="text-lg font-black text-primary">{Math.floor(xp / 1000) + 1}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(xp % 1000) / 10}%` }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{xp} Total Experience Points</p>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={!userName.trim() || !gender}
                  className="w-full h-16 rounded-full bg-primary text-white font-black text-xl shadow-xl shadow-primary/20 bouncy-hover disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">save</span>
                  Save My Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer 
        onPrivacyClick={() => navigateTo(View.PRIVACY)}
        onTermsClick={() => navigateTo(View.TERMS)}
        onParentsClick={() => navigateTo(View.PARENTS)}
        onContactClick={() => navigateTo(View.CONTACT)}
      />
    </div>
  );
};

export default App;
export { View };
