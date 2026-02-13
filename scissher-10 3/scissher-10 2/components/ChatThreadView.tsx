import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface ChatThreadViewProps {
  user: User;
  onClose: () => void;
}

const ChatThreadView: React.FC<ChatThreadViewProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'me' | 'them'; text: string; time: string }[]>([
    { role: 'them', text: "I saw you're into techno! Have you been to the new spot in Bushwick?", time: "11:22 AM" },
    { role: 'me', text: "Yes! The acoustics there are incredible. I'm actually looking for a Sesh partner for their next showcase.", time: "11:24 AM" }
  ]);
  const [input, setInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { role: 'me' as const, text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
  };

  const handleAiSkipSmallTalk = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a direct, intentional date proposal for two people on a metropolitan lesbian dating app.
                   Person A likes: ${user.interests.map(i => i.items).join(', ')}.
                   Context: They are talking about a techno venue.
                   Tone: Confident, specific, intentional. No fluff.`,
        config: { systemInstruction: "You are the ScissHER Matchmaker. Propose a specific Sesh Window." }
      });
      const suggestedText = response.text?.replace(/"/g, '') || "";
      setInput(suggestedText);
      try { await Haptics.notification({ type: 'success' as any }); } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col animate-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="px-6 pt-safe pb-6 glass border-b border-white/5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
              <img src={user.mainPhoto} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white italic tracking-tighter leading-none">{user.name}</h3>
              <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Active Now</p>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-500">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar pb-32">
        <div className="text-center py-10 space-y-3 opacity-30">
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto text-rose-400">
             <i className="fa-solid fa-lock text-lg"></i>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em]">Vaulted Intentional DM</p>
        </div>

        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'me' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] p-5 rounded-[2rem] shadow-xl text-sm font-medium leading-relaxed ${
              m.role === 'me' 
                ? 'petal-gradient text-white rounded-tr-none' 
                : 'glass border-white/10 text-slate-200 rounded-tl-none italic'
            }`}>
              {m.text}
            </div>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-2 px-2">{m.time}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-safe glass border-t border-white/5 bg-slate-950/80 backdrop-blur-3xl">
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <button 
            onClick={handleAiSkipSmallTalk}
            disabled={isAiLoading}
            className="w-fit self-center flex items-center gap-3 glass px-6 py-2 rounded-full border border-rose-500/30 active:scale-95 transition-all group"
          >
            {isAiLoading ? (
              <i className="fa-solid fa-sparkles animate-spin text-rose-400 text-[10px]"></i>
            ) : (
              <i className="fa-solid fa-wand-magic-sparkles text-rose-400 text-[10px]"></i>
            )}
            <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] group-hover:text-rose-400 transition-colors">Skip Small Talk</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 glass p-4 rounded-[2rem] border-white/10 flex items-center px-6">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Compose intention..." 
                className="bg-transparent border-none text-xs text-white focus:outline-none flex-1 placeholder:text-slate-700 font-medium italic"
              />
            </div>
            <button 
              onClick={handleSend}
              className="w-14 h-14 shimmer-btn rounded-2xl flex items-center justify-center text-white shadow-2xl active:scale-90 transition-all border border-white/20"
            >
              <i className="fa-solid fa-bolt-lightning text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatThreadView;