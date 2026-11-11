import React, { useState, useEffect } from 'react';
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
  MessageSquare, 
  Sparkles, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  ArrowUp,
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  Shield,
  Layers,
  Radio,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // Interactive UI states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [searchVal, setSearchVal] = useState('');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'tools', name: 'Tools & Home Gear', icon: Wrench, count: '140+ available', desc: 'Power drills, ladders, lawn mowers, automotive tools' },
    { id: 'emergency', name: 'Emergency SOS & Aid', icon: Stethoscope, count: '24/7 Live Radar', desc: 'Wheelchairs, oxygen concentrators, urgent medicine' },
    { id: 'books', name: 'Study & Course Texts', icon: BookOpen, count: '95+ active', desc: 'Engineering textbooks, exam notes, lab kits' },
    { id: 'electronics', name: 'Electronics & Audio', icon: Laptop, count: '110+ available', desc: 'Monitors, camera rigs, adapters, power banks' },
    { id: 'skills', name: 'Volunteer & Skill Barter', icon: Users, count: '75+ mentors', desc: 'Peer tutoring, coding mentorship, home repairs' },
    { id: 'care', name: 'Neighborhood Care', icon: Heart, count: '85+ helpers', desc: 'Senior assistance, pet sitting, campus transit' }
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
      title: 'Post a Request or Resource',
      desc: 'Need a drill, urgent medicine, or have tools to lend? Share your request with radius and urgency tags in seconds.',
      icon: Zap,
      gradient: 'from-[#b89cfe] to-[#624ff3]',
      shadow: 'shadow-purple-sq'
    },
    {
      step: '02',
      title: 'Match with Nearby Neighbors',
      desc: 'Our real-time 5km radar alerts verified neighbors. Review their trust rating and identity credentials beforehand.',
      icon: Users,
      gradient: 'from-[#ff92a5] to-[#ff67a3]',
      shadow: 'shadow-pink-sq'
    },
    {
      step: '03',
      title: 'Coordinate with Private Chat',
      desc: 'Use built-in direct messaging to safely finalize pickup without ever disclosing your exact flat or phone number.',
      icon: MessageSquare,
      gradient: 'from-[#ffb37a] to-[#ff884a]',
      shadow: 'shadow-orange-sq'
    },
    {
      step: '04',
      title: 'Build Community Trust',
      desc: 'Complete the exchange, leave mutual feedback, and boost your local Trust Score as a recognized neighborhood helper.',
      icon: Award,
      gradient: 'from-[#2D3D82] to-[#4E6EF1]',
      shadow: 'shadow-brand-glow'
    }
  ];

  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      role: 'Resident, Rohini Sector 16',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      text: 'When our power tripped during heavy rain, a neighbor 300 meters away shared an inverter generator within 15 minutes. Nearby HelpUp literally saved our medical supplies.',
      rating: 5
    },
    {
      name: 'Sneha Kulkarni',
      role: 'Student, DTU Campus',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      text: 'I borrow tools and reference textbooks from senior students and lend my camera gear on weekends. Zero rental fees, zero hassle, and total mutual trust.',
      rating: 5
    },
    {
      name: 'Col. Rajesh Sen (Retd.)',
      role: 'RWA President',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
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
      a: 'Emergency requests trigger instant push alerts to responders and active helpers within your immediate 5km radius, prioritizing urgent medical, safety, and transit distress beacons.'
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

  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-[#5E678C] dark:text-[#9FB3C8] font-sen antialiased selection:bg-[#4E6EF1] selection:text-white relative overflow-x-hidden">
      
      {/* 1. AppGrids Top Navbar */}
      <header className={`w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'fixed top-0 left-0 bg-white/95 dark:bg-[#102A43]/95 backdrop-blur-md py-3 shadow-nav-sticky border-b border-slate-100 dark:border-slate-800' 
          : 'relative bg-white dark:bg-[#0F172A] py-5 border-b border-slate-100/70 dark:border-slate-800/70'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo (AppGrids Inspired Brand Mark) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-tr from-[#4E6EF1] to-[#38BDF8] text-white shadow-brand-glow transition-transform group-hover:scale-105 shrink-0">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#1D2A5D] dark:text-white leading-tight">
                Nearby<span className="text-[#4E6EF1]">HelpUp</span>
              </span>
              <span className="text-[10px] text-[#5E678C] dark:text-slate-400 font-medium">
                Mutual Aid & Sharing
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9 text-base font-medium text-[#5E678C] dark:text-slate-300">
            <a href="#how-it-works" className="hover:text-[#4E6EF1] dark:hover:text-white transition-colors relative py-1">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#4E6EF1] dark:hover:text-white transition-colors relative py-1">
              Features
            </a>
            <a href="#explore" className="hover:text-[#4E6EF1] dark:hover:text-white transition-colors relative py-1">
              Explore 5km
            </a>
            <a href="#testimonials" className="hover:text-[#4E6EF1] dark:hover:text-white transition-colors relative py-1">
              Reviews
            </a>
            <a href="#faq" className="hover:text-[#4E6EF1] dark:hover:text-white transition-colors relative py-1">
              FAQ
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-[10px] text-[#5E678C] hover:text-[#1D2A5D] dark:hover:text-white bg-[rgba(78,110,241,0.05)] dark:bg-slate-800 transition-colors"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5 text-[#1D2A5D]" />}
            </button>

            {user ? (
              <Link
                to="/home"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold font-hind text-white bg-[#4E6EF1] hover:bg-[#3C5CE0] shadow-brand-glow transition-all hover:-translate-y-0.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2.5 rounded-[10px] text-sm font-semibold font-hind text-[#1D2A5D] dark:text-white hover:text-[#4E6EF1] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] text-sm font-semibold font-hind text-white bg-[#4E6EF1] hover:bg-[#3C5CE0] shadow-brand-glow transition-all hover:-translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggler */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-[10px] text-[#1D2A5D] dark:text-white bg-[rgba(78,110,241,0.05)] dark:bg-slate-800 lg:hidden transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 flex lg:hidden bg-[#1D2A5D]/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-72 max-w-[85vw] bg-white dark:bg-[#102A43] border-r border-slate-100 dark:border-slate-800 h-full p-6 flex flex-col justify-between text-[#1D2A5D] dark:text-white shadow-2xl animate-slide-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#4E6EF1] text-white">
                      <Heart className="h-4 w-4 fill-white" />
                    </div>
                    <span className="text-base font-bold text-[#1D2A5D] dark:text-white">Nearby HelpUp</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 text-sm font-medium">
                  {[
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Features', href: '#features' },
                    { label: 'Explore 5km', href: '#explore' },
                    { label: 'Community Reviews', href: '#testimonials' },
                    { label: 'Frequently Asked Questions', href: '#faq' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl hover:bg-[rgba(78,110,241,0.06)] hover:text-[#4E6EF1] text-[#5E678C] dark:text-slate-200 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5 font-hind">
                {user ? (
                  <Link
                    to="/home"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-[10px] text-center text-sm font-semibold text-white bg-[#4E6EF1]"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-[10px] text-center text-sm font-semibold text-white bg-[#4E6EF1] shadow-brand-glow"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 rounded-[10px] text-center text-sm font-semibold text-[#1D2A5D] dark:text-white border border-slate-200 dark:border-slate-700"
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

      {/* 2. AppGrids Hero Section with Phone Mockup */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#FBFBFE] via-white to-white dark:from-[#0F172A] dark:via-[#102A43]/30 dark:to-[#0F172A]">
        {/* Abstract Curved Gradient Vector in Background (AppGrids Signature) */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#b89cfe]/25 via-[#ff92a5]/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#4E6EF1]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (Headline, Copy, AppGrids CTAs & Search) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(78,110,241,0.08)] dark:bg-[#4E6EF1]/20 text-[#4E6EF1] dark:text-[#7A98F7] text-xs font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4E6EF1] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4E6EF1]" />
                </span>
                <span>Hyperlocal Mutual Aid & Resource Sharing</span>
              </div>

              {/* Commanding Hero H1 */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#1D2A5D] dark:text-white leading-[1.15] tracking-tight mb-6">
                Borrow, Share & Help <br />
                <span className="text-[#4E6EF1]">Right In Your Area.</span>
              </h1>

              {/* Body Text */}
              <p className="text-lg text-[#5E678C] dark:text-slate-300 leading-[28px] mb-8 pr-0 lg:pr-12">
                Connect with verified neighbors to share tools, exchange skills, lend daily essentials, and respond to critical local emergencies within a 5km radius.
              </p>

              {/* AppGrids Dual Buttons */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto font-hind">
                <Link
                  to={user ? "/create-listing" : "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[10px] font-semibold text-lg text-white bg-[#4E6EF1] hover:bg-[#3C5CE0] shadow-brand-glow transition-all hover:-translate-y-0.5"
                >
                  <span>Request Assistance</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <Link
                  to={user ? "/home" : "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[10px] font-semibold text-lg text-[#4E6EF1] dark:text-white border-2 border-[#4E6EF1] hover:bg-[#4E6EF1] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <Heart className="h-5 w-5" />
                  <span>Explore Network</span>
                </Link>
              </div>

              {/* Live Search Bar Widget */}
              <div className="mt-9 w-full max-w-xl">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white dark:bg-[#1E293B] rounded-[14px] p-2 shadow-card-soft border border-slate-200/80 dark:border-slate-700 transition-all focus-within:border-[#4E6EF1] focus-within:ring-2 focus-within:ring-[#4E6EF1]/20">
                  <Search className="ml-3 h-5 w-5 text-[#4E6EF1] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search drill, ladder, textbook, wheelchair, donor..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-transparent outline-none text-[#1D2A5D] dark:text-white placeholder-[#94A3B8]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-[10px] bg-[#4E6EF1] hover:bg-[#3C5CE0] text-white text-xs font-bold font-hind transition-colors shrink-0 shadow-xs"
                  >
                    Search Radius
                  </button>
                </form>
              </div>

              {/* Micro Trust Points */}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-[#5E678C] dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#4E6EF1]" />
                  <span>100% Free Mutual Aid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#4E6EF1]" />
                  <span>Verified Neighbor IDs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Radio className="h-4 w-4 text-[#ff67a3]" />
                  <span>Live 5km Radar Mesh</span>
                </div>
              </div>
            </div>

            {/* Right Column (AppGrids Phone Mockup & Floating Badges) */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Outer Phone Mockup Frame */}
              <div className="relative w-[295px] sm:w-[325px] rounded-[48px] p-3.5 bg-[#1D2A5D] shadow-2xl border-4 border-slate-200 dark:border-slate-800">
                
                {/* Speaker Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#102A43] rounded-full z-20 flex items-center justify-center">
                  <div className="h-1.5 w-10 bg-slate-700 rounded-full" />
                </div>

                {/* Inner Device Screen */}
                <div className="rounded-[36px] bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden pt-8 pb-5 px-4 flex flex-col gap-3.5 border border-slate-200 dark:border-slate-700/60 text-left">
                  
                  {/* Phone Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-[#4E6EF1] flex items-center justify-center text-white">
                        <Heart className="h-3.5 w-3.5 fill-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1D2A5D] dark:text-white">Nearby HelpUp</div>
                        <div className="text-[9px] text-[#4E6EF1] font-semibold">5km Perimeter Radar</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold bg-[#EF4444]/15 text-[#EF4444] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-ping" />
                      Live
                    </span>
                  </div>

                  {/* SOS Alert Card inside Phone */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-[#EF4444]/15 to-rose-50 dark:from-[#EF4444]/25 dark:to-transparent border border-[#EF4444]/30 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#EF4444]">
                      <span className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> Emergency Beacon</span>
                      <span>400m Away</span>
                    </div>
                    <div className="text-xs font-bold text-[#1D2A5D] dark:text-white">Oxygen Concentrator Kit</div>
                    <div className="text-[10px] text-slate-500">Dr. Anita Roy • Responders Dispatched</div>
                  </div>

                  {/* Active Tool Share Card inside Phone */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=150&q=80" 
                      alt="" 
                      className="h-12 w-12 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-[#4E6EF1] uppercase tracking-wider">Available to Borrow</span>
                      <div className="text-xs font-bold text-[#1D2A5D] dark:text-white truncate">Bosch Hammer Drill Kit</div>
                      <div className="text-[10px] text-slate-400">Arjun V. • 99% Trust Score</div>
                    </div>
                  </div>

                  {/* Campus Textbooks Card inside Phone */}
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&w=150&q=80" 
                      alt="" 
                      className="h-12 w-12 rounded-xl object-cover shrink-0" 
                    />
                    <div className="min-w-0">
                      <span className="text-[9px] font-bold text-[#19A974] uppercase tracking-wider">Skill & Study Barter</span>
                      <div className="text-xs font-bold text-[#1D2A5D] dark:text-white truncate">Eng. Mathematics Vol 3</div>
                      <div className="text-[10px] text-slate-400">Priyanshu S. • 200m Away</div>
                    </div>
                  </div>

                  {/* Phone Bottom Nav Preview */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-around text-slate-400">
                    <div className="text-[#4E6EF1] flex flex-col items-center text-[9px] font-bold">
                      <Radio className="h-4 w-4" />
                      <span>Radar</span>
                    </div>
                    <div className="flex flex-col items-center text-[9px]">
                      <Wrench className="h-4 w-4" />
                      <span>Items</span>
                    </div>
                    <div className="flex flex-col items-center text-[9px]">
                      <MessageSquare className="h-4 w-4" />
                      <span>Chat</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 (Trust Badge Top Left) */}
              <div className="absolute -top-4 -left-6 sm:-left-12 bg-white dark:bg-[#1E293B] p-3.5 rounded-[18px] shadow-card-soft border border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-bounce duration-1000">
                <div className="h-10 w-10 rounded-[12px] bg-gradient-to-b from-[#b89cfe] to-[#624ff3] text-white flex items-center justify-center font-bold shadow-purple-sq">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1D2A5D] dark:text-white">99% Trust Rating</div>
                  <div className="text-[10px] text-[#5E678C]">Peer Verified Neighbors</div>
                </div>
              </div>

              {/* Floating Badge 2 (Speed Badge Bottom Right) */}
              <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-white dark:bg-[#1E293B] p-3.5 rounded-[18px] shadow-card-soft border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-gradient-to-b from-[#ff92a5] to-[#ff67a3] text-white flex items-center justify-center font-bold shadow-pink-sq">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1D2A5D] dark:text-white">&lt; 4.2 Mins Avg</div>
                  <div className="text-[10px] text-[#5E678C]">Emergency Response</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. AppGrids Awesome Features Section (3-Column with Gradient Squircles) */}
      <section id="features" className="py-24 bg-white dark:bg-[#0F172A] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white tracking-tight">
              Awesome Hyperlocal Features
            </h2>
            <p className="text-lg text-[#5E678C] dark:text-slate-400 mt-3 leading-[27px]">
              Everything you need to share resources, volunteer, and get emergency help safely within your 5km community.
            </p>
          </div>

          {/* 3-Column Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Purple Squircle */}
            <div className="text-center p-8 rounded-[24px] bg-[#FBFBFE] dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800 hover:shadow-card-soft transition-all duration-300 group">
              <div className="w-[114px] h-[114px] mx-auto mb-8 rounded-[18px] flex items-center justify-center text-white bg-gradient-to-b from-[#b89cfe] to-[#624ff3] shadow-purple-sq transition-transform group-hover:scale-105">
                <Wrench className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[#1D2A5D] dark:text-white mb-4">
                Tool & Gear Sharing
              </h3>
              <p className="text-lg text-[#5E678C] dark:text-slate-400 leading-[27px]">
                Borrow power drills, ladders, lawn mowers, camping gear, and electronics from verified neighbors without renting or buying new.
              </p>
            </div>

            {/* Feature 2: Pink Squircle */}
            <div className="text-center p-8 rounded-[24px] bg-[#FBFBFE] dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800 hover:shadow-card-soft transition-all duration-300 group">
              <div className="w-[114px] h-[114px] mx-auto mb-8 rounded-[18px] flex items-center justify-center text-white bg-gradient-to-b from-[#ff92a5] to-[#ff67a3] shadow-pink-sq transition-transform group-hover:scale-105">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[#1D2A5D] dark:text-white mb-4">
                Emergency SOS Dispatch
              </h3>
              <p className="text-lg text-[#5E678C] dark:text-slate-400 leading-[27px]">
                Instant time-critical distress beacons for urgent medical supplies, transit assistance, and emergency repairs alerted to nearby responders.
              </p>
            </div>

            {/* Feature 3: Orange Squircle */}
            <div className="text-center p-8 rounded-[24px] bg-[#FBFBFE] dark:bg-[#1E293B]/60 border border-slate-100 dark:border-slate-800 hover:shadow-card-soft transition-all duration-300 group">
              <div className="w-[114px] h-[114px] mx-auto mb-8 rounded-[18px] flex items-center justify-center text-white bg-gradient-to-b from-[#ffb37a] to-[#ff884a] shadow-orange-sq transition-transform group-hover:scale-105">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[#1D2A5D] dark:text-white mb-4">
                Skill Barter & Circles
              </h3>
              <p className="text-lg text-[#5E678C] dark:text-slate-400 leading-[27px]">
                Exchange skills, tutor peers, join local interest circles, and build a lasting reputation as a recognized Top Community Helper.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. AppGrids "Why Use This App" (2-Column with Phone Showcase) */}
      <section className="py-24 bg-[#FBFBFE] dark:bg-[#102A43]/40 border-y border-slate-100 dark:border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Phone Showcase Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[290px] sm:w-[320px] rounded-[48px] p-3.5 bg-[#1D2A5D] shadow-2xl border-4 border-slate-200 dark:border-slate-800">
                <div className="rounded-[36px] bg-white dark:bg-[#0F172A] overflow-hidden p-5 flex flex-col gap-4 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-[#1D2A5D] dark:text-white">Community Circles</span>
                    <span className="text-[10px] font-bold text-[#4E6EF1] bg-[rgba(78,110,241,0.08)] px-2.5 py-0.5 rounded-full">DTU Sector</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[rgba(78,110,241,0.06)] to-transparent border border-[#4E6EF1]/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-[#4E6EF1] text-white flex items-center justify-center font-bold">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1D2A5D] dark:text-white">Rohini Volunteer Circle</div>
                        <div className="text-[10px] text-slate-500">240 active neighbors</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5E678C] dark:text-slate-300">
                      "Organizing weekend society park cleanups and urgent medical blood donor relays."
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Neighbor Trust Score:</span>
                    <span className="font-bold text-[#19A974] flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" /> 100% Verified
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Commercial Fees:</span>
                    <span className="font-bold text-[#4E6EF1]">₹0 (Free Forever)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: "Why Use This App" Plan Items */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white mb-4 tracking-tight">
                Why Use Nearby HelpUp
              </h2>
              <p className="text-lg text-[#5E678C] dark:text-slate-300 leading-[27px] mb-10">
                Traditional social platforms are noisy, ad-driven, and full of commercial promotions. Nearby HelpUp is purpose-built for clean, verified, instant civic mutual aid.
              </p>

              {/* Single Plan Items (AppGrids Style with Squircles) */}
              <div className="flex flex-col gap-8 w-full">
                
                {/* Plan 1 */}
                <div className="flex items-start gap-5">
                  <div className="w-[77px] h-[77px] min-w-[77px] rounded-[18px] flex items-center justify-center text-white bg-gradient-to-b from-[#b89cfe] to-[#624ff3] shadow-purple-sq shrink-0">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-2">
                      100% Free & Peer-Verified
                    </h3>
                    <p className="text-base text-[#5E678C] dark:text-slate-400 leading-[26px]">
                      Zero commercial markups, zero middleman cuts, and zero subscription paywalls. Run by neighbors for neighbors.
                    </p>
                  </div>
                </div>

                {/* Plan 2 */}
                <div className="flex items-start gap-5">
                  <div className="w-[77px] h-[77px] min-w-[77px] rounded-[18px] flex items-center justify-center text-white bg-gradient-to-b from-[#ff92a5] to-[#ff67a3] shadow-pink-sq shrink-0">
                    <Shield className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-2">
                      Guaranteed Privacy Protection
                    </h3>
                    <p className="text-base text-[#5E678C] dark:text-slate-400 leading-[26px]">
                      Your exact house number and phone number are never made public. Coordinate comfortably via end-to-end platform chat.
                    </p>
                  </div>
                </div>

                {/* Plan 3 */}
                <div className="flex items-start gap-5">
                  <div className="w-[77px] h-[77px] min-w-[77px] rounded-[18px] flex items-center justify-center text-white bg-gradient-to-b from-[#ffb37a] to-[#ff884a] shadow-orange-sq shrink-0">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-2">
                      Verifiable Resident Trust Scores
                    </h3>
                    <p className="text-base text-[#5E678C] dark:text-slate-400 leading-[26px]">
                      Every member builds reputation through ID verification, on-time item returns, and mutual ratings from neighbors.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. AppGrids App Info & Statistics Counter Section */}
      <section className="py-24 bg-white dark:bg-[#0F172A] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading + 3 Metric Cards */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white tracking-tight mb-4">
                Nearby HelpUp in Statistics & Impact
              </h2>
              <p className="text-lg text-[#5E678C] dark:text-slate-400 leading-[27px] mb-10">
                Growing rapidly across university campuses and residential apartment societies to foster genuine community resilience.
              </p>

              {/* 3 Metric / Info Cards (AppGrids `.app-info` Card Pattern) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-8">
                
                {/* Stat 1: Orange */}
                <div className="bg-white dark:bg-[#1E293B] rounded-[18px] py-9 px-4 text-center shadow-card-soft border border-slate-100 dark:border-slate-800">
                  <div className="inline-flex px-5 py-3 mb-4 rounded-[14px] bg-gradient-to-b from-[#F9813E] to-[#FFB489] text-white text-[32px] font-extrabold leading-none shadow-orange-sq">
                    14K+
                  </div>
                  <h4 className="text-lg font-bold text-[#1D2A5D] dark:text-white">Active Neighbors</h4>
                  <p className="text-xs text-[#5E678C] mt-1">Within 5km radius</p>
                </div>

                {/* Stat 2: Indigo */}
                <div className="bg-white dark:bg-[#1E293B] rounded-[18px] py-9 px-4 text-center shadow-card-soft border border-slate-100 dark:border-slate-800">
                  <div className="inline-flex px-5 py-3 mb-4 rounded-[14px] bg-gradient-to-b from-[#2D3D82] to-[#4E6EF1] text-white text-[32px] font-extrabold leading-none shadow-brand-glow">
                    5.8K+
                  </div>
                  <h4 className="text-lg font-bold text-[#1D2A5D] dark:text-white">Requests Met</h4>
                  <p className="text-xs text-[#5E678C] mt-1">Zero rental fees</p>
                </div>

                {/* Stat 3: Violet */}
                <div className="bg-white dark:bg-[#1E293B] rounded-[18px] py-9 px-4 text-center shadow-card-soft border border-slate-100 dark:border-slate-800">
                  <div className="inline-flex px-5 py-3 mb-4 rounded-[14px] bg-gradient-to-b from-[#9B63E2] to-[#DE8686] text-white text-[32px] font-extrabold leading-none shadow-purple-sq">
                    4.96
                  </div>
                  <h4 className="text-lg font-bold text-[#1D2A5D] dark:text-white">Trust Rating</h4>
                  <p className="text-xs text-[#5E678C] mt-1">Out of 5.0 score</p>
                </div>

              </div>

              <p className="text-base text-[#5E678C] dark:text-slate-400 leading-relaxed">
                Over 98.4% of borrowed tools and electronics are returned in identical or better condition, demonstrating the power of peer accountability.
              </p>
            </div>

            {/* Right Column: Interactive Phone Mockup with Search & Map */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[290px] sm:w-[320px] rounded-[48px] p-3.5 bg-[#1D2A5D] shadow-2xl border-4 border-slate-200 dark:border-slate-800">
                <div className="rounded-[36px] bg-[#F8FAFC] dark:bg-[#0F172A] overflow-hidden p-5 flex flex-col gap-3.5 text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-[#1D2A5D] dark:text-white">Active Feed Filters</span>
                    <span className="text-[10px] text-slate-400">Rohini Sector 16</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['All Needs', 'Tools', 'Medical SOS', 'Textbooks', 'Skills'].map((filter, i) => (
                      <span 
                        key={filter}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          i === 0 ? 'bg-[#4E6EF1] text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {filter}
                      </span>
                    ))}
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1D2A5D] dark:text-white mb-1">
                      <span>Sony 4K Video Gimbal</span>
                      <span className="text-[#4E6EF1]">1.2 km</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Lending available for weekend student projects.</p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1D2A5D] dark:text-white mb-1">
                      <span>Aluminium Extension Ladder</span>
                      <span className="text-[#4E6EF1]">600 m</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Borrow request for ceiling repairs.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. How It Works (AppGrids Step Cards 01 - 04) */}
      <section id="how-it-works" className="py-24 bg-[#FBFBFE] dark:bg-[#102A43]/40 border-y border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white tracking-tight">
              How Nearby HelpUp Works
            </h2>
            <p className="text-lg text-[#5E678C] dark:text-slate-400 mt-3 leading-[27px]">
              Simple, transparent, and private mutual coordination in four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div 
                  key={s.step}
                  className="bg-white dark:bg-[#1E293B] rounded-[20px] p-6 shadow-card-soft border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`h-12 w-12 rounded-[14px] bg-gradient-to-b ${s.gradient} text-white flex items-center justify-center font-bold ${s.shadow}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-3xl font-extrabold text-slate-200 dark:text-slate-700">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-2.5">
                      {s.title}
                    </h3>
                    <p className="text-sm text-[#5E678C] dark:text-slate-400 leading-[24px]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Explore Categories (Assistance Hubs) */}
      <section id="explore" className="py-24 bg-white dark:bg-[#0F172A] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white tracking-tight">
                Assistance Hubs
              </h2>
              <p className="text-lg text-[#5E678C] dark:text-slate-400 mt-2">
                Browse requests and offers by category across your neighborhood.
              </p>
            </div>
            <Link
              to={user ? "/home" : "/login"}
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-base font-semibold font-hind text-[#4E6EF1] hover:text-[#3C5CE0] transition-colors"
            >
              <span>View all categories</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(user ? `/home?search=${encodeURIComponent(cat.name)}` : `/login?search=${encodeURIComponent(cat.name)}`)}
                  className="bg-white dark:bg-[#1E293B] rounded-[20px] p-6 shadow-card-soft border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-[#4E6EF1]/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-[14px] bg-[rgba(78,110,241,0.08)] text-[#4E6EF1] flex items-center justify-center group-hover:bg-[#4E6EF1] group-hover:text-white transition-all">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold text-[#4E6EF1] bg-[rgba(78,110,241,0.08)] px-3 py-1 rounded-full">
                        {cat.count}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white group-hover:text-[#4E6EF1] transition-colors mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-[#5E678C] dark:text-slate-400 leading-[24px]">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. Live Active Requests Radar Feed */}
      <section className="py-24 bg-[#FBFBFE] dark:bg-[#102A43]/40 border-y border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white tracking-tight">
              Active Neighbor Requests
            </h2>
            <p className="text-lg text-[#5E678C] dark:text-slate-400 mt-2">
              Recent needs and offers from verified neighbors in nearby residential sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRequests.map((item) => (
              <div 
                key={item.id}
                className="bg-white dark:bg-[#1E293B] rounded-[20px] overflow-hidden shadow-card-soft border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#1D2A5D]/90 text-white shadow-xs">
                        {item.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#1D2A5D] shadow-xs">
                        {item.distance}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E6EF1]">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#1D2A5D] dark:text-white mt-1 line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-[#19A974]">
                    <ShieldCheck className="h-4 w-4" />
                    <span>{item.trustScore}% Trust</span>
                  </div>
                  <Link
                    to={user ? `/listing/${item.id}` : "/login"}
                    className="font-bold text-[#4E6EF1] hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={user ? "/home" : "/login"}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[10px] font-semibold font-hind text-white bg-[#1D2A5D] hover:bg-[#102A43] transition-colors shadow-md"
            >
              <span>Explore All Nearby Requests</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 9. AppGrids Testimonials ("What Users Says") */}
      <section id="testimonials" className="py-24 bg-white dark:bg-[#0F172A] relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white tracking-tight mb-14">
            What Neighbors Say
          </h2>

          {/* Testimonial Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center"
              >
                {/* Circular Avatar */}
                <div className="w-20 h-20 rounded-full mx-auto mb-7 overflow-hidden border-2 border-white shadow-md ring-4 ring-[rgba(78,110,241,0.15)]">
                  <img 
                    src={testimonials[testimonialIdx].avatar} 
                    alt={testimonials[testimonialIdx].name}
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Text (AppGrids Typography: 17px bold #5E678C leading-27px) */}
                <p className="text-lg sm:text-xl font-bold text-[#5E678C] dark:text-slate-300 leading-[32px] max-w-2xl mx-auto mb-8">
                  "{testimonials[testimonialIdx].text}"
                </p>

                {/* Author Name & Role */}
                <h4 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-1">
                  {testimonials[testimonialIdx].name}
                </h4>
                <p className="text-base text-[#5E678C] dark:text-slate-400">
                  {testimonials[testimonialIdx].role}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* AppGrids Arrow Navigation Buttons */}
            <div className="flex items-center justify-center gap-5 mt-10">
              <button
                onClick={prevTestimonial}
                className="w-[50px] h-[50px] rounded-full bg-[rgba(78,110,241,0.06)] dark:bg-slate-800 text-[#1D2A5D] dark:text-white flex items-center justify-center hover:bg-[#4E6EF1] hover:text-white transition-all shadow-xs"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-[50px] h-[50px] rounded-full bg-[rgba(78,110,241,0.06)] dark:bg-slate-800 text-[#1D2A5D] dark:text-white flex items-center justify-center hover:bg-[#4E6EF1] hover:text-white transition-all shadow-xs"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 10. AppGrids Call To Action Banner ("Install and Start Using") */}
      <section className="py-24 bg-[#FBFBFE] dark:bg-[#102A43]/50 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Headline & Store Buttons */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#1D2A5D] dark:text-white leading-tight mb-5">
                Install and Start Using Nearby HelpUp
              </h2>
              <p className="text-lg text-[#5E678C] dark:text-slate-300 leading-[28px] mb-9 pr-0 lg:pr-10">
                Join over 14,000 verified residents sharing daily tools, skills, and emergency aid. Free to download, free to use, and always focused on your neighborhood.
              </p>

              {/* AppGrids Store Button Group */}
              <div className="flex flex-wrap items-center gap-5">
                
                {/* App Store Button (Primary #4E6EF1) */}
                <Link
                  to="/login"
                  className="inline-flex items-center bg-[#4E6EF1] hover:bg-[#3C5CE0] text-white rounded-[10px] px-6 py-3.5 shadow-brand-glow transition-all hover:-translate-y-0.5"
                >
                  <svg className="h-7 w-7 mr-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.36-.56.65-.98 1.7-0.85 2.73 1.01.08 2-.49 2.58-1.24z"/>
                  </svg>
                  <div className="text-left font-hind">
                    <span className="text-[10px] uppercase tracking-wider block text-white/80 leading-tight">Available on the</span>
                    <span className="text-base font-bold block text-white leading-tight">App Store</span>
                  </div>
                </Link>

                {/* Google Play Store Button (White Card) */}
                <Link
                  to="/login"
                  className="inline-flex items-center bg-white hover:bg-slate-50 text-[#1D2A5D] rounded-[10px] px-6 py-3.5 shadow-store-btn border border-slate-200/80 transition-all hover:-translate-y-0.5"
                >
                  <svg className="h-7 w-7 mr-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <div className="text-left font-hind">
                    <span className="text-[10px] uppercase text-[#5E678C] block leading-tight">Download on</span>
                    <span className="text-base font-bold text-[#1D2A5D] block leading-tight">Google Play</span>
                  </div>
                </Link>

              </div>
            </div>

            {/* Right: Phone Store Preview Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[280px] sm:w-[310px] rounded-[44px] p-3.5 bg-[#1D2A5D] shadow-2xl border-4 border-slate-200 dark:border-slate-800 text-left">
                <div className="rounded-[32px] bg-white dark:bg-[#0F172A] p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#4E6EF1] to-[#38BDF8] text-white flex items-center justify-center font-bold">
                      <Heart className="h-6 w-6 fill-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1D2A5D] dark:text-white">Nearby HelpUp</div>
                      <div className="text-[11px] text-[#4E6EF1]">Mutual Aid OS</div>
                      <div className="flex text-amber-400 text-xs mt-0.5">★★★★★ 4.96</div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-[#5E678C] dark:text-slate-300">
                    "Ranked #1 Hyperlocal Community & Resource Sharing Network for Neighbors."
                  </div>

                  <Link
                    to="/login"
                    className="w-full py-2.5 rounded-xl bg-[#4E6EF1] text-white font-bold text-xs text-center shadow-sm"
                  >
                    Open Web App
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 11. FAQ Accordion */}
      <section id="faq" className="py-24 bg-white dark:bg-[#0F172A] relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D2A5D] dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#5E678C] dark:text-slate-400 mt-2">
              Everything you need to know about peer privacy, trust scores, and coordination.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#FBFBFE] dark:bg-[#1E293B] border border-slate-200/80 dark:border-slate-800 rounded-[18px] overflow-hidden transition-all text-left"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-bold text-[#1D2A5D] dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-[#4E6EF1] transition-transform duration-200 shrink-0 ${faqOpen === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-sm text-[#5E678C] dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-4"
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

      {/* 12. AppGrids Footer Layout */}
      <footer className="pt-24 pb-8 bg-white dark:bg-[#0F172A] border-t border-[rgba(29,42,93,0.12)] dark:border-slate-800 text-left relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
            
            {/* Col 1: Brand Info (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-12">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-tr from-[#4E6EF1] to-[#38BDF8] text-white shadow-brand-glow">
                  <Heart className="h-5 w-5 fill-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-[#1D2A5D] dark:text-white">
                  Nearby<span className="text-[#4E6EF1]">HelpUp</span>
                </span>
              </Link>
              <p className="text-base text-[#5E678C] dark:text-slate-400 leading-[26px] mb-8">
                Hyperlocal civic mutual aid network. Empowering verified neighbors to share tools, exchange skills, and coordinate rapid emergency response within 5km.
              </p>

              {/* AppGrids Social Icons */}
              <div className="flex items-center gap-3">
                {['Twitter', 'Instagram', 'Facebook', 'LinkedIn'].map((platform, i) => (
                  <a
                    key={platform}
                    href="#social"
                    className="w-10 h-10 rounded-[6px] bg-[rgba(78,110,241,0.08)] dark:bg-slate-800 text-[#5E678C] hover:bg-[#ff67a3] hover:text-white flex items-center justify-center transition-all"
                    title={platform}
                  >
                    <Share2 className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Assistance Hubs (2-3 cols) */}
            <div className="lg:col-span-3 flex flex-col">
              <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-6">
                Assistance Hubs
              </h3>
              <ul className="flex flex-col gap-3 text-base text-[#5E678C] dark:text-slate-400">
                <li><Link to="/home?search=Tools" className="hover:text-[#4E6EF1] transition-colors">Tools & Home Gear</Link></li>
                <li><Link to="/emergency" className="hover:text-[#EF4444] transition-colors flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-[#EF4444]" /> Emergency SOS</Link></li>
                <li><Link to="/home?search=Books" className="hover:text-[#4E6EF1] transition-colors">Textbooks & Notes</Link></li>
                <li><Link to="/home?search=Electronics" className="hover:text-[#4E6EF1] transition-colors">Electronics & Rigs</Link></li>
                <li><Link to="/communities" className="hover:text-[#4E6EF1] transition-colors">Local Communities</Link></li>
              </ul>
            </div>

            {/* Col 3: Quick Navigation (2 cols) */}
            <div className="lg:col-span-2 flex flex-col">
              <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-6">
                Navigation
              </h3>
              <ul className="flex flex-col gap-3 text-base text-[#5E678C] dark:text-slate-400">
                <li><Link to="/home" className="hover:text-[#4E6EF1] transition-colors">Neighbor Feed</Link></li>
                <li><Link to="/create-listing" className="hover:text-[#4E6EF1] transition-colors">Request Aid</Link></li>
                <li><Link to="/events" className="hover:text-[#4E6EF1] transition-colors">Local Cleanups</Link></li>
                <li><Link to="/chat" className="hover:text-[#4E6EF1] transition-colors">Direct Chat</Link></li>
                <li><Link to="/login" className="hover:text-[#4E6EF1] transition-colors">Sign In / Join</Link></li>
              </ul>
            </div>

            {/* Col 4: Trust & Safety (2 cols) */}
            <div className="lg:col-span-2 flex flex-col">
              <h3 className="text-xl font-bold text-[#1D2A5D] dark:text-white mb-6">
                Safety & Rules
              </h3>
              <ul className="flex flex-col gap-3 text-base text-[#5E678C] dark:text-slate-400">
                <li><Link to="/terms" className="hover:text-[#4E6EF1] transition-colors">Community Charter</Link></li>
                <li><Link to="/terms" className="hover:text-[#4E6EF1] transition-colors">Verification Rules</Link></li>
                <li><Link to="/terms" className="hover:text-[#4E6EF1] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#4E6EF1] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          {/* Copyright Bar (AppGrids `.copy-right-wrapper`) */}
          <div className="border-t border-[rgba(29,42,93,0.12)] dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#5E678C] dark:text-slate-400">
            <div>
              © {new Date().getFullYear()} Nearby HelpUp. Hyperlocal Mutual Aid Infrastructure.
            </div>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="hover:text-[#4E6EF1] transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-[#4E6EF1] transition-colors">Terms</Link>
              <Link to="/emergency" className="text-[#EF4444] font-semibold flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Emergency SOS
              </Link>
            </div>
          </div>

        </div>
      </footer>

      {/* 13. AppGrids Floating Scroll-To-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-11 h-11 bg-[#4E6EF1] hover:bg-[#3C5CE0] text-white rounded-[6px] flex items-center justify-center shadow-lg transition-all z-40 animate-fade-in"
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

    </div>
  );
};
