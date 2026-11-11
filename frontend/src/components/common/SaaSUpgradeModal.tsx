import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  BadgeCheck, 
  Heart,
  Users
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
      description: 'Essential sharing and emergency assistance access for every resident.',
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
      description: 'Step up for your neighbors in emergencies, power outages, and urgent needs.',
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#102A43]/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-2xl p-4 sm:p-10 my-4 sm:my-8 max-h-[92dvh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19A974]/10 border border-[#19A974]/20 text-[#19A974] text-xs font-bold uppercase tracking-wider mb-3">
              <Heart className="h-3.5 w-3.5" />
              <span>100% Non-Profit Community Charter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A43] dark:text-white">
              No Subscriptions. No Paywalls. Ever.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Nearby HelpUp is public-good open software created to foster neighborly resilience, circular sharing, and mutual aid. Every role is free and earned through community trust.
            </p>
          </div>

          {/* Success Banner */}
          {roleSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-[#19A974]/10 border border-[#19A974]/30 text-[#19A974] text-center font-semibold text-xs flex items-center justify-center gap-2"
            >
              <BadgeCheck className="h-4.5 w-4.5" />
              <span>Community standing updated: <strong>{roleSuccess}</strong>.</span>
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
                  className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 ${
                    isVolunteer
                      ? 'bg-white dark:bg-[#1E293B] border-2 border-[#19A974] shadow-md'
                      : 'bg-[#F8FAFC] dark:bg-slate-800/40 border border-[#E2E8F0] dark:border-slate-800'
                  }`}
                >
                  {/* Top Badge */}
                  {role.badge && (
                    <div className="mb-3">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isVolunteer
                            ? 'bg-[#19A974] text-white'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {role.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-[#102A43] dark:text-white">
                      {role.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 min-h-[36px] leading-relaxed">
                      {role.description}
                    </p>

                    {/* Cost Status Badge */}
                    <div className="mt-4 pb-4 border-b border-[#E2E8F0] dark:border-slate-700 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-[#102A43] dark:text-white">
                        {role.cost}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        · {role.period}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="mt-5 space-y-2.5">
                      {role.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isVolunteer ? 'text-[#19A974] font-bold' : 'text-slate-400'}`} />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6 pt-2">
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => handleSelectRole(role.name)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                          : isVolunteer
                          ? 'bg-[#19A974] hover:bg-[#158f62] text-white shadow-sm'
                          : 'bg-[#102A43] text-white hover:bg-[#102A43]/90 shadow-sm'
                      }`}
                    >
                      <span>{isCurrent ? 'Current Role' : role.cta}</span>
                      {!isCurrent && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Philosophy Note */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#19A974]" />
              <span>100% Free Forever · Zero Ads · Zero Commercial Data Selling</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium">
              <span>Start a chapter for your society?</span>
              <a href="mailto:volunteer@nearbyhelpup.com" className="text-[#19A974] underline">Free Chapter Guide</a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
