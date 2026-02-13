import React, { useState } from 'react';
import DiscoveryView from './DiscoveryView';
import SparksView from './SparksView';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface DiscoveryHubProps {
  onLike: (id: string) => void;
  likedUsers: string[];
  onUpgrade: () => void;
}

const DiscoveryHub: React.FC<DiscoveryHubProps> = ({ onLike, likedUsers, onUpgrade }) => {
  const [activeSubTab, setActiveSubTab] = useState<'explore' | 'sparks'>('explore');

  const handleTabChange = async (tab: 'explore' | 'sparks') => {
    if (tab === activeSubTab) return;
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    setActiveSubTab(tab);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Sub-Tab Header */}
      <div className="sticky top-0 z-20 pt-2 pb-6 px-1">
        <div className="flex bg-slate-900/60 backdrop-blur-3xl p-1 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 petal-gradient opacity-5 pointer-events-none"></div>
          <button 
            onClick={() => handleTabChange('explore')}
            className={`flex-1 py-4 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative z-10 ${
              activeSubTab === 'explore' 
                ? 'bg-slate-800 text-white shadow-xl scale-100' 
                : 'text-slate-500 scale-95 opacity-50'
            }`}
          >
            Find HER
          </button>
          <button 
            onClick={() => handleTabChange('sparks')}
            className={`flex-1 py-4 rounded-[2rem] text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-500 relative z-10 flex items-center justify-center gap-2 ${
              activeSubTab === 'sparks' 
                ? 'bg-rose-500/10 text-rose-400 shadow-xl scale-100' 
                : 'text-slate-500 scale-95 opacity-50'
            }`}
          >
            <i className="fa-solid fa-bolt-lightning text-[8px]"></i>
            My Sparks
            {likedUsers.length > 0 && activeSubTab !== 'sparks' && (
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-visible">
        {activeSubTab === 'explore' ? (
          <DiscoveryView onLike={onLike} />
        ) : (
          <SparksView likedUsers={likedUsers} onUpgrade={onUpgrade} />
        )}
      </div>
    </div>
  );
};

export default DiscoveryHub;