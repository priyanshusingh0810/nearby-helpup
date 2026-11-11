import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Search, 
  MapPin, 
  Plus, 
  Sparkles, 
  AlertTriangle, 
  Compass, 
  ArrowRight, 
  Users, 
  Calendar, 
  X, 
  Package, 
  Heart, 
  ChevronDown, 
  ShieldCheck, 
  Wrench, 
  Laptop, 
  BookOpen, 
  Home as HomeIcon, 
  Stethoscope, 
  Bike, 
  CheckCircle2, 
  Check, 
  Filter, 
  Layers, 
  MessageSquare,
  Clock,
  Radio,
  SlidersHorizontal,
  ThumbsUp
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { motion, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
  const { user } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamVal = searchParams.get('search') || '';

  // Listings & Filter States
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParamVal);
  const [searchAlternatives, setSearchAlternatives] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [radius, setRadius] = useState<number>(5.0); // km
  const [selectedMapNode, setSelectedMapNode] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);

  // Helper Availability Switch
  const [isAvailableHelper, setIsAvailableHelper] = useState(() => {
    return localStorage.getItem('helpup_helper_status') !== 'false';
  });

  const toggleHelperStatus = () => {
    const nextVal = !isAvailableHelper;
    setIsAvailableHelper(nextVal);
    localStorage.setItem('helpup_helper_status', String(nextVal));
  };

  // Helper tasks state
  const [helperTasks, setHelperTasks] = useState<any[]>([
    { id: 201, title: 'Lend Cordless Drill to Arjun', status: 'In Progress', time: 'Today, 4:00 PM', partner: 'Arjun Verma', distance: '0.4 km' },
    { id: 202, title: 'Share Calculus Textbooks with Priya', status: 'Completed', time: 'Yesterday', partner: 'Priya Mehta', distance: '1.2 km' }
  ]);

  // Favorites
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('helpup_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('helpup_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Categories
  const categoriesList = [
    { name: 'Tools & Equipment', icon: Wrench, count: '48 items' },
    { name: 'Electronics', icon: Laptop, count: '124 items' },
    { name: 'Books & Study', icon: BookOpen, count: '89 items' },
    { name: 'Home & Kitchen', icon: HomeIcon, count: '65 items' },
    { name: 'Medical & Emergency', icon: Stethoscope, count: '32 urgent' },
    { name: 'Vehicles & Rides', icon: Bike, count: '41 items' },
    { name: 'Skill Barter', icon: Users, count: '57 offers' },
    { name: 'Community Care', icon: Heart, count: '76 requests' }
  ];

  const defaultListings = [
    {
      id: 101,
      title: 'Bosch Pro 18V Cordless Hammer Drill & Bit Set',
      description: 'Brushless motor with 30-piece masonry bit set and 2 Li-ion batteries for weekend home DIY.',
      type: 'borrow',
      category: 'Tools & Equipment',
      location_name: 'Indiranagar, Bengaluru',
      images: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      is_emergency: false,
      trust_score: 99,
      owner_name: 'Arjun Verma',
      created_at: new Date().toISOString()
    },
    {
      id: 102,
      title: 'Sony Alpha 4K Video Camera & 3-Axis Gimbal',
      description: 'Motorized gimbal stabilizer for documentary shoots and event video. Ready for 2-day student loan.',
      type: 'borrow',
      category: 'Electronics',
      location_name: 'Koramangala, Bengaluru',
      images: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      is_emergency: false,
      trust_score: 97,
      owner_name: 'Priya Mehta',
      created_at: new Date().toISOString()
    },
    {
      id: 103,
      title: 'Portable Oxygen Concentrator (5L/min Continuous)',
      description: 'Dual AC/DC battery powered respiratory support with nasal cannula kit for elderly or emergencies.',
      type: 'donate',
      category: 'Medical & Emergency',
      location_name: 'Whitefield, Bengaluru',
      images: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      is_emergency: true,
      trust_score: 100,
      owner_name: 'Dr. Anita Roy',
      expires_at: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 104,
      title: 'Yamaha 2200W Silent Inverter Generator',
      description: 'Pure sine wave power for medical equipment, refrigerators and laptop banks during power cuts.',
      type: 'lend',
      category: 'Home & Kitchen',
      location_name: 'HSR Layout, Bengaluru',
      images: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
      is_emergency: false,
      trust_score: 98,
      owner_name: 'Col. Rajesh S.',
      created_at: new Date().toISOString()
    },
    {
      id: 105,
      title: 'DeWalt 12" Dual-Bevel Sliding Compound Miter Saw',
      description: 'High-precision cutting table for DIY home renovators, carpentry and student makers.',
      type: 'borrow',
      category: 'Tools & Equipment',
      location_name: 'Jayanagar, Bengaluru',
      images: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      is_emergency: false,
      trust_score: 96,
      owner_name: 'Vikram Seth',
      created_at: new Date().toISOString()
    },
    {
      id: 106,
      title: 'Acoustic Guitar Lessons for French or Spanish Practice',
      description: 'Experienced musician offering 1-on-1 acoustic guitar sessions in exchange for conversational language practice.',
      type: 'barter',
      category: 'Skill Barter',
      location_name: 'Indiranagar, Bengaluru',
      images: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
      is_emergency: false,
      trust_score: 95,
      owner_name: 'Kabir Das',
      created_at: new Date().toISOString()
    },
    {
      id: 107,
      title: 'Btwin Riverside 120 Hybrid Bicycle (Medium Frame)',
      description: 'Well-maintained 8-speed hybrid bicycle with helmet, lock, and front basket for weekend commuting.',
      type: 'borrow',
      category: 'Vehicles & Rides',
      location_name: 'Bellandur, Bengaluru',
      images: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
      is_emergency: false,
      trust_score: 94,
      owner_name: 'Rohan D.',
      created_at: new Date().toISOString()
    },
    {
      id: 108,
      title: 'Complete Set: Calculus & Linear Algebra 4th Ed.',
      description: 'Engineering textbooks in pristine condition available for university students preparing for semester finals.',
      type: 'donate',
      category: 'Books & Study',
      location_name: 'Malleshwaram, Bengaluru',
      images: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      is_emergency: false,
      trust_score: 98,
      owner_name: 'Sneha K.',
      created_at: new Date().toISOString()
    }
  ];

  // Fetch listings
  const fetchListingsData = async () => {
    setLoading(true);
    try {
      const lat = user?.location_lat || undefined;
      const lon = user?.location_lon || undefined;

      let data = await api.listings.getAll({
        type: selectedType === 'all' ? undefined : selectedType,
        category: selectedCategory || undefined,
        search: searchQuery || undefined,
        lat,
        lon,
        radius,
      });

      if ((!data || data.length === 0) && (lat || lon)) {
        data = await api.listings.getAll({
          type: selectedType === 'all' ? undefined : selectedType,
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
        });
      }

      let finalData = data || [];
      const nonEmergency = finalData.filter((l: any) => !l.is_emergency);
      if (nonEmergency.length === 0) {
        const filteredDefaults = defaultListings.filter((item) => {
          const matchesType = selectedType === 'all' || item.type === selectedType;
          const matchesCategory = !selectedCategory || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
          const query = searchQuery.toLowerCase().trim();
          const matchesSearch = !query || item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
          return matchesType && matchesCategory && matchesSearch;
        });
        finalData = [...finalData, ...filteredDefaults];
      }

      setListings(finalData);
    } catch (err) {
      console.error('Failed to load listings', err);
      setListings(defaultListings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListingsData();
  }, [selectedCategory, selectedType, radius, searchQuery, user]);

  const activeEmergencies = listings.filter((l) => l.is_emergency && l.status === 'active');
  const regularListings = listings.filter((l) => !l.is_emergency);
  const displayedListings = regularListings.slice(0, visibleCount);

  const formatListingTerms = (item: any) => {
    if (item.is_emergency) return 'EMERGENCY AID';
    if (item.type === 'borrow') return 'BORROW REQUEST';
    if (item.type === 'lend') return 'AVAILABLE TO LEND';
    if (item.type === 'barter') return 'SKILL BARTER';
    if (item.type === 'donate') return 'FREE SHARE';
    return 'MUTUAL AID';
  };

  const locationDisplay = user?.location_name ? user.location_name.split(',')[0] : 'DTU Campus, Rohini';

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] font-sans w-full min-h-screen">
      
      {/* 1. Personalized Header & Quick Metrics */}
      <div className="bg-white dark:bg-[#102A43] border-b border-[#E2E8F0] dark:border-[#1A365D] px-4 sm:px-8 py-5 sm:py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#19A974] uppercase tracking-wider bg-[#F0FDF8] dark:bg-[#19A974]/20 px-2.5 py-0.5 rounded-full">
                Neighborhood Dashboard
              </span>
              <span className="text-xs text-[#64748B] dark:text-[#9FB3C8]">
                Within {radius} km
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102A43] dark:text-white mt-1.5 tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Neighbor'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#9FB3C8] mt-1">
              {locationDisplay} • Connecting you with {listings.length} verified community resources nearby.
            </p>
          </div>

          {/* Quick Actions & Helper Availability Switch */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button
              onClick={toggleHelperStatus}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isAvailableHelper 
                  ? 'bg-[#F0FDF8] dark:bg-[#19A974]/15 border-[#19A974]/40 text-[#19A974]' 
                  : 'bg-[#F1F5F9] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#64748B]'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                {isAvailableHelper && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19A974] opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAvailableHelper ? 'bg-[#19A974]' : 'bg-slate-400'}`} />
              </span>
              <span>{isAvailableHelper ? 'Available to Help' : 'Helper Status: Off'}</span>
            </button>

            <Link
              to="/create-listing"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs text-white bg-[#19A974] hover:bg-[#148A5E] shadow-sm shadow-[#19A974]/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span>Request Assistance</span>
            </Link>

            <Link
              to="/emergency"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs text-[#EF4444] bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 transition-colors"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>SOS Radar</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-6">
          <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#19A974]/15 text-[#19A974] flex items-center justify-center font-bold shrink-0">
              <Package className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-extrabold text-[#102A43] dark:text-white">
                {regularListings.length}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#64748B] dark:text-[#9FB3C8] truncate">
                Requests Nearby
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#38BDF8]/15 text-[#0284C7] dark:text-[#38BDF8] flex items-center justify-center font-bold shrink-0">
              <Users className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-extrabold text-[#102A43] dark:text-white">
                {helperTasks.length}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#64748B] dark:text-[#9FB3C8] truncate">
                Active Tasks
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#19A974]/15 text-[#19A974] flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-extrabold text-[#102A43] dark:text-white">
                {Math.round(user?.trust_score || 95)}%
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#64748B] dark:text-[#9FB3C8] truncate">
                Trust Score
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center gap-2.5 sm:gap-3.5">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
              <ThumbsUp className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-lg sm:text-xl font-extrabold text-[#102A43] dark:text-white">
                {user?.total_ratings || 4}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium text-[#64748B] dark:text-[#9FB3C8] truncate">
                Endorsements
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Urgent Emergency SOS Banner if active */}
        {activeEmergencies.length > 0 && (
          <div className="rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-5 flex flex-col gap-3 shadow-sm text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#EF4444] font-bold text-sm uppercase tracking-wide">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
                <span>Urgent Medical / Disaster Alerts Nearby ({activeEmergencies.length})</span>
              </div>
              <Link to="/emergency" className="text-xs font-bold text-[#EF4444] hover:underline flex items-center gap-1">
                <span>View Emergency Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activeEmergencies.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex flex-col justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-[#102A43] dark:text-white truncate">{item.title}</span>
                    <span className="text-[9px] font-bold text-[#EF4444] bg-[#EF4444]/15 px-2 py-0.5 rounded shrink-0">
                      Urgent SOS
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#9FB3C8] line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                    <span className="text-[10px] text-[#64748B]">{item.location_name || 'Nearby 0.5km'}</span>
                    <Link
                      to={`/listing/${item.id}`}
                      className="px-3 py-1 rounded-lg bg-[#EF4444] hover:bg-rose-700 text-white text-[10px] font-bold"
                    >
                      Respond Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#64748B] dark:text-[#9FB3C8] uppercase tracking-wider">
              Filter by Assistance Category
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-semibold text-[#19A974] hover:underline"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          <div className="flex overflow-x-auto sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5 pb-2 sm:pb-0 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {categoriesList.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                  className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all min-w-[105px] sm:min-w-0 shrink-0 sm:shrink ${
                    isSelected 
                      ? 'bg-[#F0FDF8] dark:bg-[#19A974]/15 border-[#19A974] text-[#19A974] shadow-xs font-bold' 
                      : 'bg-white dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#64748B] dark:text-[#9FB3C8] hover:border-[#19A974] hover:text-[#102A43] dark:hover:text-white'
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 ${isSelected ? 'text-[#19A974]' : 'text-[#64748B] dark:text-[#9FB3C8]'}`} />
                  <span className="text-[11px] truncate w-full">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Type Pills & View Mode (Grid vs Map Discovery) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex flex-wrap items-center gap-2">
            {/* Type Selector with touch scroll */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] p-1 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs overflow-x-auto scrollbar-none max-w-full touch-pan-x">
              {[
                { id: 'all', label: 'All Requests' },
                { id: 'borrow', label: 'Borrow' },
                { id: 'lend', label: 'Lend' },
                { id: 'barter', label: 'Skill Barter' },
                { id: 'donate', label: 'Donations' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    selectedType === t.id
                      ? 'bg-[#102A43] text-white shadow-xs'
                      : 'text-[#64748B] dark:text-[#9FB3C8] hover:text-[#102A43] dark:hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Radius slider */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-xs font-medium text-[#64748B] shrink-0">
              <span>Radius: <strong className="text-[#102A43] dark:text-white">{radius}km</strong></span>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1.5 bg-[#E2E8F0] dark:bg-[#334155] rounded-lg appearance-none cursor-pointer accent-[#19A974]"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1E293B] p-1 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs shrink-0 self-start lg:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#19A974] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#102A43] dark:hover:text-white'
              }`}
            >
              List / Grid
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-[#19A974] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#102A43] dark:hover:text-white'
              }`}
            >
              Radar Map
            </button>
          </div>
        </div>

        {/* 2. Content: Grid View or Radar Map View */}
        {viewMode === 'map' ? (
          /* Interactive Radar Map View */
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-[#19A974]" />
                <span className="font-bold text-sm text-[#102A43] dark:text-white">
                  Interactive 5km Neighborhood Radar
                </span>
              </div>
              <span className="text-xs text-[#64748B]">Click any node to inspect neighbor details</span>
            </div>

            <div className="relative h-96 w-full rounded-2xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full" onClick={() => setSelectedMapNode(null)} xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="radar-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E2E8F0" strokeWidth="0.5" className="dark:stroke-[#1E293B]" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#radar-grid)" />

                {/* Radar concentric distance rings */}
                <circle cx="50%" cy="50%" r="60" fill="none" stroke="#CBD5E1" strokeWidth="0.75" strokeDasharray="3 3" className="dark:stroke-[#334155]" />
                <circle cx="50%" cy="50%" r="120" fill="none" stroke="#CBD5E1" strokeWidth="0.75" strokeDasharray="3 3" className="dark:stroke-[#334155]" />
                <circle cx="50%" cy="50%" r="180" fill="none" stroke="#CBD5E1" strokeWidth="0.75" strokeDasharray="3 3" className="dark:stroke-[#334155]" />

                {/* User center node */}
                <circle cx="50%" cy="50%" r="8" className="fill-[#19A974] stroke-white" strokeWidth="2.5" />
                <circle cx="50%" cy="50%" r="18" className="fill-none stroke-[#19A974] animate-ping" strokeWidth="1" opacity="0.4" />

                {/* Request pins */}
                {regularListings.map((item, idx) => {
                  const theta = (idx * 55 + 20) * (Math.PI / 180);
                  const dist = 60 + (idx * 30) % 110;
                  const xOffset = dist * Math.cos(theta);
                  const yOffset = dist * Math.sin(theta);
                  return (
                    <g 
                      key={item.id} 
                      onClick={(e) => { e.stopPropagation(); setSelectedMapNode(item); }}
                      className="cursor-pointer group"
                    >
                      <circle cx={`calc(50% + ${xOffset}px)`} cy={`calc(50% + ${yOffset}px)`} r="7" fill="#102A43" stroke="#19A974" strokeWidth="2" className="hover:scale-125 transition-transform" />
                    </g>
                  );
                })}
              </svg>

              {/* Selected Node Drawer */}
              {selectedMapNode && (
                <div className="absolute bottom-4 right-4 max-w-xs w-full p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xl flex flex-col gap-2.5 text-left z-20 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase text-[#19A974]">{selectedMapNode.type}</span>
                    <button onClick={() => setSelectedMapNode(null)} className="text-[#94A3B8] hover:text-[#1E293B]">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-[#102A43] dark:text-white truncate">{selectedMapNode.title}</h4>
                  <span className="text-[11px] font-bold text-[#19A974]">{formatListingTerms(selectedMapNode)}</span>
                  <Link
                    to={`/listing/${selectedMapNode.id}`}
                    className="px-3 py-1.5 rounded-xl bg-[#19A974] text-white text-xs font-bold text-center mt-1 shadow-xs"
                  >
                    View Request Details
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Cards Grid View */
          loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] animate-pulse" />
              ))}
            </div>
          ) : regularListings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
              <Package className="h-10 w-10 text-[#19A974] mx-auto mb-3" />
              <h3 className="font-bold text-[#102A43] dark:text-white text-base">No community requests in this filter</h3>
              <p className="text-xs text-[#64748B] dark:text-[#9FB3C8] mt-1 max-w-sm mx-auto">
                Try widening your location radius, choosing a different category, or post a request for what you need!
              </p>
              <Link
                to="/create-listing"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#19A974] text-white text-xs font-bold shadow-xs hover:bg-[#148A5E]"
              >
                <Plus className="h-4 w-4" />
                <span>Post Assistance Request</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {displayedListings.map((item) => {
                const isFav = favorites.includes(item.id);
                const firstImage = item.images?.split(';')[0] || 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=600';

                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] hover:shadow-md hover:border-[#19A974]/40 transition-all duration-200 overflow-hidden flex flex-col justify-between text-left shadow-xs"
                  >
                    <div>
                      {/* Top Image */}
                      <div className="relative h-44 w-full bg-[#F1F5F9] dark:bg-[#0F172A] overflow-hidden">
                        <img
                          src={firstImage}
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top-Left Category Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-[#102A43]/90 backdrop-blur-md text-[#102A43] dark:text-white font-bold text-[10px] shadow-xs">
                          {formatListingTerms(item)}
                        </div>

                        {/* Top-Right Favorite Bookmark */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 dark:bg-[#102A43]/80 backdrop-blur-md text-[#64748B] hover:scale-110 transition-transform shadow-xs"
                          title={isFav ? "Saved" : "Save for later"}
                        >
                          <Heart className={`h-4 w-4 ${isFav ? 'text-[#EF4444] fill-[#EF4444]' : 'text-[#64748B]'}`} />
                        </button>
                      </div>

                      {/* Content Body */}
                      <div className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#19A974]">
                          {item.category || 'General Aid'}
                        </span>

                        <h3 className="text-xs sm:text-sm font-bold text-[#102A43] dark:text-white group-hover:text-[#19A974] transition-colors line-clamp-1 mt-0.5">
                          {item.title}
                        </h3>

                        <p className="text-[11px] text-[#64748B] dark:text-[#9FB3C8] line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] dark:text-[#9FB3C8] mt-2">
                          <MapPin className="h-3 w-3 text-[#38BDF8] shrink-0" />
                          <span className="truncate">{item.location_name || 'Neighborhood 1km'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Strip */}
                    <div className="p-4 pt-0">
                      <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#19A974] shrink-0" />
                          <span className="text-[#64748B] dark:text-[#9FB3C8] truncate">
                            {item.owner_name || 'Verified Resident'}
                          </span>
                        </div>

                        <Link
                          to={`/listing/${item.id}`}
                          className="px-2.5 py-1 rounded-lg bg-[#19A974] hover:bg-[#148A5E] text-white text-[11px] font-bold shrink-0 transition-colors"
                        >
                          Assist
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Helper Commitments & Active Assistance Section */}
        <div className="grid md:grid-cols-3 gap-6 pt-6">
          <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#19A974]" />
                <h3 className="text-sm font-bold text-[#102A43] dark:text-white">
                  Your Active Helper Tasks ({helperTasks.length})
                </h3>
              </div>
              <span className="text-xs text-[#19A974] font-semibold">Helper Radar Active</span>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              {helperTasks.map((task) => (
                <div 
                  key={task.id}
                  className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-[#102A43] dark:text-white">
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] dark:text-[#9FB3C8] mt-0.5">
                      With {task.partner} • {task.time} ({task.distance})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.status === 'Completed' 
                        ? 'bg-[#19A974]/15 text-[#19A974]' 
                        : 'bg-[#38BDF8]/15 text-[#0284C7] dark:text-[#38BDF8]'
                    }`}>
                      {task.status}
                    </span>
                    <Link
                      to="/chat"
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#102A43] dark:hover:text-white hover:bg-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#E2E8F0]"
                      title="Open chat"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local Weather & Environment Widget */}
          <div className="flex flex-col gap-4">
            <WeatherWidget 
              lat={user?.location_lat ?? 28.7501} 
              lon={user?.location_lon ?? 77.1177} 
              locationName={user?.location_name || 'Neighborhood'} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};
