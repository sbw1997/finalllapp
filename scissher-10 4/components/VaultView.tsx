import React, { useState } from 'react';
import { User } from '../types';
import { GoogleGenAI } from "@google/genai";
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { MOCK_USERS } from '../constants';

interface VaultViewProps {
  user: User | null;
  onGrantAccess: (id: string) => void;
}

const VaultView: React.FC<VaultViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'public' | 'private' | 'access'>('public');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [showKeyNeeded, setShowKeyNeeded] = useState(false);

  // Track access permissions locally for demo
  const [accessPermissions, setAccessPermissions] = useState<Record<string, boolean>>({
    'u2': true,
    'u3': false,
    'u4': false
  });

  if (!user) return null;

  const photos = activeTab === 'public' ? user.publicPhotos : user.privatePhotos;
  const activeKeysCount = Object.values(accessPermissions).filter(Boolean).length;

  const handleToggleAccess = async (userId: string) => {
    const isCurrentlyGranted = accessPermissions[userId];
    
    if (isCurrentlyGranted) {
      const confirmRevoke = window.confirm(`SECURITY ALERT: Revoke Private Access for ${MOCK_USERS.find(u => u.id === userId)?.name}? Their Key will be instantly invalidated and they will lose all visibility.`);
      if (!confirmRevoke) return;
    }

    await Haptics.impact({ style: isCurrentlyGranted ? ImpactStyle.Heavy : ImpactStyle.Medium });
    
    setAccessPermissions(prev => ({
      ...prev,
      [userId]: !isCurrentlyGranted
    }));

    if (!isCurrentlyGranted) {
      await Haptics.notification({ type: NotificationType.Success });
    }
  };

  const handleRevokeAll = async () => {
    const confirm = window.confirm("EMERGENCY OVERRIDE: This will instantly invalidate ALL issued Private Access Keys. Your private album will be restricted to your eyes only. Proceed?");
    if (confirm) {
      await Haptics.notification({ type: NotificationType.Warning });
      const resetPermissions = Object.keys(accessPermissions).reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setAccessPermissions(resetPermissions);
    }
  };

  const handleCaptionGenius = async () => {
    if (!selectedPhoto) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am a ${user.currentEnergy || 'intentional person'}. 
                   Generate 3 short, poetic, "hand-written" style captions for this photo. 
                   Context: I am on ScissHER, an intentional dating app for lesbians. 
                   Focus on metropolitan vibes and authentic connection. Keep each under 10 words.`,
        config: { systemInstruction: "You are the ScissHER Caption Genius." }
      });
      alert(`Architect's Captions:\n\n${response.text}`);
      await Haptics.notification({ type: NotificationType.Success });
    } catch (err) {
      console.error(err);
      alert("Caption Genius currently unavailable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMagicEdit = async () => {
    if (!selectedPhoto || !editPrompt) return;
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: selectedPhoto.split(',')[1] || "", mimeType: 'image/png' } },
            { text: `Edit this photo as requested: ${editPrompt}` }
          ]
        }
      });
      
      let foundImage = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setSelectedPhoto(`data:image/png;base64,${part.inlineData.data}`);
          foundImage = true;
        }
      }
      
      if (foundImage) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
    } catch (err) {
      console.error(err);
      alert("Magic Edit currently unavailable.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnimate = async () => {
    if (!selectedPhoto) return;
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyNeeded(true);
      return;
    }

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: 'Animate this metropolitan portrait with subtle cinematic motion and professional lighting.',
        image: { 
          imageBytes: selectedPhoto.split(',')[1] || "", 
          mimeType: 'image/png' 
        },
        config: { 
          numberOfVideos: 1, 
          resolution: '720p', 
          aspectRatio: '9:16' 
        }
      });
      
      while (!operation.done) {
        await new Promise(r => setTimeout(r, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }
      
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      const vidResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await vidResponse.blob();
      setGeneratedVideo(URL.createObjectURL(blob));
      await Haptics.notification({ type: NotificationType.Success });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        alert("API Key error. Please re-select your paid project key.");
        await (window as any).aistudio?.openSelectKey();
      } else {
        alert("Animation failed. Ensure you have a valid paid API key selected.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 px-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-black tracking-tighter shimmer-text italic leading-none">Vibe Vault</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-70">Media Studio & Bio-Proofs</p>
      </div>

      <div className="flex bg-slate-900/40 p-1 rounded-[2.5rem] border border-white/5 mx-1 relative z-10 shadow-2xl">
        <button 
          onClick={() => setActiveTab('public')}
          className={`flex-1 py-4 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'public' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500'}`}
        >
          Public
        </button>
        <button 
          onClick={() => setActiveTab('private')}
          className={`flex-1 py-4 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'private' ? 'bg-rose-500/10 text-rose-400 shadow-xl' : 'text-slate-500'}`}
        >
          <i className="fa-solid fa-lock text-[8px]"></i> Private
        </button>
        <button 
          onClick={() => setActiveTab('access')}
          className={`flex-1 py-4 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'access' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500'}`}
        >
          <i className="fa-solid fa-key-skeleton text-[8px]"></i> Keys
        </button>
      </div>

      {activeTab !== 'access' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 px-1">
            {photos.map((img, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedPhoto(img)}
                className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group transition-all cursor-pointer active:scale-95 bg-slate-900"
              >
                <img src={img} alt="Vault item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <i className="fa-solid fa-wand-magic-sparkles text-white text-2xl drop-shadow-lg"></i>
                </div>
                {activeTab === 'private' && (
                  <div className="absolute top-4 right-4 bg-rose-500/80 backdrop-blur-md p-2 rounded-xl border border-white/20">
                     <i className="fa-solid fa-lock text-[8px] text-white"></i>
                  </div>
                )}
              </div>
            ))}
            <label className="aspect-square bg-slate-900/40 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/30 transition-all group active:scale-95">
              <input type="file" className="hidden" />
              <i className="fa-solid fa-plus text-slate-600 text-xl group-hover:text-emerald-500 transition-colors"></i>
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
          <div className="glass p-8 rounded-[3.5rem] border-white/10 space-y-5 relative overflow-hidden group bg-slate-900/40">
            <div className="absolute top-0 left-0 w-full h-1 petal-gradient opacity-40"></div>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white italic tracking-tighter leading-none">Access Matrix</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic">Manage Private Decryption Keys</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                <i className="fa-solid fa-key text-lg"></i>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic pr-4">
              Issue Keys to specific users to allow them to view your vaulted album. Keys can be revoked at any time.
            </p>

            {activeKeysCount > 0 && (
              <button 
                onClick={handleRevokeAll}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[8px] font-black text-red-500 uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                Invalidate All active Keys
              </button>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] px-4 flex items-center gap-4">
               Intentional Connections
               <div className="h-[1px] flex-1 bg-white/5"></div>
            </h4>
            
            <div className="space-y-3 px-1">
              {MOCK_USERS.filter(u => u.id !== user.id).sort((a, b) => {
                const aAccess = accessPermissions[a.id] ? 1 : 0;
                const bAccess = accessPermissions[b.id] ? 1 : 0;
                return bAccess - aAccess;
              }).map(u => {
                const hasAccess = accessPermissions[u.id];
                return (
                  <div 
                    key={u.id} 
                    className={`glass p-5 rounded-[2.5rem] flex items-center justify-between border-white/5 transition-all duration-500 ${
                      hasAccess ? 'border-rose-500/30 bg-rose-500/5 shadow-[0_10px_30px_rgba(251,113,133,0.1)]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
                        hasAccess ? 'border-rose-500 shadow-[0_0_15px_rgba(251,113,133,0.3)]' : 'border-white/10 opacity-60'
                      }`}>
                        <img src={u.mainPhoto} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white italic tracking-tighter leading-none">{u.name}</h4>
                        <p className={`text-[8px] font-black uppercase tracking-widest mt-1.5 ${hasAccess ? 'text-rose-400' : 'text-slate-500'}`}>
                          {hasAccess ? 'Key Issued' : 'Restricted'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggleAccess(u.id)}
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all group active:scale-90 ${
                        hasAccess 
                          ? 'bg-rose-500 text-white shadow-xl border border-white/20' 
                          : 'bg-slate-900 text-slate-600 border border-white/5 hover:border-white/20 hover:text-slate-400 shadow-inner'
                      }`}
                    >
                      <i className={`fa-solid ${hasAccess ? 'fa-key' : 'fa-key-skeleton'} text-lg`}></i>
                      <span className="text-[6px] font-black uppercase tracking-widest">
                        {hasAccess ? 'Revoke' : 'Grant'}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div className="fixed inset-0 z-[600] bg-slate-950 p-8 flex flex-col animate-in slide-in-from-bottom duration-500 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-10 pt-safe shrink-0">
            <h3 className="text-2xl font-black italic tracking-tighter shimmer-text leading-none">Studio Core</h3>
            <button 
              onClick={() => { setSelectedPhoto(null); setGeneratedVideo(null); }} 
              className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900 aspect-[3/4] shrink-0">
            {generatedVideo ? (
              <video src={generatedVideo} autoPlay loop muted playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={selectedPhoto} className="w-full h-full object-cover" />
            )}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                <i className="fa-solid fa-sparkles text-rose-500 text-4xl animate-spin"></i>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white animate-pulse">Processing Vibe...</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4 pb-12 shrink-0">
            <div className="flex gap-4">
               <button 
                onClick={handleCaptionGenius}
                className="flex-1 py-4 glass border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 <i className="fa-solid fa-pen-nib"></i>
                 AI Captions
               </button>
               <button 
                onClick={handleMagicEdit}
                className="flex-1 py-4 glass border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-rose-400 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 <i className="fa-solid fa-wand-sparkles"></i>
                 Magic Edit
               </button>
            </div>
            
            <button 
              onClick={handleAnimate} 
              className="w-full py-6 shimmer-btn rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl border border-white/20 active:scale-95 transition-all"
            >
              Animate with Veo
            </button>
          </div>
        </div>
      )}

      {showKeyNeeded && (
        <div className="fixed inset-0 z-[700] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="w-full max-w-sm glass p-10 rounded-[4rem] border-white/10 text-center space-y-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 petal-gradient"></div>
            <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto border border-rose-500/20">
              <i className="fa-solid fa-key text-3xl"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white italic tracking-tighter">API Key Required</h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed italic px-2">
                Advanced features like Veo require selecting a Paid API Key from your Google Cloud project.
              </p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={async () => {
                  setShowKeyNeeded(false);
                  await (window as any).aistudio?.openSelectKey();
                  handleAnimate();
                }}
                className="w-full py-6 shimmer-btn text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl border border-white/20"
              >
                Select API Key
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="block text-[9px] font-black text-slate-500 uppercase tracking-widest underline"
              >
                Billing Info
              </a>
              <button 
                onClick={() => setShowKeyNeeded(false)}
                className="text-[9px] font-black text-slate-600 uppercase tracking-widest pt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultView;