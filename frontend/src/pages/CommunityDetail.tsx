import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  Send, 
  Calendar, 
  Info, 
  UserPlus, 
  LogOut,
  X,
  Pin,
  CheckCircle2,
  ChevronLeft
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
  const [mobileTab, setMobileTab] = useState<'chat' | 'channels' | 'info'>('chat');
  
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
      const comm = await api.communities.getById(communityId);
      setCommunity(comm);

      const mems = await api.communities.getMembers(communityId);
      setMembers(mems);

      const currentMember = mems.find((m: any) => m.user_id === user?.id);
      if (currentMember) {
        setIsMember(true);
        setUserRole(currentMember.role);
        
        const chans = await api.communities.getChannels(communityId);
        setChannels(chans);
        if (chans.length > 0 && activeChannelId === null) {
          setActiveChannelId(chans[0].id);
        }

        const plls = await api.communities.getPolls(communityId);
        setPolls(plls);

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
    if (window.confirm('Are you sure you want to leave this community circle?')) {
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
      const plls = await api.communities.getPolls(communityId);
      setPolls(plls);
    } catch (err) {
      console.error('Failed to submit vote', err);
    }
  };

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
        <div className="h-10 w-10 border-4 border-[#102A43] border-t-[#19A974] rounded-full animate-spin" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex-1 p-12 text-center">
        <h3 className="font-bold text-lg text-[#102A43]">Community Circle not found</h3>
        <Link to="/communities" className="inline-block mt-4 text-xs font-semibold text-[#19A974] hover:underline">
          Return to Communities Directory
        </Link>
      </div>
    );
  }

  const isAdminOrMod = userRole === 'admin' || userRole === 'moderator';

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100dvh-64px-3.5rem)] md:h-[calc(100dvh-65px)] overflow-hidden w-full bg-[#F8FAFC] dark:bg-slate-900">
      
      {/* Mobile Top Tabs for Members */}
      {isMember && (
        <div className="md:hidden flex items-center border-b border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('channels')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
              mobileTab === 'channels'
                ? 'border-[#19A974] text-[#19A974]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            # Channels
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
              mobileTab === 'chat'
                ? 'border-[#19A974] text-[#19A974]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Chat
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('info')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
              mobileTab === 'info'
                ? 'border-[#19A974] text-[#19A974]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Info & Polls
          </button>
        </div>
      )}

      {/* 1. Channel Sidepanel */}
      <aside className={`w-full md:w-64 bg-white dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#334155] flex-col justify-between shrink-0 h-full overflow-y-auto ${
        isMember ? (mobileTab === 'channels' ? 'flex' : 'hidden md:flex') : 'flex'
      }`}>
        <div className="flex flex-col gap-5 p-4 overflow-y-auto">
          {/* Back link & Title */}
          <div>
            <Link to="/communities" className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#102A43] mb-2">
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>All Communities</span>
            </Link>
            <h2 className="font-bold text-sm text-[#102A43] dark:text-white truncate">
              {community.name}
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#19A974] mt-0.5 block">
              {community.category}
            </span>
          </div>

          {/* Membership action */}
          <div>
            {isMember ? (
              <button
                onClick={handleLeave}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/40 text-[#EF4444] hover:bg-rose-50 dark:hover:bg-rose-950/20 p-2 text-xs font-semibold transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Leave Circle</span>
              </button>
            ) : (
              <button
                onClick={handleJoin}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#19A974] hover:bg-[#158f62] text-white p-2 text-xs font-semibold transition-all shadow-sm"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Join Community Circle</span>
              </button>
            )}
          </div>

          {/* Channels List */}
          {isMember && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Channels</span>
                {isAdminOrMod && (
                  <button 
                    onClick={() => setShowChannelModal(true)} 
                    className="text-slate-400 hover:text-[#19A974] transition-colors"
                    title="Add Channel"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {channels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setActiveChannelId(chan.id);
                      setMobileTab('chat');
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium w-full text-left transition-all ${
                      activeChannelId === chan.id
                        ? 'bg-[#102A43] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-slate-400">#</span>
                    <span className="truncate">{chan.name}</span>
                    {chan.type === 'announcement' && (
                      <Pin className="h-3 w-3 text-[#38BDF8] ml-auto shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Chat Panel */}
      <div className={`flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 h-full relative border-r border-[#E2E8F0] dark:border-[#334155] ${
        isMember ? (mobileTab === 'chat' ? 'flex' : 'hidden md:flex') : 'flex'
      }`}>
        
        {isMember ? (
          <>
            {/* Top Channel Header */}
            <div className="bg-[#F8FAFC] dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-[#334155] px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">#</span>
                <span className="text-xs font-bold text-[#102A43] dark:text-white">
                  {channels.find(c => c.id === activeChannelId)?.name || 'general'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Users className="h-3.5 w-3.5 text-[#19A974]" />
                <span>{members.length} members</span>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <img
                      src={msg.sender?.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover bg-slate-100 shrink-0 border border-[#E2E8F0]"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-[#102A43] dark:text-white">
                          {msg.sender?.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-xs text-[#1E293B] dark:text-slate-200 leading-relaxed bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-2xl px-4 py-2.5 shadow-xs w-fit max-w-xl">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 text-slate-400 text-xs">
                  👋 Welcome to #{channels.find(c => c.id === activeChannelId)?.name || 'this channel'}. Say hello to your community!
                </div>
              )}
            </div>

            {/* Chat Send Input Box */}
            <form onSubmit={handleSendMessage} className="bg-white dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-[#334155] p-4 flex gap-2">
              <input
                type="text"
                placeholder={`Message #${channels.find(c => c.id === activeChannelId)?.name || ''}...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 h-10 px-4 text-xs rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] outline-none focus:border-[#19A974] dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
              <button
                type="submit"
                className="h-10 w-10 rounded-xl bg-[#19A974] hover:bg-[#158f62] text-white flex items-center justify-center transition-all shadow-xs shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <div className="h-14 w-14 rounded-full bg-[#19A974]/10 text-[#19A974] flex items-center justify-center mb-4">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-[#102A43] dark:text-white">
              Join this Community Circle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Become a verified member to access group channels, participate in discussions, coordinate local assistance, and vote on community polls.
            </p>
            <button
              onClick={handleJoin}
              className="mt-6 rounded-xl bg-[#19A974] hover:bg-[#158f62] text-white font-semibold px-6 py-2.5 text-xs transition-all shadow-sm flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Join Community Circle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Right Sidebar Details Panel */}
      {isMember && (
        <aside className={`w-full md:w-80 bg-white dark:bg-[#1E293B] border-l border-[#E2E8F0] dark:border-[#334155] overflow-y-auto h-full shrink-0 flex-col gap-6 p-4 sm:p-5 ${
          mobileTab === 'info' ? 'flex' : 'hidden md:flex'
        }`}>
          
          {/* Guidelines */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Guidelines</span>
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-[#F8FAFC] dark:bg-slate-800 p-3.5 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
              {community.rules}
            </p>
          </div>

          {/* Active Polls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Community Polls</span>
              {isAdminOrMod && (
                <button onClick={() => setShowPollModal(true)} className="text-slate-400 hover:text-[#19A974]">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              {polls.length > 0 ? (
                polls.map((poll) => {
                  const { totalVotes, stats } = calculatePollStats(poll);
                  
                  return (
                    <div key={poll.id} className="flex flex-col gap-2 p-3 bg-[#F8FAFC] dark:bg-slate-800 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
                      <h4 className="text-xs font-bold text-[#102A43] dark:text-white leading-normal">
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
                              className={`text-left rounded-lg p-2 text-[10px] font-medium transition-all relative overflow-hidden w-full ${
                                optionVoted 
                                  ? 'bg-[#19A974]/15 border border-[#19A974] text-[#19A974]' 
                                  : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                              }`}
                            >
                              <div className="flex justify-between relative z-10">
                                <span>{st.option}</span>
                                <span className="font-bold">{st.pct}%</span>
                              </div>
                              <div 
                                className="absolute left-0 top-0 bottom-0 bg-[#19A974]/15 z-0 transition-all duration-300"
                                style={{ width: `${st.pct}%` }}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 text-right mt-0.5">
                        {totalVotes} vote{totalVotes !== 1 ? 's' : ''} total
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-xs text-slate-400 border border-[#E2E8F0] rounded-xl dark:border-slate-800">
                  No active polls.
                </div>
              )}
            </div>
          </div>

          {/* Group Events */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upcoming Events</span>
            <div className="flex flex-col gap-2">
              {events.length > 0 ? (
                events.map((evt) => (
                  <Link 
                    key={evt.id} 
                    to="/events" 
                    className="p-3 bg-[#F8FAFC] dark:bg-slate-800 rounded-xl border border-[#E2E8F0] dark:border-slate-700 hover:border-[#19A974] transition-all block"
                  >
                    <h5 className="text-xs font-bold text-[#102A43] dark:text-white truncate">{evt.title}</h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                      <Calendar className="h-3 w-3 text-[#38BDF8]" />
                      <span>{new Date(evt.event_time).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <span>•</span>
                      <span>{evt.location_name}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-slate-400 border border-[#E2E8F0] rounded-xl dark:border-slate-800">
                  No upcoming group events.
                </div>
              )}
            </div>
          </div>

          {/* Members Directory */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Members Directory ({members.length})</span>
            <div className="flex flex-col gap-2">
              {members.map((mem) => (
                <div key={mem.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={mem.user?.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt="" className="h-6 w-6 rounded-full object-cover bg-slate-100" />
                    <span className="text-xs font-medium text-[#102A43] dark:text-slate-200 truncate max-w-[120px]">{mem.user?.name}</span>
                  </div>
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    mem.role === 'admin' 
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20' 
                      : mem.role === 'moderator'
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8]'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/50 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="max-w-sm w-full p-5 flex flex-col gap-4 shadow-xl border-[#E2E8F0]" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Create New Channel</h4>
              <button onClick={() => setShowChannelModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateChannel} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Channel Name</label>
                <input
                  type="text"
                  placeholder="e.g. general-help"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Channel Type</label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value)}
                  className="h-10 px-2 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                >
                  <option value="text">Standard Text Channel (#)</option>
                  <option value="announcement">Announcements Channel (Pinned)</option>
                </select>
              </div>
              <button
                type="submit"
                className="h-10 w-full bg-[#19A974] hover:bg-[#158f62] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Create Channel
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* MODAL: Create Interactive Poll */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/50 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="max-w-sm w-full p-5 flex flex-col gap-4 shadow-xl border-[#E2E8F0]" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Launch Poll</h4>
              <button onClick={() => setShowPollModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePoll} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Question</label>
                <input
                  type="text"
                  placeholder="e.g. When should we hold the community clean-up?"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Choices</label>
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[idx] = e.target.value;
                      setPollOptions(updated);
                    }}
                    className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setPollOptions([...pollOptions, ''])}
                  className="text-[#19A974] hover:underline text-xs font-medium self-start mt-1"
                >
                  + Add Option
                </button>
              </div>
              <button
                type="submit"
                className="h-10 w-full bg-[#19A974] hover:bg-[#158f62] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Publish Poll
              </button>
            </form>
          </GlassCard>
        </div>
      )}

    </div>
  );
};
