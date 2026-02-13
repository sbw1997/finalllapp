
import React, { useState, useRef, useEffect } from 'react';
import { RoseIcon } from './Header';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

// Audio Encoding helper as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Audio Decoding helper as per guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Raw PCM Decoding function as per guidelines
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveView: React.FC = () => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAiListening, setIsAiListening] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  
  // Live API State
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startVoiceSesh = async () => {
    setIsVoiceActive(true);
    setIsAiListening(true);
    
    // Create a new instance right before the call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Audio Context Setup
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use the promise pattern to avoid stale closures and race conditions in callbacks
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              
              // Correctly encode the raw PCM data using our helper
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              // Rely solely on sessionPromise resolves to send data
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const b64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (b64Audio && outputAudioContextRef.current) {
              // Track end of playback queue for gapless audio scheduling
              nextStartTimeRef.current = Math.max(
                nextStartTimeRef.current,
                outputAudioContextRef.current.currentTime,
              );
              
              const audioBuffer = await decodeAudioData(
                decode(b64Audio),
                outputAudioContextRef.current,
                24000,
                1,
              );

              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: () => setIsVoiceActive(false),
          onclose: () => setIsVoiceActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
          systemInstruction: 'You are ScissHER Assistant. You have a warm, supportive voice. You help the user navigate her intentions and the metropolitan dating scene.'
        }
      });
    } catch (err) {
      alert("Microphone access is required for Voice Sesh.");
      setIsVoiceActive(false);
    }
  };

  const endVoiceSesh = () => {
    setIsVoiceActive(false);
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    for (const source of sourcesRef.current.values()) {
      source.stop();
    }
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  return (
    <div className="space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-4xl font-black tracking-tighter shimmer-text italic leading-none">Local Live</h2>
        <div className="flex gap-4">
          <button onClick={isVoiceActive ? endVoiceSesh : startVoiceSesh} className={`w-14 h-14 glass rounded-2xl flex items-center justify-center shadow-2xl transition-all border border-white/10 ${isVoiceActive ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}>
            <i className={`fa-solid ${isVoiceActive ? 'fa-phone-hangup' : 'fa-microphone-lines'} text-2xl`}></i>
          </button>
        </div>
      </div>

      <div className="mx-1 p-12 glass rounded-[4.5rem] border-white/10 relative overflow-hidden group shadow-inner">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/5 blur-[120px] rounded-full"></div>
        <div className="relative z-10 space-y-6 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-xl mx-auto">
            <i className="fa-solid fa-bolt-lightning text-3xl"></i>
          </div>
          <h3 className="font-black text-3xl tracking-tighter text-white italic">AI Voice Sesh</h3>
          <p className="text-sm text-slate-400 font-medium leading-relaxed italic px-4">
            Hands-free app control and dating support. Just speak to your ScissHER Assistant in real-time.
          </p>
          <button onClick={isVoiceActive ? endVoiceSesh : startVoiceSesh} className="w-full py-6 shimmer-btn text-white rounded-[2.25rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl border border-white/20">
            {isVoiceActive ? "End Session" : "Start Voice Connection"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
