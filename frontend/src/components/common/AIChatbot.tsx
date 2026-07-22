import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User as UserIcon,
  Mic,
  Volume2,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import GlassCard from './GlassCard';
import { Link } from 'react-router-dom';

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { 
      sender: 'bot', 
      text: "Hello! I am your Nearby HelpUp AI assistant. How can I help you in your neighborhood today?",
      recommended_listings: [],
      recommended_communities: [],
      recommended_events: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggestions tags
  const suggestions = [
    "Urgently need calculator",
    "Where is the running club?",
    "Trading silberschatz book",
    "Show chess events Rohini"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Map history format: [{"role": "user", "content": "..."}, {"role": "model", "content": "..."}]
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
        text: "Sorry, I am facing connectivity issues matching parameters. Please try again soon."
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 1. Chat Window */}
      {isOpen && (
        <GlassCard 
          className="w-[340px] h-[480px] mb-4 flex flex-col justify-between overflow-hidden shadow-2xl border-white/60 dark:border-slate-800"
          hoverEffect={false}
        >
          {/* Header Panel */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-650 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center font-bold">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-sans">Nearby HelpUp Assistant</h4>
                <span className="text-[8px] uppercase tracking-wider font-extrabold text-indigo-200">Local Guide</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div key={idx} className={`flex flex-col gap-2 ${isBot ? 'items-start' : 'items-end'}`}>
                  
                  {/* Bubble */}
                  <div className={`flex items-start gap-2.5 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      isBot ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40' : 'bg-slate-900 text-white dark:bg-slate-800'
                    }`}>
                      {isBot ? <Bot className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
                    </div>
                    <div className={`text-[11px] leading-relaxed p-3 rounded-2xl shadow-sm ${
                      isBot 
                        ? 'bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-200 border border-slate-100 dark:border-slate-800' 
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {m.text}
                    </div>
                  </div>

                  {/* Recommendation Attachments inside chat feed */}
                  {isBot && (
                    <div className="flex flex-col gap-1.5 pl-8 w-full">
                      
                      {/* Active Listings Recommendations */}
                      {m.recommended_listings?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">Matched Items</span>
                          {m.recommended_listings.slice(0, 2).map((item: any) => (
                            <Link 
                              key={item.id} 
                              to={`/listing/${item.id}`}
                              className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 transition-all flex items-center justify-between"
                            >
                              <span className="truncate max-w-[180px]">{item.title}</span>
                              <ArrowUpRight className="h-3 w-3 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Communities Recommendations */}
                      {m.recommended_communities?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">Matching Circles</span>
                          {m.recommended_communities.slice(0, 2).map((c: any) => (
                            <Link 
                              key={c.id} 
                              to={`/communities/${c.id}`}
                              className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 transition-all flex items-center justify-between"
                            >
                              <span className="truncate max-w-[180px]">{c.name}</span>
                              <ArrowUpRight className="h-3 w-3 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Events Recommendations */}
                      {m.recommended_events?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest font-sans">Upcoming Events</span>
                          {m.recommended_events.slice(0, 2).map((evt: any) => (
                            <Link 
                              key={evt.id} 
                              to={`/events`}
                              className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:bg-slate-50 transition-all flex items-center justify-between"
                            >
                              <span className="truncate max-w-[180px]">{evt.title}</span>
                              <ArrowUpRight className="h-3 w-3 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

            {/* Loading typing state */}
            {loading && (
              <div className="flex items-start gap-2.5 pl-1.5">
                <div className="h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-indigo-500" />
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-slate-100 dark:bg-slate-900 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-650 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-655 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-660 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions quick tags */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-col gap-2">
              <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-400">Ask about</span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-[9px] font-bold bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 transition-all text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex gap-2">
            <input
              type="text"
              placeholder="Ask for items, clubs, details..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg bg-slate-50 border border-slate-205 text-[10px] outline-none focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-850 dark:text-white"
            />
            <button
              type="submit"
              className="h-9 w-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </GlassCard>
      )}

      {/* 2. Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 hover:scale-105 text-white flex items-center justify-center transition-all shadow-xl shadow-indigo-550/20"
        title="AI Assistant Guide"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5 animate-pulse" />}
      </button>

    </div>
  );
};
