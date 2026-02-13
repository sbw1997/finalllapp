
import React from 'react';

export const NormalScissorsIcon = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="7" cy="18" r="2.5" stroke={color} strokeWidth="2" />
    <circle cx="17" cy="18" r="2.5" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="12" r="1" fill={color} />
    <path d="M 8.5 16.5 L 18 3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 15.5 16.5 L 6 3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const RoseIcon = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M12 16.5C14.5 14 18 11.5 18 8C18 5 15.5 3 12 3C8.5 3 6 5 6 8C6 11.5 9.5 14 12 16.5Z" 
      fill={color} 
      fillOpacity="0.2"
    />
    <path 
      d="M12 16.5C13.5 15 16.5 13 16.5 8.5C16.5 6 14.5 4.5 12 4.5C9.5 4.5 7.5 6 7.5 8.5C7.5 13 10.5 15 12 16.5Z" 
      fill={color}
    />
    <path d="M12 16.5V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const SunflowerIcon = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="4" fill={color} />
    <path 
      d="M12 2C12 2 13 5 12 5C11 5 12 2 12 2ZM12 22C12 22 11 19 12 19C13 19 12 22 12 22ZM2 12C2 12 5 11 5 12C5 13 2 12 2 12ZM22 12C22 12 19 13 19 12C19 11 22 12 22 12ZM19.07 4.93C19.07 4.93 16.24 6.34 17 7.07C17.76 7.8 19.07 4.93 19.07 4.93ZM4.93 19.07C4.93 19.07 7.76 17.66 7 16.93C6.24 16.2 4.93 19.07 4.93 19.07ZM4.93 4.93C4.93 4.93 6.34 7.76 7.07 7C7.8 6.24 4.93 4.93 4.93 4.93ZM19.07 19.07C19.07 19.07 17.66 16.24 16.93 17C16.2 17.76 19.07 19.07 19.07 19.07Z" 
      fill={color} 
    />
  </svg>
);

export const SeshClockIcon = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="7" cy="5" r="3" stroke={color} strokeWidth="1.5" />
    <circle cx="17" cy="5" r="3" stroke={color} strokeWidth="1.5" />
    <circle cx="12" cy="13" r="8" stroke={color} strokeWidth="2" />
    <path d="M12 13L15 9" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M12 13L9 9" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Added FullConnectionIcon to resolve missing export error in SparksView
export const FullConnectionIcon = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string, color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" strokeDasharray="2 3" />
    <path d="M12 18V12L16 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12L8 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.5" fill={color} />
    <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="px-6 pt-safe pb-6 flex items-center justify-between sticky top-0 z-50 glass border-b border-white/5 rounded-b-[2rem]">
      <div className="flex items-center gap-4 py-2">
        <div className="relative group">
          <div className="w-10 h-10 bg-slate-900 rounded-[1rem] flex items-center justify-center text-white border border-white/10 overflow-hidden relative active:scale-90">
            <div className="absolute inset-0 petal-gradient opacity-15"></div>
            <NormalScissorsIcon className="w-6 h-6 relative z-10 drop-shadow-[0_0_8px_white]" color="white" />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter leading-none">
            <span className="shimmer-text italic">ScissHER</span>
          </h1>
          <span className="text-[6px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1 opacity-80">
            Intentional Connection
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 active:scale-90 transition-all">
          <i className="fa-regular fa-bell text-sm"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
