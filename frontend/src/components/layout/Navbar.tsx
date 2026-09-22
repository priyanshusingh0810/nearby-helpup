import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, MapPin, Search, Menu, X, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

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

  const popoverVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/60 px-6 glass-nav dark:border-slate-800/40 dark:bg-slate-950/60"
    >
      {/* Mobile Menu & Brand Search */}
      <div className="flex items-center gap-4 flex-1 md:flex-initial">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMobileMenuToggle}
          className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100/80 md:hidden dark:text-slate-400 dark:hover:bg-slate-900/50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <form onSubmit={handleSearchSubmit} className="relative hidden max-w-md w-72 md:block">
          <Search className="absolute left-3.5 top-[11px] h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items, borrow requests, services..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="h-9 w-full rounded-xl bg-slate-50/60 backdrop-blur-md pl-10 pr-4 text-xs outline-none border border-slate-200/50 focus:border-indigo-400 focus:bg-white/80 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900/50 dark:border-slate-800/60 dark:text-white dark:focus:bg-slate-900/80 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
          />
        </form>
      </div>

      {/* Quick Info & User Triggers */}
      <div className="flex items-center gap-4">
        {/* Location Display */}
        {user && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowLocationMenu(!showLocationMenu);
                if (showNotifications) setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200/50 hover:border-indigo-300/60 bg-white/40 hover:bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-700/50 shadow-sm"
              title="Set Location Profile"
            >
              <MapPin className="h-3.5 w-3.5 text-indigo-500" />
              <span className="max-w-[120px] md:max-w-[200px] truncate">
                {user.location_name || 'Set Location'}
              </span>
            </motion.button>
            
            <AnimatePresence>
              {showLocationMenu && (
                <motion.div 
                  variants={popoverVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-2xl p-3 shadow-2xl shadow-slate-200/40 dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-black/40 z-50 flex flex-col gap-1.5"
                >
                  <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2.5 py-1">Set Location Circle</h4>
                  
                  <motion.button
                    whileHover={{ x: 4, backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                    type="button"
                    onClick={handleUseBrowserGPS}
                    disabled={locLoading}
                    className="flex items-center gap-2 rounded-xl p-2.5 text-xs text-left font-semibold text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60 w-full transition-colors disabled:opacity-50"
                  >
                    <span>🌐</span>
                    <span className="flex-1">{locLoading ? "Detecting GPS..." : "Use Browser GPS"}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 4, backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                    type="button"
                    onClick={() => {
                      handleSimulateLocationChange();
                      setShowLocationMenu(false);
                    }}
                    className="flex items-center gap-2 rounded-xl p-2.5 text-xs text-left font-semibold text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60 w-full transition-colors"
                  >
                    <span>📍</span>
                    <span className="flex-1">Simulate DTU Location</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showLocationMenu) setShowLocationMenu(false);
            }}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100/80 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            <Bell className="h-[18px] w-[18px]" />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[8px] font-bold text-white shadow-sm shadow-rose-500/40"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                variants={popoverVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-2xl p-4 shadow-2xl shadow-slate-200/40 dark:border-slate-700/50 dark:bg-slate-900/80 dark:shadow-black/40 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-3 max-h-72 overflow-y-auto scrollbar-none">
                  {notifications.length > 0 ? (
                    notifications.map((n, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={n.id}
                      >
                        <Link
                          to={n.link_to}
                          onClick={() => handleNotificationClick(n.id)}
                          className={`flex flex-col rounded-xl p-3 transition-all duration-200 text-xs ${
                            n.is_read 
                              ? 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/40' 
                              : 'bg-indigo-50/60 text-slate-800 font-medium dark:bg-indigo-900/30 dark:text-slate-200 hover:bg-indigo-100/60 dark:hover:bg-indigo-800/40 border border-indigo-100/50 dark:border-indigo-800/30'
                          }`}
                        >
                          <span className="font-bold text-slate-800 dark:text-white">
                            {n.title}
                          </span>
                          <span className="mt-1 text-[11px] leading-relaxed opacity-90">
                            {n.content}
                          </span>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-slate-400 py-8 flex flex-col items-center gap-2">
                      <span className="text-2xl">✨</span>
                      <span>All caught up!</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

