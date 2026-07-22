import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Users, 
  Check, 
  Sparkles, 
  Sun, 
  CloudSun, 
  CloudRain, 
  ChevronRight,
  Info,
  X,
  Map
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

      // Fetch simulated weather for user location coordinates
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
      // Reload events to update stats
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
      
      // Reset form
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

  // Weather icon mapping helper
  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sunny':
        return <Sun className="h-7 w-7 text-amber-500 animate-spin-slow" />;
      case 'cloudy':
        return <CloudSun className="h-7 w-7 text-slate-400" />;
      case 'rainy':
        return <CloudRain className="h-7 w-7 text-indigo-400" />;
      default:
        return <CloudSun className="h-7 w-7 text-slate-455" />;
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* MODAL: Host Event Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <GlassCard className="max-w-md w-full p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5 font-sans">
                <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                <span>Host Neighborhood Event</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-655">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold border border-rose-100">
                {modalError}
              </div>
            )}

            <form onSubmit={handleHostEvent} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-slate-400">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Rohini Weekend Hackathon"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase text-slate-400">Description</label>
                <textarea
                  placeholder="What is the schedule? Who can join? Any prep instructions?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="p-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Location Address</label>
                  <input
                    type="text"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400">RSVP Limits (Attendees)</label>
                  <input
                    type="number"
                    value={newLimit}
                    onChange={(e) => setNewLimit(parseInt(e.target.value))}
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Latitude Coordinates</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLat}
                    onChange={(e) => setNewLat(parseFloat(e.target.value))}
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Longitude Coordinates</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLon}
                    onChange={(e) => setNewLon(parseFloat(e.target.value))}
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="h-10 px-2 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Cover Photo Link</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 h-10 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300"
              >
                Schedule Event Meeting
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Upcoming Meetups & Events
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse activities, RSVP attendance, check coordinates and outdoor weather advice.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 transition-all duration-300 w-full sm:w-auto hover:-translate-y-[1px]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Host Local Event</span>
        </button>
      </div>

      {/* Weather Indicator overlay */}
      {weather && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 border border-indigo-100/40 rounded-2xl dark:from-indigo-950/20 dark:to-purple-950/20 dark:border-indigo-900/30 gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
              {getWeatherIcon(weather.icon)}
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-850 dark:text-white flex items-center gap-1">
                <span>Neighborhood Weather Forecast:</span>
                <span className="text-indigo-600 dark:text-indigo-400">{weather.temp}</span>
              </h4>
              <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5">{weather.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-455">
            <Info className="h-4.5 w-4.5 text-indigo-500" />
            <span>Outdoor activity advisories active</span>
          </div>
        </div>
      )}

      {/* Geofilter radius circle controls */}
      <div className="flex items-center gap-4 bg-white/70 dark:bg-slate-900/60 p-4 border border-slate-205 dark:border-slate-850 rounded-2xl max-w-sm">
        <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[9px] font-bold uppercase text-slate-400">Search Radius Proximity</span>
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-indigo-650"
            />
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">{radius} km</span>
          </div>
        </div>
      </div>

      {/* Events Grid layout */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-72 w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-skeleton" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const hasLimit = evt.rsvp_limit !== null;
            const spotsLeft = hasLimit ? evt.rsvp_limit - evt.rsvp_count : null;
            const rsvpStatus = evt.user_rsvp_status;

            return (
              <GlassCard key={evt.id} className="overflow-hidden flex flex-col justify-between h-[380px] border-slate-100/50 group">
                <div>
                  {/* Cover Image banner */}
                  <div className="h-36 w-full relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img src={evt.cover_image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 text-[8px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                      📅 {new Date(evt.event_time).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col gap-2">
                    <h4 className="text-sm font-extrabold text-slate-850 dark:text-white line-clamp-1">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                    <div className="flex flex-col gap-1.5 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{evt.location_name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span>{evt.rsvp_count} Neighbors Attending</span>
                        {hasLimit && (
                          <span className="text-indigo-500">({spotsLeft} Spots left)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RSVP Controls footer */}
                <div className="px-5 pb-5 border-t border-slate-50 dark:border-slate-850 pt-4 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900 p-1 rounded-xl w-full">
                    {['going', 'maybe', 'not_going'].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleRSVP(evt.id, st)}
                        className={`rounded-lg px-2 py-1.5 text-[8px] font-extrabold uppercase tracking-wide flex-1 text-center transition-all duration-300 ${
                          rsvpStatus === st
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-md shadow-indigo-500/15'
                            : 'text-slate-455 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-slate-205 rounded-3xl dark:border-slate-800 bg-white/20">
          <span className="text-3xl">📅</span>
          <h3 className="font-bold text-sm mt-3">No meetups found nearby</h3>
          <p className="text-xs text-slate-405 mt-1">
            Try adjusting your location search range circle or coordinate details.
          </p>
        </div>
      )}

    </div>
  );
};
