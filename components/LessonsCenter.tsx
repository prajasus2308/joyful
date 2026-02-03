
import React, { useState } from 'react';

interface LessonsCenterProps {
  onBack: () => void;
  onEarnXP: (amount: number) => void;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which shape comes next? 🔴, 🟦, 🔴, 🟦, ...",
    options: ["🟢 Circle", "🔴 Circle", "🟦 Square", "🔺 Triangle"],
    answer: 1,
    logic: "The pattern repeats Circle, Square, Circle, Square."
  },
  {
    id: 2,
    question: "If all Bloops are Razzies, and all Razzies are Lurgs, are all Bloops also Lurgs?",
    options: ["Yes", "No", "Maybe", "I don't know"],
    answer: 0,
    logic: "This is a transitive relation in logic."
  },
  {
    id: 3,
    question: "Complete the sequence: 2, 4, 8, 16, ...",
    options: ["20", "24", "30", "32"],
    answer: 3,
    logic: "Each number is multiplied by 2."
  },
  {
    id: 4,
    question: "A doctor gives you 3 pills and tells you to take one every half hour. How long will the pills last?",
    options: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    answer: 1,
    logic: "You take the first at 0 min, second at 30 min, and third at 60 min."
  }
];

const LessonsCenter: React.FC<LessonsCenterProps> = ({ onBack, onEarnXP }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    const correct = index === QUIZ_QUESTIONS[currentIndex].answer;
    
    if (correct) {
      setScore(s => s + 1);
      setFeedback("✅ Brilliant! Your logic is flawless.");
    } else {
      setFeedback(`❌ Not quite! ${QUIZ_QUESTIONS[currentIndex].logic}`);
    }

    setTimeout(() => {
      if (currentIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        setShowResult(true);
        // Award XP based on final score
        onEarnXP((score + (correct ? 1 : 0)) * 100);
      }
    }, 2500);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setFeedback(null);
  };

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-background-light dark:bg-background-dark">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <div className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">
            Logic Mastery by Pratyush Raj • 2026
          </div>
        </div>

        <div className="max-w-[800px] mx-auto">
          {!showResult ? (
            <div className="bg-white dark:bg-white/5 p-10 rounded-3xl shadow-2xl border-4 border-primary/10">
              <div className="flex justify-between items-center mb-8">
                <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                  Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-primary font-black">Score: {score}</span>
              </div>
              
              <h2 className="text-3xl font-black text-[#0d171c] dark:text-white mb-10 leading-tight">
                {QUIZ_QUESTIONS[currentIndex].question}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUIZ_QUESTIONS[currentIndex].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                    className={`p-6 rounded-2xl border-2 text-lg font-bold transition-all text-left flex justify-between items-center ${
                      selectedOption === idx 
                        ? (idx === QUIZ_QUESTIONS[currentIndex].answer ? 'bg-green-500 border-green-500 text-white' : 'bg-red-500 border-red-500 text-white')
                        : 'bg-background-light dark:bg-white/5 border-primary/10 hover:border-primary text-[#49819c] dark:text-gray-300'
                    }`}
                  >
                    {opt}
                    {selectedOption === idx && (
                      <span className="material-symbols-outlined">
                        {idx === QUIZ_QUESTIONS[currentIndex].answer ? 'check_circle' : 'cancel'}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className={`mt-8 p-6 rounded-2xl font-bold animate-bounce ${feedback.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {feedback}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-white/5 p-16 rounded-3xl shadow-2xl text-center border-4 border-accent-yellow/20">
              <div className="h-24 w-24 bg-accent-yellow rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                <span className="material-symbols-outlined text-6xl">workspace_premium</span>
              </div>
              <h2 className="text-4xl font-black text-[#0d171c] dark:text-white mb-4">Quiz Complete!</h2>
              <p className="text-xl text-[#49819c] font-medium mb-10">
                You scored <span className="text-primary font-black">{score}</span> out of {QUIZ_QUESTIONS.length}.
                <br/>
                You earned <span className="text-accent-yellow font-black">+{score * 100} XP</span> for your logical brilliance!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={resetQuiz}
                  className="px-10 h-16 bg-primary text-white font-black rounded-full shadow-lg bouncy-hover"
                >
                  Try Again
                </button>
                <button 
                  onClick={onBack}
                  className="px-10 h-16 bg-background-light dark:bg-white/10 text-[#49819c] font-black rounded-full bouncy-hover"
                >
                  Go Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LessonsCenter;
