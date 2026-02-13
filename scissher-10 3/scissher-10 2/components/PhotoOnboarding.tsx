import React, { useState, useEffect, useRef } from 'react';

interface PhotoItem {
  id: string;
  url: string;
  isPrivate: boolean;
  isLead: boolean;
}

interface PhotoOnboardingProps {
  onComplete: (publicPhotos: string[], privatePhotos: string[]) => void;
}

const PhotoOnboarding: React.FC<PhotoOnboardingProps> = ({ onComplete }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [acceptedEula, setAcceptedEula] = useState(false);
  const [completion, setCompletion] = useState(0);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);

  // Editor states
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let progress = Math.min(photos.length * 15, 60);
    if (photos.some(p => p.isLead)) progress += 10;
    if (acceptedEula) progress += 15;
    if (photos.length >= 4) progress += 15;
    setCompletion(Math.min(progress, 100));
  }, [photos, acceptedEula]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    
    setUploading(true);
    setTimeout(() => {
      const newPhotos: PhotoItem[] = filesArray.map((file, idx) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file as Blob),
        isPrivate: false,
        isLead: photos.length === 0 && idx === 0
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
      setUploading(false);
    }, 800);
  };

  const togglePrivate = (id: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, isPrivate: !p.isPrivate } : p));
  };

  const setLead = (id: string) => {
    setPhotos(prev => prev.map(p => ({ ...p, isLead: p.id === id })));
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (filtered.length > 0 && !filtered.find(p => p.isLead)) {
        filtered[0].isLead = true;
      }
      return filtered;
    });
  };

  const startEditing = (id: string) => {
    setEditingPhotoId(id);
    setRotation(0);
    setZoom(1);
  };

  const saveEdit = () => {
    if (!editingPhotoId || !canvasRef.current) return;
    
    const photo = photos.find(p => p.id === editingPhotoId);
    if (!photo) return;

    const img = new Image();
    img.src = photo.url;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 1000;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      
      const aspect = img.width / img.height;
      let drawWidth, drawHeight;

      if (aspect > 1) {
        drawWidth = size * aspect * zoom;
        drawHeight = size * zoom;
      } else {
        drawWidth = size * zoom;
        drawHeight = (size / aspect) * zoom;
      }

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      const newDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotos(prev => prev.map(p => p.id === editingPhotoId ? { ...p, url: newDataUrl } : p));
      setEditingPhotoId(null);
    };
  };

  const isReady = photos.length >= 3 && acceptedEula; 

  const handleSubmit = () => {
    if (!isReady) return;
    const sorted = [...photos].sort((a, b) => (a.isLead ? -1 : b.isLead ? 1 : 0));
    const publicUrls = sorted.filter(p => !p.isPrivate).map(p => p.url);
    const privateUrls = sorted.filter(p => p.isPrivate).map(p => p.url);
    onComplete(publicUrls, privateUrls);
  };

  return (
    <div className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-start py-12 px-6 overflow-y-auto no-scrollbar">
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="w-full max-w-xs mb-8 space-y-4 sticky top-0 z-20">
        <div className="glass p-5 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-end px-1 mb-3">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Identity Score</span>
            <span className="text-xl font-black italic tracking-tighter shimmer-text">{completion}%</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
            <div 
              className="h-full petal-gradient transition-all duration-[1s] ease-[cubic-bezier(0.34,1.56,0.64,1)] relative"
              style={{ width: `${completion}%` }}
            >
               <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] bg-[length:200%_100%] animate-[shimmer_2.5s_infinite]"></div>
            </div>
          </div>
          {completion < 100 && (
            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] text-center mt-4 italic opacity-80">
              {completion < 40 ? "Upload 3+ intentional photos" : completion < 75 ? "Select your Lead photo" : "Accept standards to launch"}
            </p>
          )}
        </div>
      </div>

      <div className="text-center space-y-3 max-w-xs relative z-10 w-full mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-white italic leading-tight">
          <span className="shimmer-text">Define Your Scene</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
          Curate Your Presence
        </p>
      </div>

      <div className="w-full max-w-xs space-y-8 relative z-10">
        <div className="grid grid-cols-6 gap-3 auto-rows-[100px]">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className={`relative rounded-[2rem] overflow-hidden border transition-all duration-500 shadow-2xl group ${
                photo.isLead ? 'col-span-4 row-span-3 border-emerald-500/40' : 'col-span-2 row-span-2 border-white/5'
              }`}
            >
              <img src={photo.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Upload" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                 <button 
                  onClick={() => startEditing(photo.id)}
                  className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-emerald-500/40 transition-all"
                 >
                   <i className="fa-solid fa-crop-simple"></i>
                 </button>
                 {!photo.isLead && (
                    <button 
                      onClick={() => setLead(photo.id)}
                      className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-emerald-500/40 transition-all"
                    >
                      <i className="fa-solid fa-star"></i>
                    </button>
                 )}
              </div>

              {photo.isLead && (
                <div className="absolute top-4 left-4 bg-emerald-500 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xl border border-white/20 z-10">
                  <i className="fa-solid fa-star text-[8px] text-white animate-pulse"></i>
                  <span className="text-[8px] font-black uppercase text-white tracking-widest">Lead</span>
                </div>
              )}

              <button 
                onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-all border border-white/10 z-10"
              >
                <i className="fa-solid fa-x"></i>
              </button>

              <button 
                onClick={(e) => { e.stopPropagation(); togglePrivate(photo.id); }}
                className={`absolute bottom-3 left-3 right-3 py-2 rounded-xl flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.15em] transition-all border z-10 ${
                  photo.isPrivate 
                  ? 'bg-emerald-500/80 border-emerald-400 text-white' 
                  : 'bg-black/30 backdrop-blur-md text-white border-white/10'
                }`}
              >
                <i className={`fa-solid ${photo.isPrivate ? 'fa-lock' : 'fa-lock-open'}`}></i>
                {photo.isPrivate ? 'Vaulted' : 'Public'}
              </button>
            </div>
          ))}

          <label className="col-span-2 row-span-2 bg-slate-900/40 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/30 transition-all group shadow-inner relative overflow-hidden active:scale-95">
            <input type="file" multiple onChange={handleFileSelect} className="hidden" accept="image/*" />
            <i className="fa-solid fa-plus text-slate-600 text-xl group-hover:text-emerald-500 transition-colors"></i>
          </label>
        </div>

        <div className="glass p-6 rounded-[2.5rem] border-white/10 space-y-4">
          <div className="flex items-start gap-4 cursor-pointer" onClick={() => setAcceptedEula(!acceptedEula)}>
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${acceptedEula ? 'bg-emerald-500 border-emerald-400' : 'border-slate-700 bg-slate-900'}`}>
              {acceptedEula && <i className="fa-solid fa-check text-white text-[10px]"></i>}
            </div>
            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
              I accept the <span className="text-white">Community Standards</span> & <span className="text-white">EULA</span>. I agree to zero-tolerance for harassment or abuse.
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <button 
            onClick={handleSubmit}
            disabled={!isReady || uploading}
            className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] text-white shadow-2xl transition-all ${
              isReady && !uploading
              ? 'shimmer-btn active:scale-95 shadow-emerald-500/30' 
              : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5 opacity-50'
            }`}
          >
            {uploading ? "Encrypting Vibe..." : isReady ? "Launch Experience ✨" : "Curate More"}
          </button>
          
          <p className="text-[8px] font-bold text-slate-600 text-center uppercase tracking-[0.4em] px-8 leading-relaxed italic opacity-80">
            Photos are encrypted via <span className="text-emerald-500">End-to-End ScissHER Vault</span> technology.
          </p>
        </div>
      </div>

      {editingPhotoId && (
        <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center p-8 animate-in fade-in duration-300">
           <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
              <button onClick={() => setEditingPhotoId(null)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h3 className="text-xl font-black italic tracking-tighter shimmer-text">Studio Core</h3>
              <button onClick={saveEdit} className="px-6 py-3 petal-gradient rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                Done
              </button>
           </div>

           <div className="flex-1 flex items-center justify-center w-full max-w-sm">
             <div className="relative aspect-square w-full rounded-[3.5rem] overflow-hidden border border-white/10 bg-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
               <div 
                className="w-full h-full transition-transform duration-300 flex items-center justify-center"
                style={{ 
                  transform: `rotate(${rotation}deg) scale(${zoom})`
                }}
               >
                 <img 
                  src={photos.find(p => p.id === editingPhotoId)?.url} 
                  className="w-full h-full object-contain"
                  alt="Editing"
                 />
               </div>
               
               <div className="absolute inset-0 pointer-events-none border border-white/20 flex flex-col">
                  <div className="flex-1 border-b border-white/10 flex">
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1"></div>
                  </div>
                  <div className="flex-1 border-b border-white/10 flex">
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1"></div>
                  </div>
                  <div className="flex-1 flex">
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1 border-r border-white/10"></div>
                    <div className="flex-1"></div>
                  </div>
               </div>
             </div>
           </div>

           <div className="w-full max-w-sm space-y-8 py-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Zoom Intensity</span>
                  <span className="text-[9px] font-black text-white">{Math.round(zoom * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-900 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="flex justify-around items-center">
                 <button onClick={() => setRotation(r => (r - 90) % 360)} className="w-16 h-16 glass rounded-2xl flex flex-col items-center justify-center gap-2 text-white border border-white/5 active:scale-90 transition-all">
                    <i className="fa-solid fa-rotate-left"></i>
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-50">L</span>
                 </button>
                 <button onClick={() => { setRotation(0); setZoom(1); }} className="w-16 h-16 glass rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 border border-white/5 active:scale-90 transition-all">
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-50">Reset</span>
                 </button>
                 <button onClick={() => setRotation(r => (r + 90) % 360)} className="w-16 h-16 glass rounded-2xl flex flex-col items-center justify-center gap-2 text-white border border-white/5 active:scale-90 transition-all">
                    <i className="fa-solid fa-rotate-right"></i>
                    <span className="text-[7px] font-black uppercase tracking-widest opacity-50">R</span>
                 </button>
              </div>
           </div>
           
           <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

export default PhotoOnboarding;