
import React from 'react';

type LegalType = 'privacy' | 'terms' | 'parents' | 'contact';

interface LegalCenterProps {
  type: LegalType;
  onBack: () => void;
}

const LegalCenter: React.FC<LegalCenterProps> = ({ type, onBack }) => {
  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <h1 className="text-4xl font-black text-primary mb-6">Privacy Policy</h1>
            <p className="text-lg font-medium text-[#49819c] dark:text-gray-300">
              At Joyful 2026, we take your child's safety seriously. Pratyush Raj has designed this platform with the highest standards of data protection.
            </p>
            <h2 className="text-2xl font-black mt-8 mb-4">What we collect</h2>
            <p>We only collect minimal information needed to save your story history and XP progress. We never sell your data to third parties.</p>
            <h2 className="text-2xl font-black mt-8 mb-4">COPPA Compliance</h2>
            <p>Our app is fully compliant with the Children's Online Privacy Protection Act. Parents have full control over their child's account.</p>
          </div>
        );
      case 'terms':
        return (
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <h1 className="text-4xl font-black text-primary mb-6">Terms of Service</h1>
            <p className="text-lg font-medium text-[#49819c] dark:text-gray-300">
              By using Joyful, you agree to play fair and be kind to others in our community.
            </p>
            <h2 className="text-2xl font-black mt-8 mb-4">Magic Quill Usage</h2>
            <p>The AI Story Lab is for creative and educational purposes only. Please do not generate harmful or inappropriate content.</p>
            <h2 className="text-2xl font-black mt-8 mb-4">Copyright</h2>
            <p>The stories you create are yours! However, the "Joyful" brand and Pratyush Raj's original designs remain our property.</p>
          </div>
        );
      case 'parents':
        return (
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <h1 className="text-4xl font-black text-primary mb-6">Parents Guide</h1>
            <p className="text-lg font-medium text-[#49819c] dark:text-gray-300">
              A helpful guide for parents navigating the world of Joyful 2026.
            </p>
            <h2 className="text-2xl font-black mt-8 mb-4">Safe Learning</h2>
            <p>Every quiz and game is vetted for educational value. The AI is filtered to ensure all output is kid-friendly.</p>
            <h2 className="text-2xl font-black mt-8 mb-4">Monitor Progress</h2>
            <p>You can see your child's XP and unlocked badges in the Rewards Center to celebrate their achievements together!</p>
          </div>
        );
      case 'contact':
        return (
          <div>
            <h1 className="text-4xl font-black text-primary mb-6 text-center">Contact Us</h1>
            <p className="text-lg font-medium text-[#49819c] dark:text-gray-300 text-center mb-10">
              Have a question for Pratyush Raj or the Joyful team? We'd love to hear from you!
            </p>
            <form className="max-w-[600px] mx-auto space-y-6 bg-white dark:bg-white/5 p-8 rounded-3xl border-2 border-primary/10 shadow-xl">
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-primary mb-2">Your Name</label>
                <input type="text" className="w-full p-4 rounded-xl border-2 border-primary/10 focus:border-primary transition-all dark:bg-background-dark" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-primary mb-2">Email Address</label>
                <input type="email" className="w-full p-4 rounded-xl border-2 border-primary/10 focus:border-primary transition-all dark:bg-background-dark" placeholder="parent@example.com" />
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-primary mb-2">Message</label>
                <textarea className="w-full p-4 rounded-xl border-2 border-primary/10 focus:border-primary transition-all dark:bg-background-dark h-32" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" onClick={() => alert("Message sent to Pratyush Raj!")} className="w-full h-16 bg-primary text-white font-black rounded-full shadow-lg bouncy-hover text-xl">
                Send Magic Mail
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-[1000px]">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <div className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">
            Joyful 2026 • by Pratyush Raj
          </div>
        </div>
        
        <div className="bg-white dark:bg-white/5 p-8 md:p-16 rounded-3xl shadow-2xl border-2 border-primary/5 animate-in slide-in-from-bottom duration-500">
          {renderContent()}
        </div>
        
        <div className="mt-12 text-center text-xs font-bold text-[#49819c] uppercase tracking-widest opacity-40">
          Handcrafted with Excellence by Pratyush Raj
        </div>
      </div>
    </section>
  );
};

export default LegalCenter;
