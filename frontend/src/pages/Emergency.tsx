import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ArrowUpRight, 
  Plus,
  Flame,
  Volume2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';

export const Emergency: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Emergency states
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmergencies = async () => {
    setLoading(true);
    try {
      const data = await api.listings.getAll({
        is_emergency: true
      });
      setEmergencies(data);
    } catch (err) {
      console.error('Failed to load emergencies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  // Live countdown update trigger
  const [time, setTime] = useState(new Date().getTime());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (expiresAtStr: string) => {
    const expiresAt = new Date(expiresAtStr).getTime();
    const diff = expiresAt - time;
    if (diff <= 0) return 'Expired';
    
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const handleRespond = async (listing: any) => {
    try {
      const chat = await api.chats.getOrCreate(listing.owner_id, listing.id);
      navigate(`/chat?id=${chat.id}`);
    } catch (err) {
      alert('Failed to initiate chat');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-950/20 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative">
            <div className="absolute inset-0 rounded-2xl bg-rose-500/10 animate-glow-pulse" />
            <AlertTriangle className="h-6 w-6 text-rose-500 animate-bounce relative z-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Emergency Priority Board
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Time-bounded urgent requests. Help your neighbors in need near your coordinates.
            </p>
          </div>
        </div>
        
        <Link
          to="/create-listing"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white px-5 py-3 text-xs font-bold shadow-lg shadow-rose-500/20 dark:shadow-rose-500/10 transition-all duration-300 w-full sm:w-auto hover:-translate-y-[1px]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Raise Emergency Request</span>
        </Link>
      </div>

      {/* Info warning */}
      <div className="p-4 bg-rose-50/50 border border-rose-150/30 rounded-2xl dark:bg-rose-950/15 dark:border-rose-900/30 flex items-start gap-3">
        <Flame className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed font-semibold">
          All listings posted on the Emergency Board automatically expire after 6 to 12 hours. Push notifications are broadcasted to all active helpers within 10 km parameters instantly.
        </div>
      </div>

      {/* Emergency feed */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-48 w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-150 animate-skeleton" />
          ))}
        </div>
      ) : emergencies.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {emergencies.map((item) => (
            <GlassCard 
              key={item.id} 
              className="relative p-6 flex flex-col gap-4 border-rose-100/40 dark:border-rose-950/20 bg-gradient-to-tr from-rose-50/5 to-white/70 dark:from-rose-950/5" 
              hoverEffect={true}
            >
              <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-3 py-1 text-[8px] font-extrabold text-white uppercase tracking-widest animate-pulse shadow-md shadow-rose-500/20">
                Timer: {getCountdown(item.expires_at)}
              </div>

              <div className="flex items-start gap-3.5 mt-2">
                <span className="text-3xl shrink-0">🚨</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-850 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-455 px-2.5 py-0.5 rounded mt-1.5 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed mt-1">
                {item.description}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                <span>{item.location_name} • Verified Location Coords</span>
              </div>

              <div className="flex items-center justify-between border-t border-rose-100/50 dark:border-rose-950/20 pt-4 mt-2">
                <div className="flex items-center gap-2">
                  <img src={item.owner.profile_photo} alt="" className="h-6 w-6 rounded-full object-cover bg-slate-50" />
                  <div>
                    <h5 className="text-[10px] font-bold">{item.owner.name}</h5>
                    <span className="text-[8px] text-slate-400">Trust: {Math.round(item.owner.trust_score)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRespond(item)}
                  className="rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-extrabold text-[10px] px-4 py-2.5 transition-all duration-300 shadow-md shadow-rose-500/20 dark:shadow-rose-500/10 flex items-center gap-1 hover:-translate-y-[1px]"
                >
                  <span>Lend / Help Out</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-slate-205 rounded-3xl dark:border-slate-800 bg-white/20">
          <span className="text-3xl">🛡️</span>
          <h3 className="font-bold text-sm mt-3">All clear! No active emergencies</h3>
          <p className="text-xs text-slate-405 mt-1 max-w-xs mx-auto">
            Your neighborhood is doing great. Check back later to see if anyone needs emergency assistance.
          </p>
        </div>
      )}

    </div>
  );
};
