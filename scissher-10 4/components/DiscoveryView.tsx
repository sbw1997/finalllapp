import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import UserProfileModal from './UserProfileModal';
import SeshRequestModal from './SeshRequestModal';
import { GoogleGenAI } from "@google/genai";
import { Haptics, ImpactStyle } from '@capacitor/haptics';

const DiscoveryView: React.FC<{ onLike: (id: string) => void }> = ({ onLike }) => {
  const [idx, setIdx] = useState(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSeshModal, setShowSeshModal] = useState(false);
  const [aiIcebreaker, setAiIcebreaker] = useState('');
  const [groundingLinks, setGroundingLinks] = useState<{ web?: { uri: string, title: string }, maps?: { uri: string, title: string } }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const user = MOCK_USERS[idx % MOCK_USERS.length];

  const triggerHaptic = async (style: ImpactStyle) => {
    try { await Haptics.impact({ style }); } catch (e) {}
  };

  const handleAiIntel = async () => {
    setIsAiLoading(true);
    await triggerHaptic(ImpactStyle.Medium);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      let latLng = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3000 });
        });
        latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {}

      // Maps grounding is only supported in Gemini 2.5 series models.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a unique, 1-sentence intentional date proposal for two lesbians in ${user.location}. 
                   Target User Interests: "${user.interests.map(i => i.items).join(', ')}". 
                   Reference real metropolitan hotspots or events near ${user.location}.`,
        config: {
          systemInstruction: "You are ScissHER's AI Scene Architect. You research actual local venues and events to create high-value, intentional date proposals. Do not use generic places.",
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          toolConfig: latLng ? { retrievalConfig: { latLng } } : undefined
        }
      });

      const text = response.text?.replace(/"/g, '') || '';
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      setAiIcebreaker(text);
      setGroundingLinks(chunks);
      setShowSeshModal(true);
    } catch (err) {
      console.error(err);
      setShowSeshModal(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAction = async (type: 'like' | 'dislike') => {
    await triggerHaptic(type === 'like' ? ImpactStyle.Heavy : ImpactStyle.Light);
    setSwipeDir(type === 'like' ? 'right' : 'left');
    
    setTimeout(() => {
      if (type === 'like') onLike(user.id);
      setIdx(idx + 1);
      setSwipeDir(null);
      setAiIcebreaker('');
      setGroundingLinks([]);
    }, 450);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative aspect-[3/4.8] w-full perspective-1000 px-1">
        <div 
          className={`relative w-full h-full rounded-[4.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.95)] border border-white/10 bg-slate-900 group transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu ${
            swipeDir === 'left' ? '-translate-x-[150%] -rotate-12 opacity-0 scale-90' : 
            swipeDir === 'right' ? 'translate-x-[150%] rotate-12 opacity-0 scale-90' : 
            'translate-x-0 rotate-0 opacity-100 scale-100'
          }`}
        >
          <img 
            src={user.mainPhoto} 
            alt={user.name} 
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            onClick={() => setShowProfile(true)}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-95 pointer-events-none"></div>
          
          <div className="absolute top-10 left-10 z-10 flex flex-col gap-3">
            <div className="bg-emerald-500/20 backdrop-blur-3xl border border-emerald-500/30 px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-emerald-100">Presence Verified</span>
            </div>
            <div className="glass backdrop-blur-3xl border border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl">
               <i className="fa-solid fa-calendar-check text-rose-400 text-[9px]"></i>
               <span className="text-[9px] font-black uppercase tracking-widest text-white/90">
                 HER Window: {user.availability[0]?.day}
               </span>
            </div>
          </div>

          <div className="absolute bottom-48 left-12 right-12 space-y-6 pointer-events-none">
            <div className="space-y-4">
              <h3 className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl leading-none italic">
                {user.name}
                <span className="text-white/30 text-3xl font-light ml-3">/ {user.age}</span>
              </h3>
              <p className="text-slate-200 font-medium italic text-lg line-clamp-2 leading-tight drop-shadow-xl opacity-90 pr-4">
                "{user.bio}"
              </p>
            </div>
          </div>

          <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-6 px-10">
            <button 
              onClick={() => handleAction('dislike')}
              className="w-16 h-16 glass rounded-full flex items-center justify-center text-slate-500 border border-white/5 active:scale-75 transition-all shadow-xl"
            >
              <i className="fa-solid fa-scissors text-xl"></i>
            </button>
            
            <button 
              onClick={handleAiIntel}
              disabled={isAiLoading}
              className="w-24 h-24 glass rounded-[2.5rem] flex flex-col items-center justify-center text-rose-400 border border-white/20 active:scale-75 transition-all shadow-2xl relative overflow-hidden group/intel"
            >
              {isAiLoading ? (
                <i className="fa-solid fa-sparkles animate-spin text-2xl"></i>
              ) : (
                <>
                  <div className="absolute inset-0 bg-rose-500/5 group-hover/intel:bg-rose-500/10 transition-colors"></div>
                  <i className="fa-solid fa-wand-magic-sparkles text-3xl mb-1 relative z-10"></i>
                  <span className="text-[7px] font-black uppercase tracking-widest relative z-10 opacity-70">Scene Intel</span>
                </>
              )}
            </button>

            <button 
              onClick={() => handleAction('like')}
              className="w-16 h-16 shimmer-btn rounded-full flex items-center justify-center text-white shadow-2xl active:scale-75 transition-all border border-white/20"
            >
              <i className="fa-solid fa-bolt-lightning text-xl"></i>
            </button>
          </div>
        </div>

        <div className="absolute inset-x-8 inset-y-0 -z-10 translate-y-12 scale-[0.93] opacity-30 rounded-[4.5rem] bg-slate-800/80 border border-white/5"></div>
      </div>

      {showProfile && (
        <UserProfileModal 
          user={user}
          onClose={() => setShowProfile(false)}
          onSendPetal={() => handleAction('like')}
        />
      )}

      {showSeshModal && (
        <SeshRequestModal 
          user={user}
          initialNote={aiIcebreaker}
          groundingLinks={groundingLinks}
          onClose={() => setShowSeshModal(false)}
          onSubmit={(day, slot, note) => {
            handleAction('like');
            setShowSeshModal(false);
          }}
        />
      )}
    </div>
  );
};

export default DiscoveryView;