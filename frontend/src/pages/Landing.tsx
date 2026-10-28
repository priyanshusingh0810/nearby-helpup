import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Share2, 
  AlertOctagon, 
  ShieldCheck, 
  MapPin, 
  Search,
  Sparkles,
  Users,
  Calendar,
  Heart,
  ChevronDown,
  ShieldAlert,
  Flame,
  MessageSquare,
  Check,
  X,
  Zap,
  Sliders,
  DollarSign,
  Leaf,
  Layers,
  Lock,
  Cpu,
  BadgeCheck,
  ExternalLink,
  Sun,
  Moon,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SaaSUpgradeModal } from '../components/common/SaaSUpgradeModal';
import { motion, AnimatePresence } from 'framer-motion';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // Interactive UI Demo States
  const [activeDemoTab, setActiveDemoTab] = useState<'feed' | 'map' | 'ai' | 'emergency'>('feed');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Interactive ROI Calculator States
  const [borrowCount, setBorrowCount] = useState<number>(3);
  const [itemAvgCost, setItemAvgCost] = useState<number>(65);

  const calculatedSavings = borrowCount * itemAvgCost * 12;
  const calculatedCarbon = Math.round(borrowCount * 6.8 * 12);
  const calculatedConnections = borrowCount * 4;

  const stats = [
    { label: 'Active Neighbors', value: '14,200+' },
    { label: 'Resources Shared', value: '5,800+' },
    { label: 'Avg Emergency Response', value: '< 4.2 Mins' },
    { label: 'Trust Rating Verification', value: '4.96 / 5.0' },
  ];

  const comparisonRows = [
    {
      feature: 'Hyperlocal 5km radius filter',
      whatsapp: '❌ None (broad groups)',
      facebook: '⚠️ Clunky distance filter',
      helpup: '✅ Live GPS Mesh Circle',
    },
    {
      feature: 'Verified ID & Trust Scores',
      whatsapp: '❌ Unverified numbers',
      facebook: '⚠️ Easily spoofed profiles',
      helpup: '✅ Multi-factor ID + Ratings',
    },
    {
      feature: 'Emergency Priority Broadcast',
      whatsapp: '❌ Lost in chat noise',
      facebook: '❌ Algorithm hides urgent posts',
      helpup: '✅ High-priority radar beacon',
    },
    {
      feature: 'Automated AI Item Matching',
      whatsapp: '❌ Manual scrolling',
      facebook: '❌ Keyword ads & spam',
      helpup: '✅ Natural language matcher',
    },
    {
      feature: 'Zero-Deposit Escrow Protection',
      whatsapp: '❌ Informal & risky',
      facebook: '❌ No return guarantees',
      helpup: '✅ Optional smart deposit hold',
    },
    {
      feature: 'Privacy Protected (Exact address hidden)',
      whatsapp: '❌ Phone number exposed',
      facebook: '❌ Profile exposed to public',
      helpup: '✅ Generalized radius only',
    },
  ];

  const features = [
    {
      icon: AlertOctagon,
      title: 'Emergency Priority Circle',
      desc: 'Critical medical equipment, power inverters, or urgent tools? Broadcast high-priority beacon alerts to authenticated neighbors within 5km in seconds.',
      badge: '< 5 min SLA',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    },
    {
      icon: ShieldCheck,
      title: 'Peer-to-Peer Trust Index',
      desc: 'Multi-factor phone and identity verification, algorithmic borrowing scorecards, and tamper-resistant feedback ensure safe, reliable transactions.',
      badge: 'Zero Scams',
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      icon: Share2,
      title: 'Circular Resource Economy',
      desc: 'Eliminate household waste and clutter. Borrow, lend, swap skills, or donate tools with complete peace of mind through a frictionless workflow.',
      badge: 'Zero Waste',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  const faqs = [
    {
      q: 'Is Nearby HelpUp really 100% free and non-profit?',
      category: 'Civic Charter',
      a: 'Yes! Nearby HelpUp operates as a public-good community mesh. There are zero subscriptions, zero hidden fees, and zero paywalls. You can borrow, lend, swap skills, join local community circles, and respond to neighborhood emergencies completely free of charge.'
    },
    {
      q: 'How does the platform protect my privacy and physical address?',
      category: 'Security',
      a: 'We never broadcast your exact building or GPS coordinates. We display only generalized radius zones (e.g., 500m area) on community maps. Precise pickup arrangements are agreed upon securely through in-app encrypted chat.'
    },
    {
      q: 'What is the Trust Score and how is it calculated?',
      category: 'Verification',
      a: 'Every authenticated neighbor starts with a base Trust Score of 75. Completing government ID verification, phone verification, punctually returning borrowed items, and receiving positive peer reviews increase your score up to 100.'
    },
    {
      q: 'Can gated societies, RWAs, or university campuses use HelpUp?',
      category: 'Community Chapters',
      a: 'Absolutely! Our Campus & Colony Chapter charter allows resident welfare associations, universities, and co-living societies to launch a dedicated, verified community mesh with automated resident verification and asset check-out management at no cost.'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/login?search=${encodeURIComponent(searchVal)}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 selection:bg-indigo-500/30 selection:text-indigo-900 dark:selection:text-white">
      {/* Background Grid & Ambient Glows */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40 dark:opacity-20" />
      <div className="fixed -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-10 h-[450px] w-[450px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white font-extrabold shadow-md shadow-indigo-500/25">
              🤝
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  Nearby HelpUp
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  v2.4 SaaS
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide hidden sm:block">
                Hyperlocal Sharing OS
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#platform" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Platform</a>
            <a href="#live-demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Live Demo</a>
            <a href="#comparison" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Why HelpUp</a>
            <a href="#calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">ROI Calculator</a>
            <a href="#charter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community Charter</a>
            <a href="#faqs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQs</a>
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/login"
              className="saas-btn-primary !py-2 !px-4 !text-xs shadow-md shadow-indigo-600/30"
            >
              <span>{user ? 'Open Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-6 max-w-6xl mx-auto text-center z-10">
        {/* Release Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-8 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span>⚡ HelpUp v2.4 Mesh Network is Live · 48 Neighborhoods Connected</span>
          <ArrowRight className="h-3 w-3" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-5xl mx-auto leading-[1.08] font-sans">
          The Hyperlocal Operating System for{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
            Conscious Neighborhoods.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Stop buying tools you only use twice a year. Eliminate noise from unverified WhatsApp chats. Borrow items, swap skills, and broadcast 5-minute emergency alerts with verified neighbors.
        </p>

        {/* Hero Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-10 max-w-2xl mx-auto p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40 flex items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-2.5 px-3">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="What do you need nearby? (e.g., Cordless drill, Camping tent, Calculus textbook...)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-white outline-none placeholder:text-slate-400 font-medium"
            />
          </div>
          <button
            type="submit"
            className="saas-btn-primary !py-2.5 !px-5 !text-xs shrink-0"
          >
            <span>Search Mesh</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Dual CTA & Micro Social Proof */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
          <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:underline">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>No credit card required</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
          <span className="text-slate-500 font-medium">Instant 60-second setup</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">·</span>
          <span className="text-slate-500 font-medium">Encrypted P2P coordination</span>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-200/80 dark:border-slate-800/80">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {s.value}
              </span>
              <span className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive SaaS Showcase Window */}
      <section id="live-demo" className="py-20 px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="saas-badge mb-3">Live Interactive Preview</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Designed for Real Communities, Powered by SaaS Precision
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Explore how the neighborhood sharing mesh, AI matchmaking engine, and emergency protocol operate in real time.
          </p>
        </div>

        {/* Interactive MacBook / Browser Frame */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          {/* Window Header */}
          <div className="px-5 py-3.5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-[11px] font-semibold text-slate-400 font-mono">
                mesh.nearbyhelpup.com/console
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveDemoTab('feed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeDemoTab === 'feed'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                1. Resource Feed
              </button>
              <button
                onClick={() => setActiveDemoTab('map')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeDemoTab === 'map'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                2. Mesh Map
              </button>
              <button
                onClick={() => setActiveDemoTab('ai')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeDemoTab === 'ai'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                3. AI Matcher
              </button>
              <button
                onClick={() => setActiveDemoTab('emergency')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeDemoTab === 'emergency'
                    ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                4. Emergency Beacon
              </button>
            </div>
          </div>

          {/* Interactive Window Content Body */}
          <div className="p-6 sm:p-8 min-h-[380px] bg-slate-50/40 dark:bg-slate-950/40">
            {activeDemoTab === 'feed' && (
              <div className="grid sm:grid-cols-3 gap-5 animate-fade-in">
                {[
                  {
                    title: 'Bosch 18V Cordless Drill & Bit Set',
                    owner: 'Arjun Verma',
                    trust: 98,
                    distance: '0.4 km away',
                    type: 'Borrow',
                    category: 'Tools',
                    badge: 'Instant Confirm'
                  },
                  {
                    title: 'Sony Alpha 4K Video Gimbal Stabilizer',
                    owner: 'Priya Mehta',
                    trust: 95,
                    distance: '1.2 km away',
                    type: 'Lend',
                    category: 'Electronics',
                    badge: 'Zero Deposit'
                  },
                  {
                    title: 'Calculus & Linear Algebra 4th Edition',
                    owner: 'Rohit K.',
                    trust: 91,
                    distance: '0.8 km away',
                    type: 'Barter',
                    category: 'Books',
                    badge: 'DTU Student'
                  }
                ].map((item, i) => (
                  <div key={i} className="saas-card rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h4>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>👤 {item.owner}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Trust: {item.trust}</span>
                      </div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">📍 {item.distance}</span>
                      <button
                        onClick={() => navigate('/login')}
                        className="saas-btn-primary !py-1 !px-3 !text-[11px]"
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeDemoTab === 'map' && (
              <div className="relative h-80 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center animate-fade-in">
                {/* Simulated Radar Mesh */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="absolute h-64 w-64 rounded-full border border-dashed border-indigo-500/30 bg-indigo-500/5 animate-pulse" />
                <div className="absolute h-40 w-40 rounded-full border border-indigo-500/40 bg-indigo-500/10" />
                
                {/* Center User Node */}
                <div className="relative flex flex-col items-center z-10">
                  <div className="h-5 w-5 rounded-full bg-indigo-500 border-2 border-white shadow-lg shadow-indigo-500/50 flex items-center justify-center text-[10px] text-white font-bold">
                    You
                  </div>
                  <span className="mt-1 text-[10px] font-mono text-indigo-300 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Rohini Sector 16 Mesh (5km)
                  </span>
                </div>

                {/* Neighbor Nodes */}
                <div className="absolute top-12 left-20 flex flex-col items-center">
                  <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow">
                    🔨 Tool Set (250m)
                  </span>
                  <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white mt-1" />
                </div>

                <div className="absolute bottom-12 right-24 flex flex-col items-center">
                  <span className="bg-indigo-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow">
                    💻 MacBook Charger (400m)
                  </span>
                  <div className="h-3.5 w-3.5 rounded-full bg-indigo-500 border-2 border-white mt-1" />
                </div>

                <div className="absolute top-16 right-20 flex flex-col items-center">
                  <span className="bg-rose-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow animate-bounce">
                    🚨 Emergency Oxygen (800m)
                  </span>
                  <div className="h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white mt-1" />
                </div>
              </div>
            )}

            {activeDemoTab === 'ai' && (
              <div className="max-w-xl mx-auto flex flex-col gap-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                      Query: "I need a high-lumen projector for outdoor screening tonight at 7 PM"
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      AI Parser extracted: Category: Electronics · Sub: Projector · Urgency: Tonight · Range: 3 km
                    </div>
                  </div>
                </div>

                <div className="saas-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📽️</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Epson 3800 Lumen HD Projector + HDMI
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Owner: Vikram R. (350m away) · Trust Score: 99 · Response in 2 mins
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-xl">
                    99% Match
                  </span>
                </div>
              </div>
            )}

            {activeDemoTab === 'emergency' && (
              <div className="max-w-xl mx-auto flex flex-col gap-4 animate-fade-in">
                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5">
                  <AlertOctagon className="h-6 w-6 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Live Neighborhood Broadcast #849
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white text-[9px] font-bold">
                        CRITICAL
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                      Urgent Need: Portable Oxygen Concentrator or O2 Canister
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Elderly patient in Pocket C, Sector 16. Power line disrupted for next 2 hours. Delivery vehicle stuck.
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <span>Broadcast Radius: 5 km</span>
                      <span>·</span>
                      <span>142 Neighbors Notified</span>
                      <span>·</span>
                      <span className="text-emerald-500 font-bold">2 Responses Arrived</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* "Why HelpUp vs The Old Way" Comparison Matrix */}
      <section id="comparison" className="py-20 px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="saas-badge mb-3">Competitive Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Why Modern Neighborhoods Choose HelpUp
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Compare HelpUp with chaotic messaging apps, unverified classifieds, and unnecessary consumer spending.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Feature</th>
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px]">WhatsApp / Telegram</th>
                <th className="py-4 px-4 font-bold text-slate-400 text-[11px]">Craigslist / FB Marketplace</th>
                <th className="py-4 px-6 font-extrabold text-indigo-600 dark:text-indigo-400 text-[12px] bg-indigo-50/50 dark:bg-indigo-950/30">
                  Nearby HelpUp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {row.whatsapp}
                  </td>
                  <td className="py-4 px-4 text-slate-500 font-medium">
                    {row.facebook}
                  </td>
                  <td className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20">
                    {row.helpup}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Neighborhood Savings & Carbon Calculator */}
      <section id="calculator" className="py-20 px-6 max-w-5xl mx-auto z-10 relative">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
          <div className="max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
              Interactive ROI & Ecological Impact
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
              See How Much Your Household Saves
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Calculate your annual cash savings and carbon emission reduction by borrowing instead of purchasing rarely used tools and gear.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
            {/* Interactive Sliders */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Items Borrowed or Shared per Month</span>
                  <span className="text-base text-amber-400 font-extrabold">{borrowCount} items</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={borrowCount}
                  onChange={(e) => setBorrowCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Average Retail Price of Item</span>
                  <span className="text-base text-amber-400 font-extrabold">${itemAvgCost}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="5"
                  value={itemAvgCost}
                  onChange={(e) => setItemAvgCost(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Live Outputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <DollarSign className="h-4 w-4" />
                  <span>Annual Savings</span>
                </div>
                <span className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                  ${calculatedSavings.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5">Kept in your pocket</span>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Leaf className="h-4 w-4" />
                  <span>Carbon Avoided</span>
                </div>
                <span className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                  {calculatedCarbon} kg
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5">CO2 emissions prevented</span>
              </div>

              <div className="col-span-2 p-4 rounded-2xl bg-indigo-500/20 backdrop-blur-md border border-indigo-400/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-200">Neighborhood Trust Capital</div>
                  <div className="text-xs text-white mt-0.5">
                    Est. <strong>{calculatedConnections} high-trust local connections</strong> built per year.
                  </div>
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="saas-btn-primary !py-2 !px-4 !text-xs !bg-white !text-slate-900 shrink-0"
                >
                  Start Saving
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Non-Profit Community Charter & Roles Section */}
      <section id="charter" className="py-20 px-6 max-w-6xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="saas-badge mb-3">100% Non-Profit · Public Good</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Community Roles & Open Charter
          </h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Nearby HelpUp is free public-good software. There are no fees, subscriptions, or paywalls. All community privileges and badges are earned through trust, mutual aid, and active volunteering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Role 1: Community Neighbor */}
          <div className="saas-card rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                100% Free Forever
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                Community Neighbor
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                Essential sharing and mutual aid for everyday residents and conscious neighbors.
              </p>
              <div className="mt-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">Free Forever</span>
                <span className="text-xs text-slate-400">· Non-profit</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>5 km Hyperlocal Mesh Radius</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Unlimited item borrowing & listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Public neighborhood chats & skill clubs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Standard 24/7 emergency broadcasts</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="mt-8 saas-btn-secondary w-full"
            >
              Join Neighborhood Free
            </button>
          </div>

          {/* Role 2: Verified Volunteer & First Responder */}
          <div className="relative rounded-3xl p-7 bg-gradient-to-b from-indigo-50/70 to-emerald-50/40 dark:from-indigo-950/40 dark:to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-600 text-white">
                  Earned by Trust & Help
                </span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                Volunteer & First Responder
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                High-trust neighbors ready to help during urgent medical needs, power outages, and emergencies.
              </p>
              <div className="mt-4 pb-4 border-b border-indigo-200/50 dark:border-indigo-800/50 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">Earned Status</span>
                <span className="text-xs text-slate-400">· Trust score 85+</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 font-bold" />
                  <span>25 km Extended Citywide Mesh Beacon</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 font-bold" />
                  <span>Priority Emergency Alert Dispatch (SMS & Pin)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 font-bold" />
                  <span>Zero-Deposit Trust Guarantee Privilege</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 font-bold" />
                  <span>Verified Volunteer Community Gold Badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-indigo-600 font-bold" />
                  <span>Direct emergency responder coordination channel</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="mt-8 saas-btn-primary w-full shadow-lg shadow-indigo-600/30"
            >
              <span>Pledge as Volunteer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Role 3: Colony & Campus Chapter */}
          <div className="saas-card rounded-3xl p-7 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Open Society Deployment
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                Colony & Campus Chapters
              </h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                For residential welfare associations (RWAs), university campuses, and local societies.
              </p>
              <div className="mt-4 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">Free Open Setup</span>
                <span className="text-xs text-slate-400">· Zero commercial cost</span>
              </div>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Dedicated Private Colony or Campus Domain</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Resident roster synchronization & auto-ID checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Admin Incident Moderation Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Tool Shed & Shared Asset Inventory Kiosk</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="mt-8 saas-btn-secondary w-full"
            >
              Register Community Chapter
            </button>
          </div>
        </div>
      </section>

      {/* FAQs Accordion */}
      <section id="faqs" className="py-20 px-6 max-w-4xl mx-auto z-10 relative">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="saas-badge mb-3">Questions & Answers</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Everything you need to know about safety, lending rules, and community creation.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 overflow-hidden transition-all shadow-sm"
            >
              <button
                type="button"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-white outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">
                    {faq.category}
                  </span>
                  <span>{faq.q}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === i && (
                <div className="px-6 pb-5 pt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise SaaS Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-950 py-12 px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <div>
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-sm">
                Nearby HelpUp Ecosystem
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  All Systems Operational · 99.98% Uptime
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <a href="#platform" className="hover:text-indigo-600 transition-colors">Security Architecture</a>
            <a href="#calculator" className="hover:text-indigo-600 transition-colors">Impact Analytics</a>
            <a href="#charter" className="hover:text-indigo-600 transition-colors">Community Charter</a>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors text-indigo-600 dark:text-indigo-400 font-bold underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-4">Terms & Conditions</Link>
            <Link to="/login" className="hover:text-indigo-600 transition-colors">Privacy Shield</Link>
          </div>

          <p className="text-[10px] font-semibold text-slate-400">
            &copy; {new Date().getFullYear()} Nearby HelpUp Civic Mesh. A 100% Non-Profit Community Initiative.
          </p>
        </div>
      </footer>

      {/* Upgrade Modal */}
      <SaaSUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};
