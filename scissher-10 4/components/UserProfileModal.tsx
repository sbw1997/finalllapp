import React, { useState } from 'react';
import { User } from '../types';
import { RoseIcon } from './Header';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onSendPetal: () => void;
  hasPrivateAccess?: boolean;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onSendPetal, hasPrivateAccess = false }) => {
  const [activeGallery, setActiveGallery] = useState<'public' | 'private'>('public');
  const [showReport, setShowReport] = useState(false);
  const [guessIndex, setGuessIndex] = useState<number | null>(null);
  const [activeInterest, setActiveInterest] = useState<string | null>(null);

  const internalHasAccess = hasPrivateAccess || user.id === 'u2';

  const triggerHaptic = async (style: ImpactStyle) => {
    try { await Haptics.impact({ style }); } catch (e) {}
  };

  const handleInterestTap = async (item: string) => {
    setActiveInterest(item);
    await triggerHaptic(ImpactStyle.Light);
    setTimeout(() => setActiveInterest(null), 1000);
  };

  const handleGuess = async (idx: number) => {
    if (guessIndex !== null) return;
    setGuessIndex(idx);
    const isIllusion = idx === user.twoTruthsAndAnIllusion?.illusionIndex;
    if (isIllusion) {
      await Haptics.notification({ type: NotificationType.Success });
    } else {
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-md flex items-end">
      <div 
        className="w-full h-[94vh] bg-slate-950 rounded-t-[3.5rem] overflow-y-auto animate-in slide-in-from-bottom duration-500 pb-20 shadow-[0_-20px_100px_rgba(0,0,0,0.8)] border-t border-white/10 no-scrollbar"
      >
        <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl">
          <div className="sheet-grabber"></div>
          <div className="px-6 pb-4 flex items-center justify-between">
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h3 className="text-xl font-black tracking-tighter shimmer-text italic">{user.name}'s Scene</h3>
            <div className="flex gap-2">
              <button onClick={() => setShowReport(true)} className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center text-red-500/60 active:scale-90 transition-all">
                <i className="fa-solid fa-flag text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-10 pt-4">
          <div className="relative aspect-[3/4.2] rounded-[3.5rem] overflow-hidden shadow-2xl group border border-white/5 bg-slate-900">
            <img src={user.mainPhoto} alt={user.name} className="w-full h-full object-cover" />
            
            <div 
              className="absolute inset-0 opacity-20 transition-opacity duration-1000"
              style={{ background: `radial-gradient(circle at 50% 50%, ${user.auraColor || 'rgba(251,113,133,0.5)'}, transparent 70%)` }}
            ></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {user.describeSelfOnePhoto && (
              <div className="absolute top-1/2 left-0 right-0 p-8 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none text-center">
                 <div className="glass p-6 rounded-[2rem] border-white/20 inline-block">
                    <p className="text-sm font-black text-white italic tracking-tight leading-relaxed max-w-[200px]">
                      "{user.describeSelfOnePhoto}"
                    </p>
                 </div>
              </div>
            )}

            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 px-4 py-1.5 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-emerald-100">Verified Presence</span>
                </div>
                <div className="bg-violet-500/30 backdrop-blur-xl border border-violet-500/40 px-4 py-1.5 rounded-full">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest italic">{user.relationshipStyle}</span>
                </div>
              </div>
              
              <h2 className="text-5xl font-black tracking-tighter text-white drop-shadow-lg italic leading-none">{user.name}, {user.age}</h2>
              
              <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => handleInterestTap(user.zodiacSign)}
                  className={`glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/20 shrink-0 transition-all duration-300 ${activeInterest === user.zodiacSign ? 'scale-110 border-rose-500/50' : ''}`}
                >
                  <i className="fa-solid fa-moon text-[10px] text-rose-400"></i>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.zodiacSign}</span>
                </button>
                <button 
                  onClick={() => handleInterestTap(user.loveLanguage)}
                  className={`glass px-4 py-2 rounded-2xl flex items-center gap-2 border-white/20 shrink-0 transition-all duration-300 ${activeInterest === user.loveLanguage ? 'scale-110 border-rose-500/50' : ''}`}
                >
                  <i className="fa-solid fa-heart text-[10px] text-rose-400"></i>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.loveLanguage}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-2">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <i className="fa-solid fa-quote-left text-[10px]"></i>
                </div>
                The Vibe
              </h4>
              <p className="text-2xl font-medium text-slate-100 leading-relaxed italic pr-6 tracking-tight">
                "{user.bio}"
              </p>
            </div>

            {/* Interest Glints */}
            <div className="flex flex-wrap gap-2">
              {user.interests[0].items.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleInterestTap(item)}
                  className={`px-4 py-2 bg-slate-900 border border-white/5 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest italic transition-all relative overflow-hidden ${activeInterest === item ? 'text-white border-white/20' : ''}`}
                >
                  {activeInterest === item && (
                    <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
                  )}
                  {item}
                </button>
              ))}
            </div>

            {user.idealFirstDate && (
               <div className="glass p-10 rounded-[3rem] border-white/5 space-y-4 shadow-xl bg-slate-900/40 border-l-rose-500/40 border-l-8">
                  <p className="text-[9px] font-black text-rose-400 uppercase tracking-[0.5em] italic">The Ideal Scene</p>
                  <h4 className="text-xl font-black text-white italic tracking-tighter leading-tight pr-4">"{user.idealFirstDate}"</h4>
               </div>
            )}

            {user.twoTruthsAndAnIllusion && (
               <div className="glass p-10 rounded-[4rem] border-white/5 space-y-8 shadow-xl bg-slate-950/60 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.5em] italic">Two Truths & An Illusion</p>
                    {guessIndex !== null && (
                      <span className="text-[9px] font-black text-white uppercase tracking-widest bg-emerald-500 px-3 py-1 rounded-full">
                        Truth Revealed
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {user.twoTruthsAndAnIllusion.statements.map((statement, idx) => {
                      const isIllusion = idx === user.twoTruthsAndAnIllusion?.illusionIndex;
                      const isGuessed = guessIndex === idx;
                      const showResult = guessIndex !== null;

                      return (
                        <button 
                          key={idx} 
                          disabled={showResult}
                          onClick={() => handleGuess(idx)}
                          className={`w-full p-6 rounded-[2rem] border transition-all duration-500 text-left relative overflow-hidden active:scale-95 ${
                            showResult 
                            ? (isIllusion ? 'border-red-500/40 bg-red-500/10 text-red-100' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-50')
                            : 'border-white/5 bg-slate-900/50 text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <div className="flex gap-4 items-center">
                            {showResult && (
                              <i className={`fa-solid ${isIllusion ? 'fa-circle-xmark text-red-400' : 'fa-circle-check text-emerald-400'} text-lg`}></i>
                            )}
                            <p className="text-sm font-bold tracking-tight italic flex-1">{statement}</p>
                          </div>
                          {isGuessed && !isIllusion && showResult && (
                            <div className="absolute top-0 right-0 p-3">
                               <span className="text-[7px] font-black text-red-400 uppercase tracking-widest">Inaccurate Guess</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
               </div>
            )}

            {user.tableOrder && (
               <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <i className="fa-solid fa-martini-glass-citrus text-6xl"></i>
                  </div>
                  <div className="flex flex-col items-center gap-3 text-center border-b border-dashed border-white/20 pb-6">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.6em] italic">A Night Out Manifest</p>
                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Ordered For The Table</h5>
                  </div>
                  <div className="py-2">
                    <h4 className="text-xl font-black text-white italic tracking-widest leading-relaxed text-center uppercase">
                      {user.tableOrder}
                    </h4>
                  </div>
                  <div className="flex justify-center pt-4">
                    <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  </div>
               </div>
            )}
          </div>

          <div className="space-y-6 pt-10">
            <div className="flex bg-slate-900/50 p-1.5 rounded-[2.5rem] border border-white/5 mx-2 shadow-inner">
              <button onClick={() => setActiveGallery('public')} className={`flex-1 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeGallery === 'public' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500'}`}>Public Presence</button>
              <button onClick={() => setActiveGallery('private')} className={`flex-1 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeGallery === 'private' ? 'bg-rose-500/10 text-rose-400 shadow-lg' : 'text-slate-500'}`}><i className="fa-solid fa-lock text-[10px]"></i> Private Access</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 px-2 pb-20">
              {activeGallery === 'public' ? (
                [user.mainPhoto, ...user.publicPhotos].map((img, i) => (
                  <div key={i} className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 shadow-xl transition-transform active:scale-95 bg-slate-900"><img src={img} className="w-full h-full object-cover" /></div>
                ))
              ) : internalHasAccess ? (
                user.privatePhotos.map((img, i) => (
                  <div key={i} className="aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 shadow-xl transition-transform active:scale-95 relative bg-slate-900">
                    <img src={img} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-rose-500/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                        <i className="fa-solid fa-key text-white text-[8px]"></i>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-24 glass rounded-[4rem] border border-dashed border-white/10 space-y-6 mx-2">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-700 shadow-inner">
                    <i className="fa-solid fa-lock text-4xl"></i>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Private Access Restricted</p>
                    <p className="text-[9px] font-medium text-slate-600 italic px-10 leading-relaxed">Only users with an active Access Key can catch this light.</p>
                  </div>
                  <button onClick={() => { triggerHaptic(ImpactStyle.Medium); alert("Access Key request sent to " + user.name + " ✨"); }} className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] active:scale-90 transition-all bg-rose-500/10 px-8 py-4 rounded-2xl border border-rose-500/20">Request Key</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-8 z-[120]">
           <button 
              onClick={() => { triggerHaptic(ImpactStyle.Heavy); onSendPetal(); onClose(); }} 
              className="w-full py-7 shimmer-btn text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-[0_30px_60px_-12px_rgba(251,113,133,0.5)] flex items-center justify-center gap-4 active:scale-95 transition-all border border-white/30"
            >
              <RoseIcon className="w-8 h-8 drop-shadow-[0_0_8px_white]" color="white" />
              Send Spark
            </button>
        </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="w-full max-sm glass rounded-[3.5rem] p-10 space-y-8 text-center border-red-500/20 border shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto border border-red-500/20 shadow-xl">
              <i className="fa-solid fa-flag text-2xl"></i>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic tracking-tighter">Safety Signal</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Intentionality Check</p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-left">
              {['Harassment', 'Inappropriate Photos', 'Fake Account', 'Underage'].map((reason) => (
                <button key={reason} onClick={() => alert(`Report for "${reason}" submitted.`)} className="w-full p-4 glass border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-red-500/40 hover:text-white transition-all active:scale-95">
                  {reason}
                </button>
              ))}
            </div>
            <button onClick={() => setShowReport(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-600 pt-2 active:scale-90 transition-transform">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileModal;