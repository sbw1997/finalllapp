
import React, { useState } from 'react';

const IdentityVerification: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'intro' | 'scanning' | 'complete'>('intro');

  const startScan = () => {
    setStep('scanning');
    setTimeout(() => {
      setStep('complete');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-[#020617] z-[105] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="max-w-xs w-full space-y-10 text-center animate-in fade-in duration-700 relative z-10">
        <div className="relative w-24 h-24 mx-auto group">
           <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
           <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20 shadow-2xl relative z-10">
             <i className="fa-solid fa-shield-halved text-4xl"></i>
           </div>
        </div>

        {step === 'intro' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white tracking-tighter shimmer-text leading-tight">Identity Vibe</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 leading-relaxed">
                Biometric proof required <br/> for intentional connection
              </p>
            </div>
            
            <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-4">
               <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                 "Our scene is built on trust. One quick scan proves you're you."
               </p>
            </div>

            <button 
              onClick={startScan}
              className="w-full py-6 shimmer-btn text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all border border-white/10"
            >
              Start Biometric Scan
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="space-y-10 flex flex-col items-center animate-in fade-in duration-500">
            <div className="w-56 h-56 rounded-[4rem] border-2 border-dashed border-emerald-500/30 flex items-center justify-center relative bg-slate-900/50 shadow-inner">
              <div className="absolute inset-4 border-2 border-emerald-500/50 rounded-[3rem] animate-pulse"></div>
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,_rgba(16,185,129,0.2)_50%,_transparent_100%)] bg-[length:100%_200%] animate-[scan_2s_linear_infinite] pointer-events-none"></div>
              <i className="fa-solid fa-face-viewfinder text-6xl text-emerald-400"></i>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] animate-pulse">Analyzing Authenticity</p>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest opacity-60">Neural proof in progress...</p>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="space-y-8 animate-in zoom-in duration-700">
            <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-[0_0_40px_rgba(16,185,129,0.5)] border border-white/30 rotate-12">
              <i className="fa-solid fa-check text-3xl"></i>
            </div>
            <div className="space-y-2">
               <h2 className="text-4xl font-black text-white tracking-tighter italic">Verified.</h2>
               <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Badge Active On Scene</p>
            </div>
            <button 
              onClick={onComplete}
              className="w-full py-6 shimmer-btn text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
            >
              Continue to Curate ✨
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
      `}</style>
    </div>
  );
};

export default IdentityVerification;
