
import React from 'react';

interface FooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onParentsClick: () => void;
  onContactClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onPrivacyClick, onTermsClick, onParentsClick, onContactClick }) => {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-[#e7eff4] dark:border-white/10 px-6 py-16">
      <div className="mx-auto max-w-[1200px] flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-lg">rocket_launch</span>
            </div>
            <h2 className="text-xl font-black text-primary">Joyful</h2>
          </div>
          <p className="text-[10px] font-black text-[#49819c] dark:text-gray-500 uppercase tracking-[0.3em]">
            by Pratyush Raj
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <button onClick={onPrivacyClick} className="text-[#49819c] dark:text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</button>
          <button onClick={onTermsClick} className="text-[#49819c] dark:text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</button>
          <button onClick={onParentsClick} className="text-[#49819c] dark:text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Parents Guide</button>
          <button onClick={onContactClick} className="text-[#49819c] dark:text-gray-400 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Contact Us</button>
        </div>

        <div className="flex gap-6">
          <a className="flex h-12 w-12 items-center justify-center rounded-full bg-background-light dark:bg-white/5 text-[#49819c] hover:bg-primary hover:text-white transition-all bouncy-hover shadow-sm" href="#" title="Created by Pratyush Raj">
            <span className="material-symbols-outlined">brand_family</span>
          </a>
          <a className="flex h-12 w-12 items-center justify-center rounded-full bg-background-light dark:bg-white/5 text-[#49819c] hover:bg-accent-pink hover:text-white transition-all bouncy-hover shadow-sm" href="#">
            <span className="material-symbols-outlined">smart_display</span>
          </a>
          <a className="flex h-12 w-12 items-center justify-center rounded-full bg-background-light dark:bg-white/5 text-[#49819c] hover:bg-accent-yellow hover:text-white transition-all bouncy-hover shadow-sm" href="#">
            <span className="material-symbols-outlined">share</span>
          </a>
        </div>

        <div className="text-center space-y-1">
          <p className="text-[#0d171c] dark:text-white text-sm font-black uppercase tracking-widest">
            Created by Pratyush Raj
          </p>
          <p className="text-[#49819c] dark:text-gray-500 text-sm font-medium">
            © 2026 Joyful Kids App. All Rights Reserved. Designed with ❤️ for future explorers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
