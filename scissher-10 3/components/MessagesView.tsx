import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';
import ChatThreadView from './ChatThreadView';

const MessagesView: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<User | null>(null);

  // Mock active conversations
  const conversations = [
    { user: MOCK_USERS[1], lastMessage: "Can't wait for our Sesh on Tuesday! 🧗‍♀️", time: "2m ago", unread: true },
    { user: MOCK_USERS[2], lastMessage: "I just finished that photo set we talked about.", time: "1h ago", unread: false },
  ];

  if (selectedChat) {
    return <ChatThreadView user={selectedChat} onClose={() => setSelectedChat(null)} />;
  }

  return (
    <div className="space-y-10 pb-40 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col gap-1.5 px-4">
        <h2 className="text-5xl font-black tracking-tighter shimmer-text leading-none italic">DMs</h2>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2 opacity-70 italic">Intentional Interactions</p>
      </div>

      <div className="space-y-4 px-1">
        {conversations.map((chat, i) => (
          <button 
            key={chat.user.id}
            onClick={() => setSelectedChat(chat.user)}
            className="w-full glass p-6 rounded-[2.5rem] flex items-center gap-5 border-white/5 group shadow-xl active:scale-95 transition-all text-left relative overflow-hidden"
          >
            {chat.unread && (
              <div className="absolute top-0 right-0 w-2 h-full bg-rose-500/50"></div>
            )}
            
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                <img src={chat.user.mainPhoto} className="w-full h-full object-cover" />
              </div>
              {chat.user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-lg font-black text-white tracking-tight italic">{chat.user.name}</h4>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{chat.time}</span>
              </div>
              <p className={`text-xs truncate ${chat.unread ? 'text-white font-semibold italic' : 'text-slate-500 font-medium'}`}>
                {chat.lastMessage}
              </p>
            </div>
            
            <i className="fa-solid fa-chevron-right text-slate-800 group-hover:text-rose-400 group-hover:translate-x-1 transition-all"></i>
          </button>
        ))}

        {conversations.length === 0 && (
          <div className="py-40 text-center space-y-4 opacity-40">
            <i className="fa-solid fa-message-slash text-5xl text-slate-800"></i>
            <p className="text-[10px] font-black uppercase tracking-widest">No active DMs yet.</p>
          </div>
        )}
      </div>

      <div className="px-1 mt-10">
        <div className="glass p-8 rounded-[3.5rem] border-white/5 space-y-4 relative overflow-hidden group shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 petal-gradient opacity-30"></div>
          <h3 className="text-xl font-black text-white italic tracking-tighter">Intentional Communication</h3>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic pr-4">
            ScissHER filters out directionless conversation. Use AI Hub to help propose intentional Windows.
          </p>
          <button className="text-[9px] font-black text-rose-400 uppercase tracking-[0.4em] flex items-center gap-2">
            Interaction Guide <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesView;