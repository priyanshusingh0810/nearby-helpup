import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Home, 
  AlertTriangle, 
  MessageSquare, 
  User as UserIcon, 
  ShieldAlert, 
  LogOut, 
  Sun, 
  Moon, 
  Activity,
  Users,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Local Events', path: '/events', icon: Calendar },
    { name: 'Emergency', path: '/emergency', icon: AlertTriangle, badge: 'Active' },
    { name: 'Chat Room', path: '/chat', icon: MessageSquare },
    { name: 'My Profile', path: `/profile/${user?.id || ''}`, icon: UserIcon },
  ];

  const isAdmin = user?.username.toLowerCase() === 'admin' || user?.id === 1;

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200/60 bg-white/60 glass-panel p-6 dark:border-slate-800/50 dark:bg-slate-950/60 md:flex md:flex-col justify-between z-30"
    >
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20 group">
            🤝
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-70" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-sans">
              HelpUp
            </h1>
            <p className="text-[10px] uppercase font-semibold text-gradient-brand tracking-wider">
              Hyperlocal Assist
            </p>
          </div>
        </motion.div>

        {/* Navigation Items */}
        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-1 relative"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <motion.div key={item.name} variants={itemVariants}>
                <Link
                  to={item.path}
                  className={`group relative flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 z-10 ${
                    active
                      ? 'text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {/* Animated Active Background */}
                  {active && (
                    <motion.div
                      layoutId="activeSidebarTab"
                      className="absolute inset-0 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-800/30 shadow-sm z-0"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  {/* Active indicator bar */}
                  {active && (
                    <motion.div 
                      layoutId="activeSidebarIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/30 z-10" 
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                    <span>{item.name}</span>
                  </div>
                  
                  {item.badge && (
                    <span className="relative z-10 rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-500 dark:bg-rose-950/40 dark:text-rose-400 uppercase tracking-wide shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}

          {isAdmin && (
            <motion.div variants={itemVariants}>
              <Link
                to="/admin"
                className={`group relative mt-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive('/admin')
                    ? 'bg-rose-50/80 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                    : 'text-slate-500 hover:bg-slate-50/80 dark:text-slate-400 dark:hover:bg-slate-900/40'
                }`}
              >
                {isActive('/admin') && (
                  <motion.div 
                    layoutId="activeSidebarIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" 
                  />
                )}
                <ShieldAlert className="h-[18px] w-[18px] text-rose-500" />
                <span>Admin Center</span>
              </Link>
            </motion.div>
          )}
        </motion.nav>
      </div>

      {/* User Information & Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4"
      >
        {/* User Card */}
        {user && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-200 hover:border-indigo-200/60 dark:hover:border-indigo-800/50 shadow-sm"
          >
            <div className="relative">
              <img
                src={user.profile_photo}
                alt={user.name}
                className="h-10 w-10 rounded-lg object-cover ring-2 ring-white/50 dark:ring-slate-800/50 shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm shadow-emerald-500/40" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                {user.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Activity className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Trust: {Math.round(user.trust_score)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-4 gap-2">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors shadow-sm"
            title="Toggle Theme"
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 228, 230, 0.8)' }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-200/60 bg-white/50 text-rose-500 dark:border-rose-900/50 dark:bg-rose-950/20 dark:hover:bg-rose-900/40 px-3 py-2 text-xs font-semibold transition-colors shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.aside>
  );
};
