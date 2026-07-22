import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Sparkles, 
  Star, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  AlertTriangle,
  ArrowLeft,
  Truck,
  RotateCcw
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const listingId = parseInt(id || '0');

  // States
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number>(1.2); // mock default distance in km
  
  // Barter state
  const [barterItemTitle, setBarterItemTitle] = useState('');
  const [barterItemDesc, setBarterItemDesc] = useState('');
  const [barterItemCond, setBarterItemCond] = useState('Good');
  const [fairnessScore, setFairnessScore] = useState<number | null>(null);
  const [fairnessAdvice, setFairnessAdvice] = useState('');
  const [evaluatingTrade, setEvaluatingTrade] = useState(false);
  const [barterOffers, setBarterOffers] = useState<any[]>([]);

  const loadListingDetails = async () => {
    try {
      const data = await api.listings.getById(listingId);
      setListing(data);

      // Distance mock (using user coords if available)
      if (user?.location_lat && user?.location_lon && data.location_lat && data.location_lon) {
        // Simple mock delta distance
        const latDelta = Math.abs(user.location_lat - data.location_lat);
        const lonDelta = Math.abs(user.location_lon - data.location_lon);
        const dist = Math.sqrt(latDelta * latDelta + lonDelta * lonDelta) * 111; // Approx km
        setDistance(dist > 0.1 ? parseFloat(dist.toFixed(1)) : 0.2);
      }

      if (data.type === 'barter') {
        const offers = await api.listings.getBarterOffers(listingId);
        setBarterOffers(offers);
      }
    } catch (err) {
      console.error('Failed to load listing details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListingDetails();
  }, [listingId]);

  // AI Barter Fairness Evaluator
  const evaluateBarterDeal = async () => {
    if (!barterItemTitle.trim() || !listing) return;
    setEvaluatingTrade(true);
    try {
      const res = await api.ai.checkFairness(
        listing.title,
        listing.lend_condition || "Good",
        barterItemTitle,
        barterItemCond
      );
      setFairnessScore(res.fairness_score);
      setFairnessAdvice(res.suggestion);
    } catch (err) {
      console.error('AI valuation failed', err);
    } finally {
      setEvaluatingTrade(false);
    }
  };

  const handleStartChat = async () => {
    if (!listing) return;
    try {
      const chat = await api.chats.getOrCreate(listing.owner_id, listing.id);
      navigate(`/chat?id=${chat.id}`);
    } catch (err) {
      alert('Failed to start chat session');
    }
  };

  const handleSubmitBarter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barterItemTitle.trim()) return;

    try {
      await api.listings.createBarterOffer(listingId, {
        offered_item_title: barterItemTitle,
        offered_item_description: barterItemDesc,
        offered_item_condition: barterItemCond
      });
      alert('Barter trade offer submitted successfully to owner!');
      setBarterItemTitle('');
      setBarterItemDesc('');
      loadListingDetails();
    } catch (err) {
      alert('Failed to submit barter offer');
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    try {
      await api.listings.updateBarterOfferStatus(offerId, 'accepted');
      alert('Offer accepted!');
      loadListingDetails();
    } catch (err) {
      alert('Failed to accept offer');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex-1 p-8 text-center">
        <h3 className="font-bold text-lg">Listing not found</h3>
      </div>
    );
  }

  const isOwnListing = user?.id === listing.owner_id;

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Back to dashboard trigger */}
      <Link to="/home" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 w-fit">
        <ArrowLeft className="h-4.5 w-4.5" />
        <span>Back to Neighborhood Feed</span>
      </Link>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Images & Core Parameters */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <GlassCard className="overflow-hidden border-slate-100/50" hoverEffect={false}>
            <div className="h-72 md:h-96 bg-slate-100 dark:bg-slate-950 overflow-hidden relative group">
              <img
                src={listing.images.split(';')[0]}
                alt={listing.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 backdrop-blur-sm text-white font-extrabold text-[9px] px-3.5 py-1.5 uppercase tracking-wider shadow-sm">
                {listing.type}
              </span>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-extrabold text-slate-850 dark:text-white font-sans">{listing.title}</h1>
                <span className="text-[10px] font-bold text-indigo-655 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded border border-indigo-100/10">
                  {listing.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-455">
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{listing.location_name} ({distance} km away)</span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex flex-col gap-2">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400">Description</h4>
                <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed">
                  {listing.description || "No description provided."}
                </p>
              </div>

              {/* Type-specific parameters display */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-850 pt-4">
                {listing.lend_deposit !== null && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Lend Security Deposit</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">₹{listing.lend_deposit}</span>
                  </div>
                )}
                {listing.lend_condition && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Item Condition</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{listing.lend_condition}</span>
                  </div>
                )}
                {listing.borrow_needed_until && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Borrow Duration Limit</span>
                    <span className="text-xs font-semibold">
                      Until: {new Date(listing.borrow_needed_until).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {listing.reward && (
                  <div className="flex flex-col gap-0.5 col-span-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Reward Offered / Favor Swaps</span>
                    <span className="text-xs font-semibold text-indigo-500">🎁 {listing.reward}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Barter Swap submission form */}
          {listing.type === 'barter' && !isOwnListing && (
            <GlassCard className="p-6 border-slate-105" hoverEffect={false}>
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5 font-sans mb-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                <span>Submit Trade Swap Offer</span>
              </h3>
              
              <form onSubmit={handleSubmitBarter} className="flex flex-col gap-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Offered Item Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Silberschatz OS Book"
                      value={barterItemTitle}
                      onChange={(e) => setBarterItemTitle(e.target.value)}
                      onBlur={evaluateBarterDeal}
                      className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold uppercase text-slate-400">Condition</label>
                    <select
                      value={barterItemCond}
                      onChange={(e) => setBarterItemCond(e.target.value)}
                      onBlur={evaluateBarterDeal}
                      className="h-10 px-2 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Item Description</label>
                  <textarea
                    placeholder="Describe details of the swap item..."
                    value={barterItemDesc}
                    onChange={(e) => setBarterItemDesc(e.target.value)}
                    rows={2}
                    className="p-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>

                {/* AI Valuation evaluation panel */}
                {(fairnessScore !== null || evaluatingTrade) && (
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100/30 rounded-xl dark:bg-indigo-950/20 dark:border-indigo-900/30 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-extrabold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Sparkles className="h-4 w-4" /> AI Deal Valuation</span>
                      {evaluatingTrade ? (
                        <span>Evaluating...</span>
                      ) : (
                        <span>Fairness Score: {fairnessScore}/100</span>
                      )}
                    </div>
                    {fairnessAdvice && (
                      <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal">{fairnessAdvice}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs h-10 w-full transition-all duration-300 shadow-lg shadow-indigo-500/20"
                >
                  Submit Swap Trade
                </button>
              </form>
            </GlassCard>
          )}

          {/* Active barter offers review for listings owner */}
          {listing.type === 'barter' && isOwnListing && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Barter Offers Received</span>
              <div className="flex flex-col gap-3.5">
                {barterOffers.length > 0 ? (
                  barterOffers.map((offer) => (
                    <GlassCard key={offer.id} className="p-5 flex flex-col gap-3 border-slate-105" hoverEffect={false}>
                      <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-850 pb-2">
                        <div className="flex items-center gap-2">
                          <img src={offer.sender.profile_photo} alt="" className="h-6 w-6 rounded-full object-cover bg-slate-50" />
                          <span className="text-[10px] font-bold">{offer.sender.name}</span>
                        </div>
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          offer.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-850 dark:text-white">Offer: {offer.offered_item_title}</h4>
                        <p className="text-[10px] text-slate-455 mt-1">{offer.offered_item_description}</p>
                      </div>
                      {offer.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="h-8 bg-slate-900 text-white hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-850 text-[10px] font-bold rounded-lg transition-all"
                        >
                          Accept Trade Swap
                        </button>
                      )}
                    </GlassCard>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400 border border-slate-100 rounded-xl dark:border-slate-850">
                    No trade swap offers received yet.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Owner Credibility & Logistics */}
        <div className="flex flex-col gap-6">
          
          {/* Owner details card with trust score index */}
          <GlassCard className="p-5 flex flex-col items-center text-center gap-4 border-slate-100/50">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 w-full text-left">Lender Index</h4>
            
            <div className="flex items-center gap-3 w-full border-b border-slate-50 dark:border-slate-850 pb-4 text-left">
              <img src={listing.owner.profile_photo} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-50" />
              <div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-white">{listing.owner.name}</h4>
                <p className="text-[9px] text-slate-400 truncate mt-0.5">@{listing.owner.username}</p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-extrabold">
                <Sparkles className="h-4 w-4" />
                <span>Trust Score:</span>
              </div>
              <span className="text-xs font-extrabold text-slate-800 dark:text-white">{Math.round(listing.owner.trust_score)}</span>
            </div>

            {/* Verification highlights */}
            <div className="flex flex-col gap-2 w-full text-left mt-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Phone Verification</span>
                {listing.owner.phone_verified ? (
                  <span className="text-emerald-500 font-bold">Verified</span>
                ) : (
                  <span className="text-slate-400">Pending</span>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Identity Document Verification</span>
                {listing.owner.identity_verified ? (
                  <span className="text-emerald-500 font-bold">Verified</span>
                ) : (
                  <span className="text-slate-400">Pending</span>
                )}
              </div>
            </div>

            {!isOwnListing && (
              <button
                onClick={handleStartChat}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-3 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 hover:-translate-y-[1px]"
              >
                <MessageSquare className="h-4.5 w-4.5" />
                <span>Initiate Chat</span>
              </button>
            )}
          </GlassCard>

          {/* Logistics & Delivery details options */}
          <GlassCard className="p-5 flex flex-col gap-4 border-slate-100/50">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-455">Logistics & Pickup Planner</h4>
            
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[10px] font-bold text-slate-800 dark:text-white">Self-Pickup Recommended</h5>
                <p className="text-[9px] text-slate-455 leading-normal mt-0.5">
                  Coordinate mutually safe pickup locations (cafes, university gate, libraries) inside chat logs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[10px] font-bold text-slate-800 dark:text-white">Return Policies guidelines</h5>
                <p className="text-[9px] text-slate-455 leading-normal mt-0.5">
                  Keep items clean and return them promptly before return dates to ensure your trust score stays high.
                </p>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
