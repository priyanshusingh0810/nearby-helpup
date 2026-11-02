import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Users, 
  Sun, 
  CloudSun, 
  CloudRain, 
  Info, 
  X,
  Compass,
  Sparkles,
  Check
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState<number>(10.0);
  
  // Weather state
  const [weather, setWeather] = useState<any>(null);

  // Host event modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCover, setNewCover] = useState('');
  const [newLocName, setNewLocName] = useState('DTU Campus, Rohini');
  const [newLat, setNewLat] = useState(28.7501);
  const [newLon, setNewLon] = useState(77.1177);
  const [newTime, setNewTime] = useState('');
  const [newLimit, setNewLimit] = useState<number>(10);
  const [modalError, setModalError] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const lat = user?.location_lat || undefined;
      const lon = user?.location_lon || undefined;
      
      const data = await api.events.getAll({
        lat,
        lon,
        radius
      });
      setEvents(data);

      if (lat && lon) {
        const w = await api.events.getWeather(lat, lon);
        setWeather(w.forecast);
      }
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [radius, user]);

  const handleRSVP = async (eventId: number, status: string) => {
    try {
      await api.events.rsvp(eventId, status);
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to submit RSVP');
    }
  };

  const handleHostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!newTitle.trim() || !newTime) {
      setModalError('Event title and time are required.');
      return;
    }

    try {
      await api.events.create({
        title: newTitle,
        description: newDesc,
        cover_image: newCover || undefined,
        location_name: newLocName,
        location_lat: newLat,
        location_lon: newLon,
        event_time: new Date(newTime).toISOString(),
        rsvp_limit: newLimit || undefined
      });
      
      setNewTitle('');
      setNewDesc('');
      setNewCover('');
      setNewLocName('DTU Campus, Rohini');
      setNewTime('');
      setNewLimit(10);
      setShowModal(false);
      fetchEvents();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create event');
    }
  };

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-amber-500" />;
      case 'cloudy':
        return <CloudSun className="h-6 w-6 text-slate-400" />;
      case 'rainy':
        return <CloudRain className="h-6 w-6 text-[#38BDF8]" />;
      default:
        return <CloudSun className="h-6 w-6 text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* MODAL: Host Event Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/50 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="max-w-md w-full p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-xl border-[#E2E8F0]" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-[#102A43] dark:text-white flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#38BDF8]" />
                <span>Host Neighborhood Event</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold border border-rose-100">
                {modalError}
              </div>
            )}

            <form onSubmit={handleHostEvent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Rohini Community Weekend Cleanup"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  placeholder="What is the schedule? Who can join? Any prep instructions?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="p-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Location Name</label>
                  <input
                    type="text"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">RSVP Limit (Max)</label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(parseInt(e.target.value))}
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="h-10 px-2 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cover Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 h-10 w-full bg-[#19A974] hover:bg-[#158f62] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Schedule Neighborhood Event
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#102A43] dark:text-white">
              Upcoming Meetups & Events
            </h1>
            <span className="rounded-full bg-[#19A974]/10 text-[#19A974] px-2.5 py-0.5 text-[10px] font-bold">
              {events.length} Events
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse volunteer meetups, workshops, and community events near your neighborhood.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#19A974] hover:bg-[#158f62] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Host Local Event</span>
        </button>
      </div>

      {/* Weather Indicator Banner */}
      {weather && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F8FAFC] dark:bg-slate-800 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
              {getWeatherIcon(weather.icon)}
            </div>
            <div>
              <div className="text-xs font-bold text-[#102A43] dark:text-white flex items-center gap-2">
                <span>Local Weather:</span>
                <span className="text-[#19A974]">{weather.temp}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{weather.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="h-4 w-4 text-[#38BDF8]" />
            <span>Outdoor activity advisories live</span>
          </div>
        </div>
      )}

      {/* Radius proximity slider */}
      <div className="flex items-center gap-3 bg-white dark:bg-[#1E293B] p-3.5 border border-[#E2E8F0] dark:border-[#334155] rounded-xl max-w-sm shadow-xs">
        <MapPin className="h-4 w-4 text-[#38BDF8] shrink-0" />
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Radius Proximity</span>
            <span className="text-[#102A43] dark:text-white">{radius} km</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="20"
            step="0.5"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#19A974]"
          />
        </div>
      </div>

      {/* Events Grid layout */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-72 w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-[#E2E8F0] animate-skeleton" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const hasLimit = evt.rsvp_limit !== null;
            const spotsLeft = hasLimit ? Math.max(0, evt.rsvp_limit - evt.rsvp_count) : null;
            const rsvpStatus = evt.user_rsvp_status;

            return (
              <div 
                key={evt.id} 
                className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div>
                  {/* Cover banner */}
                  <div className="h-36 w-full relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <img 
                      src={evt.cover_image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600'} 
                      alt="" 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute left-3 top-3 rounded-full bg-[#102A43]/85 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#38BDF8]" />
                      <span>{new Date(evt.event_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-[#102A43] dark:text-white line-clamp-1 group-hover:text-[#19A974] transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="flex flex-col gap-1.5 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#38BDF8] shrink-0" />
                        <span className="truncate">{evt.location_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#19A974] shrink-0" />
                        <span>{evt.rsvp_count} Attending</span>
                        {hasLimit && (
                          <span className="text-[#19A974] font-medium">({spotsLeft} spots remaining)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RSVP Controls footer */}
                <div className="px-5 pb-5 border-t border-[#E2E8F0] dark:border-slate-800 pt-4 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-slate-900 p-1 rounded-xl w-full border border-[#E2E8F0] dark:border-slate-800">
                    {['going', 'maybe', 'not_going'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleRSVP(evt.id, st)}
                        className={`rounded-lg px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider flex-1 text-center transition-all ${
                          rsvpStatus === st
                            ? 'bg-[#102A43] text-white shadow-xs'
                            : 'text-slate-500 hover:text-[#102A43] dark:hover:text-white'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[#E2E8F0] rounded-2xl dark:border-slate-800 bg-white dark:bg-[#1E293B]">
          <div className="h-12 w-12 rounded-full bg-[#19A974]/10 text-[#19A974] flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-[#102A43] dark:text-white">No meetups found nearby</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search radius or be the first to host an activity in your area.
          </p>
        </div>
      )}

    </div>
  );
};
