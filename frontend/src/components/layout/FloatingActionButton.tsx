import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FloatingActionButton: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || location.pathname === '/create-listing' || location.pathname === '/login') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Ambient glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-lg animate-glow-pulse scale-125" />
      
      <Link
        to="/create-listing"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-110 transition-all duration-300 dark:shadow-indigo-500/15 dark:hover:shadow-indigo-500/25 hover:rotate-90 active:scale-95"
        title="Share or Request Something"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};
