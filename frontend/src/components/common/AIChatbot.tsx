import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User as UserIcon,
  ArrowUpRight
} from 'lucide-react';
import GlassCard from './GlassCard';
import { Link } from 'react-router-dom';

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { 
      sender: 'bot', 
      text: "Hello! I am your Nearby HelpUp AI assistant. Ask me to find tools, volunteer needs, or local events near your coordinates.",
      recommended_listings: [],
      recommended_communities: [],
      recommended_events: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Need cordless drill nearby",
    "Where is the running club?",
    "Calculus study group",
    "Upcoming weekend meetups"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const history = messages.slice(1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const res = await api.ai.chatbot(textToSend, history);
      
      const botMsg = {
        sender: 'bot',
        text: res.reply,
        recommended_listings: res.recommended_listings || [],
        recommended_communities: res.recommended_communities || [],
        recommended_events: res.recommended_events || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('AI chat failed', err);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Sorry, I am having connectivity issues. Please try again shortly."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      
      {/* 1. Chat Window */}
      {isOpen && (
        <GlassCard 
          className="w-[calc(100vw-2rem)] max-w-[380px] h-[min(500px,calc(100dvh-7.5rem))] mb-3 flex flex-col justify-between overflow-hidden shadow-2xl border-[#E2E8F0] dark:border-slate-800 animate-fade-in"
          hoverEffect={false}
        >
          {/* Header Panel with Navy to Sky Blue Gradient */}
          <div className="bg-gradient-to-r from-[#102A43] via-[#0C4A6E] to-[#0284C7] p-3.5 sm:p-4 text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center font-bold border border-white/20">
                <Sparkles className="h-4.5 w-4.5 text-[#38BDF8]" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Nearby HelpUp AI</h4>
                <span className="text-[9px] uppercase tracking-wider font-bold text-[#38BDF8]">Hyperlocal Assistant</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={idx} className={`flex flex-col gap-2 ${isBot ? 'items-start' : 'items-end'}`}>
                  
                  {/* Bubble */}
                  <div className={`flex items-start gap-2.5 max-w-[88%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isBot 
                        ? 'bg-[#E0F2FE] dark:bg-[#0369A1]/30 text-[#0284C7] dark:text-[#38BDF8]' 
                        : 'bg-[#102A43] text-white dark:bg-slate-800'
                    }`}>
                      {isBot ? <Bot className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                    </div>
                    <div className={`text-xs leading-relaxed p-3 rounded-2xl shadow-xs ${
                      isBot 
                        ? 'bg-white text-[#1E293B] dark:bg-slate-900 dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-800' 
                        : 'bg-[#102A43] text-white'
                    }`}>
                      {m.text}
                    </div>
                  </div>

                  {/* Recommendation Attachments */}
                  {isBot && (
                    <div className="flex flex-col gap-1.5 pl-9 w-full">
                      
                      {/* Active Listings Recommendations */}
                      {m.recommended_listings?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Matched Items</span>
                          {m.recommended_listings.slice(0, 2).map((item: any) => (
                            <Link 
                              key={item.id} 
                              to={`/listing/${item.id}`}
                              className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-[11px] font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-all flex items-center justify-between shadow-2xs"
                            >
                              <span className="truncate max-w-[200px]">{item.title}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Communities Recommendations */}
                      {m.recommended_communities?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Matching Circles</span>
                          {m.recommended_communities.slice(0, 2).map((c: any) => (
                            <Link 
                              key={c.id} 
                              to={`/communities/${c.id}`}
                              className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-[11px] font-semibold text-[#19A974] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-all flex items-center justify-between shadow-2xs"
                            >
                              <span className="truncate max-w-[200px]">{c.name}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Events Recommendations */}
                      {m.recommended_events?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</span>
                          {m.recommended_events.slice(0, 2).map((evt: any) => (
                            <Link 
                              key={evt.id} 
                              to={`/events`}
                              className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-[#E2E8F0] dark:border-slate-800 text-[11px] font-semibold text-[#0284C7] dark:text-[#38BDF8] hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-all flex items-center justify-between shadow-2xs"
                            >
                              <span className="truncate max-w-[200px]">{evt.title}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

            {/* Loading state */}
            {loading && (
              <div className="flex items-start gap-2.5 pl-1.5">
                <div className="h-7 w-7 rounded-xl bg-[#E0F2FE] dark:bg-[#0369A1]/30 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-[#0284C7] dark:text-[#38BDF8]" />
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] dark:bg-slate-900 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-col gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Try asking</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-[10px] font-medium bg-[#F8FAFC] hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-2.5 py-1.5 transition-all text-left hover:border-[#38BDF8]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask for items, tools, circles..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-10 px-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs outline-none focus:border-[#38BDF8] dark:bg-slate-900 dark:border-slate-800 dark:text-white"
            />
            <button
              type="submit"
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0EA5E9] text-white flex items-center justify-center transition-all shadow-xs shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </GlassCard>
      )}

      {/* 2. Floating Toggle Button with Sky Blue Gradient */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-gradient-to-tr from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all shadow-xl shadow-[#38BDF8]/30 border-2 border-white/60 dark:border-slate-900"
        title="Nearby HelpUp AI Assistant"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />}
      </button>

    </div>
  );
};
