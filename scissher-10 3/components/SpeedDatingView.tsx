
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { MOCK_USERS } from '../constants';

interface SpeedDatingViewProps {
  user: User | null;
  onUpdateTickets: (count: number) => void;
  onExit: () => void;
}

const SESSION_DURATION = 180; // 3 minutes
const REVEAL_START_TIME = 30; // Unblur starts at 30s remaining
const INITIAL_BLUR = 45;

const SpeedDatingView: React.FC<SpeedDatingViewProps> = ({ user, onUpdateTickets, onExit }) => {
  const [isActive, setIsActive] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [timer, setTimer] = useState(SESSION_DURATION);
  const [blurAmount, setBlurAmount] = useState(INITIAL_BLUR);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentMatch, setCurrentMatch] = useState<User | null>(null);
  const [showMatchPrompt, setShowMatchPrompt] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    let interval: any;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          const next = prev - 1;
          
          if (next > REVEAL_START_TIME) {
            setBlurAmount(INITIAL_BLUR);
          } else {
            // Gradually decrease blur from INITIAL_BLUR to 0 over the last 30 seconds
            const progress = next / REVEAL_START_TIME;
            setBlurAmount(INITIAL_BLUR * progress);
          }
          
          if (next === 10) {
             Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
          }
          
          return next;
        });
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setBlurAmount(0);
      setShowMatchPrompt(true);
      Haptics.notification({ type: NotificationType.Warning }).catch(() => {});
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startSearching = async () => {
    if (!user) return;
    
    if (!user.isPremium && user.speedDatingTickets <= 0) {
      alert("You're out of credits! Purchase more or upgrade to Premium for unlimited Sesh access.");
      return;
    }

    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(userMedia);
      setIsSearching(true);
      await Haptics.impact({ style: ImpactStyle.Heavy });

      // Simulate finding a match
      setTimeout(() => {
        const potentialMatch = MOCK_USERS.find(u => u.id !== user.id) || MOCK_USERS[0];
        setCurrentMatch(potentialMatch);
        setIsSearching(false);
        setIsActive(true);
        if (!user.isPremium) {
          onUpdateTickets(user.speedDatingTickets - 1);
        }
      }, 4000);
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera and Microphone access are required for a Virtual Blind Sesh.");
    }
  };

  useEffect(() => {
    if (videoRef.current && stream && (isActive || isSearching)) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isActive, isSearching]);

  const handleDecision = async (decision: 'pass' | 'match') => {
    if (decision === 'match') {
      await Haptics.notification({ type: NotificationType.Success });
      alert(`It's a Spark! ✨ If ${currentMatch?.name} matches back, you'll see them in your Sparks.`);
    } else {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowMatchPrompt(false);
    setCurrentMatch(null);
    setTimer(SESSION_DURATION);
    setBlurAmount(INITIAL_BLUR);
    onExit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isActive && !isSearching && !showMatchPrompt) {
     return (
        <div className="space-y-8 py-10">
           <div className="glass p-10 rounded-[4rem] border-white/10 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl petal-gradient flex items-center justify-center text-white mx-auto shadow-2xl rotate-3">
                 <i className="fa-solid fa-bolt-lightning text-3xl"></i>
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter shimmer-text leading-tight">Virtual Blind Sesh</h2>
              <p className="text-sm text-slate-400 font-medium italic leading-relaxed px-4">
                 Skip the superficial. Connect through voice and energy for 3 minutes. Appearance unblurs in the final 30s.
              </p>
              <button onClick={startSearching} className="w-full py-6 shimmer-btn text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl border border-white/20 active:scale-95 transition-all">
                 Join Queue
              </button>
           </div>
        </div>
     );
  }

  if (isSearching) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center space-y-12 px-6 text-center animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-64 h-64 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
          <div className="absolute inset-4 rounded-full overflow-hidden grayscale opacity-30 blur-[2px] bg-slate-900 shadow-inner">
             <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-20 h-20 petal-gradient rounded-full flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(16,185,129,0.5)]">
               <i className="fa-solid fa-tower-broadcast text-white text-3xl"></i>
             </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter shimmer-text uppercase italic">Scanning The Scene</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] leading-relaxed">Locating an intentional partner <br/> for a virtual interaction</p>
        </div>
        <button onClick={() => { setIsSearching(false); onExit(); }} className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-10 underline">Cancel Search</button>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-in fade-in duration-500">
        <div className="relative flex-1 bg-slate-900 overflow-hidden">
          <img 
            src={currentMatch?.mainPhoto} 
            className="w-full h-full object-cover"
            style={{ filter: `blur(${blurAmount}px) saturate(1.2)` }}
            alt="Blind Date"
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
          
          <div className="absolute top-12 left-0 right-0 px-8 flex justify-between items-start z-10">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-[2rem] flex items-center gap-4">
               <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#fb7185]"></div>
               <span className="text-xl font-black tracking-tighter text-white tabular-nums">{formatTime(timer)}</span>
            </div>
          </div>

          <div className="absolute bottom-12 left-8 right-8 z-10">
            <div className="glass p-8 rounded-[3rem] border-white/10 space-y-4 shadow-2xl">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em]">Intentional Prompt</p>
               </div>
               <h3 className="text-2xl font-black text-white italic tracking-tighter leading-tight">
                 {timer > REVEAL_START_TIME ? "Discuss your long-term vision for community." : "The reveal has begun. Stay present."}
               </h3>
               <p className="text-xs text-slate-400 font-medium italic opacity-80 leading-relaxed line-clamp-2">
                 {currentMatch?.bio}
               </p>
            </div>
          </div>
        </div>

        <div className="h-48 glass border-t border-white/10 p-6 flex items-center justify-between">
           <div className="w-36 h-full rounded-2xl overflow-hidden border border-white/10 relative shadow-xl">
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale" />
              <div className="absolute inset-0 bg-rose-500/10 pointer-events-none"></div>
           </div>
           <div className="flex-1 flex flex-col items-end justify-center px-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">HER Energy</p>
              <h4 className="text-2xl font-black text-white italic tracking-tighter">{currentMatch?.name}</h4>
           </div>
        </div>
      </div>
    );
  }

  if (showMatchPrompt) {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-in zoom-in duration-500">
         <div className="relative z-10 text-center space-y-12 w-full max-w-xs">
            <div className="w-48 h-48 rounded-[3.5rem] border-4 border-rose-500 shadow-2xl overflow-hidden mx-auto bg-slate-900">
               <img src={currentMatch?.mainPhoto} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black italic tracking-tighter shimmer-text leading-none">Decision Time</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400">Sesh Window Closed</p>
            </div>
            <div className="space-y-4 pt-4 w-full">
              <button 
                onClick={() => handleDecision('match')} 
                className="w-full py-6 shimmer-btn text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl border border-white/30"
              >
                Spark Match
              </button>
              <button 
                onClick={() => handleDecision('pass')} 
                className="w-full py-5 glass border border-white/10 text-slate-500 rounded-[2.25rem] font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all"
              >
                Cut Connection
              </button>
            </div>
         </div>
      </div>
    );
  }

  return null;
};

export default SpeedDatingView;
