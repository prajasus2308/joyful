
import React from 'react';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onParentsClick: () => void;
  onContactClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick, onParentsClick, onContactClick }) => {
  const handleSocialClick = (platform: string) => {
    // For demo purposes, we show a friendly alert. In production, these would be real links.
    alert(`Connecting to ${platform} portal... Powered by Pratyush Raj 2026`);
  };

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-[#e7eff4] dark:border-white/10 px-6 py-20">
      <div className="mx-auto max-w-[1200px] flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">rocket_launch</span>
            </div>
            <h2 className="text-2xl font-black text-primary">Joyful</h2>
          </div>
          <p className="text-[10px] font-black text-[#49819c] dark:text-gray-500 uppercase tracking-[0.4em]">
            by Pratyush Raj
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <button onClick={onPrivacyClick} className="text-[#49819c] dark:text-gray-400 text-sm font-black uppercase tracking-widest hover:text-primary transition-all hover:scale-105">Privacy</button>
          <button onClick={onTermsClick} className="text-[#49819c] dark:text-gray-400 text-sm font-black uppercase tracking-widest hover:text-primary transition-all hover:scale-105">Terms</button>
          <button onClick={onParentsClick} className="text-[#49819c] dark:text-gray-400 text-sm font-black uppercase tracking-widest hover:text-primary transition-all hover:scale-105">Parents Guide</button>
          <button onClick={onContactClick} className="text-[#49819c] dark:text-gray-400 text-sm font-black uppercase tracking-widest hover:text-primary transition-all hover:scale-105">Contact</button>
        </div>

        <div className="flex gap-8">
          <button 
            onClick={() => handleSocialClick('Instagram')}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background-light dark:bg-white/5 text-[#49819c] hover:bg-primary hover:text-white transition-all bouncy-hover shadow-sm"
          >
            <span className="material-symbols-outlined text-2xl">brand_family</span>
          </button>
          <button 
            onClick={() => handleSocialClick('YouTube')}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background-light dark:bg-white/5 text-[#49819c] hover:bg-accent-pink hover:text-white transition-all bouncy-hover shadow-sm"
          >
            <span className="material-symbols-outlined text-2xl">smart_display</span>
          </button>
          <button 
            onClick={() => handleSocialClick('Twitter')}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background-light dark:bg-white/5 text-[#49819c] hover:bg-accent-yellow hover:text-white transition-all bouncy-hover shadow-sm"
          >
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-[#0d171c] dark:text-white text-sm font-black uppercase tracking-widest">
            Handcrafted with Excellence by Pratyush Raj
          </p>
          <p className="text-[#49819c] dark:text-gray-500 text-sm font-medium opacity-80 max-w-[500px]">
            © 2026 Joyful Kids App. All Rights Reserved. <br/>
            Designed with love for future explorers and dreamers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
