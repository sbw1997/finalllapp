
import React from 'react';
import { NormalScissorsIcon } from './Header';

const LogoExport: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-20 bg-[#020617] min-h-screen">
      <div className="relative group p-20">
        <div className="absolute inset-0 petal-gradient blur-[150px] opacity-40 rounded-full"></div>
        <div className="w-[512px] h-[512px] petal-gradient rounded-[120px] flex items-center justify-center relative z-10 border-[12px] border-white shadow-[0_0_120px_rgba(251,113,133,0.5)]">
           <NormalScissorsIcon className="w-[300px] h-[300px] drop-shadow-[0_0_40px_white]" color="white" />
        </div>
      </div>
      <div className="mt-20 text-center space-y-6">
        <h1 className="text-9xl font-black italic tracking-tighter shimmer-text leading-none">ScissHER</h1>
        <p className="text-3xl font-black uppercase tracking-[1em] text-rose-400 italic">Intentional Space</p>
      </div>
    </div>
  );
};

export default LogoExport;
