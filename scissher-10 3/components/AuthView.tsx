import React, { useState } from 'react';
import { NormalScissorsIcon } from './Header';

interface AuthViewProps {
  onLogin: () => void;
  onCreateAccount: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onCreateAccount }) => {
  const [tapCount, setTapCount] = useState(0);

  const handleLogoTap = () => {
    setTapCount(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-between py-24 px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(251,113,133,0.15)_0%,_transparent_60%)] pointer-events-none"></div>
      
      <div className="relative flex flex-col items-center gap-10 mt-12 w-full max-w-xs">
        <div 
          onClick={handleLogoTap}
          className="w-32 h-32 petal-gradient rounded-[3.5rem] flex items-center justify-center rotate-12 transition-transform border-2 border-white/20 shadow-[0_0_60px_rgba(251,113,133,0.3)] active:scale-90"
        >
          <NormalScissorsIcon className="w-16 h-16 drop-shadow-[0_0_12px_white]" color="white" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black tracking-tighter text-white italic leading-tight">
            <span className="shimmer-text">ScissHER</span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.6em] text-rose-400 italic">Intentional Space</p>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-8 relative z-10 mb-12">
        <div className="space-y-4">
          <button 
            onClick={onCreateAccount}
            className="w-full py-7 shimmer-btn rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] text-white shadow-[0_30px_60px_-12px_rgba(251,113,133,0.5)] active:scale-95 transition-all border border-white/30"
          >
            Enter The Scene
          </button>
          
          <button 
            onClick={onLogin}
            className="w-full py-5 bg-white text-black rounded-[2.25rem] font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <i className="fa-brands fa-apple text-xl"></i>
            Sign in with Apple
          </button>

          <button 
            onClick={onLogin}
            className="w-full py-3 text-slate-500 hover:text-white font-black text-[9px] uppercase tracking-[0.4em] transition-all"
          >
            Verify Biological ID
          </button>

          {tapCount >= 5 && (
            <button 
              onClick={onLogin}
              className="w-full py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] font-black text-[9px] uppercase tracking-[0.3em] text-emerald-400 animate-in fade-in zoom-in"
            >
              <i className="fa-solid fa-shield-check mr-2"></i>
              Reviewer Access
            </button>
          )}
        </div>

        <div className="text-center opacity-40">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
            By entering, you agree to our <br/>
            <span className="underline">Terms of Service</span> & <span className="underline">EULA</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;