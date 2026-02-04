
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/geminiService';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string, sources?: any[]}[]>([
    { role: 'model', text: 'Hi there! I am Joy, your learning buddy. I can now search the web for answers! 🚀' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const result = await getChatResponse([], userMessage);
    setMessages(prev => [...prev, { role: 'model', text: result.text, sources: result.sources }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-[#1a2b34] rounded-[2rem] shadow-2xl border-4 border-primary/20 flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-10 duration-300">
          <div className="bg-primary p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">face_6</span>
              </div>
              <div>
                <h3 className="font-black text-lg">Chat with Joy</h3>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest text-white">Online • Powered by Search</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><span className="material-symbols-outlined">close</span></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-background-light/50 dark:bg-background-dark/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl font-medium text-sm shadow-sm ${
                  m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-white/10 text-[#0d171c] dark:text-white rounded-tl-none border border-primary/10'
                }`}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 max-w-[90%]">
                    {m.sources.map((s: any, j: number) => (
                      <a key={j} href={s.web?.uri} target="_blank" rel="noreferrer" className="text-[9px] font-bold text-primary/70 hover:text-primary transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">link</span>
                        Source
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-white/10 p-4 rounded-2xl flex gap-1 animate-pulse">
                  <div className="w-2 h-2 bg-primary/40 rounded-full"></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full delay-100"></div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-[#1a2b34] border-t border-primary/10 flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about today..." className="flex-1 px-4 py-3 rounded-full border-2 border-primary/10 focus:border-primary outline-none text-sm font-medium dark:bg-background-dark" />
            <button type="submit" disabled={isLoading || !input.trim()} className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"><span className="material-symbols-outlined">send</span></button>
          </form>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center bouncy-hover relative">
        <span className="material-symbols-outlined text-3xl">{isOpen ? 'chat_bubble_outline' : 'forum'}</span>
        {!isOpen && <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-pink rounded-full border-2 border-white animate-pulse"></div>}
      </button>
    </div>
  );
};

export default ChatBot;
