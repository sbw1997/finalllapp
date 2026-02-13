import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { PRIMARY_HYPE_QUOTE } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const PROMPT_LIBRARY = [
  { field: 'idealFirstDate', label: 'The Ideal Scene', icon: 'fa-glass-cheers', color: 'text-rose-400', question: "What defines your perfect introduction?" },
  { field: 'collabProject', label: 'Collaborative Muse', icon: 'fa-palette', color: 'text-orange-400', question: "Describe your ideal collaborative project." },
  { field: 'moodSong', label: 'Vibe Track', icon: 'fa-music', color: 'text-cyan-400', question: "A song that perfectly captures your current mood." },
  { field: 'tableOrder', label: 'Midnight Menu', icon: 'fa-utensils', color: 'text-emerald-400', question: "Curate your night out order." },
  { field: 'describeSelfOnePhoto', label: 'Self Capture', icon: 'fa-camera-retro', color: 'text-violet-400', question: "Describe yourself in one specific photo." },
  { field: 'morningRitual', label: 'Morning Ritual', icon: 'fa-sun', color: 'text-amber-400', question: "Your essential first 30 minutes of the day." },
  { field: 'urbanEscape', label: 'Urban Escape', icon: 'fa-city', color: 'text-blue-400', question: "A hidden city spot where you feel most alive." }
];

