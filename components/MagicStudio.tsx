
import React, { useState, useRef, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface MagicStudioProps {
  onBack: () => void;
  onEarnXP: (amount: number) => void;
}

const MagicStudio: React.FC<MagicStudioProps> = ({ onBack, onEarnXP }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        showToast("Heard: " + transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const handleStartListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    recognitionRef.current.start();
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setShowKeyDialog(false);
    showToast("Magic Key Connected! ✨");
    // Resume generation if it was triggered
    if (prompt.trim()) {
      executeGeneration();
    }
  };

  const executeGeneration = async () => {
    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(prompt, aspectRatio, imageSize);
      setCurrentImage(imageUrl);
      setHistory(prev => [{
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        aspectRatio: aspectRatio
      }, ...prev]);
      onEarnXP(100); // More XP for Pro generation
      showToast("Pro Masterpiece Created! +100 XP ✨");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found") || err.message?.includes("API key")) {
        setShowKeyDialog(true);
      } else {
        showToast("The magic paintbrush is resting. Try again! 🪄");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCastSpell = async () => {
    if (!prompt.trim()) {
      showToast("Tell the brush what to paint! 🎨");
      return;
    }

    // @ts-ignore - check if key is already selected for Pro models
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyDialog(true);
      return;
    }

    executeGeneration();
  };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `joyful-pro-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("High-quality art saved! 📥");
  };

  return (
    <section className="px-6 py-12 md:py-20 min-h-screen bg-[#fff9eb] dark:bg-background-dark">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-8 py-3 rounded-full font-black shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          {toast}
        </div>
      )}

      {/* API Key Modal */}
      {showKeyDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background-dark/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1a2b34] w-full max-w-md rounded-[3rem] p-10 shadow-2xl border-4 border-primary/20 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <span className="material-symbols-outlined text-4xl">key</span>
            </div>
            <h2 className="text-2xl font-black text-primary mb-4">Unlock Pro Magic!</h2>
            <p className="text-[#49819c] font-medium mb-6">
              To use high-quality 4K Pro Image generation, you need to select your personal API key from a paid GCP project.
            </p>
            <div className="space-y-4">
              <button 
                onClick={handleOpenKeySelector}
                className="w-full h-14 bg-primary text-white font-black rounded-full shadow-lg bouncy-hover"
              >
                Select Magic Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="block text-xs font-bold text-[#49819c] hover:text-primary underline"
              >
                Learn about Pro keys & billing
              </a>
              <button 
                onClick={() => setShowKeyDialog(false)}
                className="w-full h-12 text-[#49819c] font-bold"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1200px]">
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-primary font-bold hover:underline"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 animate-pulse">
              Pro Mode Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Controls Panel */}
          <div className="flex flex-col gap-8 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] shadow-xl border-2 border-primary/10 relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            
            <div>
              <h2 className="text-3xl font-black text-primary mb-2">Pro Magic Studio</h2>
              <p className="text-[#49819c] font-medium text-sm">Experience the power of Gemini 3 Pro Images! 🎨</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-2">Detailed Prompt</label>
                <div className="relative">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe a cinematic masterpiece in detail..."
                    className="w-full p-5 pr-16 rounded-2xl border-2 border-primary/20 focus:border-primary focus:ring-0 transition-all text-lg font-medium dark:bg-background-dark dark:border-white/10 h-32 resize-none shadow-inner"
                  />
                  <button 
                    onClick={handleStartListening}
                    className={`absolute right-4 bottom-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined">{isListening ? 'mic' : 'mic_none'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-center text-[10px] font-black uppercase tracking-widest text-[#49819c] mb-3">Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: "1:1", icon: "square" },
                      { val: "16:9", icon: "rectangle" },
                      { val: "9:16", icon: "stay_current_portrait" }
                    ].map((shape) => (
                      <button
                        key={shape.val}
                        onClick={() => setAspectRatio(shape.val as any)}
                        className={`p-3 rounded-xl border-2 transition-all ${aspectRatio === shape.val ? 'bg-primary border-primary text-white shadow-md' : 'bg-white dark:bg-white/5 border-primary/5 text-primary'}`}
                      >
                        <span className="material-symbols-outlined text-sm">{shape.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-center text-[10px] font-black uppercase tracking-widest text-[#49819c] mb-3">Resolution</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["1K", "2K", "4K"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setImageSize(size as any)}
                        className={`py-3 px-1 rounded-xl border-2 transition-all font-black text-[10px] ${imageSize === size ? 'bg-primary border-primary text-white shadow-md' : 'bg-white dark:bg-white/5 border-primary/5 text-primary'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCastSpell}
                disabled={isGenerating}
                className={`w-full h-16 rounded-full text-white font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                  isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#1d91cc] shadow-primary/40 bouncy-hover'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    Developing Pro Art...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_fix_high</span>
                    Cast Pro Spell
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-6 flex items-center gap-4 p-5 bg-[#fff9eb] dark:bg-white/5 rounded-2xl border border-primary/10">
               <img src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=200" alt="Art palette" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
               <p className="text-xs font-bold text-[#49819c]">Powered by Joyful Pro Studio 2026</p>
            </div>
          </div>

          {/* Canvas Preview Panel */}
          <div className="flex flex-col gap-6">
            <div className="relative aspect-square w-full max-w-[500px] mx-auto bg-white dark:bg-white/5 rounded-[3rem] border-8 border-white dark:border-white/10 shadow-2xl overflow-hidden flex items-center justify-center group bg-gradient-to-br from-white to-gray-50">
              {currentImage ? (
                <div className="relative w-full h-full">
                  <img src={currentImage} alt="Pro Magic Art" className="w-full h-full object-contain animate-in fade-in zoom-in duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button 
                      onClick={() => downloadImage(currentImage)}
                      className="w-14 h-14 bg-white text-primary rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined text-3xl">download</span>
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">
                      Pro {imageSize}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 text-primary/30 p-10 text-center">
                  <div className={`transition-all duration-1000 ${isGenerating ? 'animate-bounce scale-150 text-primary' : ''}`}>
                    <span className="material-symbols-outlined text-9xl">magic_button</span>
                  </div>
                  {isGenerating ? (
                    <div>
                      <p className="font-black text-xl animate-pulse text-primary">Brushing details...</p>
                      <p className="text-xs text-[#49819c] mt-2">Gemini 3 Pro is refining your masterpiece</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-black text-2xl mb-2 text-primary/50">Pro Studio Ready</p>
                      <p className="text-sm font-medium">Higher reasoning, better details, and 4K quality await your prompt!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gallery Strip */}
            {history.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-[#0d171c] dark:text-gray-300 mb-4 flex items-center gap-2 px-2">
                  <span className="material-symbols-outlined text-primary">photo_library</span>
                  Pro Gallery
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                  {history.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImage(item.url)}
                      className="relative min-w-[120px] h-[120px] rounded-2xl overflow-hidden border-2 border-white dark:border-white/10 shadow-md hover:scale-105 transition-transform flex-shrink-0"
                    >
                      <img src={item.url} alt="Gallery" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagicStudio;
