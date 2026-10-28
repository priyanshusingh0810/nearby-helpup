import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Heart, 
  Mail, 
  ExternalLink, 
  AlertTriangle,
  Scale,
  Users,
  Calendar,
  Sparkles
} from 'lucide-react';

interface AppFooterProps {
  className?: string;
}

export const AppFooter: React.FC<AppFooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-auto border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-colors ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Highlight Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-emerald-50/40 to-indigo-50/80 dark:from-indigo-950/20 dark:via-emerald-950/20 dark:to-indigo-950/20 border border-indigo-100/70 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-indigo-100 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
              <Scale className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  NearbyHelpUp Community Trust & Terms
                </h4>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                  21 Sections Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Clear guidelines governing peer borrowing, local barter, and mutual neighborly assistance.
              </p>
            </div>
          </div>
          <Link
            to="/terms"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all duration-200 shadow-sm shadow-indigo-600/25 shrink-0 hover:translate-x-0.5"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Read Terms & Conditions</span>
          </Link>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100 dark:border-slate-850">
          
          {/* Column 1: Brand & Mission */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🤝</span>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                NearbyHelpUp
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A decentralized civic mesh connecting verified neighbors for mutual aid, item borrowing, and barter assistance without commercial intermediaries.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                Mesh Protocol Online · 100% Non-Profit
              </span>
            </div>
          </div>

          {/* Column 2: Interactive Hub */}
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              <span>Interactive Pages</span>
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Community Feed & Listings
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Emergency Assistance Hub</span>
                </Link>
              </li>
              <li>
                <Link to="/communities" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Neighborhood Mesh Circles
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span>Community Events & Drives</span>
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Post Help / Offer Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance */}
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-emerald-500" />
              <span>Legal & Governance</span>
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link 
                  to="/terms" 
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                >
                  <FileText className="h-3 w-3" />
                  <span>Terms & Conditions (Official)</span>
                </Link>
              </li>
              <li>
                <Link to="/terms#section-4" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Emergency Notice & Limitations
                </Link>
              </li>
              <li>
                <Link to="/terms#section-5" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Borrowing & Lending Rules
                </Link>
              </li>
              <li>
                <Link to="/terms#section-6" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Barter & Exchange Policies
                </Link>
              </li>
              <li>
                <Link to="/terms#section-7" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Prohibited Activities
                </Link>
              </li>
              <li>
                <Link to="/terms#section-20" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Jurisdiction (India)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform Operator & Contact */}
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              <span>Platform Operator</span>
            </h5>
            <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-2">
              <p className="leading-relaxed">
                Operated by NearbyHelpUp Community Mesh. For governance, dispute resolution, or inquiries:
              </p>
              <a 
                href="mailto:Managemeet810@gmail.com"
                className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline break-all"
              >
                <Mail className="h-3 w-3 shrink-0" />
                <span>Managemeet810@gmail.com</span>
              </a>
              <a
                href="https://nearbyhelpup.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                <span>nearbyhelpup.vercel.app</span>
              </a>
              <div className="mt-1 p-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-[10px] text-slate-500 leading-tight">
                <strong className="font-semibold text-slate-700 dark:text-slate-300">Disclaimer:</strong> Voluntary peer platform. Not an emergency dispatch or law enforcement entity.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {currentYear} NearbyHelpUp. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <Heart className="h-3 w-3 text-rose-400 fill-rose-400/30" />
              <span>Built for community resilience</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/emergency" className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
              Emergency Hub
            </Link>
            <span>•</span>
            <a 
              href="mailto:Managemeet810@gmail.com" 
              className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              Report an Issue
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
