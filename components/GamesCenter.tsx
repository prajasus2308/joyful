
import React, { useState, useEffect } from 'react';

interface GamesCenterProps {
  onBack: () => void;
  onEarnXP: (amount: number) => void;
}

type GameType = 'math' | 'words' | null;

const GamesCenter: React.FC<GamesCenterProps> = ({ onBack, onEarnXP }) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={activeGame ? () => setActiveGame(null) : onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            {activeGame ? "Exit Game" : "Back to Home"}
          </button>
          <div className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">
            Gaming Zone by Pratyush Raj • 2026
          </div>
        </div>

        {!activeGame ? (
          <div className="flex flex-col gap-12">
            <div className="text-center">
              <h1 className="text-5xl font-black text-primary mb-4">Educational Arcade</h1>
              <p className="text-xl text-[#49819c] font-medium max-w-[600px] mx-auto">
                Play fun games and sharpen your mind while earning massive XP!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto w-full">
              <div 
                onClick={() => setActiveGame('math')}
                className="group cursor-pointer bouncy-hover bg-white dark:bg-white/5 p-10 rounded-3xl border-2 border-primary/20 hover:border-primary shadow-xl transition-all"
              >
                <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30">
                  <span className="material-symbols-outlined text-5xl">calculate</span>
                </div>
                <h3 className="text-3xl font-black text-[#0d171c] dark:text-white mb-4">Math Quest</h3>
                <p className="text-[#49819c] font-medium text-lg leading-relaxed mb-6">
                  Solve addition and subtraction puzzles to help our robot friend reach the rocket!
                </p>
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                  Play Now <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>

              <div 
                onClick={() => setActiveGame('words')}
                className="group cursor-pointer bouncy-hover bg-white dark:bg-white/5 p-10 rounded-3xl border-2 border-accent-pink/20 hover:border-accent-pink shadow-xl transition-all"
              >
                <div className="h-20 w-20 bg-accent-pink rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-accent-pink/30">
                  <span className="material-symbols-outlined text-5xl">spellcheck</span>
                </div>
                <h3 className="text-3xl font-black text-[#0d171c] dark:text-white mb-4">Word Wizard</h3>
                <p className="text-[#49819c] font-medium text-lg leading-relaxed mb-6">
                  Unscramble the letters to reveal secret words and master your vocabulary.
                </p>
                <div className="flex items-center gap-2 text-accent-pink font-black uppercase tracking-widest text-sm">
                  Play Now <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[700px] mx-auto bg-white dark:bg-white/5 p-10 rounded-3xl shadow-2xl border-4 border-primary/10">
            {activeGame === 'math' ? (
              <MathGame onEarnXP={onEarnXP} />
            ) : (
              <WordGame onEarnXP={onEarnXP} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const MathGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0, op: '+', ans: 0 });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const isSub = Math.random() > 0.5 && a > b;
    setProblem({
      a, b, 
      op: isSub ? '-' : '+',
      ans: isSub ? a - b : a + b
    });
    setUserInput('');
    setFeedback(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userInput) === problem.ans) {
      setFeedback('🎉 Correct! Awesome work!');
      setStreak(s => s + 1);
      onEarnXP(25);
      setTimeout(generateProblem, 1500);
    } else {
      setFeedback('❌ Not quite! Try again!');
      setStreak(0);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4 text-primary font-black uppercase tracking-widest text-sm">Math Quest Game</div>
      <h2 className="text-6xl font-black text-primary mb-8 animate-pulse">
        {problem.a} {problem.op} {problem.b} = ?
      </h2>
      <form onSubmit={checkAnswer} className="flex flex-col gap-6">
        <input 
          autoFocus
          type="number" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer"
          className="w-full p-6 text-4xl text-center rounded-2xl border-4 border-primary/20 focus:border-primary transition-all dark:bg-background-dark font-black"
        />
        <button className="h-16 bg-primary text-white text-xl font-black rounded-full bouncy-hover shadow-lg shadow-primary/40">
          Submit Answer
        </button>
      </form>
      {feedback && <div className={`mt-8 text-2xl font-black ${feedback.includes('🎉') ? 'text-green-500' : 'text-red-500'}`}>{feedback}</div>}
      <div className="mt-6 font-bold text-[#49819c]">Current Streak: {streak} 🔥</div>
    </div>
  );
};

const WordGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => {
  const words = ['SPACE', 'ROBOT', 'MAGIC', 'DREAM', 'LEARN', 'HAPPY', 'PLANET', 'STORY', 'FOREST', 'FRIEND'];
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    const sc = word.split('').sort(() => Math.random() - 0.5).join('');
    setCurrentWord(word);
    setScrambled(sc);
    setUserInput('');
    setFeedback(null);
  };

  useEffect(() => {
    generateWord();
  }, []);

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toUpperCase() === currentWord) {
      setFeedback('✨ Word Wizard! You did it!');
      onEarnXP(30);
      setTimeout(generateWord, 1500);
    } else {
      setFeedback('💫 Oops! The magic spell failed. Try again!');
    }
  };

  return (
    <div className="text-center">
      <div className="mb-4 text-accent-pink font-black uppercase tracking-widest text-sm">Word Wizard Challenge</div>
      <div className="text-xs font-bold text-gray-400 mb-2">UNSCRAMBLE THE WORD</div>
      <h2 className="text-6xl font-black text-accent-pink mb-8 tracking-[0.2em]">{scrambled}</h2>
      <form onSubmit={checkAnswer} className="flex flex-col gap-6">
        <input 
          autoFocus
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Unscramble here"
          className="w-full p-6 text-4xl text-center rounded-2xl border-4 border-accent-pink/20 focus:border-accent-pink transition-all dark:bg-background-dark font-black uppercase"
        />
        <button className="h-16 bg-accent-pink text-white text-xl font-black rounded-full bouncy-hover shadow-lg shadow-accent-pink/40">
          Cast Spell
        </button>
      </form>
      {feedback && <div className={`mt-8 text-2xl font-black ${feedback.includes('✨') ? 'text-green-500' : 'text-red-500'}`}>{feedback}</div>}
    </div>
  );
};

export default GamesCenter;
