import React, { useState } from 'react';
import { User, DatingEvent } from '../types';
import SpeedDatingView from './SpeedDatingView';
import HostApplicationModal from './HostApplicationModal';

interface EventsViewProps {
  user: User | null;
  onUpdateTickets: (count: number) => void;
}

const MOCK_EVENTS: DatingEvent[] = [
  { id: 'e1', title: 'Intentional Mix & Mingle', type: 'Mixer', date: 'Sunday', time: '4:00 PM', attendees: 89, image: 'https://images.unsplash.com/photo-1550029330-8dbccaade873?w=800&q=80', isLive: false },
];

const EventsView: React.FC<EventsViewProps> = ({ user, onUpdateTickets }) => {
  const [showSesh, setShowSesh] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);

  if (showSesh) {
    return (
      <div className="animate-in fade-in duration-700 h-full overflow-y-auto no-scrollbar">
        <button onClick={() => setShowSesh(false)} className="mb-6 px-4 py-3 rounded-2xl glass text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 active:scale-95 transition-all">
          <i className="fa-solid fa-chevron-left"></i> Exit Event Scene
        </button>
        <SpeedDatingView user={user} onUpdateTickets={onUpdateTickets} onExit={() => setShowSesh(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-6xl font-black tracking-tighter text-rose-400 italic leading-none">City Events</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-1 opacity-80 italic">Verified Intentional Gatherings</p>
      </div>

      <div className="space-y-8">
        {/* Main Event Card */}
        {MOCK_EVENTS.map(event => (
          <div key={event.id} onClick={() => setShowSesh(true)} className="relative aspect-[1.2/1] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl group bg-slate-900 cursor-pointer active:scale-95 transition-all">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            
            <div className="absolute top-10 left-10">
               <p className="text-emerald-400 font-black text-lg italic tracking-tight">{event.date} @ {event.time}</p>
            </div>

            <div className="absolute bottom-12 left-10 right-10">
              <h4 className="text-5xl font-black text-white tracking-tighter italic leading-[0.9] mb-6">{event.title}</h4>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800"></div>
                   ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.attendees}+ Intentions</span>
              </div>
            </div>
            
            <div className="absolute bottom-10 right-10">
               <div className="w-16 h-16 petal-gradient rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20">
                  <i className="fa-solid fa-bolt-lightning text-2xl"></i>
               </div>
            </div>
          </div>
        ))}

        {/* Curate a Sesh / Host Section */}
        <div className="bg-[#0a0f1e]/80 border border-white/5 p-16 rounded-[4rem] text-center space-y-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group mx-1">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.05)_0%,_transparent_70%)]"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="w-24 h-24 bg-slate-900/80 rounded-[2.5rem] mx-auto flex items-center justify-center text-emerald-400 shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-700">
               <i className="fa-solid fa-microphone-lines text-4xl"></i>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-black text-5xl tracking-tighter text-white italic leading-none">Curate a Sesh</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed px-6 opacity-80 italic">
                Verified hosts can create intentional Blind Sessions. Apply to lead your local community vibe.
              </p>
            </div>

            <button 
              onClick={() => setShowHostModal(true)}
              className="group relative inline-flex items-center gap-3 pt-4"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-emerald-400">Become a Host</span>
              <i className="fa-solid fa-sparkles text-emerald-400 text-xs animate-pulse"></i>
              <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-emerald-500/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
            </button>
          </div>
        </div>
      </div>

      {showHostModal && (
        <HostApplicationModal 
          user={user} 
          onClose={() => setShowHostModal(false)} 
        />
      )}
    </div>
  );
};

export default EventsView;