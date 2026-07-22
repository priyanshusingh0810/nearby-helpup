import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Image, 
  MapPin, 
  Mic, 
  File, 
  Smile, 
  Phone, 
  Video, 
  Info, 
  Check, 
  CheckCheck,
  X,
  Volume2,
  Sparkles,
  Plus,
  MessageSquare
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const Chat: React.FC = () => {
  const { user } = useAuth();
  
  // States
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  // Typing simulator state
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Attachment controls
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedVoice, setAttachedVoice] = useState<string | null>(null);
  const [attachedLoc, setAttachedLoc] = useState<{lat: number, lon: number} | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  const loadChats = async () => {
    try {
      const data = await api.chats.getMyChats();
      setChats(data);
      if (data.length > 0 && !activeChat) {
        handleSelectChat(data[0]);
      }
    } catch (err) {
      console.error('Failed to load chats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleSelectChat = async (chat: any) => {
    setActiveChat(chat);
    setMessages(chat.messages || []);
    
    // Close existing WebSocket if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Connect to WebSocket room
    try {
      const wsUrl = api.chats.getWebSocketUrl(chat.id);
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Deduplicate messages
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      };

      ws.onerror = (e) => console.error('WS Connection error', e);
    } catch (e) {
      console.error('WebSocket connection failed', e);
    }

    // Trigger mock typing indicator after selecting chat to simulate activity
    setTimeout(() => {
      const otherUser = chat.user1_id === user?.id ? chat.user2 : chat.user1;
      setTypingUser(otherUser.name);
      setTimeout(() => {
        setTypingUser(null);
      }, 2500);
    }, 4000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !attachedImage && !attachedVoice && !attachedLoc) return;

    const payload = {
      content: messageText,
      image_url: attachedImage || "",
      voice_url: attachedVoice || "",
      latitude: attachedLoc?.lat || null,
      longitude: attachedLoc?.lon || null
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // Send via WS
      socketRef.current.send(JSON.stringify(payload));
    } else {
      // Fallback to HTTP
      try {
        const msg = await api.chats.sendMessage(activeChat.id, payload);
        setMessages(prev => [...prev, msg]);
      } catch (err) {
        console.error('Failed to send message over HTTP', err);
      }
    }

    // Reset fields
    setMessageText('');
    setAttachedImage(null);
    setAttachedVoice(null);
    setAttachedLoc(null);
    setShowAttachments(false);
  };

  // Mock attachment selections
  const attachMockImage = () => {
    setAttachedImage("https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=400&auto=format&fit=crop");
    setShowAttachments(false);
  };

  const attachMockVoice = () => {
    setAttachedVoice("mock_voice_recording.mp3");
    setShowAttachments(false);
  };

  const attachMockLocation = () => {
    setAttachedLoc({ lat: 28.7501, lon: 77.1177 });
    setShowAttachments(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden w-full bg-slate-50 dark:bg-slate-900/10">
      
      {/* 1. Chats Sidebar list */}
      <aside className="w-full md:w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200/50 dark:bg-slate-950/80 dark:border-slate-850 flex flex-col h-auto md:h-full shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-850">
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white font-sans">
            Private Messages
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Secure peer-to-peer exchanges</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
          {chats.length > 0 ? (
            chats.map((c) => {
              const otherUser = c.user1_id === user?.id ? c.user2 : c.user1;
              const isActive = activeChat?.id === c.id;
              
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectChat(c)}
                  className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all ${
                    isActive 
                      ? 'bg-indigo-50/70 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400' 
                      : 'hover:bg-slate-50 text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={otherUser.profile_photo}
                      alt=""
                      className="h-9 w-9 rounded-lg object-cover bg-slate-50"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white truncate">
                      {otherUser.name}
                    </h4>
                    {c.listing && (
                      <p className="text-[9px] text-slate-400 truncate mt-0.5">
                        Item: {c.listing.title}
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              No chat logs found.
            </div>
          )}
        </div>
      </aside>

      {/* 2. Chat Conversation Box */}
      <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-slate-950 relative">
        {activeChat ? (
          <>
            {/* Header info */}
            <div className="bg-white/60 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-850 px-6 py-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={(activeChat.user1_id === user?.id ? activeChat.user2 : activeChat.user1).profile_photo}
                    alt=""
                    className="h-9 w-9 rounded-lg object-cover bg-slate-50"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-905" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white">
                    {(activeChat.user1_id === user?.id ? activeChat.user2 : activeChat.user1).name}
                  </h4>
                  <span className="text-[9px] text-slate-400">Online • Verified Helper</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 border border-slate-100 rounded-lg text-slate-455 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" title="Audio Call Ready">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 border border-slate-100 rounded-lg text-slate-455 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900" title="Video Call Ready">
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed panel */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {messages.map((m) => {
                const isSelf = m.sender_id === user?.id;
                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col gap-1 w-fit max-w-[70%] ${
                      isSelf ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`text-xs p-3 rounded-2xl shadow-sm leading-relaxed ${
                      isSelf 
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/15' 
                        : 'bg-slate-50 border border-slate-100 text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-205'
                    }`}>
                      {m.content}

                      {/* Display attachments if present */}
                      {m.image_url && (
                        <img src={m.image_url} alt="Shared Attachment" className="rounded-lg mt-2 max-h-36 object-cover w-full" />
                      )}

                      {m.voice_url && (
                        <div className="flex items-center gap-2 mt-2 bg-slate-950/20 px-3 py-2 rounded-xl text-[10px]">
                          <Volume2 className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                          <span>Voice Note: Playback ready</span>
                        </div>
                      )}

                      {m.latitude && m.longitude && (
                        <div className="flex items-center gap-2 mt-2 bg-slate-950/20 px-3 py-2 rounded-xl text-[10px]">
                          <MapPin className="h-4.5 w-4.5 text-rose-455 shrink-0" />
                          <span className="truncate">Coordinates: {m.latitude.toFixed(4)}, {m.longitude.toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp & Read Receipt */}
                    <div className="flex items-center gap-1 text-[8px] text-slate-400 mt-0.5">
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isSelf && (
                        m.is_read ? <CheckCheck className="h-3 w-3 text-indigo-500" /> : <Check className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUser && (
                <div className="text-[10px] text-slate-400 italic animate-pulse">
                  {typingUser} is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Attachment preview if any selected */}
            {(attachedImage || attachedVoice || attachedLoc) && (
              <div className="px-6 py-2 bg-indigo-50/50 border-t border-indigo-100/20 dark:bg-indigo-950/20 dark:border-indigo-900/30 flex items-center justify-between text-[10px] text-indigo-650 font-bold">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    Attachment loaded: {attachedImage ? 'Photo Image' : attachedVoice ? 'Audio Voice Recording' : 'Map Location Coordinates'}
                  </span>
                </div>
                <button onClick={() => {
                  setAttachedImage(null);
                  setAttachedVoice(null);
                  setAttachedLoc(null);
                }} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Input & Attachments Drawer panel */}
            <div className="relative">
              {showAttachments && (
                <div className="absolute bottom-16 left-4 bg-white/95 backdrop-blur-xl border border-slate-200/40 dark:bg-slate-900/95 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col gap-2.5 shadow-2xl w-44 z-20 animate-scale-in">
                  <button onClick={attachMockImage} className="flex items-center gap-2.5 text-[10px] font-bold text-slate-700 hover:text-indigo-500 dark:text-slate-300 w-full text-left">
                    <Image className="h-4.5 w-4.5 text-indigo-550" />
                    <span>Upload Image</span>
                  </button>
                  <button onClick={attachMockVoice} className="flex items-center gap-2.5 text-[10px] font-bold text-slate-700 hover:text-indigo-500 dark:text-slate-300 w-full text-left">
                    <Mic className="h-4.5 w-4.5 text-emerald-555" />
                    <span>Record Voice</span>
                  </button>
                  <button onClick={attachMockLocation} className="flex items-center gap-2.5 text-[10px] font-bold text-slate-700 hover:text-indigo-500 dark:text-slate-300 w-full text-left">
                    <MapPin className="h-4.5 w-4.5 text-rose-550" />
                    <span>Share Location</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 p-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="h-11 w-11 rounded-xl border border-slate-200 text-slate-455 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 flex items-center justify-center shrink-0"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
                
                <input
                  type="text"
                  placeholder="Type message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 h-11 px-4 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />

                <button
                  type="submit"
                  className="h-11 w-11 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-indigo-500/20 shrink-0 hover:-translate-y-[1px]"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
            <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">Start a Conversation</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Select an active neighbor session from the sidebar or click details on item listings pages to initiate a direct message box.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
