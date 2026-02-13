
import React, { useState } from 'react';
import { NormalScissorsIcon } from './Header';

const AgeVerification: React.FC<{ onVerify: () => void }> = ({ onVerify }) => {
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const birthYear = parseInt(year);
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (!year || year.length !== 4) {
      setError('Please enter your 4-digit birth year.');
      return;
    }

    if (age < 18) {
      setError('You must be 18+ to enter this scene.');
      return;
    }

    if (age > 100) {
      setError('Please enter a valid birth year.');
      return;
    }

    onVerify();
  };

  return (
    <div className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-center p-8 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(251,113,133,0.12)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="relative mb-12">
        <div className="w-24 h-24 petal-gradient rounded-[2.2rem] flex items-center justify-center rotate-12 border-2 border-white/20 shadow-[0_0_50px_rgba(251,113,133,0.3)]">
          <NormalScissorsIcon className="w-12 h-12 drop-shadow-[0_0_10px_white]" color="white" />
        </div>
      </div>

      <div className="text-center space-y-10 max-w-xs relative z-10 w-full">
        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tighter text-white italic leading-tight">
            <span className="shimmer-text">Safety Check</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Confirm your eligibility
          </p>
        </div>

        <div className="glass p-10 rounded-[3.5rem] border-white/5 space-y-6 shadow-2xl">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">Birth Year</label>
            <input 
              type="number" 
              placeholder="1998" 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-5 text-center text-2xl font-black text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 placeholder:text-slate-800" 
            />
          </div>
          {error && <p className="text-[9px] text-rose-500 font-bold uppercase tracking-widest animate-pulse">{error}</p>}
          <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed">
            Must be 18+ to connect. <br/> Biometric scan follows this step.
          </p>
        </div>

        <button 
          onClick={handleContinue}
          className="w-full py-6 shimmer-btn rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl active:scale-95 transition-all border border-white/10"
        >
          Verify & Continue
        </button>
      </div>

      <p className="fixed bottom-12 text-[8px] text-slate-600 uppercase tracking-widest text-center px-12 leading-relaxed italic">
        Identity proofing is required by our community standards for <span className="text-slate-400">Intentional Connection</span>.
      </p>
    </div>
  );
};

export default AgeVerification;
