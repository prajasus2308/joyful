
import React, { useState, useEffect } from 'react';
import { 
  getGrammarExplanation, 
  getWordFunFact, 
  getWordAudio, 
  playPcmAudio 
} from '../services/geminiService';

interface GamesCenterProps {
  onBack: () => void;
  onEarnXP: (amount: number) => void;
}

type GameType = 'math' | 'words' | 'memory' | 'eco' | 'logic' | 'science' | 'biology' | 'paleo' | 'weather' | 'grammar' | 'word_maker' | null;

const GamesCenter: React.FC<GamesCenterProps> = ({ onBack, onEarnXP }) => {
  const [activeGame, setActiveGame] = useState<GameType>(null);

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-[#fff9eb] dark:bg-background-dark">
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
                Sharpen your skills and earn XP with our growing library of magic challenges!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              <GameCard 
                title="Grammar Guardian" 
                desc="Master nouns, verbs, and adjectives with Professor Owl's help!"
                icon="menu_book"
                color="bg-rose-500"
                hoverColor="hover:border-rose-500"
                onClick={() => setActiveGame('grammar')}
              />
              <GameCard 
                title="Word Architect" 
                desc="Build complex words from scrambled tiles to earn big rewards!"
                icon="architecture"
                color="bg-emerald-600"
                hoverColor="hover:border-emerald-600"
                onClick={() => setActiveGame('word_maker')}
              />
              <GameCard 
                title="Space Voyager" 
                desc="Order the planets and launch your science rocket!"
                icon="rocket_launch"
                color="bg-indigo-600"
                hoverColor="hover:border-indigo-600"
                onClick={() => setActiveGame('science')}
              />
              <GameCard 
                title="Habitat Hero" 
                desc="Help animals find their correct homes across the globe!"
                icon="pets"
                color="bg-orange-500"
                hoverColor="hover:border-orange-500"
                onClick={() => setActiveGame('biology')}
              />
              <GameCard 
                title="Dino Sorter" 
                desc="Are you a Paleo-expert? Sort dinos by what they eat!"
                icon="history_edu"
                color="bg-amber-700"
                hoverColor="hover:border-amber-700"
                onClick={() => setActiveGame('paleo')}
              />
              <GameCard 
                title="Water Wizard" 
                desc="Master the cycle of rain, clouds, and sunshine!"
                icon="water_drop"
                color="bg-cyan-500"
                hoverColor="hover:border-cyan-500"
                onClick={() => setActiveGame('weather')}
              />
              <GameCard 
                title="Eco Sorter" 
                desc="Help the planet by sorting items correctly!"
                icon="recycling"
                color="bg-green-500"
                hoverColor="hover:border-green-500"
                onClick={() => setActiveGame('eco')}
              />
              <GameCard 
                title="Math Quest" 
                desc="Solve puzzles to help the robot reach the rocket!"
                icon="calculate"
                color="bg-primary"
                hoverColor="hover:border-primary"
                onClick={() => setActiveGame('math')}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-[800px] mx-auto bg-white dark:bg-white/5 p-10 rounded-[3rem] shadow-2xl border-4 border-primary/10 overflow-hidden">
            {activeGame === 'grammar' && <GrammarGame onEarnXP={onEarnXP} />}
            {activeGame === 'word_maker' && <WordMakerGame onEarnXP={onEarnXP} />}
            {activeGame === 'science' && <ScienceGame onEarnXP={onEarnXP} />}
            {activeGame === 'biology' && <BiologyGame onEarnXP={onEarnXP} />}
            {activeGame === 'paleo' && <PaleoGame onEarnXP={onEarnXP} />}
            {activeGame === 'weather' && <WeatherGame onEarnXP={onEarnXP} />}
            {activeGame === 'eco' && <EcoGame onEarnXP={onEarnXP} />}
            {activeGame === 'math' && <MathGame onEarnXP={onEarnXP} />}
          </div>
        )}
      </div>
    </section>
  );
};

const GameCard: React.FC<{ title: string, desc: string, icon: string, color: string, hoverColor: string, onClick: () => void }> = ({ title, desc, icon, color, hoverColor, onClick }) => (
  <div 
    onClick={onClick}
    className={`group cursor-pointer bouncy-hover bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border-2 border-primary/5 ${hoverColor} shadow-xl transition-all`}
  >
    <div className={`h-20 w-20 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-black/10`}>
      <span className="material-symbols-outlined text-5xl">{icon}</span>
    </div>
    <h3 className="text-3xl font-black text-[#0d171c] dark:text-white mb-4">{title}</h3>
    <p className="text-[#49819c] font-medium text-lg leading-relaxed mb-6">
      {desc}
    </p>
    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
      Play Now <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
    </div>
  </div>
);

// --- Grammar Guardian Game Implementation ---

const GrammarGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => {
  const words = [
    { text: 'Sprinting', type: 'Verb', phonetic: 'SPRIN-ting' },
    { text: 'Elephant', type: 'Noun', phonetic: 'EL-uh-funt' },
    { text: 'Sparkling', type: 'Adjective', phonetic: 'SPAR-kling' },
    { text: 'Danced', type: 'Verb', phonetic: 'DANST' },
    { text: 'Magnificent', type: 'Adjective', phonetic: 'mag-NIF-uh-suhnt' },
    { text: 'Scientist', type: 'Noun', phonetic: 'SY-uhn-tist' },
    { text: 'Whispered', type: 'Verb', phonetic: 'WHIS-perd' },
    { text: 'Brave', type: 'Adjective', phonetic: 'BRAVE' },
    { text: 'Ocean', type: 'Noun', phonetic: 'OH-shun' },
  ];

  const categories = ['Noun', 'Verb', 'Adjective'];
  const [current, setCurrent] = useState(words[0]);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // AI States
  const [funFact, setFunFact] = useState<string | null>(null);
  const [doubt, setDoubt] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const nextWord = () => {
    const next = words[Math.floor(Math.random() * words.length)];
    setCurrent(next);
    setFeedback(null);
    setFunFact(null);
    setAiAnswer(null);
    setDoubt('');
  };

  const handleChoice = (type: string) => {
    if (type === current.type) {
      setFeedback(`✨ Perfect! "${current.text}" is a ${type}!`);
      onEarnXP(45);
      setTimeout(nextWord, 2000);
    } else {
      setFeedback('❌ Not quite. Think about how the word is used!');
    }
  };

  const handlePlayAudio = async () => {
    if (isAudioLoading) return;
    setIsAudioLoading(true);
    const audioData = await getWordAudio(current.text);
    if (audioData) {
      await playPcmAudio(audioData);
    }
    setIsAudioLoading(false);
  };

  const handleGetFact = async () => {
    setIsAiLoading(true);
    const fact = await getWordFunFact(current.text);
    setFunFact(fact);
    setIsAiLoading(false);
  };

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubt.trim()) return;
    setIsAiLoading(true);
    const answer = await getGrammarExplanation(current.text, current.type, doubt);
    setAiAnswer(answer);
    setIsAiLoading(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <div className="mb-4 text-rose-600 font-black uppercase tracking-widest text-sm">Grammar Guardian</div>
        
        <div className="relative inline-block mb-10 group">
          <div className="px-12 py-8 bg-rose-50 rounded-[3rem] border-4 border-rose-100 shadow-lg group-hover:border-rose-300 transition-all">
            <h2 className="text-6xl font-black text-rose-600 mb-2">{current.text}</h2>
            <div className="flex items-center justify-center gap-3 text-rose-400 font-bold">
              <span className="text-sm">/{current.phonetic}/</span>
              <button 
                onClick={handlePlayAudio}
                className={`flex items-center justify-center h-8 w-8 rounded-full bg-rose-200 text-rose-600 hover:scale-110 transition-transform ${isAudioLoading ? 'animate-pulse' : ''}`}
              >
                <span className="material-symbols-outlined text-lg">volume_up</span>
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleGetFact}
            className="absolute -top-4 -right-4 h-12 w-12 bg-amber-400 rounded-full text-white shadow-lg bouncy-hover flex items-center justify-center"
            title="Magic Fact"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
          </button>
        </div>

        {funFact && (
          <div className="mb-10 p-5 bg-amber-50 border-2 border-amber-200 rounded-[2rem] text-amber-900 font-bold italic animate-in zoom-in">
            ✨ {funFact}
          </div>
        )}

        <p className="text-2xl font-black text-[#0d171c] mb-8">What part of speech is this word?</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => handleChoice(cat)}
              className="p-6 bg-white border-4 border-rose-100 rounded-[2rem] font-black text-xl text-rose-900 hover:border-rose-500 hover:bg-rose-50 transition-all bouncy-hover shadow-md"
            >
              {cat}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`text-xl font-black ${feedback.includes('✨') ? 'text-green-500' : 'text-red-500'} animate-in slide-in-from-bottom`}>
            {feedback}
          </div>
        )}
      </div>

      {/* AI Doubt Box */}
      <div className="mt-6 pt-10 border-t-2 border-rose-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <span className="material-symbols-outlined">psychology_alt</span>
          </div>
          <h3 className="text-lg font-black text-indigo-900">Ask Professor Owl</h3>
        </div>

        <form onSubmit={handleAskDoubt} className="flex gap-3">
          <input 
            type="text" 
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            placeholder="Why is this a verb?"
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 outline-none font-medium text-indigo-900"
          />
          <button 
            type="submit"
            disabled={isAiLoading}
            className="h-14 px-6 bg-indigo-600 text-white rounded-2xl font-black bouncy-hover flex items-center gap-2 disabled:opacity-50"
          >
            {isAiLoading ? '...' : <span className="material-symbols-outlined">send</span>}
          </button>
        </form>

        {aiAnswer && (
          <div className="mt-4 p-5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl text-indigo-900 font-medium animate-in slide-in-from-top-2">
            <strong>Professor Owl:</strong> {aiAnswer}
          </div>
        )}
      </div>
    </div>
  );
};

const WordMakerGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => {
  const challenges = [
    { word: 'GALAXY', theme: 'Space' },
    { word: 'FOSSIL', theme: 'History' },
    { word: 'MAGICAL', theme: 'Fantasy' },
    { word: 'RAINBOW', theme: 'Nature' },
    { word: 'ROBOTIC', theme: 'Tech' },
    { word: 'SCIENCE', theme: 'Learning' },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [built, setBuilt] = useState<string[]>([]);
  const [scrambled, setScrambled] = useState<{ char: string; originalIdx: number }[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const targetWord = challenges[currentIdx].word;
  const progress = (built.length / targetWord.length) * 100;

  const init = () => {
    const word = challenges[currentIdx].word;
    const tiles = word.split('').map((char, i) => ({ char, originalIdx: i }));
    setScrambled(tiles.sort(() => Math.random() - 0.5));
    setBuilt([]);
    setFeedback(null);
    setIsSuccess(false);
  };

  useEffect(() => { init(); }, [currentIdx]);

  const handleLetterClick = (tile: { char: string; originalIdx: number }, index: number) => {
    if (isSuccess) return;

    if (tile.char === targetWord[built.length]) {
      const newBuilt = [...built, tile.char];
      setBuilt(newBuilt);
      
      const newScrambled = [...scrambled];
      newScrambled.splice(index, 1);
      setScrambled(newScrambled);
      
      setFeedback(null);

      if (newBuilt.join('') === targetWord) {
        setIsSuccess(true);
        setFeedback('🏆 Word Architect Supreme!');
        onEarnXP(60);
        setTimeout(() => {
          setCurrentIdx((currentIdx + 1) % challenges.length);
        }, 2500);
      }
    } else {
      setFeedback('💫 Not that letter yet! Keep trying.');
    }
  };

  return (
    <div className="text-center relative">
      {/* Progress Bar */}
      <div className="w-full h-4 bg-emerald-50 rounded-full mb-10 overflow-hidden border border-emerald-100 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700 ease-out shadow-lg"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-4 text-emerald-600 font-black uppercase tracking-widest text-sm">Word Architect</div>
      <p className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-10">Theme: {challenges[currentIdx].theme}</p>
      
      {/* Word Container */}
      <div className={`flex justify-center gap-3 mb-16 transition-all duration-500 ${isSuccess ? 'scale-110' : ''}`}>
        {targetWord.split('').map((char, i) => (
          <div 
            key={i} 
            className={`
              w-14 h-18 sm:w-16 sm:h-20 border-b-4 border-emerald-500 flex items-center justify-center 
              text-4xl sm:text-5xl font-black transition-all duration-300
              ${built[i] ? 'text-emerald-700 scale-100 opacity-100 translate-y-0' : 'text-emerald-100 translate-y-4 opacity-50'}
              ${isSuccess ? 'animate-bounce' : ''}
            `}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {built[i] || '?'}
          </div>
        ))}
      </div>

      {/* Confetti Effect for Success */}
      {isSuccess && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="text-4xl animate-ping opacity-75">✨ ✨ ✨</div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {scrambled.map((tile, i) => (
          <button 
            key={`${tile.char}-${tile.originalIdx}`} 
            onClick={() => handleLetterClick(tile, i)} 
            className="w-16 h-16 bg-white border-4 border-emerald-100 rounded-[1.25rem] text-3xl font-black text-emerald-800 bouncy-hover shadow-lg hover:border-emerald-500 transition-all"
          >
            {tile.char}
          </button>
        ))}
      </div>

      <div className={`min-h-[2rem] text-xl font-black transition-all ${isSuccess ? 'text-emerald-600 scale-125' : 'text-rose-400'}`}>
        {feedback}
      </div>

      {!isSuccess && built.length > 0 && (
        <button 
          onClick={init} 
          className="mt-8 text-xs font-black text-emerald-400 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2 mx-auto transition-colors"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Reset Tiles
        </button>
      )}
    </div>
  );
};

// --- Pre-existing Games ---

const ScienceGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => <div className="text-center font-bold p-10">Space Voyager Logic - Level 2 Required</div>;
const BiologyGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => <div className="text-center font-bold p-10">Habitat Hero Logic - Level 2 Required</div>;
const PaleoGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => <div className="text-center font-bold p-10">Dino Sorter Logic - Level 3 Required</div>;
const WeatherGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => <div className="text-center font-bold p-10">Water Wizard Logic - Level 2 Required</div>;
const EcoGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => <div className="text-center font-bold p-10">Eco Sorter Logic - Level 1 Required</div>;
const MathGame: React.FC<{ onEarnXP: (amount: number) => void }> = ({ onEarnXP }) => <div className="text-center font-bold p-10">Math Challenge - Loading...</div>;

export default GamesCenter;
