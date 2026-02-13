import React, { useState } from 'react';
import { User } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

interface HostApplicationModalProps {
  user: User | null;
  onClose: () => void;
}

const HostApplicationModal: React.FC<HostApplicationModalProps> = ({ user, onClose }) => {
  const [step, setStep] = useState(1);
  const [vision, setVision] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAiVisionAssist = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am a ${user?.currentEnergy} on ScissHER. I want to host an intentional local event for the lesbian community. 
                   My interests are: ${user?.interests[0].items.join(', ')}. 
                   Draft a professional, inspiring 2-sentence vision statement for a community gathering.`,
        config: { systemInstruction: "You are the ScissHER Host Mentor. You help future community leaders articulate their value." }
      });
      setVision(response.text?.replace(/"/g, '') || '');
      await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await Haptics.impact({ style: ImpactStyle.Heavy });
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Application successfully transmitted to ScissHER HQ. We'll verify your Scene presence shortly.");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-500 overflow-y-auto no-scrollbar">
      <div className="px-8 pt-safe pb-10 flex flex-col items-center text-center space-y-12">
        <div className="w-full flex justify-between items-center py-6">
          <button onClick={onClose} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-500 active:scale-90 transition-all border border-white/5">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="flex gap-1.5">
             {[1,2,3].map(i => (
               <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-400 w-6' : 'bg-slate-800'}`}></div>
             ))}
          </div>
          <div className="w-12 h-12"></div>
        </div>

        {step === 1 && (
          <div className="space-y-10 animate-in fade-in zoom-in duration-500">
            <div className="w-28 h-28 petal-gradient rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl border-2 border-white/20 rotate-6">
              <i className="fa-solid fa-microphone-lines text-5xl"></i>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-white italic tracking-tighter leading-none">Host The Scene</h2>
              <p className="text-sm text-slate-400 font-medium italic leading-relaxed px-6">
                ScissHER hosts are the cultural architects of their cities. Sponsors and coordinators receive exclusive tools and high-priority matching.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 text-left">
               <div className="glass p-6 rounded-[2.5rem] border-white/10 flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><i className="fa-solid fa-check"></i></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Coordinated Blind Sesh events</p>
               </div>
               <div className="glass p-6 rounded-[2.5rem] border-white/10 flex items-center gap-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><i className="fa-solid fa-check"></i></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Monetization for sponsored venues</p>
               </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-7 shimmer-btn rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] text-white shadow-2xl active:scale-95 transition-all">Start Application</button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-sm space-y-10 animate-in slide-in-from-right duration-500">
            <div className="text-left space-y-2">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] italic">Step 02 / Vision</p>
               <h3 className="text-4xl font-black text-white italic tracking-tighter">Define Your Vibe</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Host Vision Statement</p>
                <button 
                  onClick={handleAiVisionAssist}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 text-rose-400 text-[9px] font-black uppercase tracking-widest animate-pulse"
                >
                  {isAiLoading ? <i className="fa-solid fa-sparkles animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                  AI Assist
                </button>
              </div>
              <textarea 
                value={vision}
                onChange={e => setVision(e.target.value)}
                placeholder="What kind of community experience do you want to coordinate?"
                className="w-full bg-slate-900/50 border border-white/10 rounded-[3rem] p-10 text-base italic font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[240px] shadow-inner"
              />
            </div>

            <button onClick={() => setStep(3)} className="w-full py-7 shimmer-btn rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] text-white shadow-2xl active:scale-95 transition-all">Next Component</button>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-sm space-y-12 animate-in slide-in-from-right duration-500">
            <div className="text-left space-y-2">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] italic">Step 03 / Proof</p>
               <h3 className="text-4xl font-black text-white italic tracking-tighter">Bio-ID Validation</h3>
            </div>

            <div className="glass p-10 rounded-[4rem] border-white/10 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/40"></div>
               <i className="fa-solid fa-shield-halved text-6xl text-emerald-400 opacity-20"></i>
               <p className="text-sm text-slate-400 font-medium leading-relaxed italic px-2">
                 Hosting requires a Level 2 Identity verification. We will re-scan your provided Biometric ID to confirm Host eligibility.
               </p>
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full py-7 shimmer-btn rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] text-white shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              {isSubmitting ? <i className="fa-solid fa-sparkles animate-spin"></i> : <i className="fa-solid fa-fingerprint"></i>}
              {isSubmitting ? "Transmitting..." : "Submit & Verify"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostApplicationModal;