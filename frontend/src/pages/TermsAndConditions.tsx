import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Scale, 
  Search, 
  ArrowLeft, 
  Printer, 
  Share2, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Mail, 
  FileText,
  ChevronRight,
  BookOpen,
  Info
} from 'lucide-react';
import { AppFooter } from '../components/layout/AppFooter';

interface SectionData {
  id: number;
  title: string;
  category: 'General' | 'Conduct & Safety' | 'Transactions' | 'Legal & Liability';
  summary?: string;
  isCrucial?: boolean;
  content: React.ReactNode;
}

export const TermsAndConditions: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);

  // Handle URL hash jumping on mount
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.hash]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections: SectionData[] = useMemo(() => [
    {
      id: 1,
      title: "1. Introduction",
      category: "General",
      summary: "Overview of the NearbyHelpUp platform, acceptance of terms, operator identity and contact details.",
      content: (
        <div className="space-y-4">
          <p>
            Welcome to <strong>NearbyHelpUp</strong> (“Platform”, “we”, “our” or “us”). NearbyHelpUp is a community-based platform designed to help people connect with individuals in their nearby communities for mutual assistance, borrowing and lending items, exchanging goods or services, and sharing local help requests.
          </p>
          <p>
            These Terms & Conditions (“Terms”) govern your access to and use of the NearbyHelpUp website, mobile application, and related services. By accessing or using NearbyHelpUp, you agree to these Terms. If you do not agree, you must discontinue using the Platform.
          </p>
          <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Platform Operator:</span>
              <span className="text-slate-600 dark:text-slate-400 font-mono">NearbyHelpUp Community Operations / Legal Entity</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Contact Email:</span>
              <a href="mailto:Managemeet810@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono">
                Managemeet810@gmail.com
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Website:</span>
              <a href="https://nearbyhelpup.vercel.app/" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-mono">
                https://nearbyhelpup.vercel.app/
              </a>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "2. Eligibility",
      category: "General",
      summary: "Minimum age of 12 years, accurate profile registration, account credentials confidentiality.",
      content: (
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>You must be at least <strong>12 years old</strong> to create an account and independently use the Platform.</li>
          <li>You must provide accurate and up-to-date information when registering or using our services.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials and for activities conducted through your account.</li>
          <li>You must not impersonate another person or create an account using false information.</li>
          <li>If we introduce features for minors in the future, they will be subject to separate eligibility and safeguarding requirements.</li>
        </ol>
      )
    },
    {
      id: 3,
      title: "3. How NearbyHelpUp Works",
      category: "General",
      summary: "Facilitating connections between local community members; non-ownership of user-offered items.",
      content: (
        <div className="space-y-3">
          <p>
            NearbyHelpUp helps users discover and communicate with other members of their local community. Depending on the features available, users may:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>Post requests for assistance.</li>
            <li>Offer help to other community members.</li>
            <li>Borrow or lend items.</li>
            <li>Exchange goods or services through barter.</li>
            <li>Participate in local community activities.</li>
            <li>Communicate with other users through supported messaging features.</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
            NearbyHelpUp primarily facilitates connections between users. Unless expressly stated otherwise, we do not own, inspect, manufacture, supply, or directly provide items or services offered by users.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: "4. Community Assistance and Emergency Requests",
      category: "Conduct & Safety",
      isCrucial: true,
      summary: "Voluntary help nature; explicit disclaimer that Platform is not a substitute for 112/police/ambulance.",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 dark:text-rose-200 space-y-1">
              <strong className="font-bold">CRITICAL EMERGENCY NOTICE:</strong>
              <p>
                The Platform is <strong>NOT</strong> an emergency response service, ambulance dispatch, police service, hospital, or disaster-response authority. In an emergency, always dial your local emergency services (e.g. 112 in India).
              </p>
            </div>
          </div>
          <ol className="list-decimal pl-5 space-y-2.5">
            <li>Users may post requests for help, including requests for essential items or other forms of community assistance.</li>
            <li>Assistance is voluntary unless the parties separately agree otherwise.</li>
            <li>NearbyHelpUp does not guarantee that a request will receive a response or that assistance will be available within a particular time.</li>
            <li>The Platform is not an emergency response service, ambulance service, police service, hospital, or disaster-response authority.</li>
            <li>In an emergency, users should contact the appropriate local emergency services rather than rely solely on NearbyHelpUp.</li>
            <li>Users must not create false emergency requests, manipulate other users through fabricated emergencies, or solicit assistance through fraudulent claims.</li>
          </ol>
        </div>
      )
    },
    {
      id: 5,
      title: "5. Borrowing and Lending",
      category: "Transactions",
      summary: "User responsibility for item inspections, agreed conditions, responsible usage, and timely return.",
      content: (
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>Users are responsible for agreeing directly on the item, its condition, the borrowing period, the return date, and any other relevant conditions.</li>
          <li>Users should inspect items before accepting them and document their condition when appropriate.</li>
          <li>Borrowers must use borrowed items responsibly and return them according to the agreement reached with the lender.</li>
          <li>Lenders must accurately describe items and disclose known defects, safety concerns, or limitations.</li>
          <li>Users should not lend or borrow items that they do not legally own or have permission to provide.</li>
          <li>Disputes concerning loss, damage, non-return, or misuse of borrowed items should first be raised with the other party and reported to NearbyHelpUp where appropriate.</li>
          <li>Unless a separate written agreement or applicable law provides otherwise, NearbyHelpUp does not guarantee the return, condition, safety, or availability of any borrowed item.</li>
        </ol>
      )
    },
    {
      id: 6,
      title: "6. Barter and Exchange",
      category: "Transactions",
      summary: "Rules for non-monetary exchanges of goods and services; requirement for honest disclosure and legal compliance.",
      content: (
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>Users may exchange permitted goods or services without a monetary payment where supported by the Platform.</li>
          <li>The parties are responsible for agreeing on the terms, condition, quantity, delivery, and timing of an exchange.</li>
          <li>Users must disclose relevant defects or limitations and must not misrepresent the value, quality, or nature of what they offer.</li>
          <li>Users must not use barter to facilitate unlawful transactions or disguise prohibited commercial activity.</li>
          <li>NearbyHelpUp does not guarantee that both parties will fulfil an exchange agreement.</li>
          <li>Any monetary arrangements, deposits, reimbursements, or fees must comply with applicable law and any additional rules published by NearbyHelpUp.</li>
        </ol>
      )
    },
    {
      id: 7,
      title: "7. User Responsibilities and Prohibited Activities",
      category: "Conduct & Safety",
      isCrucial: true,
      summary: "Strict prohibition against fraud, illegal items, harassment, malware, spam, and platform evasion.",
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-rose-600 dark:text-rose-400">
            You agree not to engage in any of the following activities:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Post fraudulent, misleading, defamatory, or deliberately deceptive content.</li>
            <li>Use the Platform to harass, threaten, stalk, exploit, or discriminate against others unlawfully.</li>
            <li>Publish another person&apos;s private information without appropriate authorization.</li>
            <li>Post illegal, stolen, counterfeit, dangerous, or prohibited goods.</li>
            <li>Offer or request illegal services, weapons, controlled substances, or other unlawful items.</li>
            <li>Engage in scams, phishing, impersonation, identity theft, or financial fraud.</li>
            <li>Upload malware or attempt to compromise the Platform&apos;s security.</li>
            <li>Spam users, manipulate reviews, or create multiple accounts to evade restrictions.</li>
            <li>Circumvent account restrictions or misuse community features.</li>
            <li>Use the Platform to facilitate violence, exploitation, or any other unlawful conduct.</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            We may investigate suspected violations, restrict content, suspend accounts, or take other appropriate action, subject to applicable law and our operational policies.
          </p>
        </div>
      )
    },
    {
      id: 8,
      title: "8. User-Generated Content",
      category: "Conduct & Safety",
      summary: "Ownership of your content, license granted to NearbyHelpUp to host and display, IP protections.",
      content: (
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>Users are responsible for the content, photographs, descriptions, requests, offers, messages, and reviews they submit.</li>
          <li>You must have the necessary rights and permissions to submit content.</li>
          <li>You retain ownership of your content, subject to any rights you have granted to others.</li>
          <li>By submitting content, you grant NearbyHelpUp a non-exclusive, worldwide, royalty-free licence to host, store, reproduce, display, and process that content as reasonably necessary to operate, maintain, secure, and improve the Platform, subject to applicable law and our Privacy Policy.</li>
          <li>You must not upload content that infringes intellectual property rights or violates another person&apos;s privacy.</li>
          <li>We may remove or restrict content that violates these Terms or applicable law.</li>
        </ol>
      )
    },
    {
      id: 9,
      title: "9. User Safety and Interactions",
      category: "Conduct & Safety",
      isCrucial: true,
      summary: "Public meeting advice, credential security (never share OTPs), independent evaluation of trustworthiness.",
      content: (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            <strong>Security Warning:</strong> Never disclose passwords, OTPs, UPI PINs, or banking details to anyone on or off the platform.
          </div>
          <ol className="list-decimal pl-5 space-y-2.5">
            <li>Users should exercise reasonable caution when meeting people, exchanging items, or providing assistance.</li>
            <li>Where practical, meet in public places and avoid sharing sensitive personal information unnecessarily.</li>
            <li>Do not share passwords, one-time passwords (OTPs), banking credentials, or authentication codes with other users.</li>
            <li>Users should independently assess whether another user or an offer is trustworthy.</li>
            <li>Any identity checks, verification badges, ratings, or reviews, if available, should not be treated as an absolute guarantee of trustworthiness.</li>
            <li>Users should promptly report suspicious behaviour, threats, fraud, or safety concerns through the Platform&apos;s designated reporting channel. NearbyHelpUp may assist with reports and take appropriate action, but it cannot guarantee the conduct or safety of every user interaction.</li>
          </ol>
        </div>
      )
    },
    {
      id: 10,
      title: "10. Payments, Fees, and Financial Arrangements",
      category: "Transactions",
      summary: "Platform is centered on mutual assistance; no platform-held deposits unless expressly indicated.",
      content: (
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>The Platform&apos;s core community assistance and barter features are intended to support mutual help rather than mandatory monetary exchange.</li>
          <li>Unless expressly displayed and agreed to through an authorized Platform feature, NearbyHelpUp does not collect or hold payments, deposits, or security amounts on behalf of users.</li>
          <li>Users must clearly agree on any permitted financial arrangement directly with the other party.</li>
          <li>NearbyHelpUp is not responsible for unauthorized transfers, off-platform payments, or losses resulting from a user&apos;s independent financial decisions, except where responsibility cannot lawfully be excluded.</li>
          <li>Any future paid features, subscriptions, transaction fees, or payment processing services will be governed by additional terms where applicable.</li>
        </ol>
      )
    },
    {
      id: 11,
      title: "11. Reviews, Ratings, and Reports",
      category: "Conduct & Safety",
      summary: "Reviews must reflect genuine personal experiences without malicious retaliation or bribery.",
      content: (
        <ol className="list-decimal pl-5 space-y-2.5">
          <li>Reviews and ratings must reflect genuine experiences and must not contain fabricated claims, threats, or abusive content.</li>
          <li>Users must not manipulate ratings or offer improper incentives to influence reviews.</li>
          <li>NearbyHelpUp may review reports and take reasonable moderation action.</li>
          <li>We do not guarantee that every review or allegation can be independently verified.</li>
          <li>Users should report suspected fraudulent or harmful activity rather than retaliate against other members.</li>
        </ol>
      )
    },
    {
      id: 12,
      title: "12. Privacy and Personal Information",
      category: "Legal & Liability",
      summary: "Collection and processing of user data; avoiding posting sensitive personal details publicly.",
      content: (
        <div className="space-y-3">
          <p>
            Our collection and use of personal information are described in the NearbyHelpUp Privacy Policy. Depending on the features used, information may include account details, contact information, approximate or selected location, listings, communications, and reports.
          </p>
          <p>
            We will handle personal information in accordance with our published Privacy Policy and applicable data protection laws. Users should avoid posting sensitive personal information publicly.
          </p>
          <p>
            For information about data access, correction, deletion, retention, consent, and grievance procedures, please refer to our Privacy Policy or contact our grievance desk at{' '}
            <a href="mailto:Managemeet810@gmail.com" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Managemeet810@gmail.com
            </a>.
          </p>
        </div>
      )
    },
    {
      id: 13,
      title: "13. Intellectual Property",
      category: "Legal & Liability",
      summary: "Ownership of NearbyHelpUp trademarks, UI, and software; prohibition of unauthorized duplication.",
      content: (
        <div className="space-y-3">
          <p>
            The Platform&apos;s name, branding, logos, interface, software, design, and original materials are owned by or licensed to NearbyHelpUp, unless otherwise stated.
          </p>
          <p>
            You may not copy, reproduce, distribute, modify, reverse-engineer, or commercially exploit protected Platform materials without appropriate authorization, except as permitted by applicable law. User-generated content remains subject to the ownership and licence provisions in Section 8.
          </p>
        </div>
      )
    },
    {
      id: 14,
      title: "14. Third-Party Services",
      category: "Legal & Liability",
      summary: "Integrations with third-party auth, maps, and hosting services subject to their own terms.",
      content: (
        <p>
          The Platform may integrate with third-party services, including authentication providers, hosting providers, maps, messaging tools, or analytics services. Such services may be governed by their own terms and privacy policies. NearbyHelpUp does not control every aspect of third-party services and cannot guarantee their continuous availability. This section does not exclude any responsibility imposed on us by applicable law.
        </p>
      )
    },
    {
      id: 15,
      title: "15. Platform Availability and Changes",
      category: "General",
      summary: "Operational maintenance, service modifications, and reasonable uptime efforts.",
      content: (
        <p>
          We may update, modify, suspend, or discontinue features for maintenance, security, legal compliance, or operational reasons. We will make reasonable efforts to maintain the availability and security of the Platform, but uninterrupted or error-free operation cannot be guaranteed. Where required by applicable law, we will provide appropriate notice of material changes or discontinuation.
        </p>
      )
    },
    {
      id: 16,
      title: "16. Account Suspension and Termination",
      category: "Conduct & Safety",
      summary: "Voluntary account deletion and platform termination for safety or terms violations.",
      content: (
        <div className="space-y-3">
          <p>
            You may stop using the Platform at any time and request account deletion through the available account settings or by contacting{' '}
            <a href="mailto:Managemeet810@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Managemeet810@gmail.com
            </a>.
          </p>
          <p>
            We may restrict, suspend, or terminate access where reasonably necessary because of suspected fraud, safety risks, violations of these Terms, legal obligations, or threats to the Platform or its users. Where appropriate and legally permissible, we may notify the affected user and provide an opportunity to respond.
          </p>
          <p className="text-xs text-slate-500">
            Termination does not remove obligations or liabilities that arose before termination. Information may be retained where required or permitted by applicable law and our Privacy Policy.
          </p>
        </div>
      )
    },
    {
      id: 17,
      title: "17. Disclaimers and Limitation of Liability",
      category: "Legal & Liability",
      isCrucial: true,
      summary: "Platform provided 'as available'; disclaimers regarding peer conduct, item conditions, and indirect losses.",
      content: (
        <div className="space-y-4">
          <p>
            NearbyHelpUp is provided on an &quot;as available&quot; basis, subject to applicable law. To the extent legally permitted, NearbyHelpUp does not guarantee:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
            <li>The identity, reliability, intentions, or conduct of every user.</li>
            <li>The quality, legality, safety, or condition of user-provided goods or services.</li>
            <li>That a request for assistance will be fulfilled.</li>
            <li>That a borrower will return an item or that an exchange will be completed.</li>
            <li>Uninterrupted access to the Platform or the absence of every technical issue.</li>
          </ul>
          <p>
            To the extent permitted by law, NearbyHelpUp will not be liable for indirect or consequential losses arising from independent user-to-user interactions or temporary Platform unavailability.
          </p>
          <p className="text-xs text-slate-500 bg-slate-100/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            Nothing in these Terms excludes or limits liability for fraud, wilful misconduct, gross negligence where applicable, death or personal injury where such exclusion is prohibited, statutory consumer rights, or any other liability that cannot legally be excluded or limited. Nothing in these Terms removes rights or remedies available to users under applicable law.
          </p>
        </div>
      )
    },
    {
      id: 18,
      title: "18. Indemnity",
      category: "Legal & Liability",
      summary: "User responsibility for claims arising from unlawful conduct or material breach of terms.",
      content: (
        <p>
          To the extent permitted by applicable law, you agree to be responsible for losses, claims, or reasonable costs arising directly from your unlawful conduct, fraud, or material violation of these Terms, including infringement of third-party rights. This provision does not require you to indemnify NearbyHelpUp for losses caused by our own unlawful conduct or for liabilities that cannot legally be transferred to you.
        </p>
      )
    },
    {
      id: 19,
      title: "19. Dispute Resolution",
      category: "Legal & Liability",
      isCrucial: true,
      summary: "Direct neighbor dialogue, platform grievance reporting via email, and statutory legal rights.",
      content: (
        <div className="space-y-3">
          <p>
            Users are encouraged to communicate respectfully and attempt to resolve disputes directly where it is safe and appropriate.
          </p>
          <p>
            You may contact NearbyHelpUp at{' '}
            <a href="mailto:Managemeet810@gmail.com" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Managemeet810@gmail.com
            </a>{' '}
            to report a dispute involving suspected fraud, abuse, account access, or Platform misuse. NearbyHelpUp may review reports and facilitate communication at its discretion, but does not guarantee a settlement between users.
          </p>
          <p className="text-xs text-slate-500">
            Nothing in this section prevents any party from approaching a competent court, regulator, consumer commission, or other legally authorized authority.
          </p>
        </div>
      )
    },
    {
      id: 20,
      title: "20. Governing Law and Jurisdiction",
      category: "Legal & Liability",
      isCrucial: true,
      summary: "Governed by the laws of India; competent courts within India.",
      content: (
        <div className="p-4 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="font-semibold text-slate-900 dark:text-white">
            Applicable Jurisdiction: Laws of India
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            These Terms are governed by the laws of India. Subject to mandatory legal requirements and the jurisdiction of competent authorities, disputes concerning these Terms shall be subject to the jurisdiction of the competent courts in India. Nothing in this clause restricts any non-waivable legal rights of users.
          </p>
        </div>
      )
    },
    {
      id: 21,
      title: "21. Changes to These Terms",
      category: "General",
      summary: "Periodic revisions to reflect feature expansions, community policies, and regulatory updates.",
      content: (
        <p>
          We may update these Terms from time to time to reflect changes in the Platform, applicable law, or our services. Continued use of NearbyHelpUp following the publication of revised terms constitutes your acceptance of the updated Terms.
        </p>
      )
    }
  ], []);

  const categories = ['All', 'General', 'Conduct & Safety', 'Transactions', 'Legal & Liability'];

  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      const matchesCategory = selectedCategory === 'All' || sec.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const titleMatch = sec.title.toLowerCase().includes(query);
      const summaryMatch = sec.summary?.toLowerCase().includes(query);
      return matchesCategory && (titleMatch || summaryMatch);
    });
  }, [sections, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate(user ? '/home' : '/');
                }
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <Link to={user ? '/home' : '/'} className="flex items-center gap-2.5">
              <span className="text-2xl">🤝</span>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base leading-none">
                  NearbyHelpUp
                </span>
                <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Community Mesh Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
              title="Copy link to Terms"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Share Link</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
              title="Print or Save PDF"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <Link
              to={user ? '/home' : '/'}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm shadow-indigo-600/20"
            >
              {user ? 'Return to Feed' : 'Explore Platform'}
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Title Section */}
      <section className="border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-indigo-950/20 dark:via-slate-950 dark:to-transparent py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
            <Scale className="h-3.5 w-3.5" />
            <span>Official Legal Governance Document</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Terms & Conditions
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to NearbyHelpUp. Please read these terms carefully before accessing or participating in peer borrowing, barter exchange, or mutual community assistance.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Updated: <strong>October 2026</strong></span>
            <span>•</span>
            <span>21 Comprehensive Sections</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Mail className="h-3 w-3" /> Managemeet810@gmail.com
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Category Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 21 clauses (e.g., 'emergency', 'borrowing', 'age', 'liability')..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column: Left Table of Contents, Right Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Left TOC (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Table of Contents (21)
              </h3>
            </div>
            
            <nav className="flex flex-col gap-1 text-xs">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#section-${sec.id}`}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    activeSectionId === sec.id
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate pr-2">{sec.title}</span>
                  {sec.isCrucial && (
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" title="Key Safety Clause" />
                  )}
                </a>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Legally Binding Agreement</span>
              </div>
              <p className="leading-tight">
                Applicable to all users registered in India under jurisdiction of competent courts.
              </p>
            </div>
          </aside>

          {/* Right Main Content Stream */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {filteredSections.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Info className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">No sections match your search</h3>
                <p className="text-xs text-slate-500 mt-1">Try searching for keywords like &quot;emergency&quot;, &quot;borrow&quot;, or &quot;eligibility&quot;.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredSections.map((sec) => (
                <article
                  key={sec.id}
                  id={`section-${sec.id}`}
                  className={`scroll-mt-24 p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                    sec.isCrucial
                      ? 'border-indigo-200/80 dark:border-indigo-900/60 shadow-sm ring-1 ring-indigo-500/10'
                      : 'border-slate-200/70 dark:border-slate-800/80 shadow-sm'
                  }`}
                >
                  {/* Section Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                        {sec.id}
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {sec.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {sec.category}
                      </span>
                      {sec.isCrucial && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                          Critical Clause
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section Summary Pill */}
                  {sec.summary && (
                    <div className="mb-4 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-950/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850">
                      <strong>Summary:</strong> {sec.summary}
                    </div>
                  )}

                  {/* Section Body */}
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {sec.content}
                  </div>
                </article>
              ))
            )}

            {/* Assistance & Grievance Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-base font-bold">Have Questions or Need Grievance Redressal?</h3>
                  <p className="text-xs text-indigo-100 max-w-md">
                    Our community safety and grievance team responds to platform misuse, dispute escalations, or terms inquiries within 48 business hours.
                  </p>
                </div>
                <a
                  href="mailto:Managemeet810@gmail.com"
                  className="px-4 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Grievance Desk</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Embedded Footer */}
      <AppFooter />

    </div>
  );
};
