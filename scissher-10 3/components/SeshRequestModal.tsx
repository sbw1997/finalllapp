
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface SeshRequestModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (day: string, slot: string, note: string) => void;
  initialNote?: string;
  groundingLinks?: any[];
}

const SeshRequestModal: React.FC<SeshRequestModalProps> = ({ user, onClose, onSubmit, initialNote = '', groundingLinks = [] }) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (initialNote) setNote(initialNote);
  }, [initialNote]);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  const handleSend = () => {
    if (selectedDay && selectedSlot) {
      triggerHaptic();
      onSubmit(selectedDay, selectedSlot, note);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end bg-black/80 backdrop-blur-md p-0 animate-in fade-in duration-300">
      <div className="w-full bg-slate-950 rounded-t-[3.5rem] p-8 pb-12 shadow-[0_-30px_100px_rgba(0,0,0,0.9)] border-t border-white/10 animate-in slide-in-from-bottom-full duration-500 no-scrollbar overflow-y-auto max-h-[92vh]">
        <div className="sheet-grabber mb-8"></div>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[1.75rem] petal-gradient flex items-center justify-center text-white border border-white/20 shadow-xl rotate-6">
              <i className="fa-solid fa-calendar-heart text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none">ScissHER Sesh</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Requesting Intentional Window</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center active:scale-90 transition-all border border-white/5">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="space-y-10">
          {(initialNote || groundingLinks.length > 0) && (
            <div className="bg-rose-500/10 p-6 rounded-[2rem] border border-rose-500/20 space-y-4 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-sparkles text-rose-400 text-[10px]"></i>
                <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">Scene Intel Suggestion</span>
              </div>
              <p className="text-sm font-medium italic text-slate-200 leading-relaxed pr-4">
                "{initialNote}"
              </p>
              {groundingLinks.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {groundingLinks.map((link, idx) => {
                    const data = link.web || link.maps;
                    if (!data) return null;
                    return (
                      <a 
                        key={idx} 
                        href={data.uri} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[9px] font-black text-white bg-slate-900/50 border border-white/10 px-3 py-1.5 rounded-full hover:bg-rose-500/20 transition-colors flex items-center gap-2"
                      >
                        <i className={`fa-solid ${link.maps ? 'fa-location-dot' : 'fa-link'}`}></i>
                        {data.title || "View Source"}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Select HER Availability</h4>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {user.availability.map((avail) => (
                <button
                  key={avail.day}
                  onClick={() => {
                    setSelectedDay(avail.day);
                    setSelectedSlot('');
                  }}
                  className={`px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                    selectedDay === avail.day 
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-100 shadow-xl' 
                      : 'bg-slate-900 border-white/5 text-slate-500'
                  }`}
                >
                  {avail.day}
                </button>
              ))}
            </div>
          </div>

          {selectedDay && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">Select Specific Window</h4>
              <div className="grid grid-cols-2 gap-3">
                {user.availability.find(a => a.day === selectedDay)?.slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedSlot === slot 
                        ? 'bg-rose-500 text-white shadow-2xl border-white/30' 
                        : 'bg-slate-900 border-white/5 text-slate-500'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">The Proposal</h4>
            <textarea
              placeholder="Suggest a specific intention..."
              className="w-full bg-slate-900 border border-white/5 rounded-[2.5rem] p-7 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-100 placeholder:text-slate-700 italic min-h-[140px] shadow-inner"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleSend}
              disabled={!selectedDay || !selectedSlot}
              className={`w-full py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
                selectedDay && selectedSlot
                  ? 'shimmer-btn text-white shadow-2xl active:scale-95 border border-white/30'
                  : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5 opacity-50'
              }`}
            >
              Confirm Intentional Sesh
            </button>
            <p className="text-[8px] text-center text-slate-600 font-bold uppercase tracking-[0.5em] mt-8 px-10 leading-relaxed italic opacity-60">
              directionless talk is filtered out. <br/> only intentional requests reach HER scene.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeshRequestModal;
