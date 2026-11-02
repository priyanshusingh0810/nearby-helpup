import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Plus, 
  ArrowLeft, 
  Check, 
  Info,
  AlertTriangle,
  Upload,
  Heart,
  Wrench,
  Clock,
  ShieldCheck
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const CreateListing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form Steps: 1 = Category & Type, 2 = Details, 3 = Location & Urgency
  const [formStep, setFormStep] = useState(1);

  // Listing fields
  const [type, setType] = useState('borrow');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tools & Equipment');
  const [images, setImages] = useState('');
  const [locName, setLocName] = useState(user?.location_name || 'DTU Campus, Rohini');
  const [lat, setLat] = useState(user?.location_lat || 28.7501);
  const [lon, setLon] = useState(user?.location_lon || 77.1177);
  
  // Urgency & Reward
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  const [reward, setReward] = useState('');
  
  // AI helpers
  const [aiGenerating, setAiGenerating] = useState(false);
  const [spamAlert, setSpamAlert] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Tools & Equipment', 'Medical & Emergency', 'Books & Study', 'Electronics',
    'Home & Kitchen', 'Vehicles & Rides', 'Skill Barter', 'Community Care', 'Others'
  ];

  const shareTypes = [
    { id: 'borrow', label: 'Borrow Request', desc: 'Need an item temporarily' },
    { id: 'lend', label: 'Offer to Lend', desc: 'Share your items with neighbors' },
    { id: 'barter', label: 'Skill Barter', desc: 'Trade knowledge or assistance' },
    { id: 'donate', label: 'Free Give-Away', desc: 'Donate items to community' },
    { id: 'service', label: 'Volunteer Aid', desc: 'Offer physical help or chores' }
  ];

  // AI Helper: Auto Classify & Description Generator
  const handleAiAutoFill = async () => {
    if (!title.trim()) {
      alert('Please enter a request title first.');
      return;
    }
    setAiGenerating(true);
    try {
      const descRes = await api.ai.generateDescription(title, "Good condition", type);
      if (descRes.description) {
        setDescription(descRes.description);
      }

      const catRes = await api.ai.classify(title);
      if (catRes.category) {
        setCategory(catRes.category);
      }
    } catch (err) {
      console.error('AI Auto-fill failed', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpamAlert(null);

    if (!title.trim()) {
      alert('Please provide a title for your request.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Spam & Moderation Scan
      const spamRes = await api.ai.checkSpam(description || title);
      if (spamRes.is_spam) {
        setSpamAlert(`Safety Warning: ${spamRes.reason}`);
        setSubmitting(false);
        return;
      }

      // 2. Submit listing details
      await api.listings.create({
        type,
        title,
        description,
        category,
        images: images || undefined,
        location_name: locName,
        location_lat: lat,
        location_lon: lon,
        is_emergency: urgency === 'emergency',
        reward
      });

      navigate('/home');
    } catch (err: any) {
      alert(err.message || 'Failed to submit assistance request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-2xl mx-auto flex flex-col gap-6 w-full text-left">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/home')} 
        className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#102A43] dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </button>

      <GlassCard className="p-6 sm:p-8" hoverEffect={false}>
        <div className="flex flex-col gap-6">
          
          {/* Header & Step Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#334155] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#102A43] dark:text-white">
                Create Assistance Request
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#9FB3C8] mt-0.5">
                Share or request items, skills, and mutual aid in your 5km radius
              </p>
            </div>

            {/* Step Pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step} 
                  className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold transition-all ${
                    formStep === step 
                      ? 'bg-[#19A974] text-white shadow-xs' 
                      : formStep > step 
                        ? 'bg-[#102A43] text-white' 
                        : 'bg-[#E2E8F0] dark:bg-[#334155] text-[#64748B]'
                  }`}
                >
                  {formStep > step ? <Check className="h-3.5 w-3.5" /> : step}
                </div>
              ))}
            </div>
          </div>

          {spamAlert && (
            <div className="p-3.5 bg-[#EF4444]/10 text-[#EF4444] rounded-xl text-xs font-semibold border border-[#EF4444]/30 flex items-start gap-2 animate-fade-in">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{spamAlert}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-6">
            
            {/* STEP 1: Categories & Type Selection */}
            {formStep === 1 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Assistance Type
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {shareTypes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          type === t.id 
                            ? 'bg-[#F0FDF8] dark:bg-[#19A974]/15 border-[#19A974] text-[#19A974] shadow-xs' 
                            : 'bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#F8FAFC] hover:border-[#19A974]'
                        }`}
                      >
                        <div className="font-bold text-xs">{t.label}</div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#9FB3C8] mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Resource Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs font-medium bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="rounded-xl bg-[#19A974] hover:bg-[#148A5E] text-white font-bold text-xs h-11 w-full mt-2 transition-all shadow-xs"
                >
                  Continue to Request Details
                </button>
              </div>
            )}

            {/* STEP 2: Detail parameters (Title & Description) */}
            {formStep === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                      Request Title
                    </label>
                    <button
                      type="button"
                      onClick={handleAiAutoFill}
                      disabled={aiGenerating}
                      className="text-[11px] font-bold text-[#19A974] hover:text-[#148A5E] flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{aiGenerating ? 'Generating...' : 'AI Auto-Fill'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bosch Hammer Drill with masonry bit set / Calculus Textbook"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974] placeholder:text-[#94A3B8]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Detailed Description
                  </label>
                  <textarea
                    required
                    placeholder="Describe what you need, condition expectations, lending duration, or swap details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="p-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974] placeholder:text-[#94A3B8] font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Image Link (Optional Attachment)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className="h-11 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974] placeholder:text-[#94A3B8]"
                  />
                </div>

                <div className="flex justify-between gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-white font-semibold text-xs h-11 px-5 hover:bg-[#F8FAFC]"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep(3)}
                    className="rounded-xl bg-[#19A974] hover:bg-[#148A5E] text-white font-bold text-xs h-11 flex-1 shadow-xs transition-colors"
                  >
                    Continue to Location & Urgency
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Location Coordinates & Urgency */}
            {formStep === 3 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                {/* Urgency Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'normal', label: 'Standard', color: 'border-[#19A974] text-[#19A974] bg-[#F0FDF8]' },
                      { id: 'urgent', label: 'Urgent', color: 'border-amber-500 text-amber-600 bg-amber-50' },
                      { id: 'emergency', label: 'Emergency SOS', color: 'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10' }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setUrgency(lvl.id as any)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                          urgency === lvl.id 
                            ? `${lvl.color} shadow-xs` 
                            : 'bg-white dark:bg-[#0F172A] border-[#E2E8F0] dark:border-[#334155] text-[#64748B]'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Neighborhood / Campus Area
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#94A3B8]" />
                    <input
                      type="text"
                      required
                      value={locName}
                      onChange={(e) => setLocName(e.target.value)}
                      className="h-11 pl-10 pr-3.5 w-full rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Token of Gratitude / Barter (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free coffee treat, help review a resume, or chocolate bar"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="h-11 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974] placeholder:text-[#94A3B8]"
                  />
                </div>

                <div className="flex justify-between gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-white font-semibold text-xs h-11 px-5 hover:bg-[#F8FAFC]"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-[#19A974] hover:bg-[#148A5E] text-white font-bold text-xs h-11 flex-1 shadow-sm shadow-[#19A974]/30 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Publishing Request...' : 'Publish Assistance Request'}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </GlassCard>

    </div>
  );
};
