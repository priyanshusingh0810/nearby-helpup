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
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [searchVal, setSearchVal] = useState('');

  const stats = [
    { label: 'Neighbors Connected', value: '14,200+' },
    { label: 'Resources Shared', value: '4,600+' },
    { label: 'Emergency Response Time', value: '<5 Mins' },
    { label: 'Trust Rating Verification', value: '4.95/5' },
  ];

  const categories = [
    { name: 'Electronics', emoji: '💻', count: '142 Items' },
    { name: 'Books', emoji: '📚', count: '290 Items' },
    { name: 'Sports', emoji: '⚽', count: '98 Items' },
    { name: 'Fashion', emoji: '👕', count: '120 Items' },
    { name: 'Medical', emoji: '🩺', count: '24 Emergency' },
    { name: 'Services', emoji: '🛠️', count: '85 Offers' },
  ];

  const features = [
    {
      icon: AlertOctagon,
      title: 'Emergency Priority Circle',
      desc: 'Critical medical equipment, power chargers, or urgent files needed immediately? Broadcast emergency alerts to neighbors within a 5km radius instantly.',
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20'
    },
    {
      icon: ShieldCheck,
      title: 'Peer-to-Peer Trust Index',
      desc: 'Verify your ID and phone, build borrowing scores, and get badges. Sleep easy knowing transactions happen only with authenticated neighborhood members.',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
    },
    {
      icon: Share2,
      title: 'Circular Access Sharing',
      desc: 'Eliminate waste. Borrow, Lend, Rent, Swapping (Barter), and Volunteer services seamlessly in one unified hyperlocal platform.',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah K.',
      role: 'Student, Rohini',
      text: 'My DSLR gimbal broke the night before a project. Within 15 minutes of posting an emergency request, a classmate nearby lent me theirs. Absolutely life-saving!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop'
    },
    {
      name: 'Rohan Sharma',
      role: 'Startup Founder, Sector 17',
      text: 'I started a local founders book club on HelpUp. We meet weekly at local cafes. It is been amazing to meet people with common goals literally next door.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop'
    }
  ];

  const faqs = [
    {
      q: 'Is Nearby HelpUp free to use?',
      q_label: 'Pricing & Use Cases',
      a: 'Yes! Nearby HelpUp is built to foster neighborhood collaboration and support. Items can be listed for free borrowing, trading/bartering, or donation. Optional small deposits for premium items can be set for peace of mind.'
    },
    {
      q: 'How are location coordinates and privacy handled?',
      q_label: 'Privacy Concerns',
      a: 'We never expose your exact coordinate address. We only display generalized radius circles (e.g. 500m radius) on the neighborhood maps. You coordinate pickup points securely via chat.'
    },
    {
      q: 'What is the Trust Score and how do I increase it?',
      q_label: 'Trust & Verification',
      a: 'Every user starts with a trust score of 75. You increase this by completing phone verification, identity document checks, achieving high ratings, and returning borrowed items on time.'
    },
    {
      q: 'How does the Emergency Mode broadcast work?',
      q_label: 'Safety Broadcasts',
      a: 'When you raise an emergency request, nearby active users receive immediate notifications, and the request is marked with a glowing countdown at the top of the map and dashboard feed.'
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
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-glow-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none animate-glow-pulse delay-300" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none animate-glow-pulse delay-500" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-pink-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Glass Navigation Header */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/50 dark:bg-slate-950/50 backdrop-blur-2xl backdrop-saturate-[180%] sticky top-0 z-50 border-b border-slate-200/30 dark:border-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white text-xl font-bold shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/15">
            🤝
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight font-sans text-slate-900 dark:text-white">
              Nearby HelpUp
            </span>
            <span className="block text-[8px] tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-extrabold uppercase">
              Hyperlocal Community
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-2.5 text-xs font-bold text-white hover:from-slate-800 hover:to-slate-700 dark:from-white dark:to-slate-100 dark:text-slate-950 dark:hover:from-slate-100 dark:hover:to-slate-200 shadow-lg shadow-slate-900/10 dark:shadow-none transition-all duration-200 flex items-center gap-2"
          >
            <span>{user ? 'Enter App' : 'Get Started'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-28 md:py-40 md:px-12 flex flex-col items-center text-center max-w-5xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/30 dark:border-indigo-800/20 px-4 py-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 mb-8 uppercase tracking-wider animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>The Operating System for Your Neighborhood</span>
        </span>
        
        <h1 className="text-4xl font-extrabold tracking-tight md:text-7xl text-slate-900 dark:text-white font-sans max-w-4xl leading-[1.08] mb-6 animate-fade-in-up">
          Everything You Need, <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            Right Next Door.
          </span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-12 animate-fade-in-up delay-200">
          Borrow items, swap skills, coordinate emergencies, join active local clubs, and meet neighbors with common interests in real time.
        </p>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl bg-white/75 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-800/30 p-2 rounded-2xl flex items-center gap-2 shadow-2xl shadow-slate-200/40 dark:shadow-black/20 mb-14 animate-fade-in-up delay-300">
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="What do you need nearby? (e.g. DSLR camera, football club, calculator, volunteer...)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent text-sm outline-none border-none text-slate-800 dark:text-white placeholder:text-slate-400/70"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-3 text-xs transition-all duration-300 shrink-0 flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
          >
            <span>Search</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Popular Categories Grid */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Popular categories</span>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3.5">
            {categories.map((c) => (
              <GlassCard 
                key={c.name}
                className="p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer border-slate-100/40 dark:border-slate-800/20"
                onClick={() => navigate(`/login?category=${c.name}`)}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">{c.name}</span>
                <span className="text-[8px] text-slate-400">{c.count}</span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-slate-200/30 dark:border-slate-800/30 pt-12">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${i * 100 + 400}ms` }}>
              <span className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">{s.value}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Product Highlight / Features */}
      <section className="py-28 bg-white/30 dark:bg-slate-900/10 border-y border-slate-200/20 dark:border-slate-800/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Built to Connect Your Neighborhood
            </h2>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Not just an item sharing website—Nearby HelpUp is a complete operating ecosystem for communities, events, and resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <GlassCard 
                  key={i} 
                  className="p-8 flex flex-col gap-5 border-white/50 dark:border-slate-800/30 hover:-translate-y-2"
                  glow={true}
                >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${f.color} shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">{f.title}</h3>
                    <p className="mt-3 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Mock Map / Showcase */}
      <section className="py-24 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <span className="rounded-full bg-rose-50 px-3.5 py-1 text-[9px] font-extrabold text-rose-500 dark:bg-rose-950/40 dark:text-rose-400 uppercase tracking-widest w-fit">
            📍 Real-Time Location Network
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Mesh Map of Your Local Community
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Instantly view items, active running/cycling events, local volunteering projects, and emergency power chargers popping up near you. Toggle range circles between 2 km to 50 km to adjust search parameters.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 font-bold text-xs shrink-0">1</div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Adjust your radius circle slider</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 font-bold text-xs shrink-0">2</div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Click markers to chat with the resource owner</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500 font-bold text-xs shrink-0">3</div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Create safety emergency broadcast notifications</span>
            </div>
          </div>
        </div>

        {/* Map Showcase Frame */}
        <div className="bg-white/80 dark:bg-slate-900/60 p-4 rounded-3xl border border-white/60 dark:border-slate-800/40 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-slate-800 dark:text-white">Active Neighbor Node Map</span>
            </div>
            <span className="text-[10px] text-indigo-500 font-semibold uppercase">Radius: 5 km</span>
          </div>

          <div className="h-72 w-full rounded-2xl bg-slate-50 dark:bg-slate-950/80 relative overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-900">
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]" />
            {/* Range circle */}
            <div className="absolute h-48 w-48 rounded-full border border-dashed border-indigo-500/30 bg-indigo-500/5 animate-pulse" />
            <div className="absolute h-24 w-24 rounded-full border border-dashed border-indigo-500/40 bg-indigo-500/5" />
            
            {/* Center Node */}
            <div className="absolute h-4 w-4 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-950 shadow-md shadow-indigo-600/35 z-10" />
            
            {/* User Markers */}
            <div className="absolute top-10 left-16 flex flex-col items-center cursor-pointer group">
              <span className="bg-rose-500 text-white font-bold text-[8px] px-2 py-0.5 rounded-full shadow animate-bounce">🚨 Oxygen Cylinder</span>
              <div className="h-3.5 w-3.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-950 mt-1" />
            </div>

            <div className="absolute bottom-16 right-20 flex flex-col items-center cursor-pointer group">
              <span className="bg-indigo-600 text-white font-bold text-[8px] px-2 py-0.5 rounded-full shadow">💻 Laptop Charger</span>
              <div className="h-3.5 w-3.5 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-950 mt-1" />
            </div>

            <div className="absolute top-20 right-10 flex flex-col items-center cursor-pointer group">
              <span className="bg-emerald-600 text-white font-bold text-[8px] px-2 py-0.5 rounded-full shadow">🏃 Morning Run Club</span>
              <div className="h-3.5 w-3.5 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-950 mt-1" />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Testimonials */}
      <section className="py-24 bg-white/40 dark:bg-slate-900/10 border-t border-slate-200/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Lived Experiences
            </h2>
            <p className="mt-3 text-sm text-slate-650 dark:text-slate-400">
              Read how nearby users borrow items, share skills, and run local events.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((t, idx) => (
              <GlassCard key={idx} className="p-8 flex flex-col gap-4 border-slate-100/50">
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover shadow-sm bg-slate-50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <span className="text-[10px] text-indigo-500 font-semibold">{t.role}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Accordion */}
      <section className="py-28 bg-white/50 dark:bg-slate-900/10 border-t border-slate-200/20 dark:border-slate-800/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-16">
            Everything you need to know about safety, lending rules, and community creation.
          </p>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="border border-slate-200/40 rounded-2xl dark:border-slate-800/40 overflow-hidden bg-white/60 dark:bg-slate-900/30 backdrop-blur-sm transition-all duration-200 hover:border-indigo-200/30 dark:hover:border-indigo-800/20"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-sm text-slate-800 dark:text-white outline-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[8px] bg-indigo-50/80 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 px-2 py-0.5 rounded-md font-extrabold uppercase">
                      {faq.q_label}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-indigo-500 transition-transform duration-300 ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 pt-2 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100/60 dark:border-slate-800/30 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/20 dark:border-slate-800/20 py-12 px-6 bg-slate-50/50 dark:bg-slate-950 transition-colors">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤝</span>
            <span className="font-extrabold tracking-tight text-slate-800 dark:text-white">Nearby HelpUp</span>
          </div>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" className="hover:text-indigo-500 transition-colors">Security</a>
            <a href="#how-it-works" className="hover:text-indigo-500 transition-colors">Volunteering</a>
            <a href="#how-it-works" className="hover:text-indigo-500 transition-colors">Privacy</a>
          </div>
          <p className="text-[10px] font-semibold text-slate-400">
            &copy; {new Date().getFullYear()} Nearby HelpUp Ecosystem. Empowering neighborhood resilience.
          </p>
        </div>
      </footer>
    </div>
  );
};
