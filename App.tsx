
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import AIStoryLab from './components/AIStoryLab';
import GamesCenter from './components/GamesCenter';
import LessonsCenter from './components/LessonsCenter';
import RewardsCenter from './components/RewardsCenter';
import LegalCenter from './components/LegalCenter';

enum View {
  LANDING = 'landing',
  STORY_LAB = 'story_lab',
  GAMES = 'games',
  LESSONS = 'lessons',
  REWARDS = 'rewards',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  PARENTS = 'parents',
  CONTACT = 'contact'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('joyful_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('joyful_xp', xp.toString());
  }, [xp]);

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const earnXP = (amount: number) => {
    setXp(prev => prev + amount);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header 
        xp={xp}
        onLogoClick={() => navigateTo(View.LANDING)} 
        onStartClick={() => navigateTo(View.STORY_LAB)} 
        onGamesClick={() => navigateTo(View.GAMES)}
        onLessonsClick={() => navigateTo(View.LESSONS)}
        onRewardsClick={() => navigateTo(View.REWARDS)}
        currentView={currentView}
      />
      
      <main className="flex-1">
        {currentView === View.LANDING && (
          <LandingPage 
            onGetStarted={() => navigateTo(View.STORY_LAB)} 
            onGamesClick={() => navigateTo(View.GAMES)}
            onLessonsClick={() => navigateTo(View.LESSONS)}
            onRewardsClick={() => navigateTo(View.REWARDS)}
          />
        )}
        {currentView === View.STORY_LAB && (
          <AIStoryLab onBack={() => navigateTo(View.LANDING)} onEarnXP={earnXP} />
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
