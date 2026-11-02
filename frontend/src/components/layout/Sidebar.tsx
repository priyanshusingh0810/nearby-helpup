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
  Users,
  Calendar,
  Heart,
  ChevronRight,
  ShieldCheck,
  Scale,
  Compass,
  Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SaaSUpgradeModal } from '../common/SaaSUpgradeModal';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const currentRole = localStorage.getItem('helpup_community_role') || 'Verified Helper';

  const mainMenuItems = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Local Events', path: '/events', icon: Calendar },
    { name: 'Emergency SOS', path: '/emergency', icon: AlertTriangle, badge: 'Live' },
  ];

  const collabMenuItems = [
    { name: 'Messages & Chat', path: '/chat', icon: MessageSquare },
    { name: 'My Profile', path: `/profile/${user?.id || ''}`, icon: UserIcon },
    { name: 'Community Terms', path: '/terms', icon: Scale },
  ];

  const isAdmin = user?.username?.toLowerCase() === 'admin' || user?.id === 1;

  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/home' && location.pathname.startsWith(path));
  };

  return (
    <>
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed left-0 top-0 hidden min-h-[100dvh] h-[100dvh] w-64 border-r border-[#1A365D] bg-[#102A43] p-5 md:flex md:flex-col justify-between z-30 overflow-y-auto text-white shadow-lg"
      >
        <div className="flex flex-col gap-6">
          {/* Brand Logo Header */}
          <div className="flex flex-col gap-2.5">
            <Link to="/home" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#19A974] text-white font-extrabold shadow-md shadow-[#19A974]/30 transition-transform group-hover:scale-105">
                <Heart className="h-5 w-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-white">
                    Nearby HelpUp
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#19A974]/20 text-[#19A974] border border-[#19A974]/40">
                    Pro
                  </span>
                </div>
                <span className="text-[11px] text-[#9FB3C8] font-medium tracking-tight">
                  Mutual Aid & Sharing
                </span>
              </div>
            </Link>

            {/* Active Neighborhood Node */}
            <div className="p-2.5 rounded-xl bg-[#1A365D]/80 border border-[#38BDF8]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]" />
                </span>
                <span className="text-[11px] font-medium text-[#F0F4F8] truncate">
                  {user?.location_name ? user.location_name.split(',')[0] : 'DTU Campus, Rohini'}
                </span>
              </div>
              <span className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/30 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                5km Radius
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="flex flex-col gap-5">
            {/* Core Assistance */}
            <div className="flex flex-col gap-1">
              <span className="px-3 text-[10px] font-bold text-[#829AB1] uppercase tracking-wider mb-1">
                Platform
              </span>
              <nav className="flex flex-col gap-1">
                {mainMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                        active
                          ? 'text-white bg-[#19A974] shadow-sm shadow-[#19A974]/30'
                          : 'text-[#D9E2EC] hover:text-white hover:bg-[#1A365D]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-[#9FB3C8] group-hover:text-white'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-[#EF4444] text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Collaboration & Community */}
            <div className="flex flex-col gap-1">
              <span className="px-3 text-[10px] font-bold text-[#829AB1] uppercase tracking-wider mb-1">
                Community
              </span>
              <div className="flex flex-col gap-1">
                {collabMenuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                        active
                          ? 'text-white bg-[#19A974] shadow-sm shadow-[#19A974]/30'
                          : 'text-[#D9E2EC] hover:text-white hover:bg-[#1A365D]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-[#9FB3C8] group-hover:text-white'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`group relative flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 mt-1 ${
                      isActive('/admin')
                        ? 'bg-[#EF4444] text-white'
                        : 'text-[#D9E2EC] hover:text-white hover:bg-[#1A365D]'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4 text-[#EF4444] group-hover:text-white" />
                    <span>Admin Safety Panel</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area: Community Impact Card & User Profile */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#1A365D]">
          {/* Community Standing Card */}
          <div className="p-3.5 rounded-xl bg-[#1A365D]/70 border border-[#243E63] flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#19A974] flex items-center gap-1">
                <Heart className="h-3 w-3 fill-[#19A974]" />
                <span>100% Free Mutual Aid</span>
              </span>
              <span className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#D9E2EC]">
              <span className="font-medium text-[11px] truncate">{currentRole}</span>
              <span className="text-[10px] font-bold text-[#19A974]">Level 3</span>
            </div>

            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="mt-0.5 w-full py-1.5 px-2 rounded-lg bg-[#19A974] hover:bg-[#148A5E] text-white font-semibold text-[11px] transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Community Charter</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A365D]/90 border border-[#243E63]">
              <Link to={`/profile/${user.id}`} className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <img
                    src={user.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-[#19A974]"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#19A974] border-2 border-[#102A43]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#9FB3C8] font-medium flex items-center gap-1">
                    <ShieldCheck className="h-2.5 w-2.5 text-[#19A974]" />
                    <span>Trust: {Math.round(user.trust_score || 95)}%</span>
                  </span>
                </div>
              </Link>

              {/* Theme & Signout */}
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg text-[#9FB3C8] hover:text-white hover:bg-[#243E63] transition-colors"
                  title="Toggle Light/Dark Theme"
                >
                  {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-[#9FB3C8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      <SaaSUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </>
  );
};
