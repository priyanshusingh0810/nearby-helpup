import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  Trash2, 
  UserCheck, 
  BarChart, 
  AlertTriangle,
  Flame,
  CheckCircle,
  FileText
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const AdminDashboard: React.FC = () => {
  // States
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('verification'); // 'verification' or 'listings'

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Load general stats
      const st = await api.admin.getStats();
      setStats(st);

      // 2. Load users list
      const usrList = await api.admin.getUsers();
      setUsers(usrList);

      // 3. Load all active listings
      const list = await api.listings.getAll();
      setListings(list);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerify = async (userId: number) => {
    try {
      await api.admin.verifyUser(userId);
      alert('User identity status verified successfully!');
      loadAdminData();
    } catch (err) {
      alert('Failed to verify user');
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    if (window.confirm('Are you sure you want to delete this listing from the database?')) {
      try {
        await api.admin.deleteListing(listingId);
        alert('Listing deleted successfully.');
        loadAdminData();
      } catch (err) {
        alert('Failed to delete listing');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingVerificationUsers = users.filter(u => !u.identity_verified);
  const verifiedUsers = users.filter(u => u.identity_verified);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Header Banner */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Admin Control Center
        </h2>
        <p className="text-xs text-slate-550 dark:text-slate-400 mt-1">
          Monitor platform metrics, manage user verification requests, and review flagged listing items.
        </p>
      </div>

      {/* Analytics Summary widgets */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="p-4 flex items-center gap-3.5 border-slate-100/50" hoverEffect={false}>
            <div className="p-2 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-indigo-950/20 rounded-xl text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Users Registered</span>
              <h3 className="text-base font-extrabold mt-0.5">{stats.total_users || users.length}</h3>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-3.5 border-slate-100/50" hoverEffect={false}>
            <div className="p-2 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-950/20 rounded-xl text-emerald-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Active Listings</span>
              <h3 className="text-base font-extrabold mt-0.5">{stats.total_listings || listings.length}</h3>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-3.5 border-slate-100/50" hoverEffect={false}>
            <div className="p-2 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-950/20 rounded-xl text-amber-600">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Volunteering Services</span>
              <h3 className="text-base font-extrabold mt-0.5">{stats.total_services || 5}</h3>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-3.5 border-slate-100/50" hoverEffect={false}>
            <div className="p-2 bg-rose-50 dark:bg-rose-955/25 rounded-xl text-rose-500">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Emergencies Open</span>
              <h3 className="text-base font-extrabold mt-0.5">
                {listings.filter(l => l.is_emergency).length}
              </h3>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setTab('verification')}
          className={`px-4 py-2.5 text-xs font-bold transition-all duration-300 border-b-2 ${
            tab === 'verification'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          ID Verification Queue ({pendingVerificationUsers.length})
        </button>
        <button
          onClick={() => setTab('listings')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            tab === 'listings'
              ? 'border-indigo-600 text-indigo-655 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-655'
          }`}
        >
          Resource Listing Moderation ({listings.length})
        </button>
      </div>

      {/* Verification Queue Panel */}
      {tab === 'verification' && (
        <div className="flex flex-col gap-4">
          {pendingVerificationUsers.length > 0 ? (
            pendingVerificationUsers.map((u) => (
              <GlassCard key={u.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-slate-100/50" hoverEffect={false}>
                <div className="flex items-center gap-3.5">
                  <img src={u.profile_photo} alt="" className="h-11 w-11 rounded-lg object-cover bg-slate-50" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white">{u.name}</h4>
                    <p className="text-[9px] text-slate-400">@{u.username} • {u.email}</p>
                    {u.college && (
                      <span className="text-[9px] bg-slate-100 text-slate-550 dark:bg-slate-900 dark:text-slate-350 px-2 py-0.5 rounded font-semibold mt-1 inline-block">
                        {u.college}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3.5 self-stretch md:self-auto shrink-0 justify-end">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded">
                    <FileText className="h-4 w-4" />
                    <span>ID_Affiliation.png</span>
                  </div>
                  <button
                    onClick={() => handleVerify(u.id)}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-[10px] px-4 py-2.5 transition-all duration-300 shadow-lg shadow-indigo-500/20"
                  >
                    Approve Verification
                  </button>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-205 rounded-3xl dark:border-slate-800 bg-white/20">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-sm">All users verified</h3>
              <p className="text-xs text-slate-455 mt-1">Pending identity verification queues are currently empty.</p>
            </div>
          )}
        </div>
      )}

      {/* Listing Moderation Panel */}
      {tab === 'listings' && (
        <div className="flex flex-col gap-4">
          {listings.length > 0 ? (
            listings.map((item) => (
              <GlassCard key={item.id} className="p-4 flex justify-between items-center gap-4 border-slate-105" hoverEffect={false}>
                <div className="flex items-center gap-3.5 min-w-0">
                  <img src={item.images.split(';')[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-50 shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-855 dark:text-white truncate">{item.title}</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">Category: {item.category} • Posted by: {item.owner.name}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteListing(item.id)}
                  className="rounded-xl bg-rose-50 hover:bg-gradient-to-r hover:from-rose-500 hover:to-rose-600 text-rose-500 hover:text-white text-[10px] font-bold p-2.5 transition-all duration-300 shrink-0"
                  title="Delete Listing"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </GlassCard>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-205 rounded-3xl bg-white/20">
              <h3 className="font-bold text-sm">No active listings posted</h3>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
