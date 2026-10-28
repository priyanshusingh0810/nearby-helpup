import React, { useState } from 'react';
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
  Calendar,
  Sparkles,
  Zap,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SaaSUpgradeModal } from '../common/SaaSUpgradeModal';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentPlan = localStorage.getItem('helpup_plan_tier') || 'Free Neighbor';
  const isPro = currentPlan.includes('Pro');

  const mainMenuItems = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Local Events', path: '/events', icon: Calendar },
    { name: 'Emergency Mesh', path: '/emergency', icon: AlertTriangle, badge: 'Live' },
  ];

  const collabMenuItems = [
    { name: 'Chat Room', path: '/chat', icon: MessageSquare },
    { name: 'My Profile', path: `/profile/${user?.id || ''}`, icon: UserIcon },
  ];

  const isAdmin = user?.username?.toLowerCase() === 'admin' || user?.id === 1;

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 24 } }
  };

  return (
    <>
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200/80 bg-white/80 glass-panel p-5 dark:border-slate-800/80 dark:bg-slate-950/80 md:flex md:flex-col justify-between z-30 overflow-y-auto"
      >
        <div className="flex flex-col gap-6">
          {/* Brand Logo & SaaS Workspace Pill */}
          <div className="flex flex-col gap-2.5">
            <Link to="/home" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white font-extrabold shadow-md shadow-indigo-500/25">
                🤝
                <div className="absolute inset-0 rounded-xl bg-indigo-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                    Nearby HelpUp
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                    SaaS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
                  Hyperlocal Sharing OS
                </span>
              </div>
            </Link>

            {/* Active Workspace Node */}
            <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {user?.location_name ? user.location_name.split(',')[0] : 'Downtown Rohini'}
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                5km Mesh
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="flex flex-col gap-5">
            {/* Group 1: Core Platform */}
            <div className="flex flex-col gap-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Platform
              </span>
              <motion.nav variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-1">
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Link
                        to={item.path}
                        className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 z-10 ${
                          active
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.nav>
            </div>

            {/* Group 2: Collaboration */}
            <div className="flex flex-col gap-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Collaboration
              </span>
              <div className="flex flex-col gap-1">
                {collabMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                        active
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 mt-1 ${
                      isActive('/admin')
                        ? 'bg-rose-50/80 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    <span>Admin Console</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area: SaaS Quota Card & User Profile */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-200/70 dark:border-slate-800/70">
          {/* SaaS Quota / Plan Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>{currentPlan}</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                {isPro ? 'Unlimited' : '8/10 Borrows'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: isPro ? '100%' : '80%' }}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="mt-0.5 w-full py-1.5 px-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/25"
            >
              <span>{isPro ? 'Manage Membership' : 'Upgrade to Pro'}</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
              <Link to={`/profile/${user.id}`} className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <img
                    src={user.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.name}
                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-2.5 w-2.5 text-indigo-500" />
                    <span>Score: {Math.round(user.trust_score || 85)}</span>
                  </span>
                </div>
              </Link>

              {/* Theme & Signout Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Toggle Dark/Light"
                >
                  {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* SaaS Upgrade Modal */}
      <SaaSUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
};
