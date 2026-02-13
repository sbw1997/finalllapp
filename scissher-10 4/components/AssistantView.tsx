
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const AssistantView: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; urls?: { uri: string; title: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);
    try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch (e) {}

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Determine if Maps tool is needed based on query context
      const needsMaps = userMsg.toLowerCase().includes('nearby') || userMsg.toLowerCase().includes('restaurant') || userMsg.toLowerCase().includes('spot') || userMsg.toLowerCase().includes('place');

      // Attempt to capture user location for Google Maps grounding precision
      let latLng = undefined;
      if (needsMaps) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latLng = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (e) {
          console.debug("Location access denied or unavailable for Maps grounding");
        }
      }

      const response = await ai.models.generateContent({
        // Maps grounding requires gemini-2.5 series; general Q&A uses gemini-3-flash-preview for efficiency
        model: needsMaps ? 'gemini-2.5-flash' : 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "You are ScissHER's Elite Scene Assistant. You help users with dating advice, community safety, and finding intentional hotspots. You are high-fashion, respectful, and direct.",
          tools: needsMaps ? [{ googleMaps: {} }] : undefined,
          toolConfig: latLng ? {
            retrievalConfig: {
              latLng: latLng
            }
          } : undefined
        }
      });

      const text = response.text || "The metropolitan vibe is processing... one moment.";
      // Extract Maps URLs from groundingMetadata as required by guidelines
      const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.maps)
        .filter(Boolean);

      setMessages(prev => [...prev, { role: 'ai', text, urls }]);
      try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "The network vibe is slightly unstable. Try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="px-4 mb-6">
        <h2 className="text-4xl font-black tracking-tighter shimmer-text italic leading-none">Scene AI</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 opacity-70">Strategic Metropolitan Intel</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar space-y-6 px-4 pb-10">
        {messages.length === 0 && (
          <div className="text-center py-20 space-y-4 opacity-50">
            <i className="fa-solid fa-headset text-5xl text-slate-800"></i>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-600 italic">No Active Intelligence Sessions</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] shadow-xl ${m.role === 'user' ? 'bg-rose-500 text-white rounded-tr-none' : 'glass border-white/10 text-slate-200 rounded-tl-none'}`}>
              <p className="text-sm font-medium italic leading-relaxed">{m.text}</p>
              {m.urls && m.urls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-rose-400">Nearby Spots Found:</p>
                  {m.urls.map((link, j) => (
                    <a key={j} href={link.uri} target="_blank" rel="noreferrer" className="block text-[10px] text-white underline italic opacity-80">{link.title}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="glass p-6 rounded-[2.5rem] rounded-tl-none border-white/10">
              <i className="fa-solid fa-sparkles text-rose-400 animate-spin"></i>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 flex items-center gap-3 shadow-2xl mx-1 mb-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about hotspots or advice..." 
          className="bg-transparent border-none text-xs text-white focus:outline-none flex-1 placeholder:text-slate-600 italic px-4" 
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="w-12 h-12 shimmer-btn rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default AssistantView;
