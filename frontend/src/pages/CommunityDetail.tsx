import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  MessageSquare, 
  Volume2, 
  Plus, 
  Send, 
  ShieldCheck, 
  Calendar, 
  Info, 
  UserPlus, 
  LogOut,
  X,
  FileText,
  Pin
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const communityId = parseInt(id || '0');

  // Core States
  const [community, setCommunity] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Chat message input
  const [messageText, setMessageText] = useState('');
  
  // New channel modal
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState('text');

  // New poll modal
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const loadData = async () => {
    try {
      // 1. Get community base info
      const comm = await api.communities.getById(communityId);
      setCommunity(comm);

      // 2. Get members
      const mems = await api.communities.getMembers(communityId);
      setMembers(mems);

      // Check user membership status
      const currentMember = mems.find((m: any) => m.user_id === user?.id);
      if (currentMember) {
        setIsMember(true);
        setUserRole(currentMember.role);
        
        // 3. Load channels
        const chans = await api.communities.getChannels(communityId);
        setChannels(chans);
        if (chans.length > 0 && activeChannelId === null) {
          setActiveChannelId(chans[0].id);
        }

        // 4. Load polls
        const plls = await api.communities.getPolls(communityId);
        setPolls(plls);

        // 5. Load community events
        const evts = await api.events.getAll({ community_id: communityId });
        setEvents(evts);
      } else {
        setIsMember(false);
        setUserRole(null);
      }
    } catch (err) {
      console.error('Failed to load community details', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!activeChannelId) return;
    try {
      const msgs = await api.communities.getChannelMessages(activeChannelId);
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [communityId, user]);

  useEffect(() => {
    loadMessages();
    // Start polling messages every 3 seconds for local real-time simulation
    const interval = setInterval(() => {
      loadMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [activeChannelId]);

  const handleJoin = async () => {
    try {
      await api.communities.join(communityId);
      loadData();
    } catch (err) {
      alert('Failed to join community');
    }
  };

  const handleLeave = async () => {
    if (window.confirm('Are you sure you want to leave this community?')) {
      try {
        await api.communities.leave(communityId);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to leave community');
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChannelId) return;
    
    try {
      const newMsg = await api.communities.sendChannelMessage(activeChannelId, messageText);
      setMessages(prev => [...prev, newMsg]);
      setMessageText('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      await api.communities.createChannel(communityId, {
        name: newChannelName,
        type: newChannelType
      });
      setNewChannelName('');
      setShowChannelModal(false);
      loadData();
    } catch (err) {
      alert('Failed to create channel');
    }
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = pollOptions.filter(o => o.trim() !== '');
    if (!pollQuestion.trim() || filteredOptions.length < 2) {
      alert('Please fill question and at least 2 options.');
      return;
    }

    try {
      await api.communities.createPoll(communityId, {
        question: pollQuestion,
        options: filteredOptions
      });
      setPollQuestion('');
      setPollOptions(['', '']);
      setShowPollModal(false);
      loadData();
    } catch (err) {
      alert('Failed to create poll');
    }
  };

  const handleVote = async (pollId: number, optionIndex: number) => {
    try {
      await api.communities.votePoll(pollId, optionIndex);
      // Reload polls
      const plls = await api.communities.getPolls(communityId);
      setPolls(plls);
    } catch (err) {
      console.error('Failed to submit vote', err);
    }
  };

  // Helper calculation for Poll Votes
  const calculatePollStats = (poll: any) => {
    const votesDict = poll.votes || {};
    const totalVotes = Object.keys(votesDict).length;
    
    const stats = poll.options.map((opt: string, idx: number) => {
      const count = Object.values(votesDict).filter(v => v === idx).length;
      const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
      return { option: opt, count, pct };
    });
    
    return { totalVotes, stats };
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex-1 p-8 text-center">
        <h3 className="font-bold text-lg">Community Group not found</h3>
      </div>
    );
  }

  const isAdminOrMod = userRole === 'admin' || userRole === 'moderator';

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden w-full">
      
      {/* 1. Channel Sidepanel (Discord Style) */}
      <aside className="w-full md:w-60 bg-white border-r border-slate-205 dark:bg-slate-950 dark:border-slate-850 flex flex-col justify-between shrink-0 h-auto md:h-full">
        <div className="flex flex-col gap-6 p-4 overflow-y-auto">
          {/* Header Community Title */}
          <div>
            <h3 className="font-extrabold text-sm text-slate-850 dark:text-white truncate">
              {community.name}
            </h3>
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-indigo-500 mt-1 block">
              {community.category}
            </span>
          </div>

          {/* Join/Leave Button */}
          <div>
            {isMember ? (
              <button
                onClick={handleLeave}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-rose-100/50 text-rose-500 hover:bg-rose-50 dark:border-rose-950/20 dark:hover:bg-rose-950/20 p-2 text-xs font-bold transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Leave Group</span>
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white p-2 text-xs font-bold transition-all duration-300 shadow-lg shadow-indigo-500/20"
              >
                <UserPlus className="h-4 w-4" />
                <span>Join Community</span>
              </button>
            )}
          </div>

          {/* Channels List */}
          {isMember && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">Channels</span>
                {isAdminOrMod && (
                  <button onClick={() => setShowChannelModal(true)} className="text-slate-400 hover:text-slate-600">
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {channels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => setActiveChannelId(chan.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold w-full text-left transition-all duration-300 ${
                      activeChannelId === chan.id
                        ? 'bg-gradient-to-r from-indigo-50/80 to-indigo-50/40 text-indigo-600 dark:from-indigo-950/40 dark:to-indigo-950/20 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <span className="text-slate-400">#</span>
                    <span className="truncate">{chan.name}</span>
                    {chan.type === 'announcement' && (
                      <Pin className="h-3 w-3 text-indigo-400 ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Chat Panel */}
      <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900/25 h-full relative border-r border-slate-205 dark:border-slate-850">
        
        {isMember ? (
          <>
            {/* Top Channel Header info */}
            <div className="bg-white/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-850 px-6 py-4 flex items-center gap-2">
              <span className="font-extrabold text-slate-400">#</span>
              <span className="text-xs font-bold text-slate-850 dark:text-white">
                {channels.find(c => c.id === activeChannelId)?.name || 'select-channel'}
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3.5">
                    <img
                      src={msg.sender.profile_photo}
                      alt=""
                      className="h-8 w-8 rounded-lg object-cover bg-slate-50 shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-extrabold text-slate-850 dark:text-white">
                          {msg.sender.name}
                        </span>
                        <span className="text-[8px] text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-white/70 dark:bg-slate-950/40 rounded-2xl px-4 py-2.5 shadow-sm w-fit max-w-lg">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-slate-400 text-xs">
                  👋 This is the start of the chat history. Send a message to start!
                </div>
              )}
            </div>

            {/* Chat Send Input Box */}
            <form onSubmit={handleSendMessage} className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 p-4 flex gap-2">
              <input
                type="text"
                placeholder={`Message #${channels.find(c => c.id === activeChannelId)?.name || ''}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 h-11 px-4 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="h-11 w-11 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center transition-all duration-300 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <Users className="h-14 w-14 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-full mb-4" />
            <h3 className="text-base font-extrabold text-slate-850 dark:text-white font-sans">
              Join Community Circle
            </h3>
            <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 leading-relaxed">
              This group is private to DTU/Rohini neighbors. Click below to join, access channels list, chat, schedule upcoming events and vote on active polls.
            </p>
            <button
              onClick={handleJoin}
              className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-3 text-xs transition-all duration-300 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 flex items-center gap-1.5 hover:-translate-y-[1px]"
            >
              <UserPlus className="h-4 w-4" />
              <span>Join Circle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Right Sidebar Details Context Panel (Facebook Group Style) */}
      {isMember && (
        <aside className="w-full md:w-72 bg-white border-l border-slate-205 dark:bg-slate-950 dark:border-slate-850 overflow-y-auto h-auto md:h-full shrink-0 flex flex-col gap-6 p-5">
          
          {/* Rules & Info */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-indigo-500" />
              <span>Guidelines</span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {community.rules}
            </p>
          </div>

          {/* Polls Widgets */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-455">Active Polls</span>
              {isAdminOrMod && (
                <button onClick={() => setShowPollModal(true)} className="text-slate-400 hover:text-slate-655">
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              {polls.length > 0 ? (
                polls.map((poll) => {
                  const { totalVotes, stats } = calculatePollStats(poll);
                  const hasVoted = Object.keys(poll.votes || {}).includes(user?.id?.toString() || '');
                  
                  return (
                    <div key={poll.id} className="flex flex-col gap-2 p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
                      <h4 className="text-[11px] font-bold text-slate-800 dark:text-white leading-normal">
                        {poll.question}
                      </h4>
                      <div className="flex flex-col gap-1.5 mt-1">
                        {stats.map((st: any, idx: number) => {
                          const optionVote = poll.votes?.[user?.id?.toString() || ''];
                          const optionVoted = optionVote === idx;
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => handleVote(poll.id, idx)}
                              className={`text-left rounded-lg p-2 text-[10px] font-semibold transition-all relative overflow-hidden w-full ${
                                optionVoted 
                                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-650 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400' 
                                  : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350'
                              }`}
                            >
                              <div className="flex justify-between relative z-10">
                                <span>{st.option}</span>
                                <span>{st.pct}%</span>
                              </div>
                              {/* Visual Vote Progress Bar */}
                              <div 
                                className="absolute left-0 top-0 bottom-0 bg-indigo-500/10 z-0 transition-all duration-300"
                                style={{ width: `${st.pct}%` }}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[9px] text-slate-400 text-right mt-1">
                        {totalVotes} Votes total
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-[10px] text-slate-400 border border-slate-100 rounded-xl dark:border-slate-850">
                  No active polls.
                </div>
              )}
            </div>
          </div>

          {/* Group Upcoming Events list */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-455">Group Events</span>
            <div className="flex flex-col gap-2">
              {events.length > 0 ? (
                events.map((evt) => (
                  <Link 
                    key={evt.id} 
                    to="/events" 
                    className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100/50 transition-all block"
                  >
                    <h5 className="text-[11px] font-bold text-slate-800 dark:text-white truncate">{evt.title}</h5>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(evt.event_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{evt.location_name}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-[10px] text-slate-400 border border-slate-100 rounded-xl dark:border-slate-850">
                  No group events scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Members List */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-455">Members Directory ({members.length})</span>
            <div className="flex flex-col gap-2.5">
              {members.map((mem) => (
                <div key={mem.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={mem.user.profile_photo} alt="" className="h-6 w-6 rounded-full object-cover bg-slate-50" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{mem.user.name}</span>
                  </div>
                  <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    mem.role === 'admin' 
                      ? 'bg-rose-50 text-rose-500 dark:bg-rose-950/20' 
                      : mem.role === 'moderator'
                      ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20'
                      : 'bg-slate-50 text-slate-400 dark:bg-slate-900'
                  }`}>
                    {mem.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>
      )}

      {/* MODAL: Create Chat Channel */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <GlassCard className="max-w-sm w-full p-5 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
              <h4 className="text-xs font-bold">Create New Chat Channel</h4>
              <button onClick={() => setShowChannelModal(false)} className="text-slate-400 hover:text-slate-655">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChannel} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-slate-400">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g. weekend-runs"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-slate-400">Channel Type</label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value)}
                  className="h-10 px-2 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                >
                  <option value="text">Text chat (#)</option>
                  <option value="announcement">Announcements channel (Pins)</option>
                </select>
              </div>
              <button
                type="submit"
                className="h-10 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300"
              >
                Create Channel
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL: Create Interactive Poll */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <GlassCard className="max-w-sm w-full p-5 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
              <h4 className="text-xs font-bold">Launch Interactive Poll</h4>
              <button onClick={() => setShowPollModal(false)} className="text-slate-400 hover:text-slate-655">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePoll} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-slate-400">Poll Question</label>
                <input
                  type="text"
                  placeholder="e.g. Should we host meetups on Sunday instead?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] font-bold uppercase text-slate-400">Poll Options</label>
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Choice Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[idx] = e.target.value;
                      setPollOptions(updated);
                    }}
                    className="h-9 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  className="text-indigo-500 hover:text-indigo-650 text-[10px] font-bold self-start mt-1"
                >
                  + Add Option Choice
                </button>
              </div>
              <button
                type="submit"
                className="h-10 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300"
              >
                Launch Poll
              </button>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
};
