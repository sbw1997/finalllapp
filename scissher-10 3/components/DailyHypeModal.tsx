
import React from 'react';
import { PRIMARY_HYPE_QUOTE } from '../constants';
import { NormalScissorsIcon } from './Header';

interface DailyHypeModalProps {
  onClose: () => void;
}

const DailyHypeModal: React.FC<DailyHypeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15)_0%,_transparent_70%)] animate-pulse pointer-events-none"></div>
      
      <div className="w-full max-sm glass p-10 rounded-[4rem] border-white/10 text-center space-y-8 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in zoom-in slide-in-from-bottom-10 duration-700">
        <div className="absolute top-0 left-0 w-full h-1 petal-gradient"></div>
        
        <div className="relative">
          <div className="w-24 h-24 petal-gradient rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-[0_0_30px_rgba(16,185,129,0.4)] rotate-12 transition-transform hover:rotate-0 duration-500">
             <NormalScissorsIcon className="w-14 h-14 drop-shadow-[0_0_8px_white]" color="white" />
             <div className="absolute -top-3 -right-3 animate-pulse">
                <i className="fa-solid fa-sparkle text-cyan-300 text-lg"></i>
             </div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Phone Number Verified</p>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Intention Status: Maximum ✨</p>
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-tight text-white italic leading-tight px-2">
          "{PRIMARY_HYPE_QUOTE}"
        </h2>

        <div className="space-y-4">
          <button 
            onClick={onClose}
            className="w-full py-5 shimmer-btn text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-500/30 active:scale-95 transition-all border border-white/10"
          >
            I'm Ready To Connect ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyHypeModal;
