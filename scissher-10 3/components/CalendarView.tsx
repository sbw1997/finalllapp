
import React, { useState } from 'react';

const CalendarView: React.FC = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const slots = ['Morning', 'Afternoon', 'Evening', 'Night'];
  
  const [myAvailability, setMyAvailability] = useState<Record<string, string[]>>({
    'Fri': ['Evening', 'Night'],
    'Sat': ['Afternoon', 'Evening']
  });

  const [activeTab, setActiveTab] = useState<'planner' | 'requests'>('planner');

  const toggleSlot = (day: string, slot: string) => {
    setMyAvailability(prev => {
      const currentSlots = prev[day] || [];
      if (currentSlots.includes(slot)) {
        return { ...prev, [day]: currentSlots.filter(s => s !== slot) };
      } else {
        return { ...prev, [day]: [...currentSlots, slot] };
      }
    });
  };

  return (
    <div className="space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1.5 px-4">
        <h2 className="text-5xl font-black tracking-tighter shimmer-text leading-none italic">Sesh Center</h2>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 opacity-70 italic">Skip Small Talk • Define Your Window</p>
      </div>

      <div className="flex bg-slate-900/40 p-1.5 rounded-[3rem] border border-white/5 mx-1 shadow-inner backdrop-blur-3xl">
        <button onClick={() => setActiveTab('planner')} className={`flex-1 py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 ${activeTab === 'planner' ? 'bg-slate-800 text-white shadow-2xl scale-100' : 'text-slate-500 scale-95 opacity-50'}`}>
          <i className="fa-solid fa-calendar-day"></i> Planner
        </button>
        <button onClick={() => setActiveTab('requests')} className={`flex-1 py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 relative ${activeTab === 'requests' ? 'bg-rose-500/10 text-rose-400 shadow-2xl scale-100' : 'text-slate-500 scale-95 opacity-50'}`}>
          <i className="fa-solid fa-paper-plane"></i> Requests
        </button>
      </div>

      {activeTab === 'planner' ? (
        <div className="glass rounded-[4.5rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group border-t-rose-500/20 mx-1">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="grid grid-cols-8 gap-4 mb-12">
            <div className="col-span-1"></div>
            {days.map(d => (
              <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase tracking-tighter">{d[0]}</div>
            ))}
          </div>

          <div className="space-y-8">
            {slots.map(slot => (
              <div key={slot} className="grid grid-cols-8 gap-4 items-center">
                <div className="col-span-1 text-[9px] font-black text-slate-600 uppercase pr-2 text-right opacity-60 italic">{slot[0]}</div>
                {days.map(day => {
                  const isActive = myAvailability[day]?.includes(slot);
                  return (
                    <button
                      key={`${day}-${slot}`}
                      onClick={() => toggleSlot(day, slot)}
                      className={`aspect-square transition-all duration-500 relative flex items-center justify-center rounded-[1.25rem] ${
                        isActive 
                          ? 'petal-gradient shadow-[0_15px_30px_rgba(251,113,133,0.3)] scale-110 z-10 border border-white/30' 
                          : 'bg-slate-950/60 border border-white/5 hover:border-rose-500/30 scale-90'
                      }`}
                    >
                      {isActive && <i className="fa-solid fa-bolt text-[10px] text-white"></i>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex gap-6 p-8 bg-slate-950/60 rounded-[3rem] border border-white/5 items-center">
            <div className="w-14 h-14 rounded-[1.75rem] bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-xl border border-emerald-500/20">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
              Matches are strictly filtered by overlapping windows. No more "hey what's up" without a plan.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-40 glass rounded-[4.5rem] border-white/5 space-y-8 mx-1">
          <div className="w-28 h-28 bg-slate-900/80 rounded-[3.5rem] flex items-center justify-center text-slate-800 mx-auto border border-white/5 shadow-inner">
            <i className="fa-solid fa-calendar-circle-exclamation text-5xl"></i>
          </div>
          <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.4em] italic px-12">No intentional sparks reflected yet.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
