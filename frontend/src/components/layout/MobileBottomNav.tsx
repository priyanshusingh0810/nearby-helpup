import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  AlertTriangle, 
  Plus, 
  MessageSquare, 
  User as UserIcon,
  Users
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#102A43]/95 backdrop-blur-lg border-t border-[#E2E8F0] dark:border-[#1A365D] px-2 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+0.375rem)] shadow-lg transition-colors">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home */}
        <Link
          to="/home"
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1.5 rounded-xl transition-all ${
            isActive('/home')
              ? 'text-[#19A974] font-bold scale-105'
              : 'text-[#64748B] dark:text-[#9FB3C8] hover:text-[#102A43]'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </Link>

        {/* Communities */}
        <Link
          to="/communities"
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1.5 rounded-xl transition-all ${
            isActive('/communities')
              ? 'text-[#19A974] font-bold scale-105'
              : 'text-[#64748B] dark:text-[#9FB3C8] hover:text-[#102A43]'
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Circles</span>
        </Link>

        {/* Center Request Action */}
        <Link
          to="/create-listing"
          className="flex items-center justify-center -mt-6 h-12 w-12 rounded-full bg-[#19A974] text-white shadow-lg shadow-[#19A974]/40 hover:bg-[#148A5E] border-2 border-white dark:border-[#102A43] transition-transform active:scale-90"
          title="Create Assistance Request"
          aria-label="Post request or aid"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </Link>

        {/* Messages */}
        <Link
          to="/chat"
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1.5 rounded-xl transition-all ${
            isActive('/chat')
              ? 'text-[#19A974] font-bold scale-105'
              : 'text-[#64748B] dark:text-[#9FB3C8] hover:text-[#102A43]'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Chat</span>
        </Link>

        {/* Emergency SOS */}
        <Link
          to="/emergency"
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1.5 rounded-xl transition-all ${
            isActive('/emergency')
              ? 'text-[#EF4444] font-bold scale-105'
              : 'text-[#64748B] dark:text-[#9FB3C8] hover:text-[#EF4444]'
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">SOS</span>
        </Link>
      </div>
    </nav>
  );
};
