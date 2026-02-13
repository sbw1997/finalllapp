
import React from 'react';

interface PremiumUpgradeModalProps {
  onClose: () => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({ onClose }) => {
  const perks = [
    { icon: 'fa-bolt', title: 'Unlimited Sesh Tickets', desc: 'Join every Blind Sesh event without limits.' },
    { icon: 'fa-eye', title: 'See Who Petal\'d You', desc: 'Reveal matches before you even swipe.' },
    { icon: 'fa-key-skeleton', title: 'Priority Vault Access', desc: 'Be the first to see private albums.' },
    { icon: 'fa-location-crosshairs', title: 'Global Passport', desc: 'Change your city and connect anywhere.' },
  ];

  const handlePurchase = () => {
    // In a native build, this would trigger: 
    // await CapacitorStore.purchase('scissher_premium_monthly');
    alert("In production, this triggers the Apple In-App Purchase dialog. Payment is handled securely via your Apple ID.");
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/95 flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_rgba(121,40,202,0.2)_0%,_transparent_60%)] pointer-events-none animate-pulse"></div>
      
      <div className="w-full max-w-sm glass rounded-[3.5rem] border-white/10 relative overflow-hidden shadow-[0_0_80px_rgba(121,40,202,0.3)] animate-in zoom-in duration-500">
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 z-50">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 petal-gradient rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-3 mb-4">
              <i className="fa-solid fa-crown text-white text-3xl drop-shadow-lg"></i>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-white italic">Full Bloom</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">The Ultimate Intentional Experience</p>
          </div>

          <div className="space-y-4">
            {perks.map((perk, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center shrink-0">
                  <i className={`fa-solid ${perk.icon} text-rose-500 text-xs`}></i>
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{perk.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4">
            <button 
              onClick={handlePurchase}
              className="w-full py-5 shimmer-btn text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all border border-white/20"
            >
              Unlock For $9.99/mo
            </button>
            
            <div className="space-y-2 px-2">
              <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest text-center leading-relaxed">
                Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period.
              </p>
              <div className="flex justify-center gap-4">
                <button className="text-[7px] font-black uppercase text-slate-500 underline">Terms of Use</button>
                <button className="text-[7px] font-black uppercase text-slate-500 underline">Privacy Policy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumUpgradeModal;
