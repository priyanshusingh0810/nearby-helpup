import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { 
  Users, 
  Activity, 
  Trash2, 
  UserCheck, 
  AlertTriangle,
  Flame,
  CheckCircle,
  FileText,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('verification');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const st = await api.admin.getStats();
      setStats(st);

      const usrList = await api.admin.getUsers();
      setUsers(usrList);

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
    if (window.confirm('Are you sure you want to remove this listing from the platform?')) {
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
        <div className="h-10 w-10 border-4 border-[#102A43] border-t-[#19A974] rounded-full animate-spin" />
      </div>
    );
  }

  const pendingVerificationUsers = users.filter(u => !u.identity_verified);
  const verifiedUsers = users.filter(u => u.identity_verified);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl mx-auto flex flex-col gap-5 sm:gap-6 md:gap-8 pb-20 w-full">
      
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102A43] dark:text-white">
            Admin Governance Center
          </h1>
          <span className="rounded-full bg-[#102A43] text-white px-2.5 py-0.5 text-[10px] font-bold">
            Platform Ops
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor community trust health, review ID credentials, verify neighbors, and moderate active listings.
        </p>
      </div>

      {/* Analytics Summary widgets */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="p-2.5 bg-[#38BDF8]/10 rounded-xl text-[#38BDF8]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
              <h3 className="text-lg font-bold text-[#102A43] dark:text-white mt-0.5">{stats.total_users || users.length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="p-2.5 bg-[#19A974]/10 rounded-xl text-[#19A974]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Listings</span>
              <h3 className="text-lg font-bold text-[#102A43] dark:text-white mt-0.5">{stats.total_listings || listings.length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="p-2.5 bg-[#102A43]/10 rounded-xl text-[#102A43] dark:text-slate-300">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Help Categories</span>
              <h3 className="text-lg font-bold text-[#102A43] dark:text-white mt-0.5">{stats.total_services || 8}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 flex items-center gap-3.5 shadow-xs">
            <div className="p-2.5 bg-[#EF4444]/10 rounded-xl text-[#EF4444]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Emergencies</span>
              <h3 className="text-lg font-bold text-[#102A43] dark:text-white mt-0.5">
                {listings.filter(l => l.is_emergency).length}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#E2E8F0] dark:border-slate-800 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setTab('verification')}
          className={`pb-3 text-xs font-bold transition-all relative shrink-0 ${
            tab === 'verification'
              ? 'text-[#102A43] dark:text-white'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>ID Verification Queue ({pendingVerificationUsers.length})</span>
          {tab === 'verification' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#19A974]" />
          )}
        </button>
        <button
          onClick={() => setTab('listings')}
          className={`pb-3 text-xs font-bold transition-all relative shrink-0 ${
            tab === 'listings'
              ? 'text-[#102A43] dark:text-white'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>Listing Moderation ({listings.length})</span>
          {tab === 'listings' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#19A974]" />
          )}
        </button>
      </div>

      {/* Verification Queue Panel */}
      {tab === 'verification' && (
        <div className="flex flex-col gap-4">
          {pendingVerificationUsers.length > 0 ? (
            pendingVerificationUsers.map((u) => (
              <div 
                key={u.id} 
                className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img 
                    src={u.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                    alt="" 
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover bg-slate-100 border border-[#E2E8F0] shrink-0" 
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#102A43] dark:text-white truncate">{u.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">@{u.username} • {u.email}</p>
                    {u.college && (
                      <span className="text-[9px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium mt-1 inline-block truncate max-w-full">
                        {u.college}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-stretch sm:self-auto shrink-0 justify-start sm:justify-end">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-200">
                    <FileText className="h-4 w-4" />
                    <span>ID_Affiliation.png</span>
                  </div>
                  <button
                    onClick={() => handleVerify(u.id)}
                    className="rounded-xl bg-[#19A974] hover:bg-[#158f62] text-white font-semibold text-xs px-4 py-2 transition-all shadow-sm flex items-center gap-1"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Approve Verification</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-[#E2E8F0] rounded-2xl dark:border-slate-800 bg-white dark:bg-[#1E293B]">
              <div className="h-10 w-10 rounded-full bg-[#19A974]/10 text-[#19A974] flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[#102A43] dark:text-white">All users verified</h3>
              <p className="text-xs text-slate-500 mt-1">Pending identity verification queues are currently empty.</p>
            </div>
          )}
        </div>
      )}

      {/* Listing Moderation Panel */}
      {tab === 'listings' && (
        <div className="flex flex-col gap-3">
          {listings.length > 0 ? (
            listings.map((item) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 flex justify-between items-center gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img 
                    src={item.images?.split(';')[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=100'} 
                    alt="" 
                    className="h-10 w-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-[#E2E8F0]" 
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#102A43] dark:text-white truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Category: {item.category} • Posted by: {item.owner?.name} • Location: {item.location_name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteListing(item.id)}
                  className="rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-[#EF4444] text-xs font-medium p-2.5 transition-all shrink-0"
                  title="Delete Listing"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-[#E2E8F0] rounded-2xl bg-white dark:bg-[#1E293B]">
              <h3 className="font-bold text-sm text-[#102A43]">No active listings found</h3>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
