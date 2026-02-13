import React, { useState, useEffect } from 'react';
import Header, { NormalScissorsIcon } from './components/Header';
import Navigation from './components/Navigation';
import DiscoveryHub from './components/DiscoveryHub';
import CalendarView from './components/CalendarView';
import ProfileView from './components/ProfileView';
import VaultView from './components/VaultView';
import LiveView from './components/LiveView';
import EventsView from './components/EventsView';
import MessagesView from './components/MessagesView';
import AgeVerification from './components/AgeVerification';
import AuthView from './components/AuthView';
import PhotoOnboarding from './components/PhotoOnboarding';
import DailyHypeModal from './components/DailyHypeModal';
import PremiumUpgradeModal from './components/PremiumUpgradeModal';
import { AppView, User, AuthState } from './types';
import { MOCK_USERS } from './constants';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>('landing');
  const [currentView, setCurrentView] = useState<AppView>('discovery');
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [showHype, setShowHype] = useState<boolean>(false);
  const [showPremium, setShowPremium] = useState<boolean>(false);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [matchUser, setMatchUser] = useState<User | null>(null);
  const [viewTransitioning, setViewTransitioning] = useState(false);

  useEffect(() => {
    const initNativeFeatures = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (e) {}
      setTimeout(() => setIsAppLoading(false), 2200);
    };
    initNativeFeatures();

    if (localStorage.getItem('scissher_verified') === 'true') {
      setAuthState('authorized');
    }
  }, []);

  const handleAuthorized = async () => {
    setAuthState('authorized');
    localStorage.setItem('scissher_verified', 'true');
    setShowHype(true);
    try { await Haptics.notification({ type: NotificationType.Success }); } catch (e) {}
  };

  const handleLike = async (id: string) => {
    setLikedUsers(prev => [...prev, id]);
    if (Math.random() > 0.85) {
      const found = MOCK_USERS.find(u => u.id === id);
      if (found) {
        try { await Haptics.notification({ type: NotificationType.Success }); } catch (e) {}
        setMatchUser(found);
      }
    } else {
      try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch (e) {}
    }
  };

  const handleUpdateTickets = (count: number) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, speedDatingTickets: count });
    }
  };

  const navigateTo = async (view: AppView) => {
    if (view === currentView) return;
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    setViewTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setViewTransitioning(false);
      const mainEl = document.querySelector('main');
      if (mainEl) mainEl.scrollTop = 0;
    }, 200);
  };

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center animate-in fade-in duration-1000">
        <div className="w-32 h-32 petal-gradient rounded-[3rem] flex items-center justify-center animate-pulse shadow-[0_0_80px_rgba(251,113,133,0.3)] border-2 border-white/20">
          <NormalScissorsIcon className="w-16 h-16" color="white" />
        </div>
        <div className="mt-10 text-center space-y-3">
          <h1 className="text-4xl font-black tracking-tighter shimmer-text italic leading-none">ScissHER</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-500 animate-pulse">Entering The Scene...</p>
        </div>
      </div>
    );
  }

  if (authState === 'landing') return <AuthView onLogin={handleAuthorized} onCreateAccount={() => setAuthState('verifying')} />;
  if (authState === 'verifying') return <AgeVerification onVerify={() => setAuthState('onboarding')} />;
  if (authState === 'onboarding') return <PhotoOnboarding onComplete={() => handleAuthorized()} />;

  const renderView = () => {
    switch (currentView) {
      case 'discovery': return <DiscoveryHub onLike={handleLike} likedUsers={likedUsers} onUpgrade={() => setShowPremium(true)} />;
      case 'messages': return <MessagesView />;
      case 'calendar': return <CalendarView />;
      case 'events': return <EventsView user={currentUser} onUpdateTickets={handleUpdateTickets} />;
      case 'live': return <LiveView />;
      case 'profile': return <ProfileView user={currentUser} onReset={() => {
        localStorage.removeItem('scissher_verified');
        setAuthState('landing');
      }} />;
      case 'vault': return <VaultView user={currentUser} onGrantAccess={() => {}} />;
      default: return <DiscoveryHub onLike={handleLike} likedUsers={likedUsers} onUpgrade={() => setShowPremium(true)} />;
    }
  };

  return (
    <div className="h-full w-full bg-[#020617] text-slate-100 font-sans selection:bg-rose-500/30 flex flex-col overflow-hidden">
      <Header />
      
      <main className={`flex-1 overflow-y-auto no-scrollbar max-w-md mx-auto w-full px-4 pt-4 pb-40 transition-all duration-300 min-h-0 ${viewTransitioning ? 'opacity-0 scale-95 blur-lg' : 'opacity-100 scale-100 blur-0'}`}>
        {renderView()}
      </main>

      <Navigation currentView={currentView} setView={navigateTo} />

      {matchUser && (
        <div className="fixed inset-0 z-[600] bg-slate-950/98 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
           <div className="absolute inset-0 petal-gradient opacity-20 animate-pulse"></div>
           <div className="relative z-10 text-center space-y-12 w-full max-w-xs">
              <div className="flex items-center justify-center -space-x-8">
                 <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white/20 shadow-2xl overflow-hidden -rotate-6 bg-slate-900">
                    <img src={currentUser?.mainPhoto} className="w-full h-full object-cover" />
                 </div>
                 <div className="w-32 h-32 rounded-[2.5rem] border-4 border-rose-500 shadow-2xl overflow-hidden rotate-6 relative bg-slate-900">
                    <img src={matchUser.mainPhoto} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-rose-500/10"></div>
                 </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-6xl font-black italic tracking-tighter shimmer-text leading-none">Electric Match</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400">Atmospheric Connection Validated</p>
              </div>
              <p className="text-sm font-medium italic text-slate-300 px-4">You and {matchUser.name} have sparked an intentional scene.</p>
              <div className="space-y-4 pt-4">
                <button 
                  onClick={() => { setMatchUser(null); navigateTo('calendar'); }} 
                  className="w-full py-6 shimmer-btn text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl border border-white/30"
                >
                  Schedule Sesh
                </button>
                <button onClick={() => setMatchUser(null)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Keep Exploring</button>
              </div>
           </div>
        </div>
      )}

      {showHype && <DailyHypeModal onClose={() => setShowHype(false)} />}
      {showPremium && <PremiumUpgradeModal onClose={() => setShowPremium(false)} />}
    </div>
  );
};

export default App;