const ProfileView: React.FC<{ user: User | null, onReset: () => void }> = ({ user, onReset }) => {
  const [showMantra, setShowMantra] = useState(false);
  const [auraColor, setAuraColor] = useState(user?.auraColor || '#fb7185');
  const [isSuggesting, setIsSuggesting] = useState<string | null>(null);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [completion, setCompletion] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    let score = 0;
    const steps = [];

    if (user.bio) score += 20; else steps.push("Craft your vibe (Bio)");
    if (user.idealFirstDate) score += 10; else steps.push("Define your Ideal Scene");
    if (user.collabProject) score += 10; else steps.push("Share a Collaborative Vision");
    if (user.moodSong) score += 10; else steps.push("Add your Vibe Track");
    if (user.tableOrder) score += 10; else steps.push("Curate your Table Order");
    if (user.twoTruthsAndAnIllusion) score += 15; else steps.push("Add an Illusion");
    if (user.privatePhotos && user.privatePhotos.length > 0) score += 15; else steps.push("Vault private photos");
    if (user.publicPhotos && user.publicPhotos.length >= 3) score += 10; else steps.push("Upload more public presence");

    setCompletion(Math.min(score, 100));
    setSuggestions(steps);
  }, [user]);

  if (!user) return null;

  const handleSuggest = async (field: string) => {
    setIsSuggesting(field);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am a user on ScissHER, an intentional dating app for lesbians (age 20-30). 
                   My bio is: "${user.bio}". My energy is: ${user.currentEnergy}.
                   Suggest a clever, atmospheric response for the prompt field: "${field}". 
                   The prompt question is: "${PROMPT_LIBRARY.find(p => p.field === field)?.question}".
                   Keep it under 15 words, witty, and high-fashion.`,
        config: { systemInstruction: "You are the ScissHER Scene Architect. You help users express their authentic light with depth and style." }
      });
      const text = response.text?.replace(/"/g, '') || "Something intentional...";
      alert(`Architect's Suggestion: \n\n"${text}"`);
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(null);
    }
  };

  return (
    <div className="space-y-12 pb-40 animate-in slide-in-from-bottom-6 duration-700 px-2 relative">
      <div 
        className="fixed inset-0 -z-50 opacity-10 blur-[120px] pointer-events-none transition-colors duration-1000"
        style={{ background: `radial-gradient(circle at 50% 50%, ${auraColor}, transparent 70%)` }}
      ></div>

      {/* Profile Completion Indicator */}
      <div className="relative mx-1">
        <div className="glass p-8 rounded-[3.5rem] border-white/10 space-y-6 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-end px-1">
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Identity Potency</h4>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
                {completion === 100 ? "Presence fully actualized" : "Manifestation in progress"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black italic tracking-tighter shimmer-text leading-none">{completion}%</span>
            </div>
          </div>
          
          <div className="relative h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div 
              className="h-full transition-all duration-[1.5s] ease-[cubic-bezier(0.34,1.56,0.64,1)] relative"
              style={{ width: `${completion}%`, backgroundColor: auraColor }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] bg-[length:200%_100%] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="pt-2 animate-in fade-in duration-1000">
               <div className="flex items-center gap-2 mb-3">
                  <i className="fa-solid fa-sparkles text-[8px] text-rose-400"></i>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next for 100%:</p>
               </div>
               <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 2).map((step, i) => (
                    <div key={i} className="px-3 py-1.5 bg-slate-900/50 border border-white/5 rounded-full text-[8px] font-bold text-slate-500 italic">
                      {step}
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center pt-4">
        <div className="relative group">
          <div 
            className="absolute inset-0 blur-[60px] rounded-full group-hover:scale-125 transition-all duration-1000 opacity-40"
            style={{ backgroundColor: auraColor }}
          ></div>
          <div className="w-48 h-48 rounded-[4rem] overflow-hidden border-4 border-slate-950 shadow-2xl relative z-10 p-1 bg-gradient-to-tr from-rose-500 via-violet-500 to-emerald-500">
            <img src={user.mainPhoto} className="w-full h-full object-cover rounded-[3.8rem]" alt="Me" />
          </div>
          <button className="absolute -bottom-2 -right-2 w-14 h-14 petal-gradient rounded-2xl flex items-center justify-center text-white border-4 border-slate-950 z-20 shadow-2xl active:scale-90 transition-transform">
            <i className="fa-solid fa-camera-retro text-lg"></i>
          </button>
        </div>
        
        <div className="mt-8 text-center space-y-2">
          <h2 className="text-5xl font-black text-white tracking-tighter italic leading-none">{user.name}, {user.age}</h2>
          <div className="flex flex-col items-center gap-2 mt-2">
             <div className="flex items-center gap-3">
                <i className="fa-solid fa-certificate text-emerald-400 text-xs"></i>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 italic">Identity Active</span>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-1">
        <div className="flex justify-between items-center px-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Prismatic Studio</h3>
          <button className="text-[9px] font-black uppercase tracking-widest text-rose-400">Library</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
          {PROMPT_LIBRARY.map((p, idx) => (
            <button 
              key={idx}
              onClick={() => { setActivePromptIndex(idx); Haptics.impact({ style: ImpactStyle.Light }); }}
              className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border shrink-0 transition-all duration-500 min-w-[140px] ${
                activePromptIndex === idx 
                  ? 'bg-slate-900 border-white/20 shadow-xl scale-110 translate-y-[-4px]' 
                  : 'bg-slate-950/40 border-white/5 opacity-50'
              }`}
            >
              <i className={`fa-solid ${p.icon} text-xl ${p.color}`}></i>
              <span className="text-[8px] font-black uppercase tracking-widest text-white">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="px-1">
          <button 
            onClick={() => handleSuggest(PROMPT_LIBRARY[activePromptIndex].field)}
            className="w-full glass p-10 rounded-[3.5rem] border-white/5 space-y-6 shadow-xl text-left relative overflow-hidden group active:scale-95 transition-all"
          >
            <div className="flex justify-between items-center relative z-10">
              <p className={`text-[9px] font-black uppercase tracking-[0.5em] italic ${PROMPT_LIBRARY[activePromptIndex].color}`}>
                {PROMPT_LIBRARY[activePromptIndex].label}
              </p>
              {isSuggesting === PROMPT_LIBRARY[activePromptIndex].field ? (
                <i className="fa-solid fa-sparkles animate-spin text-rose-400"></i>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-700">AI Assist</span>
                  <i className="fa-solid fa-wand-magic-sparkles text-slate-700"></i>
                </div>
              )}
            </div>
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-70">
                {PROMPT_LIBRARY[activePromptIndex].question}
              </p>
              <p className="text-xl font-black text-white italic tracking-tighter leading-tight pr-10">
                "{ (user as any)[PROMPT_LIBRARY[activePromptIndex].field] || 'Manifest your answer...' }"
              </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
               <i className={`fa-solid ${PROMPT_LIBRARY[activePromptIndex].icon} text-6xl`}></i>
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-6 px-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 px-6 flex items-center gap-4">
           The Core
           <div className="h-[1px] flex-1 bg-white/5"></div>
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <button onClick={() => setShowMantra(true)} className="w-full glass p-8 rounded-[3rem] flex items-center justify-between border-white/5 group shadow-xl hover:bg-white/5 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-xl">
                <i className="fa-solid fa-sparkles text-lg"></i>
              </div>
              <div className="text-left">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-100 block">Identity Mantra</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-0.5 block">Daily Intention</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-slate-800 group-hover:translate-x-1.5 transition-transform"></i>
          </button>

          <button onClick={onReset} className="w-full py-8 glass border border-white/5 text-slate-500 rounded-[3rem] font-black uppercase tracking-[0.5em] text-[10px] hover:text-white transition-all active:scale-95 mt-10">
            Disconnect Presence
          </button>
        </div>
      </div>

      {showMantra && (
        <div className="fixed inset-0 z-[600] bg-slate-950 p-10 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
           <div className="absolute inset-0 petal-gradient opacity-10 animate-pulse"></div>
           <div className="relative z-10 space-y-12">
              <div className="w-24 h-24 petal-gradient rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-white/20 shadow-2xl rotate-12">
                <i className="fa-solid fa-sparkles text-white text-3xl"></i>
              </div>
              <div className="space-y-6 px-4">
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.6em] italic opacity-80">Daily Intention Status</p>
                 <h2 className="text-4xl font-black text-white tracking-tighter italic leading-tight">
                   "{PRIMARY_HYPE_QUOTE}"
                 </h2>
              </div>
              <button 
                onClick={() => setShowMantra(false)}
                className="w-full py-6 shimmer-btn text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all border border-white/20"
              >
                Reflect & Continue
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;