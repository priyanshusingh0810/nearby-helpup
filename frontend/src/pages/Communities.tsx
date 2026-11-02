import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  X,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';

export const Communities: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Create community modal state
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Sports');
  const [newCover, setNewCover] = useState('');
  const [newRules, setNewRules] = useState('Be respectful and helpful to your neighbors.');
  const [modalError, setModalError] = useState('');

  const categories = [
    { name: 'Running Club', emoji: '🏃' },
    { name: 'Chess', emoji: '♟️' },
    { name: 'Cycling', emoji: '🚴' },
    { name: 'Yoga', emoji: '🧘' },
    { name: 'Startup', emoji: '🚀' },
    { name: 'AI & Tech', emoji: '🤖' },
    { name: 'Books', emoji: '📚' },
    { name: 'Gaming', emoji: '🎮' },
    { name: 'NGO & Relief', emoji: '🤝' },
    { name: 'Coding', emoji: '💻' }
  ];

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const data = await api.communities.getAll({
        category: selectedCategory || undefined,
        search: searchQuery || undefined
      });
      setCommunities(data);
    } catch (err) {
      console.error('Failed to load communities', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [selectedCategory, searchQuery]);

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!newName.trim() || !newDesc.trim()) {
      setModalError('Please enter a name and description.');
      return;
    }

    try {
      await api.communities.create({
        name: newName,
        description: newDesc,
        category: newCategory,
        cover_image: newCover || undefined,
        rules: newRules
      });
      
      setNewName('');
      setNewDesc('');
      setNewCover('');
      setNewRules('Be respectful and helpful to your neighbors.');
      setShowModal(false);
      fetchCommunities();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create community');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Create Community Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/50 backdrop-blur-sm p-4 animate-fade-in">
          <GlassCard className="max-w-md w-full p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-xl border-[#E2E8F0]" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-[#102A43] dark:text-white flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#38BDF8]" />
                <span>Establish Local Circle</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold border border-rose-100">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCommunity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Community Name</label>
                <input
                  type="text"
                  placeholder="e.g. Oakridge Neighborhood Watch & Help"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  placeholder="Describe your group's purpose, activities, and who should join..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="p-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Rules & Guidelines</label>
                <textarea
                  placeholder="Rules for respectful coordination..."
                  value={newRules}
                  onChange={(e) => setNewRules(e.target.value)}
                  rows={2}
                  className="p-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 h-10 w-full bg-[#19A974] hover:bg-[#158f62] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Launch Community Circle
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#102A43] dark:text-white">
              Local Communities & Circles
            </h1>
            <span className="rounded-full bg-[#19A974]/10 text-[#19A974] px-2.5 py-0.5 text-[10px] font-bold">
              {communities.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover and join localized volunteer circles, interest clubs, neighborhood watch, and mutual aid spaces.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#19A974] hover:bg-[#158f62] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Form New Community</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search communities by name, topic, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl bg-white dark:bg-[#1E293B] pl-10 pr-4 text-xs outline-none border border-[#E2E8F0] dark:border-[#334155] focus:border-[#19A974] shadow-xs text-[#1E293B] dark:text-white"
          />
        </div>

        {/* Scrollable Categories List */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? 'bg-[#102A43] text-white shadow-xs'
                : 'bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            All Groups
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`rounded-xl px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === c.name
                  ? 'bg-[#102A43] text-white shadow-xs'
                  : 'bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Feed */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-72 w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-[#E2E8F0] animate-skeleton" />
          ))}
        </div>
      ) : communities.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {communities.map((c) => (
            <div 
              key={c.id} 
              className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
            >
              <div>
                {/* Cover Image */}
                <div className="h-36 w-full relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={c.cover_image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600'}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {c.is_verified && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#19A974] px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified Circle</span>
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-[#102A43]/85 text-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    {c.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-[#102A43] dark:text-white line-clamp-1 group-hover:text-[#19A974] transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              {/* Footer info & CTA */}
              <div className="px-5 pb-5 flex items-center justify-between border-t border-[#E2E8F0] dark:border-slate-800 pt-4">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Users className="h-4 w-4 text-[#38BDF8]" />
                  <span className="text-[11px] font-medium">Active Members</span>
                </div>
                <Link
                  to={`/communities/${c.id}`}
                  className="rounded-xl bg-[#102A43] hover:bg-[#102A43]/90 text-white font-semibold text-xs px-4 py-2 transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>Enter Space</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[#E2E8F0] rounded-2xl dark:border-slate-800 bg-white dark:bg-[#1E293B]">
          <div className="h-12 w-12 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mx-auto mb-3">
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-sm text-[#102A43] dark:text-white">No communities found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or be the first to launch a local circle for this category in your neighborhood!
          </p>
        </div>
      )}

    </div>
  );
};
