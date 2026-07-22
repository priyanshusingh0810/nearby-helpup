import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, MapPin, Search, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onMobileMenuToggle }) => {
  const { user, updateUserCoords } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.getAll();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // refresh every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNotificationClick = async (id: number) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
    setShowNotifications(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    } else {
      navigate(`/home?search=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleSimulateLocationChange = () => {
    // DTU coords standard: 28.7501, 77.1177. Let's toggle slightly
    const randomOffsetLat = (Math.random() - 0.5) * 0.01;
    const randomOffsetLon = (Math.random() - 0.5) * 0.01;
    const newLat = 28.7501 + randomOffsetLat;
    const newLon = 77.1177 + randomOffsetLon;
    const locationNames = [
      'Bawana Road, Rohini',
      'DTU Main Library, Rohini',
      'Sector 16 Market, Rohini',
      'DTU Hostels, New Delhi'
    ];
    const randomName = locationNames[Math.floor(Math.random() * locationNames.length)];
    updateUserCoords(newLat, newLon, randomName);
  };

  const handleUseBrowserGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          );
          const data = await response.json();
          const address = data.address;
          const road = address.road || address.suburb || address.neighbourhood || '';
          const city = address.city || address.town || address.village || '';
          const name = [road, city].filter(Boolean).join(', ') || data.display_name || 'My Location';
          
          await updateUserCoords(latitude, longitude, name);
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          await updateUserCoords(latitude, longitude, "My Geolocation");
        } finally {
          setLocLoading(false);
          setShowLocationMenu(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        alert(`Failed to fetch location: ${error.message}`);
        setLocLoading(false);
        setShowLocationMenu(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAllRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/75 px-6 backdrop-blur-2xl backdrop-saturate-[180%] dark:border-slate-800/40 dark:bg-slate-950/75 transition-all duration-300">
      {/* Mobile Menu & Brand Search */}
      <div className="flex items-center gap-4 flex-1 md:flex-initial">
        <button
          onClick={onMobileMenuToggle}
          className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100/80 md:hidden dark:text-slate-400 dark:hover:bg-slate-900/50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative hidden max-w-md w-72 md:block">
          <Search className="absolute left-3.5 top-[11px] h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items, borrow requests, services..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="h-9 w-full rounded-xl bg-slate-50/80 pl-10 pr-4 text-xs outline-none border border-slate-200/50 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 dark:bg-slate-900/50 dark:border-slate-800/50 dark:text-white dark:focus:bg-slate-900 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/5 transition-all duration-200"
          />
        </form>
      </div>

      {/* Quick Info & User Triggers */}
      <div className="flex items-center gap-3">
        {/* Location Display */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/50 hover:border-indigo-200/50 hover:bg-indigo-50/30 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 dark:border-slate-800/50 dark:text-slate-400 dark:hover:bg-indigo-950/20 dark:hover:border-indigo-800/30"
              title="Set Location Profile"
            >
              <MapPin className="h-3.5 w-3.5 text-indigo-500" />
              <span className="max-w-[120px] md:max-w-[200px] truncate">
                {user.location_name || 'Set Location'}
              </span>
            </button>
            
            {showLocationMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-xl p-3 shadow-xl shadow-slate-200/20 dark:border-slate-800/50 dark:bg-slate-900/95 dark:shadow-black/20 z-50 flex flex-col gap-1.5 animate-scale-in">
                <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2.5 py-1">Set Location Circle</h4>
                
                <button
                  type="button"
                  onClick={handleUseBrowserGPS}
                  disabled={locLoading}
                  className="flex items-center gap-2 rounded-xl p-2.5 text-xs text-left font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40 w-full transition-all disabled:opacity-50"
                >
                  <span>🌐</span>
                  <span className="flex-1">{locLoading ? "Detecting GPS..." : "Use Browser GPS"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSimulateLocationChange();
                    setShowLocationMenu(false);
                  }}
                  className="flex items-center gap-2 rounded-xl p-2.5 text-xs text-left font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/40 w-full transition-all"
                >
                  <span>📍</span>
                  <span className="flex-1">Simulate DTU Location</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50/80 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-300 transition-all duration-200"
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[8px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-scale-in">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-xl p-4 shadow-xl shadow-slate-200/20 dark:border-slate-800/50 dark:bg-slate-900/95 dark:shadow-black/20 z-50 animate-scale-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100/80 dark:border-slate-800/50">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2 py-3 max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <Link
                      key={n.id}
                      to={n.link_to}
                      onClick={() => handleNotificationClick(n.id)}
                      className={`flex flex-col rounded-xl p-2.5 transition-all duration-200 text-xs ${
                        n.is_read 
                          ? 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-800/20' 
                          : 'bg-indigo-50/40 text-slate-800 font-medium dark:bg-indigo-950/20 dark:text-slate-300 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30'
                      }`}
                    >
                      <span className="font-bold text-slate-700 dark:text-white">
                        {n.title}
                      </span>
                      <span className="mt-0.5 text-[11px] leading-relaxed">
                        {n.content}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="text-center text-xs text-slate-400 py-6">
                    All caught up!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
