import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Building2, 
  HeartHandshake, 
  Award,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SaaSUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaaSUpgradeModal: React.FC<SaaSUpgradeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [currentPlan, setCurrentPlan] = useState<string>(() => {
    return localStorage.getItem('helpup_plan_tier') || 'Free Neighbor';
  });
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free Neighbor',
      tier: 'free',
      priceMonthly: '$0',
      priceAnnual: '$0',
      period: 'forever free',
      description: 'Essential sharing for conscious individuals and everyday neighbors.',
      badge: 'Current Default',
      features: [
        '5 km Hyperlocal Neighborhood Mesh',
        'Up to 5 active item borrows/month',
        'Neighborhood public chats & clubs',
        'Standard emergency broadcasts',
        'Peer trust rating & verification',
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      name: 'Pro Neighbor',
      tier: 'pro',
      priceMonthly: '$4.99',
      priceAnnual: '$3.75',
      period: 'per month, billed annually',
      description: 'Supercharge your borrowing power with extended radius and priority alerts.',
      badge: 'Most Popular · Free with 90+ Trust',
      features: [
        '25 km Extended City Mesh Radius',
        'Unlimited monthly borrows & listings',
        'Zero-Deposit Trust Guarantee privilege',
        'Priority Emergency Beacon (top of feed + instant SMS)',
        'Verified Pro Gold Community Badge',
        'AI Matchmaker priority recommendation',
        'Real-time Carbon & Financial Savings analytics',
      ],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'HOA & Campus Circle',
      tier: 'enterprise',
      priceMonthly: '$59',
      priceAnnual: '$45',
      period: 'per society/month',
      description: 'For apartment societies, universities, gated communities, and HOAs.',
      badge: 'Enterprise Mesh',
      features: [
        'Private Gated Community Domain & Mesh',
        'Resident roster synchronization & auto-ID verification',
        'Admin Moderation Dashboard & Incident Logs',
        'Shared Tool Shed & Asset Check-out Kiosk',
        'Community Event Ticketing & Pool reservations',
        'Dedicated SLA & 24/7 Priority Emergency dispatch support',
      ],
      cta: 'Deploy for Community',
      popular: false,
    },
  ];

  const handleSelectPlan = (planName: string) => {
    localStorage.setItem('helpup_plan_tier', planName);
    setCurrentPlan(planName);
    setUpgradeSuccess(planName);
    setTimeout(() => {
      setUpgradeSuccess(null);
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 sm:p-10 my-8 overflow-hidden"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/15 blur-[120px]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Transparent Community SaaS Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Simple, Community-First Plans
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Nearby HelpUp is free forever for basic sharing. Upgrade for extended emergency radius, instant trust guarantees, or enterprise gated communities.
            </p>

            {/* Billing Toggle */}
            <div className="mt-6 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-extrabold uppercase">
                  Save 25%
                </span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {upgradeSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-sm flex items-center justify-center gap-2"
            >
              <BadgeCheck className="h-5 w-5" />
              <span>Success! Your active plan is now updated to: <strong>{upgradeSuccess}</strong>.</span>
            </motion.div>
          )}

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.name;
              const isPro = plan.tier === 'pro';

              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                    isPro
                      ? 'bg-gradient-to-b from-indigo-50/70 to-purple-50/40 dark:from-indigo-950/40 dark:to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Top Badge */}
                  {plan.badge && (
                    <div className="mb-4">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isPro
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-h-[36px] leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mt-5 pb-5 border-b border-slate-200/70 dark:border-slate-700/60 flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        /{billingCycle === 'annual' ? 'mo (billed yearly)' : 'month'}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isPro ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-emerald-500'}`} />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8 pt-4">
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => handleSelectPlan(plan.name)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isCurrent
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                          : isPro
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98]'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/70 active:scale-[0.98]'
                      }`}
                    >
                      <span>{isCurrent ? 'Current Plan' : plan.cta}</span>
                      {!isCurrent && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Guarantee Footer Note */}
          <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>100% Secure Checkout · Encrypted Escrow · Cancel Anytime with 1-Click</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="text-indigo-500">Need a custom university / campus deployment?</span>
              <a href="mailto:enterprise@nearbyhelpup.com" className="underline hover:text-indigo-600">Contact Sales</a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
