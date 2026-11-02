import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Image, 
  MapPin, 
  Mic, 
  Phone, 
  Video, 
  Check, 
  CheckCheck,
  X,
  Volume2,
  Sparkles,
  Plus,
  MessageSquare,
  Search,
  ArrowLeft,
  ShieldCheck
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
  const [searchContact, setSearchContact] = useState('');

  // Mobile view toggle (show list vs active chat on small screens)
  const [mobileChatView, setMobileChatView] = useState<'list' | 'chat'>('list');

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
    setMobileChatView('chat');
    
    // Close existing WebSocket
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
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.id)) return prev;
          return [...prev, data];
        });
      };

      ws.onerror = (e) => console.error('WS Connection error', e);
    } catch (e) {
      console.error('WebSocket connection failed', e);
    }

    // Mock typing indicator
    setTimeout(() => {
      const otherUser = chat.user1_id === user?.id ? chat.user2 : chat.user1;
      setTypingUser(otherUser?.name || 'Neighbor');
      setTimeout(() => {
        setTypingUser(null);
      }, 2000);
    }, 3500);
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
      socketRef.current.send(JSON.stringify(payload));
    } else {
      try {
        const msg = await api.chats.sendMessage(activeChat.id, payload);
        setMessages(prev => [...prev, msg]);
      } catch (err) {
        console.error('Failed to send message over HTTP', err);
      }
    }

    setMessageText('');
    setAttachedImage(null);
    setAttachedVoice(null);
    setAttachedLoc(null);
    setShowAttachments(false);
  };

  const attachMockImage = () => {
    setAttachedImage("https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=400&auto=format&fit=crop");
    setShowAttachments(false);
  };

  const attachMockVoice = () => {
    setAttachedVoice("voice_note.mp3");
    setShowAttachments(false);
  };

  const attachMockLocation = () => {
    setAttachedLoc({ lat: 28.7501, lon: 77.1177 });
    setShowAttachments(false);
  };

  const filteredChats = chats.filter((c) => {
    const otherUser = c.user1_id === user?.id ? c.user2 : c.user1;
    return otherUser?.name?.toLowerCase().includes(searchContact.toLowerCase()) || 
           c.listing?.title?.toLowerCase().includes(searchContact.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-24">
        <div className="h-10 w-10 border-4 border-[#19A974] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden w-full bg-[#F8FAFC] dark:bg-[#0F172A] text-left">
      
      {/* 1. Conversations Sidebar */}
      <aside className={`w-full md:w-80 bg-white dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#334155] flex flex-col h-full shrink-0 ${
        mobileChatView === 'chat' ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#102A43] dark:text-white">
              Neighbor Messages
            </h3>
            <span className="text-[10px] font-bold text-[#19A974] bg-[#F0FDF8] dark:bg-[#19A974]/15 px-2 py-0.5 rounded-full">
              {chats.length} Active
            </span>
          </div>

          {/* Search Contacts */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] outline-none focus:border-[#19A974]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1">
          {filteredChats.length > 0 ? (
            filteredChats.map((c) => {
              const otherUser = c.user1_id === user?.id ? c.user2 : c.user1;
              const isActive = activeChat?.id === c.id;
              
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectChat(c)}
                  className={`flex items-center gap-3 p-3 rounded-xl w-full text-left transition-all ${
                    isActive 
                      ? 'bg-[#F0FDF8] dark:bg-[#19A974]/15 border border-[#19A974]/30 shadow-xs' 
                      : 'hover:bg-[#F8FAFC] dark:hover:bg-[#334155]/40 text-[#64748B]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={otherUser?.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'Neighbor')}&background=102A43&color=fff`}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[#E2E8F0]"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#19A974] border-2 border-white dark:border-[#1E293B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#102A43] dark:text-white truncate">
                        {otherUser?.name}
                      </h4>
                      <span className="text-[10px] text-[#94A3B8]">
                        Now
                      </span>
                    </div>
                    {c.listing ? (
                      <p className="text-[11px] text-[#19A974] font-medium truncate mt-0.5">
                        Item: {c.listing.title}
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#64748B] dark:text-[#9FB3C8] truncate mt-0.5">
                        Direct communication
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-[#94A3B8]">
              No conversations found.
            </div>
          )}
        </div>
      </aside>

      {/* 2. Chat Conversation Box */}
      <div className={`flex-1 flex flex-col justify-between h-full bg-white dark:bg-[#0F172A] relative ${
        mobileChatView === 'list' ? 'hidden md:flex' : 'flex'
      }`}>
        {activeChat ? (
          <>
            {/* Header info */}
            <div className="bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                {/* Back to list button on mobile */}
                <button
                  onClick={() => setMobileChatView('list')}
                  className="p-1.5 rounded-lg text-[#64748B] md:hidden hover:bg-[#F1F5F9]"
                  aria-label="Back to contacts"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={(activeChat.user1_id === user?.id ? activeChat.user2 : activeChat.user1)?.profile_photo || `https://ui-avatars.com/api/?name=Neighbor&background=102A43&color=fff`}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[#19A974]"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#19A974] border-2 border-white dark:border-[#1E293B]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white">
                    {(activeChat.user1_id === user?.id ? activeChat.user2 : activeChat.user1)?.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-[#19A974] font-medium">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Neighbor • Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-[#64748B] hover:text-[#102A43] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors" 
                  title="Audio Coordinate Ready"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button 
                  className="p-2 border border-[#E2E8F0] dark:border-[#334155] rounded-xl text-[#64748B] hover:text-[#102A43] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors" 
                  title="Video Coordinate Ready"
                >
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-3.5 bg-[#F8FAFC] dark:bg-[#0F172A]">
              {messages.map((m) => {
                const isSelf = m.sender_id === user?.id;
                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col gap-1 w-fit max-w-[80%] sm:max-w-[70%] ${
                      isSelf ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`text-xs p-3.5 rounded-2xl shadow-xs leading-relaxed ${
                      isSelf 
                        ? 'bg-[#19A974] text-white rounded-br-xs' 
                        : 'bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-white rounded-bl-xs'
                    }`}>
                      {m.content}

                      {/* Attachment preview */}
                      {m.image_url && (
                        <img src={m.image_url} alt="Shared Attachment" className="rounded-xl mt-2 max-h-40 object-cover w-full shadow-xs" />
                      )}

                      {m.voice_url && (
                        <div className="flex items-center gap-2 mt-2 bg-black/10 dark:bg-white/10 px-3 py-1.5 rounded-xl text-[10px]">
                          <Volume2 className="h-4 w-4 animate-pulse" />
                          <span>Voice Recording (0:15)</span>
                        </div>
                      )}

                      {m.latitude && m.longitude && (
                        <div className="flex items-center gap-2 mt-2 bg-black/10 dark:bg-white/10 px-3 py-1.5 rounded-xl text-[10px]">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span>Shared Location Coordinates</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp & Status */}
                    <div className="flex items-center gap-1 text-[9px] text-[#94A3B8] px-1">
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isSelf && (
                        m.is_read ? <CheckCheck className="h-3 w-3 text-[#19A974]" /> : <Check className="h-3 w-3 text-[#94A3B8]" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUser && (
                <div className="text-[11px] text-[#64748B] dark:text-[#9FB3C8] italic animate-pulse">
                  {typingUser} is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Attachment preview banner */}
            {(attachedImage || attachedVoice || attachedLoc) && (
              <div className="px-6 py-2 bg-[#F0FDF8] dark:bg-[#19A974]/15 border-t border-[#19A974]/30 flex items-center justify-between text-[11px] text-[#19A974] font-bold">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    Ready to send: {attachedImage ? 'Photo Image' : attachedVoice ? 'Audio Voice Recording' : 'Location Pin'}
                  </span>
                </div>
                <button onClick={() => {
                  setAttachedImage(null);
                  setAttachedVoice(null);
                  setAttachedLoc(null);
                }} className="text-[#64748B] hover:text-[#1E293B]">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Input & Attachments Panel */}
            <div className="relative border-t border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B]">
              {showAttachments && (
                <div className="absolute bottom-16 left-4 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-3 flex flex-col gap-2 shadow-xl w-48 z-20 animate-fade-in">
                  <button onClick={attachMockImage} className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#1E293B] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] w-full text-left">
                    <Image className="h-4 w-4 text-[#19A974]" />
                    <span>Attach Photo</span>
                  </button>
                  <button onClick={attachMockVoice} className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#1E293B] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] w-full text-left">
                    <Mic className="h-4 w-4 text-[#38BDF8]" />
                    <span>Voice Memo</span>
                  </button>
                  <button onClick={attachMockLocation} className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-[#1E293B] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#334155] w-full text-left">
                    <MapPin className="h-4 w-4 text-[#EF4444]" />
                    <span>Share Location</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="p-3 sm:p-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="h-11 w-11 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-[#64748B] hover:text-[#102A43] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] flex items-center justify-center shrink-0 transition-colors"
                  title="Add attachments"
                >
                  <Plus className="h-4.5 w-4.5" />
                </button>
                
                <input
                  type="text"
                  placeholder="Type a message to coordinate pickup or help..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 h-11 px-4 text-xs sm:text-sm rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] outline-none focus:border-[#19A974] text-[#1E293B] dark:text-white placeholder-[#94A3B8]"
                />

                <button
                  type="submit"
                  className="h-11 w-11 rounded-xl bg-[#19A974] hover:bg-[#148A5E] text-white flex items-center justify-center transition-all shadow-xs shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-[#F0FDF8] dark:bg-[#19A974]/15 flex items-center justify-center text-[#19A974] mb-4">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-sm text-[#102A43] dark:text-white">Start a Conversation</h3>
            <p className="text-xs text-[#64748B] dark:text-[#9FB3C8] mt-1.5 leading-relaxed">
              Select a neighbor from your active threads or click "Message Neighbor" on any assistance request to coordinate.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
