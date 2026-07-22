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
  BookOpen,
  Laptop,
  Flame,
  UserCheck
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
    { name: 'AI', emoji: '🤖' },
    { name: 'Books', emoji: '📚' },
    { name: 'Gaming', emoji: '🎮' },
    { name: 'NGO', emoji: '🤝' },
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
      
      // Reset form
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <GlassCard className="max-w-md w-full p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                <span>Establish Local Community</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-655">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold border border-rose-100">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCommunity} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Community Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rohini Cycling Club"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea
                  placeholder="Discuss goals, schedules and who should join..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="p-3 rounded-lg border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="h-10 px-2 rounded-lg border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://unsplash.com/..."
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Rules & Guidelines</label>
                <textarea
                  placeholder="Rules for member coordination..."
                  value={newRules}
                  onChange={(e) => setNewRules(e.target.value)}
                  rows={2}
                  className="p-3 rounded-lg border border-slate-200 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="mt-2 h-10 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300"
              >
                Launch Community Group
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Local Communities & Circles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover nearby clubs, startup networks, NGOs, and coding circles around you.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-3 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 transition-all duration-300 w-full sm:w-auto hover:-translate-y-[1px]"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Form New Community</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search communities by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-xl bg-white pl-11 pr-4 text-xs outline-none border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-850 dark:text-white shadow-sm"
          />
        </div>

        {/* Scrollable Categories List */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap border transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white border-transparent shadow-md shadow-indigo-500/20'
                : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 hover:border-indigo-200/30 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            }`}
          >
            All Groups 👥
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap border transition-all duration-300 ${
                selectedCategory === c.name
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white border-transparent shadow-md shadow-indigo-500/20'
                  : 'bg-white border-slate-200/50 text-slate-700 hover:bg-slate-50 hover:border-indigo-200/30 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Feed */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-60 w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-skeleton" />
          ))}
        </div>
      ) : communities.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {communities.map((c) => (
            <GlassCard key={c.id} className="overflow-hidden flex flex-col justify-between h-[340px] border-slate-100/50 group">
              <div>
                {/* Cover Image */}
                <div className="h-36 w-full relative bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img
                    src={c.cover_image}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {c.is_verified && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[8px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified</span>
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[8px] font-extrabold text-white uppercase tracking-wider">
                    {c.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-2">
                  <h4 className="text-sm font-extrabold text-slate-850 dark:text-white line-clamp-1">
                    {c.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              {/* Members count & Join/Enter link */}
              <div className="px-5 pb-5 flex items-center justify-between border-t border-slate-50 dark:border-slate-850 pt-4">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Members Active</span>
                </div>
                <Link
                  to={`/communities/${c.id}`}
                  className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-indigo-600 hover:to-purple-500 text-white font-extrabold text-[10px] px-4 py-2 transition-all duration-300 flex items-center gap-1 shadow-sm hover:shadow-md hover:shadow-indigo-500/15"
                >
                  <span>Enter Space</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-3xl dark:border-slate-800 bg-white/20">
          <span className="text-3xl">👥</span>
          <h3 className="font-bold text-sm mt-3">No communities found</h3>
          <p className="text-xs text-slate-405 mt-1">
            Be the first to create a community for this category in your area!
          </p>
        </div>
      )}

    </div>
  );
};
