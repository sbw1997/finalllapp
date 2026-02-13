import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import UserProfileModal from './UserProfileModal';
import SeshRequestModal from './SeshRequestModal';
import { User } from '../types';
import { FullConnectionIcon } from './Header';

interface SparksViewProps {
  likedUsers: string[];
  onUpgrade: () => void;
}

const SparksView: React.FC<SparksViewProps> = ({ likedUsers, onUpgrade }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [seshRequestUser, setSeshRequestUser] = useState<User | null>(null);

  const handleSeshSubmit = (day: string, slot: string, note: string) => {
    setSeshRequestUser(null);
    alert(`Sesh request fired! ⚡️ Check your Sesh Center for the vibe check.`);
  };

  return (
    <div className="space-y-6 pb-20 px-1 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-2 gap-5 px-1">
        {MOCK_USERS.map((user) => (
          <div key={user.id} className="relative aspect-[3/4.6] rounded-[3.5rem] overflow-hidden group shadow-2xl border border-white/5 bg-slate-900 transition-all duration-500 hover:-translate-y-2">
            <img 
              src={user.mainPhoto} 
              alt={user.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/10 to-transparent"></div>
            
            <div className="absolute top-5 left-5 flex gap-1">
               <div className="w-9 h-9 petal-gradient rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                 <i className="fa-solid fa-bolt-lightning text-white text-xs"></i>
               </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-4">
              <div className="space-y-1">
                <h4 className="font-black text-2xl tracking-tighter text-white leading-none italic">{user.name}</h4>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] italic opacity-80">{user.distance}</p>
              </div>
              
              <div className="flex flex-col gap-2.5">
                <button 
                  onClick={() => setSeshRequestUser(user)}
                  className="w-full py-3 shimmer-btn rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] text-white shadow-xl flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-bolt text-[10px]"></i>
                  Sesh
                </button>
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="w-full py-2.5 glass rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border-white/10 text-slate-400 hover:text-white"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* PREMIUM UPGRADE CARD */}
      <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[4.5rem] text-center space-y-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden group border-t-rose-500/20 mx-1 mt-10">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-500/5 blur-[120px] rounded-full group-hover:bg-rose-500/10 transition-all duration-1000"></div>
        
        <div className="mx-auto flex items-center justify-center relative z-10 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
           <FullConnectionIcon className="w-24 h-24" color="#fb7185" />
        </div>

        <div className="relative z-10 space-y-4 px-4">
          <h3 className="font-black text-4xl tracking-tighter shimmer-text italic leading-tight">Full Connection</h3>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-2 opacity-80 italic">
            Stop guessing who's vibing with your energy. Reveal the Sparks instantly and interact with absolute intention.
          </p>
        </div>

        <button 
          onClick={onUpgrade} 
          className="w-full py-6 shimmer-btn rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl shadow-rose-600/30 active:scale-95 transition-all relative z-10 border border-white/20"
        >
          Ascend to Premium
        </button>
      </div>

      {selectedUser && (
        <UserProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onSendPetal={() => alert("Spark refreshed! ⚡️")}
        />
      )}

      {seshRequestUser && (
        <SeshRequestModal 
          user={seshRequestUser} 
          onClose={() => setSeshRequestUser(null)} 
          onSubmit={handleSeshSubmit} 
        />
      )}
    </div>
  );
};

export default SparksView;