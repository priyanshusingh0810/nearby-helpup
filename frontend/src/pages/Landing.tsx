import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Star, 
  Check, 
  ChevronDown, 
  Users, 
  MapPin, 
  Clock, 
  Wrench, 
  Laptop, 
  BookOpen, 
  Stethoscope, 
  Sun, 
  Moon, 
  Zap, 
  HelpCircle,
  MessageSquare,
  Sparkles,
  Award,
  ChevronRight,
  Shield,
  PhoneCall,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AppFooter } from '../components/layout/AppFooter';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const stats = [
    { label: 'Active Neighbors', value: '14,200+', tag: 'Verified Residents' },
    { label: 'Requests Fulfilled', value: '5,800+', tag: 'Zero Commercial Fees' },
    { label: 'Avg Emergency Response', value: '< 4.2 Mins', tag: 'Within 5km Radius' },
    { label: 'Neighbor Trust Score', value: '4.96 / 5.0', tag: 'Peer Verification' },
  ];

  const categories = [
    { id: 'tools', name: 'Tools & Equipment', icon: Wrench, count: '140+ nearby', desc: 'Drills, ladders, lawn mowers, automotive tools' },
    { id: 'emergency', name: 'Emergency SOS & Medical', icon: Stethoscope, count: '24/7 Live', desc: 'Wheelchairs, oxygen concentrators, urgent aid' },
    { id: 'books', name: 'Study & Textbooks', icon: BookOpen, count: '95+ nearby', desc: 'Course textbooks, exam notes, lab kits' },
    { id: 'electronics', name: 'Electronics & Gear', icon: Laptop, count: '110+ nearby', desc: 'Chargers, monitors, camera rigs, adapters' },
    { id: 'skills', name: 'Volunteer & Skill Barter', icon: Users, count: '75+ mentors', desc: 'Coding tutoring, language practice, repairs' },
    { id: 'care', name: 'Community Care & Rides', icon: Heart, count: '85+ helpers', desc: 'Elderly assistance, pet sitting, campus rides' }
  ];

  const featuredRequests = [
    {
      id: 1,
      title: 'Bosch Pro 18V Cordless Hammer Drill & Kit',
      category: 'Tools & Equipment',
      owner: 'Arjun Verma',
      trustScore: 99,
      distance: '0.4 km',
      type: 'Borrow Request',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      badge: 'Immediate Match'
    },
    {
      id: 2,
      title: 'Portable Oxygen Concentrator & Oximeter Kit',
      category: 'Emergency Aid',
      owner: 'Dr. Anita Roy',
      trustScore: 100,
      distance: '0.6 km',
      type: 'SOS Aid',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      badge: 'Critical Medical'
    },
    {
      id: 3,
      title: 'Engineering Mathematics Vol. 3 & Gate Notes',
      category: 'Study & Books',
      owner: 'Priyanshu Sharma',
      trustScore: 96,
      distance: '0.2 km',
      type: 'Resource Share',
      image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=600&q=80',
      badge: 'Student Verified'
    },
    {
      id: 4,
      title: 'Sony Alpha 4K Video Gimbal & 3-Axis Stabilizer',
      category: 'Electronics',
      owner: 'Priya Mehta',
      trustScore: 97,
      distance: '1.2 km',
      type: 'Borrow Request',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      badge: 'Verified Member'
    }
  ];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Post a Request or Offer',
      desc: 'Need a power drill, emergency medicine, or want to volunteer? Share your request in seconds with category and urgency tags.',
      icon: Zap
    },
    {
      step: '02',
      title: 'Match with Verified Neighbors',
      desc: 'Our real-time 5km mesh alerts trusted neighbors nearby. Review their verified identity and trust score before connecting.',
      icon: Users
    },
    {
      step: '03',
      title: 'Coordinate in Real-Time',
      desc: 'Use in-app messaging to finalize pickup or assistance safely without ever exposing your private phone number or exact address.',
      icon: MessageSquare
    },
    {
      step: '04',
      title: 'Strengthen Your Community',
      desc: 'Complete the handoff, leave peer reviews, build your neighborhood reputation, and earn badges as a Top Community Helper.',
      icon: Award
    }
  ];

  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      role: 'Resident, Rohini Sector 16',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',
      text: 'When our power tripped during heavy rain, a neighbor 300 meters away shared an inverter generator within 15 minutes. Nearby HelpUp literally saved our medical supplies.',
      rating: 5
    },
    {
      name: 'Sneha Kulkarni',
      role: 'Student, DTU Campus',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
      text: 'I borrow tools and reference textbooks from senior students and lend my camera gear on weekends. Zero rental fees, zero hassle, and total mutual trust.',
      rating: 5
    },
    {
      name: 'Col. Rajesh Sen (Retd.)',
      role: 'RWA Secretary',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
      text: 'Instead of cluttered WhatsApp groups full of spam, Nearby HelpUp gives our society a structured, safe platform for real emergency response and neighborly help.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'Is Nearby HelpUp completely free for neighbors?',
      a: 'Yes, 100%. Nearby HelpUp is built as civic mutual-aid infrastructure. There are zero platform fees, zero subscription paywalls, and no commercial markups.'
    },
    {
      q: 'How does Nearby HelpUp protect my safety and privacy?',
      a: 'We never broadcast your exact building or GPS coordinates. Listings display only a generalized neighborhood radius (e.g. 500m). Personal contact numbers are kept private and communication happens via in-app chat.'
    },
    {
      q: 'What is the Neighbor Trust Score?',
      a: 'Every verified member starts with a baseline score. Verifying your identity, receiving positive ratings after item returns or assistance, and timely returns increase your score up to 100.'
    },
    {
      q: 'How does the Emergency SOS board work?',
      a: 'Emergency requests trigger instant push alerts to responders and active helpers within your immediate 5km radius, prioritizing urgent medical and safety needs.'
    }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(user ? `/home?search=${encodeURIComponent(searchVal)}` : `/login?search=${encodeURIComponent(searchVal)}`);
    } else {
      navigate(user ? '/home' : '/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] font-sans antialiased selection:bg-[#19A974] selection:text-white">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-white/95 dark:bg-[#102A43]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#19A974] text-white shadow-sm shadow-[#19A974]/30 transition-transform group-hover:scale-105 shrink-0">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-[#102A43] dark:text-white truncate">
                Nearby HelpUp
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#64748B] dark:text-[#9FB3C8] font-medium truncate">
                Hyperlocal Community Platform
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#64748B] dark:text-[#D9E2EC]">
            <a href="#how-it-works" className="hover:text-[#102A43] dark:hover:text-white transition-colors">How It Works</a>
            <a href="#categories" className="hover:text-[#102A43] dark:hover:text-white transition-colors">Categories</a>
            <a href="#community" className="hover:text-[#102A43] dark:hover:text-white transition-colors">Trust & Safety</a>
            <a href="#testimonials" className="hover:text-[#102A43] dark:hover:text-white transition-colors">Testimonials</a>
            <a href="#faqs" className="hover:text-[#102A43] dark:hover:text-white transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#102A43] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1A365D] transition-colors"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-[#102A43]" />}
            </button>

            {user ? (
              <Link
                to="/home"
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#19A974] hover:bg-[#148A5E] shadow-sm transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className="hidden xs:inline-flex px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-[#102A43] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1A365D] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#19A974] hover:bg-[#148A5E] shadow-sm shadow-[#19A974]/25 transition-all"
                >
                  <span className="hidden sm:inline">Join Neighborhood</span>
                  <span className="sm:hidden">Join</span>
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#102A43] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1A365D] md:hidden transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer for Landing */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 flex md:hidden bg-[#102A43]/75 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-72 max-w-[85vw] bg-white dark:bg-[#102A43] border-r border-[#E2E8F0] dark:border-[#1A365D] h-full p-5 flex flex-col justify-between text-[#1E293B] dark:text-white shadow-2xl animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-5 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A365D]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#19A974] text-white">
                      <Heart className="h-4 w-4 fill-white" />
                    </div>
                    <span className="text-sm font-bold text-[#102A43] dark:text-white">Nearby HelpUp</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 text-xs font-semibold">
                  {[
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Categories', href: '#categories' },
                    { label: 'Trust & Safety', href: '#community' },
                    { label: 'Testimonials', href: '#testimonials' },
                    { label: 'FAQs', href: '#faqs' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1A365D] text-[#1E293B] dark:text-[#F0F4F8] transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1A365D] flex flex-col gap-2.5">
                {user ? (
                  <Link
                    to="/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-[#19A974]"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-[#19A974]"
                    >
                      Join Neighborhood
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-[#102A43] dark:text-white border border-[#E2E8F0] dark:border-[#1A365D]"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#19A974]/10 via-[#38BDF8]/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Live Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0FDF8] dark:bg-[#19A974]/15 border border-[#19A974]/30 text-[#19A974] text-xs font-semibold mb-6 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19A974] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#19A974]" />
              </span>
              <span>14,000+ Verified Neighbors Within 5km</span>
            </div>

            {/* Clear Headline as requested */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#102A43] dark:text-white tracking-tight leading-[1.15]">
              Help Is Closer <br className="hidden sm:inline" />
              <span className="text-[#19A974]">Than You Think.</span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-base sm:text-lg text-[#64748B] dark:text-[#9FB3C8] leading-relaxed max-w-2xl mx-auto">
              Nearby HelpUp connects verified neighbors for instant mutual aid. Borrow daily tools, exchange skills, lend resources, and get emergency assistance right in your neighborhood.
            </p>

            {/* Prominent Action Buttons as requested */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to={user ? "/create-listing" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#19A974] hover:bg-[#148A5E] shadow-md shadow-[#19A974]/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Help Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to={user ? "/home" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#102A43] hover:bg-[#0B1D30] shadow-md shadow-[#102A43]/20 transition-all hover:-translate-y-0.5 active:translate-y-0 border border-[#243E63]"
              >
                <Heart className="h-4 w-4 text-[#19A974]" />
                <span>Become a Helper</span>
              </Link>
            </div>

            {/* Fast Neighborhood Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-md rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] p-1.5 transition-all focus-within:border-[#19A974] focus-within:ring-2 focus-within:ring-[#19A974]/20">
                <Search className="ml-3 h-5 w-5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Need a ladder, drill, blood donor, tutor, or wheelchair?"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none text-[#1E293B] dark:text-white placeholder-[#94A3B8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#19A974] hover:bg-[#148A5E] text-white text-xs font-bold transition-colors shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((item) => (
              <div 
                key={item.label}
                className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-5 shadow-xs text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-[#102A43] dark:text-white">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] mt-1">
                  {item.label}
                </div>
                <div className="text-[11px] text-[#19A974] font-medium mt-0.5">
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-[#102A43]/50 border-y border-[#E2E8F0] dark:border-[#1A365D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#19A974] bg-[#F0FDF8] dark:bg-[#19A974]/15 px-3 py-1 rounded-full">
              Simple & Reliable
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] dark:text-white mt-3">
              How Nearby HelpUp Works
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#9FB3C8] mt-2">
              Get assistance or lend a hand in four straightforward steps with full privacy and trust safeguards.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorksSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div 
                  key={s.step}
                  className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 relative flex flex-col justify-between hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-[#19A974]/15 text-[#19A974] flex items-center justify-center font-bold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-2xl font-black text-[#CBD5E1] dark:text-[#475569]">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#102A43] dark:text-white mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#9FB3C8] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Assistance Categories */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#19A974]">
                Explore By Need
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] dark:text-white mt-1">
                Popular Assistance Categories
              </h2>
            </div>
            <Link
              to={user ? "/home" : "/login"}
              className="mt-3 sm:mt-0 text-xs font-bold text-[#19A974] hover:text-[#148A5E] flex items-center gap-1"
            >
              <span>View all categories</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(user ? `/home?search=${encodeURIComponent(cat.name)}` : `/login?search=${encodeURIComponent(cat.name)}`)}
                  className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 hover:shadow-md hover:border-[#19A974]/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-[#F0FDF8] dark:bg-[#19A974]/20 text-[#19A974] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#19A974] bg-[#F0FDF8] dark:bg-[#19A974]/15 px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#102A43] dark:text-white group-hover:text-[#19A974] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#9FB3C8] mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Community Feed Preview */}
      <section className="py-20 bg-white dark:bg-[#102A43]/40 border-y border-[#E2E8F0] dark:border-[#1A365D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
              Live 5km Radar
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] dark:text-white mt-1">
              Active Neighbor Requests
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#9FB3C8] mt-2">
              Real-time needs and offers shared by verified residents in nearby sectors.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredRequests.map((item) => (
              <div 
                key={item.id}
                className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" 
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#102A43]/90 text-white shadow-xs">
                        {item.type}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#102A43] shadow-xs">
                        {item.distance}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#19A974]">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-[#102A43] dark:text-white mt-1 line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#E2E8F0] dark:border-[#334155] mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#64748B] dark:text-[#9FB3C8]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#19A974]" />
                    <span>{item.trustScore}% Trust</span>
                  </div>
                  <Link
                    to={user ? `/listing/${item.id}` : "/login"}
                    className="text-[11px] font-bold text-[#19A974] hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to={user ? "/home" : "/login"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#102A43] hover:bg-[#0B1D30] transition-colors"
            >
              <span>Explore All Nearby Requests</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#19A974]">
              Community Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] dark:text-white mt-1">
              Trusted by 14,000+ Neighbors
            </h2>
            <p className="text-sm text-[#64748B] dark:text-[#9FB3C8] mt-2">
              See how verified neighbors are creating safer, more resourceful neighborhoods.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#1E293B] dark:text-[#D9E2EC] leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#334155]">
                  <img 
                    src={t.avatar} 
                    alt={t.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[#19A974]" 
                  />
                  <div>
                    <h5 className="text-xs font-bold text-[#102A43] dark:text-white">
                      {t.name}
                    </h5>
                    <p className="text-[11px] text-[#64748B] dark:text-[#9FB3C8]">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 bg-white dark:bg-[#102A43]/30 border-t border-[#E2E8F0] dark:border-[#1A365D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#19A974]">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-[#102A43] dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-[#102A43] dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-[#64748B] transition-transform ${faqOpen === idx ? 'rotate-180 text-[#19A974]' : ''}`} />
                </button>
                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-[#64748B] dark:text-[#9FB3C8] leading-relaxed border-t border-[#E2E8F0] dark:border-[#334155]/60 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-[#102A43] via-[#1A365D] to-[#102A43] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#38BDF8] text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join Your Neighborhood Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Connect with Helpers Nearby?
          </h2>
          <p className="mt-3 text-sm text-[#D9E2EC] max-w-xl mx-auto">
            Get instant assistance for daily needs or lend your tools and skills to build a more resilient neighborhood.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#19A974] hover:bg-[#148A5E] shadow-lg shadow-[#19A974]/30 transition-all hover:-translate-y-0.5"
            >
              Get Started for Free
            </Link>
            <Link
              to="/emergency"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-[#EF4444] bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Emergency Radar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <AppFooter />
    </div>
  );
};
