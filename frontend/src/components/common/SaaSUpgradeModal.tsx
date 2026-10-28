import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Award,
  ArrowRight,
  BadgeCheck,
  Heart,
  Users,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SaaSUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaaSUpgradeModal: React.FC<SaaSUpgradeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState<string>(() => {
    return localStorage.getItem('helpup_community_role') || 'Community Neighbor';
  });
  const [roleSuccess, setRoleSuccess] = useState<string | null>(null);

  const roles = [
    {
      name: 'Community Neighbor',
      tier: 'neighbor',
      cost: 'Free Forever',
      period: '100% Non-Profit Public Good',
      description: 'Essential sharing and emergency access for every conscious resident.',
      badge: 'Active Default Role',
      features: [
        '5 km Hyperlocal Neighborhood Mesh',
        'Unlimited community item borrows & listings',
        'Neighborhood public chats & skill sharing',
        'Standard emergency broadcasts & safety circle',
        'Peer trust rating & community verification',
      ],
      cta: 'Current Role',
      isVolunteer: false,
    },
    {
      name: 'Verified Volunteer & First Responder',
      tier: 'volunteer',
      cost: 'Earned by Trust',
      period: 'Score 85+ or Volunteer Pledge',
      description: 'Step up for your neighbors in emergencies, power outages, and medical needs.',
      badge: 'Community Champion · Zero Cost',
      features: [
        '25 km Extended Citywide Mesh Beacon',
        'Priority Emergency Dispatch (Instant SMS & Feed Pin)',
        'Zero-Deposit Trust Guarantee privilege',
        'Verified Volunteer Gold Community Badge',
        'AI Matchmaker priority recommendation',
        'Real-time Carbon & Household Savings impact tracker',
      ],
      cta: 'Pledge as Volunteer',
      isVolunteer: true,
    },
    {
      name: 'Colony & Campus Chapter Lead',
      tier: 'chapter',
      cost: 'Free Open Setup',
      period: 'For RWAs, Societies & Universities',
      description: 'Deploy a dedicated sharing & safety grid for your apartment complex or campus.',
      badge: 'Civic Chapter',
      features: [
        'Private Gated Colony or Campus Domain Mesh',
        'Resident directory synchronization & auto-ID checks',
        'Community Moderation Dashboard & Incident Logs',
        'Shared Tool Shed & Library Asset Check-out Kiosk',
        'Local Event Ticketing & Park Cleanup coordination',
        'Zero platform fees — 100% community-owned',
      ],
      cta: 'Register Chapter',
      isVolunteer: false,
    },
  ];

  const handleSelectRole = (roleName: string) => {
    localStorage.setItem('helpup_community_role', roleName);
    setCurrentRole(roleName);
    setRoleSuccess(roleName);
    setTimeout(() => {
      setRoleSuccess(null);
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
          <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="h-3.5 w-3.5" />
              <span>100% Non-Profit Community Charter</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              No Subscriptions. No Paywalls. Ever.
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Nearby HelpUp is public-good open software created to foster neighborly resilience, circular sharing, and mutual aid. Every role is free and earned through trust and community participation.
            </p>
          </div>

          {/* Success Banner */}
          {roleSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center font-bold text-sm flex items-center justify-center gap-2"
            >
              <BadgeCheck className="h-5 w-5" />
              <span>Pledge Confirmed! Your community standing is set to: <strong>{roleSuccess}</strong>.</span>
            </motion.div>
          )}

          {/* Roles Grid */}
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            {roles.map((role) => {
              const isCurrent = currentRole === role.name;
              const isVolunteer = role.isVolunteer;

              return (
                <div
                  key={role.name}
                  className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                    isVolunteer
                      ? 'bg-gradient-to-b from-indigo-50/70 to-emerald-50/40 dark:from-indigo-950/40 dark:to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Top Badge */}
                  {role.badge && (
                    <div className="mb-4">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isVolunteer
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {role.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                      {role.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-h-[36px] leading-relaxed">
                      {role.description}
                    </p>

                    {/* Cost Status Badge */}
                    <div className="mt-5 pb-5 border-b border-slate-200/70 dark:border-slate-700/60 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {role.cost}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        · {role.period}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="mt-6 space-y-3">
                      {role.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isVolunteer ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-emerald-500'}`} />
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
                      onClick={() => handleSelectRole(role.name)}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isCurrent
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                          : isVolunteer
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 active:scale-[0.98]'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/70 active:scale-[0.98]'
                      }`}
                    >
                      <span>{isCurrent ? 'Active Role' : role.cta}</span>
                      {!isCurrent && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Non-Profit Philosophy Note */}
          <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>100% Free Forever · Zero Ads · Zero Commercial Data Selling · Community Driven</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="text-indigo-500">Want to start a chapter for your colony or university?</span>
              <a href="mailto:volunteer@nearbyhelpup.com" className="underline hover:text-indigo-600">Get Free Starter Kit</a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
