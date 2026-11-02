import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  AlertTriangle,
  ArrowLeft,
  Truck,
  RotateCcw,
  CheckCircle,
  Heart
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
  const [distance, setDistance] = useState<number>(0.8);
  
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

      if (user?.location_lat && user?.location_lon && data.location_lat && data.location_lon) {
        const latDelta = Math.abs(user.location_lat - data.location_lat);
        const lonDelta = Math.abs(user.location_lon - data.location_lon);
        const dist = Math.sqrt(latDelta * latDelta + lonDelta * lonDelta) * 111;
        setDistance(dist > 0.1 ? parseFloat(dist.toFixed(1)) : 0.3);
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
      <div className="flex-1 flex items-center justify-center p-24">
        <div className="h-10 w-10 border-4 border-[#19A974] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex-1 p-12 text-center">
        <h3 className="font-bold text-lg text-[#102A43] dark:text-white">Assistance Request Not Found</h3>
        <Link to="/home" className="mt-4 inline-block text-xs font-bold text-[#19A974] hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isOwnListing = user?.id === listing.owner_id;

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto flex flex-col gap-6 pb-20 w-full text-left">
      
      {/* Back button */}
      <Link 
        to="/home" 
        className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#102A43] dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Neighborhood Feed</span>
      </Link>

      <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-start">
        
        {/* Left Side: Photo & Details */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <GlassCard className="overflow-hidden" hoverEffect={false}>
            {listing.images && (
              <div className="h-64 sm:h-84 bg-[#F1F5F9] dark:bg-[#0F172A] overflow-hidden relative">
                <img
                  src={listing.images.split(';')[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#102A43]/90 backdrop-blur-md text-white font-bold text-[10px] px-3.5 py-1 uppercase tracking-wider shadow-sm">
                  {listing.type}
                </span>
                {listing.is_emergency && (
                  <span className="absolute right-4 top-4 rounded-full bg-[#EF4444] text-white font-bold text-[10px] px-3.5 py-1 uppercase tracking-wider shadow-sm animate-pulse">
                    Emergency Priority
                  </span>
                )}
              </div>
            )}

            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102A43] dark:text-white tracking-tight">
                  {listing.title}
                </h1>
                <span className="text-xs font-bold text-[#19A974] bg-[#F0FDF8] dark:bg-[#19A974]/15 px-3 py-1 rounded-full border border-[#19A974]/30 w-fit">
                  {listing.category}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#9FB3C8]">
                <MapPin className="h-4 w-4 text-[#19A974] shrink-0" />
                <span>{listing.location_name || 'Neighborhood Area'} ({distance} km away)</span>
              </div>

              <div className="border-t border-[#E2E8F0] dark:border-[#334155] pt-4 flex flex-col gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Description & Context
                </h4>
                <p className="text-xs sm:text-sm text-[#1E293B] dark:text-[#D9E2EC] leading-relaxed whitespace-pre-wrap">
                  {listing.description || "No specific details provided."}
                </p>
              </div>

              {/* Extra Parameters */}
              <div className="grid grid-cols-2 gap-4 border-t border-[#E2E8F0] dark:border-[#334155] pt-4">
                {listing.lend_condition && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase">Condition</span>
                    <span className="text-xs font-bold text-[#102A43] dark:text-white">{listing.lend_condition}</span>
                  </div>
                )}
                {listing.reward && (
                  <div className="flex flex-col gap-0.5 col-span-2">
                    <span className="text-[10px] font-bold text-[#64748B] uppercase">Token of Gratitude / Swap</span>
                    <span className="text-xs font-semibold text-[#19A974]">🎁 {listing.reward}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Barter Offer form */}
          {listing.type === 'barter' && !isOwnListing && (
            <GlassCard className="p-6" hoverEffect={false}>
              <h3 className="text-sm font-bold text-[#102A43] dark:text-white flex items-center gap-2 mb-3">
                <Sparkles className="h-4.5 w-4.5 text-[#38BDF8]" />
                <span>Propose a Barter or Skill Trade</span>
              </h3>
              
              <form onSubmit={handleSubmitBarter} className="flex flex-col gap-4">
                <div className="grid md:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-[#64748B]">What do you offer?</label>
                    <input
                      type="text"
                      placeholder="e.g. Guitar lesson / Router tool / Study notes"
                      value={barterItemTitle}
                      onChange={(e) => setBarterItemTitle(e.target.value)}
                      onBlur={evaluateBarterDeal}
                      className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-[#64748B]">Condition / Level</label>
                    <select
                      value={barterItemCond}
                      onChange={(e) => setBarterItemCond(e.target.value)}
                      onBlur={evaluateBarterDeal}
                      className="h-10 px-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974]"
                    >
                      <option value="New">New / Expert</option>
                      <option value="Like New">Like New / Advanced</option>
                      <option value="Good">Good / Intermediate</option>
                      <option value="Fair">Fair / Beginner</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-[#64748B]">Description of Offer</label>
                  <textarea
                    placeholder="Provide details about the swap..."
                    value={barterItemDesc}
                    onChange={(e) => setBarterItemDesc(e.target.value)}
                    rows={2}
                    className="p-3 rounded-xl border border-[#E2E8F0] dark:border-[#334155] text-xs bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-white outline-none focus:border-[#19A974]"
                  />
                </div>

                {/* AI Valuation */}
                {(fairnessScore !== null || evaluatingTrade) && (
                  <div className="p-3.5 bg-[#F0F9FF] dark:bg-[#0F172A] border border-[#38BDF8]/30 rounded-xl flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#0284C7] dark:text-[#38BDF8]">
                      <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> AI Trade Fairness Score</span>
                      <span>{evaluatingTrade ? 'Calculating...' : `${fairnessScore}/100`}</span>
                    </div>
                    {fairnessAdvice && (
                      <p className="text-[11px] text-[#64748B] dark:text-[#9FB3C8]">{fairnessAdvice}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="rounded-xl bg-[#19A974] hover:bg-[#148A5E] text-white font-bold text-xs h-10 w-full transition-colors shadow-xs"
                >
                  Send Trade Proposal
                </button>
              </form>
            </GlassCard>
          )}

          {/* Barter Offers for Owner */}
          {listing.type === 'barter' && isOwnListing && (
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">Trade Offers Received</span>
              <div className="flex flex-col gap-3">
                {barterOffers.length > 0 ? (
                  barterOffers.map((offer) => (
                    <GlassCard key={offer.id} className="p-4 flex flex-col gap-2.5" hoverEffect={false}>
                      <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-[#334155] pb-2">
                        <div className="flex items-center gap-2">
                          <img src={offer.sender.profile_photo} alt="" className="h-6 w-6 rounded-full object-cover" />
                          <span className="text-xs font-bold">{offer.sender.name}</span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          offer.status === 'accepted' ? 'bg-[#19A974]/15 text-[#19A974]' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#102A43] dark:text-white">Offer: {offer.offered_item_title}</h4>
                        <p className="text-[11px] text-[#64748B] dark:text-[#9FB3C8] mt-0.5">{offer.offered_item_description}</p>
                      </div>
                      {offer.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="h-8 bg-[#19A974] hover:bg-[#148A5E] text-white text-xs font-bold rounded-lg transition-colors mt-1"
                        >
                          Accept Trade Swap
                        </button>
                      )}
                    </GlassCard>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-[#64748B] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl">
                    No trade swap offers received yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Owner Credibility & Action Card */}
        <div className="flex flex-col gap-6">
          <GlassCard className="p-5 flex flex-col items-center text-center gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] w-full text-left">
              Resident Credibility
            </h4>
            
            <div className="flex items-center gap-3 w-full border-b border-[#E2E8F0] dark:border-[#334155] pb-4 text-left">
              <img 
                src={listing.owner?.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.owner?.name || 'Neighbor')}&background=102A43&color=fff`} 
                alt="" 
                className="h-11 w-11 rounded-xl object-cover ring-2 ring-[#19A974]" 
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#102A43] dark:text-white truncate">{listing.owner?.name}</h4>
                <p className="text-[10px] text-[#64748B] truncate mt-0.5">@{listing.owner?.username}</p>
              </div>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-xs text-[#19A974] font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Trust Score:</span>
              </div>
              <span className="text-sm font-extrabold text-[#102A43] dark:text-white">
                {Math.round(listing.owner?.trust_score || 95)}%
              </span>
            </div>

            {/* Verification checklist */}
            <div className="flex flex-col gap-2 w-full text-left text-xs text-[#64748B]">
              <div className="flex items-center justify-between">
                <span>Phone Verified</span>
                <span className="text-[#19A974] font-bold">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Neighborhood Resident</span>
                <span className="text-[#19A974] font-bold">Verified</span>
              </div>
            </div>

            {!isOwnListing && (
              <button
                onClick={handleStartChat}
                className="mt-2 w-full rounded-xl bg-[#19A974] hover:bg-[#148A5E] text-white font-bold text-xs py-3 transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#19A974]/30"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Message Neighbor</span>
              </button>
            )}
          </GlassCard>

          {/* Safe Exchange Tips */}
          <GlassCard className="p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Safe Neighbor Guidelines
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs text-[#64748B] dark:text-[#9FB3C8]">
              <Truck className="h-4 w-4 text-[#19A974] shrink-0 mt-0.5" />
              <span>Meet in a well-lit public space or your society lobby for handover.</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-[#64748B] dark:text-[#9FB3C8]">
              <RotateCcw className="h-4 w-4 text-[#19A974] shrink-0 mt-0.5" />
              <span>Return borrowed resources clean and on time to protect your Trust Score.</span>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
