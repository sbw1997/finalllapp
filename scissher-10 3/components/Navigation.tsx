import React from 'react';
import { AppView } from '../types';
import { SeshClockIcon } from './Header';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const items = [
    { 
      id: 'discovery', 
      icon: 'fa-solid fa-compass', 
      label: 'Explore', 
      component: null 
    },
    { 
      id: 'messages', 
      icon: 'fa-solid fa-message', 
      label: 'DMs', 
      component: null 
    },
    { 
      id: 'calendar', 
      icon: '', 
      label: 'Sesh', 
      component: <SeshClockIcon className="w-5 h-5" /> 
    },
    { 
      id: 'events', 
      icon: 'fa-solid fa-ticket', 
      label: 'Events', 
      component: null 
    },
    { 
      id: 'profile', 
      icon: 'fa-solid fa-id-card-clip', 
      label: 'Me', 
      component: null 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] glass border-t border-white/5 px-2 pt-4 pb-safe flex justify-around items-center shadow-[0_-20px_80px_rgba(0,0,0,0.9)] rounded-t-[2.5rem]">
      {items.map((item) => {
        const isActive = currentView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id as AppView)}
            className={`flex flex-col items-center justify-center gap-1.5 py-2 transition-all duration-500 flex-1 relative ${
              isActive ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            {isActive && (
              <div className="absolute inset-0 bg-rose-500/10 blur-2xl rounded-full scale-110 animate-pulse"></div>
            )}
            
            <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
              {item.component ? (
                React.cloneElement(item.component as React.ReactElement<any>, { 
                  color: isActive ? '#fb7185' : 'currentColor',
                  className: "w-5 h-5 drop-shadow-[0_0_8px_rgba(251,113,133,0.3)]"
                })
              ) : (
                <i className={`${item.icon} text-lg ${isActive ? 'drop-shadow-[0_0_10px_rgba(251,113,133,0.5)]' : ''}`}></i>
              )}
            </div>
            
            <span className={`text-[7px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
              isActive ? 'opacity-100 translate-y-0 text-rose-400' : 'opacity-40 translate-y-1'
            }`}>
              {item.label}
            </span>

            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185]"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;