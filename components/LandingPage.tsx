
import React, { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onGamesClick: () => void;
  onLessonsClick: () => void;
  onRewardsClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onGamesClick, onLessonsClick, onRewardsClick }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-glow -z-10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent-pink/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent-yellow/10 rounded-full blur-3xl"></div>
        
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
            <button 
              onClick={onGetStarted}
              className="group flex min-w-[200px] bouncy-hover items-center justify-center gap-2 rounded-full h-16 px-8 bg-primary text-white text-lg font-black shadow-xl shadow-primary/40"
            >
              Get Started
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            <button 
              onClick={() => setShowVideo(true)}
              className="min-w-[200px] bouncy-hover h-16 px-8 rounded-full border-2 border-primary/20 bg-white dark:bg-white/5 text-primary text-lg font-black hover:bg-primary/5 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">play_circle</span>
              Watch Video
            </button>
          </div>
          <p className="mt-8 text-xs font-bold text-[#49819c] uppercase tracking-widest">
            Handcrafted with excellence by Pratyush Raj
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="mt-20 mx-auto max-w-[1000px] rounded-xl overflow-hidden shadow-2xl border-8 border-white dark:border-white/10 aspect-video bg-cover bg-center transition-transform hover:scale-[1.01] duration-500" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDU41nwUKMbozwnGpnZlyA0wCVGW0zOtL7_g10AWdWRTH19CvrddHWZ2Gbr-4MWKd23e_uCnhma0XNoFNQSJFS-UU6sajUbd0ZwmvQHB-ug9LdEkBkOefK7K3RYY30WESnNjG4Hc2phZVBfyny_sPQX4sXXuk2jZJ1g2dOTvwzRQJ-nhZG_97nHcuuyxzKe4A7gNQWITQ-6x5FV7zPkcToiww0CfxjC0kSTJP6Dw45bnKuDOnRGtNTLV0vl08-B49559TTC6ZNEUy_9')" }}>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-10 animate-in fade-in duration-300">
          <div className="relative w-full max-w-[1200px] aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary/30">
            <button 
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/SGP6Y0Pnhe4?autoplay=1" 
              title="Exciting Space Adventure" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
            <div className="absolute bottom-4 left-6 pointer-events-none">
              <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Presented by Pratyush Raj • Joyful 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Feature Section */}
      <section id="features" className="px-6 py-20 bg-white dark:bg-background-dark/30">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#0d171c] dark:text-white">Discover the Fun</h2>
            <p className="text-[#49819c] dark:text-gray-400 text-lg max-w-[600px]">We've combined education with pure excitement to create the ultimate learning experience in 2026.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="videogame_asset" 
              title="Level Up" 
              description="Master new skills through interactive challenges and level up your custom avatar."
              color="primary"
              onClick={onGamesClick}
            />
            <FeatureCard 
              icon="workspace_premium" 
              title="Earn Badges" 
              description="Collect rare, shiny badges for every goal you reach and show them off in your gallery."
              color="accent-pink"
              onClick={onRewardsClick}
            />
            <FeatureCard 
              icon="group" 
              title="New Friends" 
              description="Meet new friends and learn together in a completely safe, moderated environment."
              color="accent-yellow"
              onClick={onLessonsClick}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-[1000px] rounded-xl bg-gradient-to-br from-primary to-[#1d91cc] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/10 rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight max-w-[700px]">
              Ready for your next big adventure?
            </h2>
            <p className="text-lg md:text-xl font-medium text-white/90 max-w-[600px]">
              Join thousands of kids who are already having a blast while learning something new every day!
            </p>
            <button 
              onClick={onGetStarted}
              className="flex min-w-[240px] bouncy-hover items-center justify-center rounded-full h-16 px-10 bg-white text-primary text-xl font-black shadow-lg"
            >
              Get Started Now
            </button>
            <span className="text-sm font-bold opacity-80 uppercase tracking-widest">
              A Pratyush Raj Production
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string; color: string; onClick: () => void }> = ({ icon, title, description, color, onClick }) => {
  const colorClass = color === 'primary' ? 'bg-primary' : color === 'accent-pink' ? 'bg-accent-pink' : 'bg-accent-yellow';
  const borderClass = color === 'primary' ? 'border-primary/40' : color === 'accent-pink' ? 'border-accent-pink/40' : 'border-accent-yellow/40';
  const hoverBorderClass = color === 'primary' ? 'hover:border-primary' : color === 'accent-pink' ? 'hover:border-accent-pink' : 'hover:border-accent-yellow';
  
  return (
    <button 
      onClick={onClick}
      className={`group bouncy-hover text-left flex flex-col gap-6 rounded-xl border-2 ${borderClass} bg-background-light dark:bg-white/5 p-8 transition-all ${hoverBorderClass} hover:shadow-2xl cursor-pointer w-full`}
    >
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${colorClass} text-white shadow-lg`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-black text-[#0d171c] dark:text-white">{title}</h3>
        <p className="text-[#49819c] dark:text-gray-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

export default LandingPage;
