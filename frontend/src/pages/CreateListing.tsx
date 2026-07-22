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
  AlertTriangle
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const CreateListing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form Steps: 1 = Category & Type, 2 = Details, 3 = Location & Expiry
  const [formStep, setFormStep] = useState(1);

  // Listing fields
  const [type, setType] = useState('borrow');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [images, setImages] = useState('');
  const [locName, setLocName] = useState(user?.location_name || 'DTU Campus, Rohini');
  const [lat, setLat] = useState(user?.location_lat || 28.7501);
  const [lon, setLon] = useState(user?.location_lon || 77.1177);
  
  // Expirations
  const [isEmergency, setIsEmergency] = useState(false);
  const [reward, setReward] = useState('');
  
  // AI states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [spamAlert, setSpamAlert] = useState<string | null>(null);

  const categories = [
    'Electronics', 'Fashion', 'Books', 'Gaming', 'Sports', 'Furniture', 
    'Medical', 'Education', 'Services', 'Others'
  ];

  // AI Helper: Auto Classify & Description Generator
  const handleAiAutoFill = async () => {
    if (!title.trim()) {
      alert('Please enter a listing title first.');
      return;
    }
    setAiGenerating(true);
    try {
      // 1. Generate description
      const descRes = await api.ai.generateDescription(title, "Good", type);
      setDescription(descRes.description);

      // 2. Classify category
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
      alert('Please fill out the title.');
      return;
    }

    try {
      // 1. Trigger Spam & Moderation Scanner
      const spamRes = await api.ai.checkSpam(description || title);
      if (spamRes.is_spam) {
        setSpamAlert(`Spam Warning: ${spamRes.reason}`);
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
        is_emergency: isEmergency,
        reward
      });

      alert('Listing created successfully!');
      navigate('/home');
    } catch (err) {
      alert('Failed to submit listing details');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-2xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Back to dashboard trigger */}
      <button onClick={() => navigate('/home')} className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 w-fit">
        <ArrowLeft className="h-4.5 w-4.5" />
        <span>Cancel & Back</span>
      </button>

      <GlassCard className="p-6 md:p-8 border-slate-100/50" hoverEffect={false}>
        <div className="flex flex-col gap-6">
          
          {/* Form Step Indicators */}
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
            <h2 className="text-sm font-extrabold text-slate-850 dark:text-white font-sans">
              Post Resource Request / Share
            </h2>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <span 
                  key={step} 
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                    formStep >= step ? 'bg-gradient-to-r from-indigo-600 to-purple-500 scale-110 shadow-sm shadow-indigo-500/30' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {spamAlert && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold border border-rose-100/60 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{spamAlert}</span>
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="flex flex-col gap-6">
            
            {/* STEP 1: Categories & Type Selection */}
            {formStep === 1 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Share/Request Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                    {['borrow', 'lend', 'barter', 'donate', 'service'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`h-11 rounded-lg text-xs font-semibold uppercase transition-all duration-300 border ${
                          type === t 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-500 border-transparent text-white shadow-md shadow-indigo-500/15' 
                            : 'bg-white border-slate-200 text-slate-655 hover:border-indigo-200/30 dark:bg-slate-900 dark:border-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-indigo-600 hover:to-purple-500 text-white font-bold text-xs h-11 w-full mt-2 transition-all duration-300 dark:from-slate-800 dark:to-slate-700 dark:hover:from-indigo-600 dark:hover:to-purple-500"
                >
                  Continue to details
                </button>
              </div>
            )}

            {/* STEP 2: Detail parameters (Title & Description AI Helpers) */}
            {formStep === 2 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Resource Title</label>
                    <button
                      type="button"
                      onClick={handleAiAutoFill}
                      disabled={aiGenerating}
                      className="text-[9px] font-bold text-indigo-505 hover:text-indigo-650 flex items-center gap-1 uppercase"
                    >
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      <span>{aiGenerating ? 'Auto Filling...' : 'AI Auto fill'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Scientific Calculator Casio / Black blazer Size M"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Detailed Description</label>
                  <textarea
                    placeholder="Specify condition details, lend timeframes, or trading expectations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="p-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Resource Image Link</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex justify-between gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="rounded-xl border border-slate-200 text-slate-700 font-bold text-xs h-11 px-6 dark:border-slate-800 dark:text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep(3)}
                    className="rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs h-11 flex-1 dark:bg-slate-800"
                  >
                    Continue to location
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Location Coordinates & Expiry */}
            {formStep === 3 && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Latitude Coordinates</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value))}
                      className="h-11 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Longitude Coordinates</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={lon}
                      onChange={(e) => setLon(parseFloat(e.target.value))}
                      className="h-11 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">General Area Location Name</label>
                  <input
                    type="text"
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Compensation / Reward Offered</label>
                  <input
                    type="text"
                    placeholder="e.g. Hot coffee treat, chocolate swap, or help you debug React"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 border border-slate-100 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                  <input
                    type="checkbox"
                    id="is_emergency"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_emergency" className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
                    <span>Tag this request as active emergency priority</span>
                  </label>
                </div>

                <div className="flex justify-between gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="rounded-xl border border-slate-200 text-slate-700 font-bold text-xs h-11 px-6 dark:border-slate-800 dark:text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs h-11 flex-1 shadow-lg shadow-indigo-500/20 transition-all duration-300"
                  >
                    Launch Listing Now
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
