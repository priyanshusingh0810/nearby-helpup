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
    <div className="fixed bottom-22 right-6 z-40 hidden sm:block">
      <Link
        to="/create-listing"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#19A974] hover:bg-[#158f62] text-white shadow-lg shadow-[#19A974]/30 hover:scale-105 transition-all duration-200 border-2 border-white/60 dark:border-slate-800"
        title="Post New Assistance or Request"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};
