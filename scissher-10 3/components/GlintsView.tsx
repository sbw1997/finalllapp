import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import UserProfileModal from './UserProfileModal';
import SeshRequestModal from './SeshRequestModal';
import { User } from '../types';

interface GlintsViewProps {
  likedUsers: string[];
  onUpgrade: () => void;
}

const GlintsView: React.FC<GlintsViewProps> = ({ likedUsers, onUpgrade }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [seshRequestUser, setSeshRequestUser] = useState<User | null>(null);

  const handleSeshSubmit = (day: string, slot: string, note: string) => {
    setSeshRequestUser(null);
    alert(`Spark reflected! 💎 Sesh request on its way.`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-3xl font-black tracking-tighter shimmer-text">Prism Network</h2>
        <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.2em]">{likedUsers.length} SPARKS REFLECTED</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MOCK_USERS.map((user) => (
          <div key={user.id} className="relative aspect-[3/4.2] rounded-[2.5rem] overflow-hidden group shadow-lg border border-white/5 bg-slate-900">
            <img 
              src={user.mainPhoto} 
              alt={user.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent"></div>
            
            <div className="absolute top-4 left-4 flex gap-1">
               <div className="w-8 h-8 petal-gradient rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                 <i className="fa-solid fa-gem text-white text-[10px]"></i>
               </div>
            </div>

            <div className="absolute bottom-5 left-5 right-5 space-y-3">
              <div>
                <h4 className="font-black text-xl leading-tight text-white mb-0.5">{user.name}, {user.age}</h4>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic">{user.distance}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setSeshRequestUser(user)}
                  className="w-full py-2.5 shimmer-btn rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white shadow-lg flex items-center justify-center gap-2 border border-white/10 active:scale-95 transition-all"
                >
                  <i className="fa-solid fa-bolt"></i>
                  Send a Sesh Request
                </button>
                <button 
                  onClick={() => setSelectedUser(user)}
                  className="w-full py-2 glass rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-white/10 transition-all border-white/10 text-slate-300"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-8 rounded-[3rem] text-center space-y-5 shadow-2xl relative overflow-hidden group">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-all"></div>
        <div className="w-14 h-14 bg-purple-500/20 rounded-[1.5rem] mx-auto flex items-center justify-center text-purple-400 shadow-xl border border-purple-500/20 relative z-10">
           <i className="fa-solid fa-gem text-2xl"></i>
        </div>
        <div className="relative z-10">
          <h3 className="font-black text-2xl tracking-tight shimmer-text">Full Spectrum</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed px-4">Stop guessing who's catching your light. Reveal every Spark before you even swipe.</p>
        </div>
        <button onClick={onUpgrade} className="w-full py-4 shimmer-btn rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white shadow-xl shadow-purple-600/20 active:scale-95 transition-all relative z-10">Ascend to Premium</button>
      </div>

      {selectedUser && (
        <UserProfileModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onSendPetal={() => alert("Spark sent! 💎")}
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

export default GlintsView;