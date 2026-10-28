import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  MapPin, 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  Package, 
  HelpCircle,
  ChevronDown,
  Command,
  CheckCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { SaaSUpgradeModal } from '../common/SaaSUpgradeModal';

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
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'all' | 'unread'>('all');

  const [notifications, setNotifications] = useState<any[]>([]);

  const currentPlan = localStorage.getItem('helpup_plan_tier') || 'Free Neighbor';
  const isPro = currentPlan.includes('Pro');

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
        const searchInput = document.getElementById('navbar-saas-search');
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

  const popoverVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 350, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      y: 8, 
      scale: 0.96,
      transition: { duration: 0.15 }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 transition-colors">
        {/* Left: Mobile Toggle & SaaS Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onMobileMenuToggle}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Quick Search with ⌘K Badge */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-[11px] h-3.5 w-3.5 text-slate-400" />
            <input
              id="navbar-saas-search"
              type="text"
              placeholder="Search items, skills, emergency requests..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="h-9 w-full rounded-xl bg-slate-100/70 dark:bg-slate-900/60 pl-9 pr-14 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none border border-slate-200/60 dark:border-slate-800/80 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm placeholder:text-slate-400"
            />
            <div className="absolute right-2.5 top-2 flex items-center gap-0.5 pointer-events-none">
              <span className="saas-kbd text-[9px] px-1 py-0.2">⌘K</span>
            </div>
          </form>
        </div>

        {/* Right: Actions, Location Beacon, Plan Badge, Notifications */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* SaaS Membership Badge Button */}
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              isPro
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 hover:bg-indigo-100/60'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isPro ? 'Pro Member' : 'Free Plan'}</span>
          </button>

          {/* Location Radius Beacon */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowLocationMenu(!showLocationMenu);
                  if (showNotifications) setShowNotifications(false);
                  if (showCreateMenu) setShowCreateMenu(false);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 hover:border-indigo-300 dark:hover:border-indigo-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
                <span className="max-w-[100px] sm:max-w-[150px] truncate">
                  {user.location_name ? user.location_name.split(',')[0] : 'Downtown Rohini'}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
              </button>

              <AnimatePresence>
                {showLocationMenu && (
                  <motion.div 
                    variants={popoverVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xl z-50 flex flex-col gap-1.5"
                  >
                    <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Mesh Geographic Node
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleUseBrowserGPS}
                      disabled={locLoading}
                      className="flex items-center gap-2.5 rounded-xl p-2.5 text-xs text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 w-full transition-colors disabled:opacity-50"
                    >
                      <span>🌐</span>
                      <div className="flex flex-col">
                        <span>{locLoading ? "Detecting GPS..." : "Detect Live Browser GPS"}</span>
                        <span className="text-[10px] text-slate-400 font-normal">Real-time coordinates</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSimulateLocationChange();
                        setShowLocationMenu(false);
                      }}
                      className="flex items-center gap-2.5 rounded-xl p-2.5 text-xs text-left font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 w-full transition-colors"
                    >
                      <span>📍</span>
                      <div className="flex flex-col">
                        <span>Switch to Campus Hub</span>
                        <span className="text-[10px] text-slate-400 font-normal">DTU & Rohini Sector 16</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Quick Create Action Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowCreateMenu(!showCreateMenu);
                if (showNotifications) setShowNotifications(false);
                if (showLocationMenu) setShowLocationMenu(false);
              }}
              className="saas-btn-primary !py-1.5 !px-3 !text-xs shadow-md shadow-indigo-600/25"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Post</span>
            </button>

            <AnimatePresence>
              {showCreateMenu && (
                <motion.div
                  variants={popoverVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl z-50 flex flex-col gap-1"
                >
                  <Link
                    to="/create-listing?type=borrow"
                    onClick={() => setShowCreateMenu(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold">Ask to Borrow</div>
                      <div className="text-[10px] text-slate-400 font-normal">Request tools, electronics, books</div>
                    </div>
                  </Link>

                  <Link
                    to="/create-listing?type=lend"
                    onClick={() => setShowCreateMenu(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold">List an Item / Skill</div>
                      <div className="text-[10px] text-slate-400 font-normal">Share resources with neighbors</div>
                    </div>
                  </Link>

                  <Link
                    to="/emergency"
                    onClick={() => setShowCreateMenu(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border-t border-slate-100 dark:border-slate-800 mt-1"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold">Emergency Broadcast</div>
                      <div className="text-[10px] text-rose-400 font-normal">Urgent medicine, power, tools</div>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (showLocationMenu) setShowLocationMenu(false);
                if (showCreateMenu) setShowCreateMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={popoverVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <CheckCheck className="h-3 w-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-2 pt-2.5 pb-2">
                    <button
                      onClick={() => setActiveNotifTab('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        activeNotifTab === 'all'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setActiveNotifTab('unread')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        activeNotifTab === 'unread'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 pt-1 max-h-72 overflow-y-auto scrollbar-none">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((n) => (
                        <Link
                          key={n.id}
                          to={n.link_to || '/home'}
                          onClick={() => handleNotificationClick(n.id)}
                          className={`flex flex-col rounded-xl p-3 text-xs transition-colors ${
                            n.is_read
                              ? 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                              : 'bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-800 dark:text-slate-200 border border-indigo-100 dark:border-indigo-800/40'
                          }`}
                        >
                          <span className="font-bold text-slate-900 dark:text-white">
                            {n.title}
                          </span>
                          <span className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {n.content}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-400 flex flex-col items-center gap-1.5">
                        <span className="text-xl">✨</span>
                        <span>No notifications right now</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* SaaS Upgrade Modal */}
      <SaaSUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
};
