import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  Plus, 
  Sparkles, 
  ChevronDown, 
  CheckCheck,
  Heart,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onMobileMenuToggle }) => {
  const { user, updateUserCoords } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'all' | 'unread'>('all');

  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.getAll();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Global keyboard shortcut for ⌘K / Ctrl+K search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('navbar-search-input');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const filteredNotifications = notifications.filter((n) => {
    if (activeNotifTab === 'unread') return !n.is_read;
    return true;
  });

  const markAllRead = async () => {
    try {
      await api.notifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const [locationSearch, setLocationSearch] = useState('');
  const popularLocations = [
    'Rohini Sector 16, New Delhi',
    'DTU Campus, New Delhi',
    'Indiranagar, Bengaluru',
    'Koramangala, Bengaluru',
    'Bandra West, Mumbai',
    'Andheri East, Mumbai',
    'Hitec City, Hyderabad',
    'Kothrud, Pune'
  ];

  const filteredLocations = popularLocations.filter((loc) =>
    loc.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] px-4 sm:px-6 transition-colors shadow-xs">
      {/* Left: Mobile Menu Toggle & Location Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="rounded-xl p-2 text-[#64748B] hover:text-[#102A43] hover:bg-[#F1F5F9] md:hidden transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Location Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowLocationMenu(!showLocationMenu);
              if (showNotifications) setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-xl border border-[#38BDF8]/40 dark:border-[#38BDF8]/30 bg-[#E0F2FE]/40 dark:bg-[#0C4A6E]/30 hover:border-[#38BDF8] px-3 py-1.5 text-xs font-semibold text-[#0369A1] dark:text-[#38BDF8] transition-all shadow-xs max-w-[170px] sm:max-w-[220px]"
          >
            <MapPin className="h-4 w-4 text-[#38BDF8] shrink-0" />
            <span className="truncate text-left">
              {user?.location_name ? user.location_name.split(',')[0] : 'DTU Campus, Rohini'}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-[#38BDF8]/70 ml-auto shrink-0 transition-transform ${showLocationMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showLocationMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-3.5 shadow-xl z-50 flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    Select Your Neighborhood
                  </span>
                  <button onClick={() => setShowLocationMenu(false)} className="text-[#94A3B8] hover:text-[#1E293B]">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* GPS Detector */}
                <button
                  type="button"
                  onClick={handleUseBrowserGPS}
                  disabled={locLoading}
                  className="flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-semibold text-[#0284C7] dark:text-[#38BDF8] bg-[#E0F2FE] dark:bg-[#0C4A6E]/40 border border-[#38BDF8]/40 hover:bg-[#BAE6FD] w-full transition-colors disabled:opacity-50"
                >
                  <MapPin className="h-4 w-4 text-[#0284C7] dark:text-[#38BDF8] shrink-0" />
                  <div className="flex flex-col text-left">
                    <span>{locLoading ? "Locating you..." : "Detect Current Location"}</span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-normal">Fast auto-detect via GPS</span>
                  </div>
                </button>

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Search city, sector or landmark..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] text-xs text-[#1E293B] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#19A974] focus:outline-none"
                  />
                </div>

                {/* Popular areas */}
                <div className="flex flex-col gap-1 max-h-44 overflow-y-auto">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-1 pt-1">
                    Nearby Hubs
                  </span>
                  {filteredLocations.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        updateUserCoords(28.7501, 77.1177, loc);
                        setShowLocationMenu(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left text-[#64748B] dark:text-[#94A3B8] hover:text-[#102A43] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors"
                    >
                      <MapPin className="h-3 w-3 text-[#94A3B8] shrink-0" />
                      <span className="truncate">{loc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-4 hidden sm:block">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
          <input
            id="navbar-search-input"
            type="text"
            placeholder="Search assistance, items to borrow, skills or volunteers..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="h-10 w-full rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] pl-10 pr-12 text-xs font-medium text-[#1E293B] dark:text-[#F8FAFC] outline-none border border-[#E2E8F0] dark:border-[#334155] focus:border-[#19A974] focus:ring-2 focus:ring-[#19A974]/20 transition-all placeholder:text-[#94A3B8]"
          />
          <div className="absolute right-2.5 top-2.5 flex items-center gap-0.5 pointer-events-none">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E2E8F0] dark:bg-[#334155] text-[#64748B] dark:text-[#94A3B8]">
              ⌘K
            </span>
          </div>
        </form>
      </div>

      {/* Right: Actions, Messages, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#102A43] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-[#102A43]" />}
        </button>

        {/* Chat Shortcut */}
        <Link
          to="/chat"
          className="p-2 rounded-xl text-[#64748B] hover:text-[#102A43] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors relative"
          title="Direct Messages"
        >
          <MessageSquare className="h-5 w-5" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showLocationMenu) setShowLocationMenu(false);
            }}
            className="relative p-2 rounded-xl text-[#64748B] hover:text-[#102A43] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#334155] transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 shadow-xl z-50 text-[#1E293B] dark:text-[#F8FAFC]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#102A43] dark:text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] text-[10px] font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-semibold text-[#19A974] hover:underline flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-2 pt-2.5 pb-2">
                  <button
                    onClick={() => setActiveNotifTab('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeNotifTab === 'all'
                        ? 'bg-[#102A43] text-white'
                        : 'text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setActiveNotifTab('unread')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeNotifTab === 'unread'
                        ? 'bg-[#102A43] text-white'
                        : 'text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                </div>

                <div className="flex flex-col gap-2 pt-1 max-h-72 overflow-y-auto">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n) => (
                      <Link
                        key={n.id}
                        to={n.link_to || '/home'}
                        onClick={() => handleNotificationClick(n.id)}
                        className={`flex flex-col rounded-xl p-3 text-xs transition-colors ${
                          n.is_read
                            ? 'bg-transparent text-[#64748B] hover:bg-[#F8FAFC]'
                            : 'bg-[#F0FDF8] dark:bg-[#19A974]/15 border border-[#19A974]/30 text-[#1E293B]'
                        }`}
                      >
                        <span className="font-bold text-[#102A43] dark:text-white">
                          {n.title}
                        </span>
                        <span className="mt-0.5 text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                          {n.content}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-[#64748B] flex flex-col items-center gap-1.5">
                      <Sparkles className="h-5 w-5 text-[#19A974]" />
                      <span>All caught up! No notifications.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar */}
        {user ? (
          <Link
            to={`/profile/${user.id}`}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#19A974]/50 transition-all"
            title="My Profile"
          >
            <img
              src={user.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Neighbor')}&background=102A43&color=fff`}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-[#E2E8F0]"
            />
          </Link>
        ) : (
          <Link
            to="/login"
            className="text-xs font-semibold text-[#102A43] hover:text-[#19A974] px-3 py-1.5 transition-colors"
          >
            Sign In
          </Link>
        )}

        {/* Primary CTA: Request Help or Share */}
        <Link
          to="/create-listing"
          className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs text-white bg-[#19A974] hover:bg-[#148A5E] transition-all shadow-xs shadow-[#19A974]/25 hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span className="hidden xs:inline">Request Help</span>
          <span className="xs:hidden">Help</span>
        </Link>
      </div>
    </header>
  );
};
