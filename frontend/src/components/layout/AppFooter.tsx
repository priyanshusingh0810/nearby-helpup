import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Heart, 
  Mail, 
  MapPin, 
  AlertTriangle,
  Scale,
  Users,
  Calendar,
  Sparkles,
  Phone
} from 'lucide-react';

interface AppFooterProps {
  className?: string;
}

export const AppFooter: React.FC<AppFooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`mt-auto border-t border-[#1A365D] bg-[#102A43] text-white font-sans ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[#1A365D]">
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#19A974] text-white shadow-sm">
                <Heart className="h-5 w-5 fill-white" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Nearby HelpUp
              </span>
            </div>
            <p className="text-xs text-[#9FB3C8] leading-relaxed">
              Hyperlocal community assistance and mutual aid network. Empowering neighbors to share resources, volunteer skills, and coordinate instant emergency support within 5km.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#19A974] mt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Free & Peer-Verified</span>
            </div>
          </div>

          {/* Assistance Categories */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Assistance Hubs
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-[#D9E2EC]">
              <li>
                <Link to="/home?search=Tools" className="hover:text-[#19A974] transition-colors">
                  Tools & Home Equipment
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-[#EF4444] transition-colors flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-[#EF4444]" />
                  <span>Emergency SOS Dispatch</span>
                </Link>
              </li>
              <li>
                <Link to="/home?search=Books" className="hover:text-[#19A974] transition-colors">
                  Textbooks & Study Notes
                </Link>
              </li>
              <li>
                <Link to="/home?search=Electronics" className="hover:text-[#19A974] transition-colors">
                  Electronics & Hardware
                </Link>
              </li>
              <li>
                <Link to="/communities" className="hover:text-[#19A974] transition-colors">
                  Volunteer & Skill Barter
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-[#D9E2EC]">
              <li>
                <Link to="/home" className="hover:text-[#19A974] transition-colors">
                  Neighborhood Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="hover:text-[#19A974] transition-colors">
                  Request / Offer Help
                </Link>
              </li>
              <li>
                <Link to="/communities" className="hover:text-[#19A974] transition-colors">
                  Local Communities
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#19A974] transition-colors">
                  Community Cleanups & Drives
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-[#19A974] transition-colors">
                  Direct Messaging
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="flex flex-col gap-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Safety & Governance
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-[#D9E2EC]">
              <li>
                <Link to="/terms" className="hover:text-[#19A974] transition-colors">
                  Community Charter & Rules
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#19A974] transition-colors">
                  Peer Verification Standards
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#19A974] transition-colors">
                  Emergency Medical Protocol
                </Link>
              </li>
              <li>
                <a href="mailto:support@helpup.org" className="hover:text-[#19A974] transition-colors flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>support@helpup.org</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9FB3C8]">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Nearby HelpUp. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-[#38BDF8]">Hyperlocal Mutual Aid Operating System</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/emergency" className="text-[#EF4444] hover:underline font-semibold flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>SOS Hotline</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
