import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldAlert, 
  ArrowRight, 
  Phone, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  LogIn,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Info,
  ShieldCheck
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { api } from '../services/api';
import { 
  isFirebaseConfigured, 
  signInWithFirebaseGoogle, 
  saveFirebaseConfig, 
  getFirebaseConfig 
} from '../services/firebase';

export const Login: React.FC = () => {
  const { login, signup, googleSignIn, phoneSignIn } = useAuth();
  const navigate = useNavigate();
  
  // Method switching ('email' | 'phone')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Email fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('Delhi Technological University');
  
  // Real-time validations
  const [emailError, setEmailError] = useState('');
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: 'bg-slate-200' });
  
  // Mobile login fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Modals & loading states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Real-time email validation & DB exist check
  const handleEmailChange = async (val: string) => {
    setEmail(val);
    setEmailExists(null);
    if (!val) {
      setEmailError('');
      return;
    }
    const isValid = /\S+@\S+\.\S+/.test(val);
    if (!isValid) {
      setEmailError('Invalid email format');
      return;
    }
    setEmailError('');
    
    // Check DB existence (debounced in production, fast for responsiveness here)
    setCheckingEmail(true);
    try {
      const res = await api.auth.checkEmail(val);
      setEmailExists(res.exists);
    } catch (e) {
      // Fail silently
    } finally {
      setCheckingEmail(false);
    }
  };

  // Real-time password strength
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (!val) {
      setPasswordStrength({ score: 0, text: '', color: 'bg-slate-200' });
      return;
    }
    let score = 0;
    if (val.length >= 6) score += 1;
    if (/[A-Z]/.test(val)) score += 1;
    if (/[0-9]/.test(val)) score += 1;
    if (/[^A-Za-z0-9]/.test(val)) score += 1;

    let text = 'Weak';
    let color = 'bg-gradient-to-r from-rose-500 to-rose-400';
    if (score === 2) {
      text = 'Medium';
      color = 'bg-gradient-to-r from-amber-500 to-amber-400';
    } else if (score >= 3) {
      text = 'Strong';
      color = 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    }
    setPasswordStrength({ score, text, color });
  };

  // Send OTP countdown hook
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const [receivedOtp, setReceivedOtp] = useState('');

  const handleSendOtp = async () => {
    if (phone.length < 10) return;
    setError('');
    try {
      const res = await api.auth.requestOtp(phone);
      setOtpSent(true);
      setCountdown(30);
      setReceivedOtp(res.otp);
      alert(`[SMS GATEWAY] Verification code sent to ${phone}: ${res.otp}. Please type this code to login.`);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    }
  };

  // Form submit (Email/Phone Sign In / Sign Up)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginMethod === 'phone') {
        await phoneSignIn(phone, otp);
      } else {
        if (isSignUp) {
          await signup({
            email,
            username,
            name,
            password,
            college,
            location_lat: 28.7501,
            location_lon: 77.1177,
            location_name: 'DTU Campus, Rohini',
          });
        } else {
          await login(email, password);
        }
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify fields.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth & Firebase configuration
  const [activeClientId, setActiveClientId] = useState<string>(() => {
    return (
      localStorage.getItem('custom_google_client_id') ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '401820413933-mi81nriei4p8rrhrc63vh5hvkukasl48.apps.googleusercontent.com'
    );
  });
  const [clientInputVal, setClientInputVal] = useState('');
  const [firebaseKeyVal, setFirebaseKeyVal] = useState(() => getFirebaseConfig().apiKey || '');
  const [showSettingsAccordion, setShowSettingsAccordion] = useState(false);
  const [originCopied, setOriginCopied] = useState(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState('');
  const tokenClientRef = useRef<any>(null);

  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // 1. Detect Google OAuth token in URL hash (e.g., from redirect flow)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashStr = window.location.hash.substring(1);
      if (hashStr.includes('access_token') || hashStr.includes('id_token') || hashStr.includes('credential')) {
        const params = new URLSearchParams(hashStr);
        const accessToken = params.get('access_token');
        const credential = params.get('credential') || params.get('id_token');
        if (accessToken || credential) {
          setLoading(true);
          window.history.replaceState(null, '', window.location.pathname);
          googleSignIn(accessToken ? { access_token: accessToken } : { credential })
            .then(() => navigate('/home'))
            .catch((err: any) => {
              setError(err.message || 'Google OAuth failed');
              setLoading(false);
            });
        }
      }
    }
  }, []);

  // 2. Initialize Google Identity Services (GIS)
  useEffect(() => {
    let checkTimer: any = null;

    const setupGis = () => {
      const google = (window as any).google;
      if (!google?.accounts) return false;

      if (activeClientId) {
        try {
          // Initialize Google ID Token / One-Tap
          google.accounts.id.initialize({
            client_id: activeClientId,
            auto_select: false,
            callback: async (response: any) => {
              if (response?.credential) {
                setLoading(true);
                setError('');
                try {
                  await googleSignIn({ credential: response.credential });
                  navigate('/home');
                } catch (err: any) {
                  setError(err.message || 'Google authentication failed');
                  setLoading(false);
                }
              }
            },
          });

          // Initialize OAuth2 Token Client for interactive popups
          if (google.accounts.oauth2) {
            tokenClientRef.current = google.accounts.oauth2.initTokenClient({
              client_id: activeClientId,
              scope: 'email profile openid',
              callback: async (tokenResponse: any) => {
                if (tokenResponse?.error) {
                  setLoading(false);
                  if (tokenResponse.error !== 'access_denied') {
                    setShowGoogleModal(true);
                  }
                  return;
                }

                if (tokenResponse?.access_token) {
                  setLoading(true);
                  setError('');
                  try {
                    await googleSignIn({ access_token: tokenResponse.access_token });
                    navigate('/home');
                  } catch (err: any) {
                    setError(err.message || 'Google authentication failed');
                    setLoading(false);
                  }
                }
              },
            });
          }

          // Render official button if container exists
          const btnContainer = document.getElementById('googleSignInOfficialBtn');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              width: 320,
              shape: 'rectangular',
              text: 'continue_with',
            });
          }
        } catch (e) {
          console.error('Failed to initialize Google Identity Services', e);
        }
      }
      return true;
    };

    if (!setupGis()) {
      checkTimer = setInterval(() => {
        if (setupGis()) {
          clearInterval(checkTimer);
        }
      }, 300);
    }

    return () => {
      if (checkTimer) clearInterval(checkTimer);
    };
  }, [activeClientId]);

  // Direct Google OAuth Popup Flow
  const openGoogleOAuthPopup = () => {
    const redirectUri = window.location.origin + '/login';
    const clientId = activeClientId;
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid%20email%20profile&prompt=select_account`;

    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(oauthUrl, 'GoogleOAuthPopup', `width=${width},height=${height},left=${left},top=${top}`);
    if (!popup) {
      setShowGoogleModal(true);
      return;
    }

    setLoading(true);
    const timer = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(timer);
          setLoading(false);
          return;
        }
        if (popup.location && popup.location.href.includes(window.location.origin)) {
          const hash = popup.location.hash;
          if (hash) {
            popup.close();
            clearInterval(timer);
            const params = new URLSearchParams(hash.substring(1));
            const token = params.get('access_token');
            if (token) {
              googleSignIn({ access_token: token })
                .then(() => navigate('/home'))
                .catch((err) => {
                  setError(err.message || 'Google authentication failed');
                  setLoading(false);
                });
            } else {
              setLoading(false);
            }
          }
        }
      } catch (e) {
        // Cross-origin access expected before redirect
      }
    }, 500);
  };

  // Handler to initiate Google OAuth / Firebase login
  const handleGoogleAuthClick = async () => {
    setError('');

    // 1. Try Firebase Google Popup if Firebase is configured with an API key
    if (isFirebaseConfigured()) {
      setLoading(true);
      try {
        const result = await signInWithFirebaseGoogle();
        await googleSignIn(result);
        navigate('/home');
        return;
      } catch (fbErr: any) {
        setLoading(false);
        if (fbErr.code === 'auth/popup-closed-by-user') {
          return;
        }
      }
    }

    // 2. Try Google Identity Services interactive popup client with timeout guard
    if (tokenClientRef.current) {
      setLoading(true);
      let resolved = false;

      // 1.5s timeout: if popup was blocked or GIS failed silently, reveal modal immediately
      const timer = setTimeout(() => {
        if (!resolved) {
          setLoading(false);
          setShowGoogleModal(true);
        }
      }, 1500);

      tokenClientRef.current.callback = async (tokenResponse: any) => {
        resolved = true;
        clearTimeout(timer);
        if (tokenResponse?.error) {
          setLoading(false);
          if (tokenResponse.error !== 'access_denied') {
            setShowGoogleModal(true);
          }
          return;
        }

        if (tokenResponse?.access_token) {
          setLoading(true);
          setError('');
          try {
            await googleSignIn({ access_token: tokenResponse.access_token });
            navigate('/home');
          } catch (err: any) {
            setError(err.message || 'Google authentication failed');
            setLoading(false);
          }
        }
      };

      try {
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        clearTimeout(timer);
        setLoading(false);
        setShowGoogleModal(true);
        return;
      }
    }

    // 3. Fallback: Open Google Account Chooser modal
    setShowGoogleModal(true);
  };

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientInputVal.trim()) return;
    const cleanId = clientInputVal.trim();
    localStorage.setItem('custom_google_client_id', cleanId);
    setActiveClientId(cleanId);
    setConfigSuccessMsg('Google Client ID updated successfully!');
    setTimeout(() => setConfigSuccessMsg(''), 3000);
    setError('');
    // Automatically trigger login after a short delay for GIS re-init
    setTimeout(() => {
      if (tokenClientRef.current) {
        tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
      }
    }, 400);
  };

  const handleSaveFirebaseKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseKeyVal.trim()) return;
    const current = getFirebaseConfig();
    saveFirebaseConfig({
      ...current,
      apiKey: firebaseKeyVal.trim(),
    });
    setConfigSuccessMsg('Firebase API Key saved successfully!');
    setTimeout(() => setConfigSuccessMsg(''), 3000);
  };

  const handleCopyOrigin = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.origin);
      setOriginCopied(true);
      setTimeout(() => setOriginCopied(false), 2000);
    }
  };

  // Google Sign-In Chooser accounts list for seamless testing & quick login
  const googleAccounts = [
    { name: 'Priyanshu Sharma', email: 'priyanshu@helpup.com', photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priyanshu' },
    { name: 'Anuj Tiwari', email: 'anujtiwari1427@gmail.com', photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=anuj' },
    { name: 'System Administrator', email: 'admin@helpup.com', photo: 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin' },
  ];

  const handleSelectGoogleAccount = async (account: { name: string; email: string; photo?: string }) => {
    if (!account.email) return;
    setShowGoogleModal(false);
    setError('');
    setLoading(true);
    try {
      await googleSignIn({
        id: `google-${account.email.split('@')[0]}`,
        email: account.email,
        name: account.name || account.email.split('@')[0],
        picture: account.photo || `https://api.dicebear.com/7.x/adventurer/svg?seed=${account.email.split('@')[0]}`,
      });
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }
    handleSelectGoogleAccount({
      email: customGoogleEmail,
      name: customGoogleName || customGoogleEmail.split('@')[0],
    });
  };

  // Shared input class with gradient focus ring
  const inputClass = "h-10 w-full rounded-xl bg-slate-50/80 border border-slate-200/60 pl-10 pr-4 text-xs outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.08),0_0_20px_-4px_rgba(79,70,229,0.12)] dark:bg-slate-900/80 dark:border-slate-800/60 dark:text-white dark:focus:bg-slate-950 dark:focus:border-indigo-500/40 dark:focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1),0_0_20px_-4px_rgba(79,70,229,0.08)]";
  const inputClassNoIcon = "h-10 w-full rounded-xl bg-slate-50/80 border border-slate-200/60 px-4 text-xs outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.08),0_0_20px_-4px_rgba(79,70,229,0.12)] dark:bg-slate-900/80 dark:border-slate-800/60 dark:text-white dark:focus:bg-slate-950 dark:focus:border-indigo-500/40 dark:focus:shadow-[0_0_0_3px_rgba(79,70,229,0.1),0_0_20px_-4px_rgba(79,70,229,0.08)]";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 ambient-mesh" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/12 rounded-full blur-[140px] pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-glow-pulse delay-300" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-pink-500/6 rounded-full blur-[100px] pointer-events-none animate-glow-pulse delay-500" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header with glow halo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white text-3xl shadow-xl mb-4 animate-float">
            🤝
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-xl scale-150" />
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-md" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isSignUp ? 'Create a HelpUp Account' : 'Welcome back to HelpUp'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Join your local university sharing network' : 'Sign in to access nearby borrows and offers'}
          </p>
        </div>

        <GlassCard className="p-6 md:p-8 gradient-border" hoverEffect={false}>
          {error && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-200/50 bg-gradient-to-r from-rose-50/80 to-rose-50/40 p-3 text-xs font-semibold text-rose-600 dark:border-rose-950/30 dark:bg-gradient-to-r dark:from-rose-950/30 dark:to-rose-950/10 dark:text-rose-400 animate-fade-in">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Tabs with gradient indicator */}
          {!isSignUp && (
            <div className="flex bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl mb-5 border border-slate-200/30 dark:border-slate-800/30">
              <button
                type="button"
                onClick={() => { setLoginMethod('email'); setError(''); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                  loginMethod === 'email' 
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-950 dark:text-indigo-400 shadow-indigo-500/5' 
                    : 'text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Email Address
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('phone'); setError(''); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                  loginMethod === 'phone' 
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-950 dark:text-indigo-400 shadow-indigo-500/5' 
                    : 'text-slate-550 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Mobile Number
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {loginMethod === 'email' || isSignUp ? (
              /* --- EMAIL METHOD --- */
              <>
                {isSignUp && (
                  <>
                    <div className="flex flex-col gap-1.5 animate-fade-in">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="Priyanshu Sharma"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 animate-fade-in delay-100">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="priyanshu_sharma"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
                    
                    {/* Real-time Email Database Match Badge */}
                    {checkingEmail && <span className="text-[9px] text-indigo-500 font-medium flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Verifying...</span>}
                    {!checkingEmail && email && emailError && <span className="text-[9px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {emailError}</span>}
                    {!checkingEmail && email && !emailError && emailExists === true && <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5"><Check className="h-3 w-3" /> Account found</span>}
                    {!checkingEmail && email && !emailError && emailExists === false && <span className="text-[9px] text-amber-600 dark:text-amber-450 font-bold flex items-center gap-0.5"><AlertCircle className="h-3 w-3" /> Unregistered Email</span>}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="priyanshu@helpup.com"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
                    {password && (
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        Strength: <span className="font-extrabold text-slate-700 dark:text-slate-350">{passwordStrength.text}</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  {/* Gradient Password Strength Progress Bar */}
                  {password && (
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} rounded-full transition-all duration-500 ease-out`} 
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <div className="flex flex-col gap-1.5 animate-fade-in delay-200">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">College / Organization</label>
                    <input
                      type="text"
                      placeholder="Delhi Technological University"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className={inputClassNoIcon}
                    />
                  </div>
                )}
              </>
            ) : (
              /* --- PHONE OTP METHOD --- */
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone Number</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={phone.length < 10 || countdown > 0}
                      onClick={handleSendOtp}
                      className="h-10 px-4 rounded-xl text-[10px] font-extrabold uppercase bg-gradient-to-r from-indigo-50 to-indigo-50/80 text-indigo-650 hover:from-indigo-100 hover:to-indigo-50 disabled:opacity-50 dark:from-indigo-950/40 dark:to-indigo-950/20 dark:text-indigo-400 transition-all shrink-0 border border-indigo-100/30 dark:border-indigo-900/30"
                    >
                      {countdown > 0 ? `Resend (${countdown}s)` : otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="flex flex-col gap-1.5 animate-fade-in">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Enter 4-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Type '1234' for demo"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="h-10 w-full tracking-[1.5em] text-center rounded-xl bg-slate-50/80 border border-slate-200/60 px-4 text-xs font-bold outline-none transition-all duration-300 focus:border-indigo-500/50 focus:bg-white focus:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] dark:bg-slate-900/80 dark:border-slate-800/60 dark:text-white dark:focus:bg-slate-950"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading || (loginMethod === 'phone' && otp.length < 4)}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 text-xs font-bold text-white hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all duration-500 shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/15 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-[1px] active:translate-y-0"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Social Sign In Divider with gradient line */}
          <div className="relative my-6 flex items-center justify-center">
            <span className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800"></span>
            <span className="relative bg-white px-3 text-[10px] font-bold text-slate-450 dark:bg-slate-900 uppercase">Or continue with</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleAuthClick}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-750 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-850 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 shadow-sm"
            >
              <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 2.08-1.4 3.03l3.25 2.5c1.9-1.76 3.2-4.35 3.2-7.38z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.25-2.5c-.9.6-2.06.96-3.25.96-3.13 0-5.78-2.11-6.73-4.96l-3.37 2.6C5.32 21.05 8.44 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.59c-.25-.75-.39-1.56-.39-2.4s.14-1.65.39-2.4l-3.37-2.6C.68 8.84 0 10.34 0 12s.68 3.16 1.9 4.8l3.37-2.21z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 8.44 0 5.32 2.95 3.38 6.79l3.37 2.6c.95-2.85 3.6-4.64 6.73-4.64z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick account switch / selector shortcut */}
            <button
              type="button"
              onClick={() => {
                setError('');
                setShowGoogleModal(true);
              }}
              className="text-[11px] text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-medium transition-colors text-center py-0.5 flex items-center justify-center gap-1"
            >
              <span>Choose Google account or test options</span>
              <ArrowRight className="h-3 w-3" />
            </button>

            {/* Official GIS Button container for One-Tap / rendered button if Client ID present */}
            {activeClientId && (
              <div id="googleSignInOfficialBtn" className="w-full flex justify-center empty:hidden min-h-[40px]"></div>
            )}
          </div>
        </GlassCard>

        {/* Navigation bottom link */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setLoginMethod('email');
            }}
            className="font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent hover:from-indigo-500 hover:to-pink-500 transition-all duration-300"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/60 text-center text-[11px] text-slate-400">
          By signing in or registering, you agree to our{' '}
          <Link to="/terms" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Terms & Conditions
          </Link>.
        </div>
      </div>

      {/* --- GOOGLE ACCOUNT CHOOSER & AUTHORIZATION MODAL --- */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/50 dark:border-slate-800/60 p-6 rounded-3xl max-w-md w-full shadow-2xl flex flex-col gap-4 gradient-border animate-scale-in max-h-[92vh] overflow-y-auto text-left">
            
            {/* Google Brand Header */}
            <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-center mb-2">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 p-2.5 shadow-md border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                  <svg className="h-7 w-7" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 2.08-1.4 3.03l3.25 2.5c1.9-1.76 3.2-4.35 3.2-7.38z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.25-2.5c-.9.6-2.06.96-3.25.96-3.13 0-5.78-2.11-6.73-4.96l-3.37 2.6C5.32 21.05 8.44 24 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.59c-.25-.75-.39-1.56-.39-2.4s.14-1.65.39-2.4l-3.37-2.6C.68 8.84 0 10.34 0 12s.68 3.16 1.9 4.8l3.37-2.21z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 8.44 0 5.32 2.95 3.38 6.79l3.37 2.6c.95-2.85 3.6-4.64 6.73-4.64z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-extrabold text-slate-850 dark:text-white">Sign in with Google</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose an account to continue to <span className="font-semibold text-indigo-600 dark:text-indigo-400">Nearby HelpUp</span></p>
            </div>

            {configSuccessMsg && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold animate-fade-in border border-emerald-200/50">
                <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{configSuccessMsg}</span>
              </div>
            )}

            {/* 1. Enter Any Google / Gmail Account (Real User Sign In) */}
            <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 p-4 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-indigo-950/40 dark:via-slate-900/90 dark:to-purple-950/30 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Sign In with Your Google Account
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full">
                  Instant Access
                </span>
              </div>
              <form onSubmit={handleCustomGoogleSubmit} className="flex flex-col gap-2.5">
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Enter your Gmail or Google Workspace email..."
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="h-10 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition-all shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Your Display Name (optional)"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="h-10 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white transition-all shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!customGoogleEmail || !customGoogleEmail.includes('@')}
                  className="h-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/25 active:scale-[0.99]"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Authenticate with this Google Account</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* 2. Direct Web OAuth Consent Screen Button */}
            <button
              type="button"
              onClick={openGoogleOAuthPopup}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 text-indigo-500" />
              <span>Launch Google OAuth 2.0 Web Consent Popup</span>
            </button>

            {/* 3. List of Verified Quick-Select Accounts */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Or Select Verified Test Account
              </span>
              {googleAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleSelectGoogleAccount(account)}
                  className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200/70 hover:border-indigo-400 bg-white/70 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-purple-50/40 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-600 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/20 transition-all duration-200 group shadow-sm text-left"
                >
                  <img 
                    src={account.photo} 
                    alt={account.name} 
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all" 
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{account.name}</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 truncate">{account.email}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 ml-auto shrink-0 transition-all" />
                </button>
              ))}
            </div>

            {/* Developer & OAuth Origin Configuration Accordion */}
            <div className="border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-950/30">
              <button
                type="button"
                onClick={() => setShowSettingsAccordion(!showSettingsAccordion)}
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-slate-650 dark:text-slate-350 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Google Cloud & Firebase Settings</span>
                </div>
                {showSettingsAccordion ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showSettingsAccordion && (
                <div className="p-3.5 pt-1 flex flex-col gap-3 text-left border-t border-slate-200/50 dark:border-slate-800/60 animate-fade-in">
                  
                  {/* Authorized Origin Hint */}
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40 text-[11px] text-slate-600 dark:text-slate-300 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">Authorized JavaScript Origin:</span>
                      <button
                        type="button"
                        onClick={handleCopyOrigin}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline"
                      >
                        <Copy className="h-3 w-3" />
                        {originCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <code className="bg-white/80 dark:bg-slate-900 px-2 py-1 rounded text-[11px] font-mono text-indigo-950 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-900">
                      {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}
                    </code>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Add this origin to your Google Cloud Console OAuth 2.0 Web Client to enable Google popup auth on this domain.
                    </p>
                  </div>

                  {/* Client ID Form */}
                  <form onSubmit={handleSaveClientId} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                        Google OAuth Client ID
                      </label>
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                      >
                        Google Console <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="...apps.googleusercontent.com"
                        value={clientInputVal}
                        onChange={(e) => setClientInputVal(e.target.value)}
                        className="h-8 flex-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={!clientInputVal.trim()}
                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shrink-0 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>

                  {/* Firebase API Key Form */}
                  <form onSubmit={handleSaveFirebaseKey} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                        Firebase API Key (Optional)
                      </label>
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                      >
                        Firebase Console <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="AIzaSy..."
                        value={firebaseKeyVal}
                        onChange={(e) => setFirebaseKeyVal(e.target.value)}
                        className="h-8 flex-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 text-xs outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={!firebaseKeyVal.trim()}
                        className="h-8 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50 text-white font-bold text-xs shrink-0 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
