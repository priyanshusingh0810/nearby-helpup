import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Search, 
  MapPin, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  SlidersHorizontal,
  Mic,
  MicOff,
  Compass,
  ArrowRight,
  Users,
  Calendar,
  X,
  Volume2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import { WeatherWidget } from '../components/widgets/WeatherWidget';

export const Home: React.FC = () => {
  const { user } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamVal = searchParams.get('search') || '';

  // States
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParamVal);
  const [searchAlternatives, setSearchAlternatives] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [radius, setRadius] = useState<number>(5.0); // km
  const [isAiParsed, setIsAiParsed] = useState(false);
  const [selectedMapNode, setSelectedMapNode] = useState<any>(null);

  // Recommendations and trending states
  const [recListings, setRecListings] = useState<any[]>([]);
  const [recCommunities, setRecCommunities] = useState<any[]>([]);
  const [recEvents, setRecEvents] = useState<any[]>([]);

  // Voice recording mock modal
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('Listening...');

  const categories = [
    { name: 'Electronics', emoji: '💻' },
    { name: 'Fashion', emoji: '👕' },
    { name: 'Books', emoji: '📚' },
    { name: 'Gaming', emoji: '🎮' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Furniture', emoji: '🪑' },
    { name: 'Medical', emoji: '🩺' },
    { name: 'Education', emoji: '🎓' },
    { name: 'Services', emoji: '🛠️' }
  ];

  // Fetch active listings
  const fetchListingsData = async () => {
    setLoading(true);
    try {
      const lat = user?.location_lat || undefined;
      const lon = user?.location_lon || undefined;

      const data = await api.listings.getAll({
        type: selectedType === 'all' ? undefined : selectedType,
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
        lat,
        lon,
        radius,
      });
      setListings(data);
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI Recommendations
  const fetchRecommendations = async () => {
    try {
      const data = await api.ai.getRecommendations();
      setRecListings(data.recommended_listings || []);
      setRecCommunities(data.recommended_communities || []);
      setRecEvents(data.recommended_events || []);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
    }
  };

  useEffect(() => {
    fetchListingsData();
  }, [selectedCategory, selectedType, radius, searchQuery, user]);

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  // Load AI suggested search alternatives when user searches
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchAlternatives([]);
      return;
    }
    
    const fetchAlternatives = async () => {
      try {
        const res = await api.ai.getAlternatives(searchQuery);
        setSearchAlternatives(res.alternatives || []);
      } catch (err) {
        console.error('Failed to fetch search alternatives', err);
      }
    };

    const delayDebounce = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetchAlternatives();
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Parse search using natural language parsing
  const handleNaturalLanguageSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.ai.parseSearch(searchQuery);
      if (res.type && res.type !== 'all') {
        setSelectedType(res.type);
      }
      if (res.category) {
        setSelectedCategory(res.category);
      }
      if (res.search) {
        setSearchQuery(res.search);
      }
      setIsAiParsed(true);
    } catch (err) {
      console.error('AI search parsing failed', err);
    }
  };

  // Trigger voice search using Web Speech API with fallback simulation
  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let fallbackTimer: any = null;
    let recognitionInstance: any = null;

    const triggerFallback = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (recognitionInstance) {
        try {
          recognitionInstance.abort();
        } catch (e) {}
      }
      setVoiceStatus('Processing audio (demo fallback)...');
      setTimeout(() => {
        const voiceQueries = [
          "I need a scientific calculator for exam tomorrow",
          "running club near me Rohini",
          "badminton racket available for rent",
          "wheelchair for medical emergency"
        ];
        const randomQuery = voiceQueries[Math.floor(Math.random() * voiceQueries.length)];
        setSearchQuery(randomQuery);
        setSearchParams({ search: randomQuery });
        setVoiceRecording(false);
      }, 1000);
    };

    if (!SpeechRecognition) {
      setVoiceRecording(true);
      setVoiceStatus('Speech API not supported. Simulating...');
      setTimeout(triggerFallback, 1200);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionInstance = recognition;
      recognition.continuous = false;
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setVoiceRecording(true);
      setVoiceStatus('Listening... Speak now!');

      // If no permission is granted or silence is absolute, fallback after 5.5 seconds
      fallbackTimer = setTimeout(() => {
        console.log('Voice search timed out. Switching to simulation fallback.');
        triggerFallback();
      }, 5500);

      recognition.onresult = (event: any) => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        const transcript = event.results[0][0].transcript;
        setVoiceStatus(`Recognized: "${transcript}"`);
        setTimeout(() => {
          setSearchQuery(transcript);
          setSearchParams({ search: transcript });
          setVoiceRecording(false);
        }, 1000);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (fallbackTimer) clearTimeout(fallbackTimer);
        setVoiceStatus(`Mic Error (${event.error}). Simulating...`);
        setTimeout(triggerFallback, 1000);
      };

      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
      triggerFallback();
    }
  };

  // Countdown timer helper for Emergency listings
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (expiresAtStr: string) => {
    const expiresAt = new Date(expiresAtStr).getTime();
    const diff = expiresAt - currentTime;
    if (diff <= 0) return 'Expired';
    
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const activeEmergencies = listings.filter(l => l.is_emergency && l.status === 'active');
  const regularListings = listings.filter(l => !l.is_emergency);

  const getTypeBadgeColor = (type: string) => {
    const mapping: Record<string, string> = {
      borrow: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
      lend: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
      barter: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
      donate: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
      service: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400'
    };
    return mapping[type.toLowerCase()] || 'bg-slate-50 text-slate-650';
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Voice Recording Modal */}
      {voiceRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 p-8 rounded-3xl flex flex-col items-center gap-6 max-w-sm w-full text-center shadow-2xl animate-scale-in">
            <button className="self-end text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setVoiceRecording(false)}>
              <X className="h-5 w-5" />
            </button>
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500/20 to-rose-500/5 animate-ping" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-rose-500/15 to-rose-500/5 animate-pulse" />
              <div className="relative h-full w-full bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-950/40 dark:to-rose-950/20 rounded-full flex items-center justify-center">
                <Mic className="h-8 w-8 text-rose-500" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">{voiceStatus}</h4>
              <p className="text-[10px] text-slate-400 mt-1">Speak clearly into your microphone device</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hello, <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">{user?.name || 'Neighbor'}</span> 👋
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore resources, meetups, and emergency requests happening in your community circle.
          </p>
        </div>
        <Link
          to="/create-listing"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 transition-all duration-300 w-full sm:w-auto hover:-translate-y-[1px] hover:shadow-xl hover:shadow-indigo-500/25"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>New Share / Request</span>
        </Link>
      </div>

      {/* Search Input Container */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 max-w-3xl w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search items, groups, events near you... (Or type a natural language query)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchParams({ search: e.target.value });
                if (isAiParsed) setIsAiParsed(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNaturalLanguageSearch();
              }}
              className="h-11 w-full rounded-xl bg-white pl-11 pr-12 text-xs outline-none border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-850 dark:text-white dark:focus:bg-slate-950 transition-all duration-200 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchParams({});
                  setIsAiParsed(false);
                }}
                className="absolute right-12 top-3.5 text-[10px] font-bold text-slate-400 hover:text-slate-650"
              >
                Clear
              </button>
            )}
            <button
              onClick={startVoiceSearch}
              className="absolute right-4 top-3 text-slate-450 hover:text-indigo-500"
              title="Voice Search"
            >
              <Mic className="h-4.5 w-4.5" />
            </button>
          </div>
          <button
            onClick={handleNaturalLanguageSearch}
            className="rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold px-4 py-3 text-xs flex items-center gap-1 hover:bg-slate-850 transition-all"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>AI Ask</span>
          </button>
        </div>

        {/* AI Parsed Search Badge */}
        {isAiParsed && (
          <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 px-3 py-1 rounded-lg w-fit border border-indigo-100/20 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Search parsed automatically by Nearby HelpUp AI engine</span>
          </div>
        )}

        {/* AI Suggested search alternatives */}
        {searchAlternatives.length > 0 && (
          <div className="flex flex-col gap-2 p-4 bg-indigo-50/10 border border-indigo-100/30 rounded-2xl dark:border-indigo-950/20 dark:bg-indigo-950/15 max-w-3xl">
            <div className="flex items-center gap-1.5 text-[9px] text-indigo-500 dark:text-indigo-400 font-extrabold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Related Search Alternatives</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {searchAlternatives.map((alt) => (
                <button
                  key={alt}
                  onClick={() => {
                    setSearchQuery(alt);
                    setSearchParams({ search: alt });
                  }}
                  className="rounded-full px-3.5 py-1.5 text-[10px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Broadcast Feed */}
      {activeEmergencies.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 animate-bounce" />
            <span>Active Nearby Emergencies</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {activeEmergencies.map((item) => (
              <div 
                key={item.id}
                className="relative rounded-2xl border border-rose-200/40 bg-gradient-to-br from-rose-50/40 to-white/80 p-5 dark:border-rose-950/30 dark:from-rose-950/15 dark:to-slate-950/50 flex flex-col gap-3 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 emergency-pulse"
              >
                <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-1 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse shadow-md shadow-rose-500/20">
                  Timer: {getCountdown(item.expires_at)}
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🚨</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <span className="text-[9px] bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-455 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">
                      {item.category}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between border-t border-rose-100/50 dark:border-rose-950/20 pt-3">
                  <div className="flex items-center gap-2">
                    <img src={item.owner.profile_photo} alt="" className="h-5 w-5 rounded-full object-cover bg-slate-50" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.owner.name}</span>
                  </div>
                  <Link
                    to={`/listing/${item.id}`}
                    className="rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white text-[10px] font-bold px-4 py-1.5 transition-all shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/25"
                  >
                    Respond Instantly
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Neighborhood Map Node preview */}
      <GlassCard className="p-5 flex flex-col gap-4" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <Compass className="h-5 w-5 text-indigo-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-850 dark:text-white font-sans">Interactive Neighborhood Grid Map</h3>
              <p className="text-[10px] text-slate-400">See listings, active clubs, and emergency broadcasts close to you</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">Filter Radius: {radius} km</span>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-32 h-1.5 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* SVG Neighborhood Mesh Map Canvas */}
        <div className="relative h-72 w-full rounded-2xl bg-slate-50 border border-slate-200/60 dark:bg-slate-950/40 dark:border-slate-850 overflow-hidden flex items-center justify-center shadow-inner">
          <svg className="absolute inset-0 h-full w-full" onClick={() => setSelectedMapNode(null)} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-850" />
              </pattern>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="100%" height="100%" fill="url(#centerGlow)" />

            {/* Abstract styled street roads (Minimalistic Hyperlocal look) */}
            <g opacity="0.15" stroke="currentColor" strokeWidth="1.25" className="text-slate-400 dark:text-slate-700">
              <line x1="0" y1="30%" x2="100%" y2="70%" />
              <line x1="0" y1="70%" x2="100%" y2="30%" />
              <line x1="25%" y1="0" x2="25%" y2="100%" />
              <line x1="75%" y1="0" x2="75%" y2="100%" />
              {/* Curve lanes */}
              <path d="M 0,144 Q 256,48 512,144" fill="none" strokeWidth="0.75" />
              <path d="M 0,48 Q 256,240 512,48" fill="none" strokeWidth="0.75" />
              {/* Concentric distance rings */}
              <circle cx="50%" cy="50%" r="40" fill="none" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="50%" cy="50%" r="80" fill="none" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="50%" cy="50%" r="120" fill="none" strokeWidth="0.5" strokeDasharray="3 3" />
            </g>

            {/* Connection Mesh Lines from User (Center) to Active Nodes */}
            {listings.map((item, idx) => {
              const theta = (idx * 60 + 15) * (Math.PI / 180);
              const distance = 45 + (idx * 25) % 80;
              const xOffset = distance * Math.cos(theta);
              const yOffset = distance * Math.sin(theta);
              const isEmergency = item.is_emergency;
              const strokeColor = isEmergency ? 'rgba(244, 63, 94, 0.3)' : 'rgba(79, 70, 229, 0.25)';
              
              return (
                <line 
                  key={`line-list-${item.id}`}
                  x1="50%" 
                  y1="50%" 
                  x2={`calc(50% + ${xOffset}px)`} 
                  y2={`calc(50% + ${yOffset}px)`} 
                  stroke={strokeColor} 
                  strokeWidth="1" 
                  strokeDasharray="4 4" 
                  className="transition-all duration-300"
                />
              );
            })}

            {recCommunities.map((c, idx) => {
              const theta = (idx * 90 + 200) * (Math.PI / 180);
              const distance = 70 + (idx * 30) % 60;
              const xOffset = distance * Math.cos(theta);
              const yOffset = distance * Math.sin(theta);
              
              return (
                <line 
                  key={`line-comm-${c.id}`}
                  x1="50%" 
                  y1="50%" 
                  x2={`calc(50% + ${xOffset}px)`} 
                  y2={`calc(50% + ${yOffset}px)`} 
                  stroke="rgba(16, 185, 129, 0.25)" 
                  strokeWidth="1" 
                  strokeDasharray="4 4"
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Adjustable Range Outer Circle */}
            <circle 
              cx="50%" 
              cy="50%" 
              r={Math.min(radius * 5.5 + 30, 140)} 
              fill="rgba(79, 70, 229, 0.02)" 
              stroke="rgba(79, 70, 229, 0.3)" 
              strokeWidth="1.5" 
              strokeDasharray="5 5" 
              className="transition-all duration-500"
            />

            {/* User Center Node (Self) */}
            <circle cx="50%" cy="50%" r="6" className="fill-indigo-600 stroke-white dark:stroke-slate-950" strokeWidth="2" />
            <circle cx="50%" cy="50%" r="14" className="fill-none stroke-indigo-600 animate-ping" strokeWidth="1" opacity="0.35" />

            {/* Render Items/Events/Communities coordinates offset deterministically */}
            {listings.map((item, idx) => {
              const theta = (idx * 60 + 15) * (Math.PI / 180);
              const distance = 45 + (idx * 25) % 80;
              const xOffset = distance * Math.cos(theta);
              const yOffset = distance * Math.sin(theta);
              
              const isEmergency = item.is_emergency;
              const color = isEmergency ? '#f43f5e' : '#4f46e5';
              const isSelected = selectedMapNode?.id === item.id && selectedMapNode?.nodeType === 'listing';
              
              return (
                <g 
                  key={item.id} 
                  onClick={(e) => { e.stopPropagation(); setSelectedMapNode({ ...item, nodeType: 'listing' }); }}
                  className="cursor-pointer group"
                >
                  {/* Concentric outer ring breathing animation */}
                  <circle cx={`calc(50% + ${xOffset}px)`} cy={`calc(50% + ${yOffset}px)`} r={isSelected ? "14" : "10"} fill="none" stroke={color} strokeWidth="1.5" className={`${isEmergency ? 'animate-pulse opacity-60' : 'opacity-0 group-hover:opacity-50'} transition-all duration-300`} />
                  <circle cx={`calc(50% + ${xOffset}px)`} cy={`calc(50% + ${yOffset}px)`} r={isSelected ? "7" : "5.5"} fill={color} stroke="#fff" strokeWidth="1.5" className="transition-all duration-300 hover:scale-125" />
                  
                  {/* Tooltip Hover Overlay */}
                  <foreignObject 
                    x={`calc(50% + ${xOffset - 50}px)`} 
                    y={`calc(50% + ${yOffset - 36}px)`} 
                    width="100" 
                    height="32"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  >
                    <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-sm text-white rounded text-[8px] p-1 truncate text-center shadow-lg font-bold border border-white/10">
                      {item.title}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Render Suggested Communities Nodes */}
            {recCommunities.map((c, idx) => {
              const theta = (idx * 90 + 200) * (Math.PI / 180);
              const distance = 70 + (idx * 30) % 60;
              const xOffset = distance * Math.cos(theta);
              const yOffset = distance * Math.sin(theta);
              const isSelected = selectedMapNode?.id === c.id && selectedMapNode?.nodeType === 'community';
              
              return (
                <g 
                  key={c.id} 
                  onClick={(e) => { e.stopPropagation(); setSelectedMapNode({ ...c, nodeType: 'community' }); }}
                  className="cursor-pointer group"
                >
                  <circle cx={`calc(50% + ${xOffset}px)`} cy={`calc(50% + ${yOffset}px)`} r={isSelected ? "14" : "10"} fill="none" stroke="#10b981" strokeWidth="1.5" className="opacity-0 group-hover:opacity-50 transition-all duration-300" />
                  <circle cx={`calc(50% + ${xOffset}px)`} cy={`calc(50% + ${yOffset}px)`} r={isSelected ? "7" : "5.5"} fill="#10b981" stroke="#fff" strokeWidth="1.5" className="transition-all duration-300 hover:scale-125" />
                  
                  <foreignObject 
                    x={`calc(50% + ${xOffset - 50}px)`} 
                    y={`calc(50% + ${yOffset - 36}px)`} 
                    width="100" 
                    height="32"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  >
                    <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-sm text-white rounded text-[8px] p-1 truncate text-center shadow-lg font-bold border border-white/10">
                      👥 {c.name}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* Map Legends */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2.5 text-[9px] font-bold text-slate-500 bg-white/90 backdrop-blur-sm dark:bg-slate-950/90 dark:text-slate-400 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/40 shadow-md">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-600"></span> Listing</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span> Emergency</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Circle</span>
          </div>

          {/* Interactive Floating Details Panel */}
          {selectedMapNode && (
            <div className="absolute bottom-3 right-3 max-w-[250px] w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/50 shadow-xl animate-scale-in flex flex-col gap-2 z-10">
              <div className="flex justify-between items-center">
                <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm ${
                  selectedMapNode.nodeType === 'community' 
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                    : selectedMapNode.is_emergency 
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-455'
                    : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                }`}>
                  {selectedMapNode.nodeType === 'community' ? 'Community' : selectedMapNode.type}
                </span>
                <button onClick={() => setSelectedMapNode(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div className="flex gap-2.5">
                <img 
                  src={selectedMapNode.nodeType === 'community' ? selectedMapNode.cover_image : (selectedMapNode.images?.split(';')[0] || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=120')} 
                  alt="" 
                  className="h-11 w-11 rounded-lg object-cover bg-slate-100 border border-slate-200/50 dark:border-slate-850 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-[10px] font-extrabold text-slate-850 dark:text-white truncate">{selectedMapNode.name || selectedMapNode.title}</h5>
                  <p className="text-[9px] text-slate-455 dark:text-slate-400 line-clamp-2 mt-0.5 leading-normal">{selectedMapNode.description}</p>
                </div>
              </div>
              
              <Link
                to={selectedMapNode.nodeType === 'community' ? `/communities/${selectedMapNode.id}` : `/listing/${selectedMapNode.id}`}
                className="text-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-[9px] py-2.5 transition-all duration-300 flex items-center justify-center gap-1 shadow-sm mt-1"
              >
                <span>View Details</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Horizontal Scroll Category Selector */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450">Browse Categories</span>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white border-transparent shadow-md shadow-indigo-500/20'
                : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 hover:border-indigo-200/30 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-850'
            }`}
          >
            All Items 📦
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === c.name
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white border-transparent shadow-md shadow-indigo-500/20'
                  : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 hover:border-indigo-200/30 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-850'
              }`}
            >
              {c.name} {c.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Feed Grid */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left main feed (Active listings list) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-extrabold text-sm">
              <SlidersHorizontal className="h-4.5 w-4.5 text-slate-450" />
              <span>Hyperlocal Community Feed</span>
            </div>
            
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100/60 p-1 rounded-xl dark:bg-slate-900 w-full sm:w-auto overflow-x-auto">
              {['all', 'borrow', 'lend', 'barter', 'donate', 'service'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`rounded-lg px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedType === t
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                      : 'text-slate-550 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Listings List */}
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-48 w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-skeleton" />
              ))}
            </div>
          ) : regularListings.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {regularListings.map((item) => (
                <GlassCard key={item.id} className="overflow-hidden flex flex-col justify-between h-[340px] border-slate-100/50 group">
                  <div>
                    {/* Item Image with gradient overlay */}
                    <div className="h-40 w-full relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                      <img
                        src={item.images.split(';')[0]}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-sm ${getTypeBadgeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                          {item.title}
                        </h4>
                        <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded border border-indigo-100/10">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Owner Info & Details Action */}
                  <div className="px-4 pb-4 flex items-center justify-between border-t border-slate-50 dark:border-slate-850 pt-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.owner.profile_photo}
                        alt={item.owner.name}
                        className="h-6 w-6 rounded-full bg-slate-100 object-cover"
                      />
                      <span className="text-[10px] font-bold text-slate-650 dark:text-slate-400">
                        {item.owner.name}
                      </span>
                    </div>
                    <Link
                      to={`/listing/${item.id}`}
                      className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-extrabold px-3.5 py-2 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 transition-all shadow-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl dark:border-slate-800 bg-white/30">
              <span className="text-3xl">📭</span>
              <h3 className="font-bold text-sm mt-3">No matching listings found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Try widening your search radius range circle or selecting another category.
              </p>
            </div>
          )}
        </div>

        {/* Right side recommended match panels */}
        <div className="flex flex-col gap-6">
          
          {/* Weather Widget */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450">Local Weather</span>
            <WeatherWidget lat={user?.location_lat ?? null} lon={user?.location_lon ?? null} locationName={user?.location_name} />
          </div>

          {/* Recommended Communities */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450">Recommended Communities</span>
            <div className="flex flex-col gap-3">
              {recCommunities.length > 0 ? (
                recCommunities.map((c) => (
                  <GlassCard key={c.id} className="p-4 flex items-center justify-between gap-3 border-slate-100/50" hoverEffect={true}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-500 font-bold shrink-0">
                        👥
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-850 dark:text-white truncate">
                          {c.name}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          {c.category} • Local Group
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/communities/${c.id}`}
                      className="rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-[10px] font-extrabold px-3 py-1.5 dark:bg-indigo-950/40 dark:text-indigo-400 transition-all shrink-0"
                    >
                      Join
                    </Link>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-6 border border-slate-100 rounded-2xl dark:border-slate-850 text-xs text-slate-400">
                  No group suggestions.
                </div>
              )}
            </div>
          </div>

          {/* Recommended Events */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450">Upcoming Local Events</span>
            <div className="flex flex-col gap-3">
              {recEvents.length > 0 ? (
                recEvents.map((evt) => (
                  <GlassCard key={evt.id} className="p-4 flex items-center justify-between gap-3 border-slate-100/50" hoverEffect={true}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-500 font-bold shrink-0">
                        📅
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-850 dark:text-white truncate">
                          {evt.title}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          {evt.location_name}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/events`}
                      className="rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-extrabold px-3 py-1.5 dark:bg-slate-850 dark:text-slate-300 dark:hover:bg-slate-800 transition-all shrink-0"
                    >
                      RSVP
                    </Link>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-6 border border-slate-100 rounded-2xl dark:border-slate-850 text-xs text-slate-400">
                  No local meetups scheduled.
                </div>
              )}
            </div>
          </div>

          {/* Recommended Items */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-455">Recommended Items</span>
            <div className="flex flex-col gap-3">
              {recListings.length > 0 ? (
                recListings.slice(0, 3).map((item) => (
                  <GlassCard key={item.id} className="p-3.5 flex gap-3 border-slate-100/50" hoverEffect={true}>
                    <img
                      src={item.images.split(';')[0]}
                      alt={item.title}
                      className="h-12 w-12 rounded-xl object-cover bg-slate-50 shrink-0"
                    />
                    <div className="flex flex-col gap-0.5 min-w-0 justify-center">
                      <span className="text-xs font-bold text-slate-850 dark:text-white truncate">
                        {item.title}
                      </span>
                      <span className="text-[9px] text-indigo-500 font-extrabold uppercase tracking-wide">
                        {item.type} • {item.category}
                      </span>
                      <Link
                        to={`/listing/${item.id}`}
                        className="text-[9px] font-bold text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 underline mt-1"
                      >
                        Inspect Resource
                      </Link>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-6 border border-slate-100 rounded-2xl dark:border-slate-850 text-xs text-slate-405">
                  No matching recommendations.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
