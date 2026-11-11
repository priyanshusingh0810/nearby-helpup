import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  Plus,
  ShieldAlert,
  Flame,
  Radio,
  BellRing,
  CheckCircle2,
  PhoneCall
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
      alert('Failed to initiate emergency chat connection');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6 md:gap-8 pb-20 w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-12 w-12 bg-[#EF4444]/10 rounded-2xl flex items-center justify-center shrink-0 border border-[#EF4444]/20">
            <Radio className="h-6 w-6 text-[#EF4444] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-[#102A43] dark:text-white">
                Emergency Priority Board
              </h1>
              <span className="rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-ping" />
                Live Network
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Time-critical community distress beacons. Directly coordinate rapid local response with nearby neighbors.
            </p>
          </div>
        </div>
        
        <Link
          to="/create-listing"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#EF4444] hover:bg-[#dc2626] text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-all duration-200 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Raise Emergency Request</span>
        </Link>
      </div>

      {/* Quick stats ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-4 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-[#19A974]/10 flex items-center justify-center text-[#19A974]">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#102A43] dark:text-white">100%</div>
            <div className="text-[11px] text-slate-500">Community Volunteer Network</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-4 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-[#38BDF8]/10 flex items-center justify-center text-[#38BDF8]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#102A43] dark:text-white">&lt; 5 mins</div>
            <div className="text-[11px] text-slate-500">Avg. First Response Time</div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-4 flex items-center gap-3 shadow-xs">
          <div className="h-10 w-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center text-[#EF4444]">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-[#102A43] dark:text-white">10 km</div>
            <div className="text-[11px] text-slate-500">Active Alert Perimeter</div>
          </div>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="font-semibold">Notice for Responders: </span> 
          All listings on this priority board represent urgent assistance needs (medical transit, urgent supplies, critical repairs). 
          For life-threatening medical emergencies or severe crime incidents, always contact national emergency services immediately (911 / 112).
        </div>
      </div>

      {/* Emergency feed */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-56 w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-[#E2E8F0] animate-skeleton" />
          ))}
        </div>
      ) : emergencies.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {emergencies.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-[#1E293B] border border-[#EF4444]/30 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#EF4444]" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider truncate">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-[#EF4444] text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{getCountdown(item.expires_at)}</span>
                  </span>
                </div>

                <div className="flex items-start gap-3 mt-1">
                  <div className="h-8 w-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                    <ShieldAlert className="h-4 w-4 text-[#EF4444]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-[#102A43] dark:text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                  {item.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-4">
                  <MapPin className="h-3.5 w-3.5 text-[#EF4444] shrink-0" />
                  <span className="truncate">{item.location_name}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-[#E2E8F0] dark:border-slate-800 pt-4 mt-5 gap-3">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={item.owner?.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                    alt="" 
                    className="h-8 w-8 rounded-full object-cover bg-slate-100 border border-[#E2E8F0] shrink-0" 
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-semibold text-[#102A43] dark:text-white truncate">{item.owner?.name}</h5>
                    <span className="text-[10px] text-slate-400">Trust Score: {Math.round(item.owner?.trust_score || 85)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRespond(item)}
                  className="rounded-xl bg-[#19A974] hover:bg-[#158f62] text-white font-semibold text-xs px-4 py-2 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Respond Instantly</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[#E2E8F0] rounded-2xl dark:border-slate-800 bg-white dark:bg-[#1E293B]">
          <div className="h-12 w-12 rounded-full bg-[#19A974]/10 text-[#19A974] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-[#102A43] dark:text-white">All clear — No active emergencies in your sector</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your neighborhood network is currently secure. When a neighbor raises a distress beacon within 10 km, it will instantly display here.
          </p>
        </div>
      )}

    </div>
  );
};
