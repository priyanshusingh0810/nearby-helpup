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

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200/60 bg-white/80 backdrop-blur-xl p-6 dark:border-slate-800/50 dark:bg-slate-950/90 md:flex md:flex-col justify-between z-30 transition-all duration-300">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
            🤝
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-600 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-50" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white font-sans">
              HelpUp
            </h1>
            <p className="text-[10px] uppercase font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-wider">
              Hyperlocal Assist
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/40 text-indigo-600 dark:from-indigo-950/40 dark:to-purple-950/20 dark:text-indigo-400'
                    : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-900/40 dark:hover:text-slate-300'
                }`}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 shadow-sm shadow-indigo-500/30" />
                )}
                <div className="flex items-center gap-3">
                  <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${active ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-500 dark:bg-rose-950/30 dark:text-rose-400 uppercase tracking-wide emergency-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-rose-50/80 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                  : 'text-slate-500 hover:bg-slate-50/80 dark:text-slate-400 dark:hover:bg-slate-900/40'
              }`}
            >
              {isActive('/admin') && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-gradient-to-b from-rose-500 to-pink-500" />
              )}
              <ShieldAlert className="h-[18px] w-[18px] text-rose-500" />
              <span>Admin Center</span>
            </Link>
          )}
        </nav>
      </div>

      {/* User Information & Settings */}
      <div className="flex flex-col gap-4">
        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-100/80 dark:border-slate-800/50 p-3 bg-gradient-to-r from-slate-50/50 to-indigo-50/20 dark:from-slate-900/30 dark:to-indigo-950/10 transition-all duration-200 hover:border-indigo-100/50 dark:hover:border-indigo-900/30">
            <div className="relative">
              <img
                src={user.profile_photo}
                alt={user.name}
                className="h-10 w-10 rounded-lg object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
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
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between border-t border-slate-100/80 dark:border-slate-800/50 pt-4 gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-200"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          
          <button
            onClick={logout}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100/60 hover:bg-rose-50/80 text-rose-500 dark:border-rose-950/30 dark:hover:bg-rose-950/20 px-3 py-2 text-xs font-semibold transition-all duration-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
