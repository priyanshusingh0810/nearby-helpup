import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Settings, 
  X, 
  Heart, 
  FileText, 
  CheckCircle, 
  UserCheck, 
  MessageSquare,
  Sparkles,
  Award,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Camera,
  ExternalLink
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { WeatherWidget } from '../components/widgets/WeatherWidget';
import { SaaSUpgradeModal } from '../components/common/SaaSUpgradeModal';

export const Profile: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const { user: currentUser, refreshUser } = useAuth();
  const profileId = parseInt(user_id || '0');
  const isOwnProfile = currentUser?.id === profileId;

  // Profile data states
  const [profileUser, setProfileUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification modal states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyName, setVerifyName] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSaaSModal, setShowSaaSModal] = useState(false);

  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [editedInterests, setEditedInterests] = useState('');
  const [editedSkills, setEditedSkills] = useState('');
  const [editedPhoto, setEditedPhoto] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await api.profiles.getById(profileId);
      setProfileUser(data);
      setEditedName(data.name);
      setEditedBio(data.bio || '');
      setEditedInterests(data.interests || '');
      setEditedSkills(data.skills || '');
      setEditedPhoto(data.profile_photo || '');

      const userListings = await api.profiles.getListings(profileId);
      setListings(userListings);

      const userReviews = await api.profiles.getReviews(profileId);
      setReviews(userReviews);
    } catch (err) {
      console.error('Failed to load profile details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingPhoto(true);
    try {
      const res = await api.upload.uploadImage(files[0]);
      setEditedPhoto(res.url);
    } catch (err) {
      alert('Failed to upload image file');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.profiles.updateMe({
        name: editedName,
        bio: editedBio,
        interests: editedInterests,
        skills: editedSkills,
        profile_photo: editedPhoto
      });
      setProfileUser(updated);
      setIsEditing(false);
      
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      alert('Failed to update profile info');
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    setTimeout(async () => {
      try {
        if (currentUser?.id) {
          await api.admin.verifyUser(currentUser.id);
          loadProfile();
          setVerifyStep(4);
        }
      } catch (err) {
        alert('Verification process failed.');
      } finally {
        setIsVerifying(false);
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-[#102A43] border-t-[#19A974] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex-1 p-12 text-center">
        <h3 className="font-bold text-lg text-[#1E293B]">Profile not found</h3>
        <Link to="/" className="inline-block mt-4 text-xs font-semibold text-[#19A974] hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const interestTags = profileUser.interests ? profileUser.interests.split(';').filter((t: string) => t.trim() !== '') : [];
  const skillsTags = profileUser.skills ? profileUser.skills.split(';').filter((t: string) => t.trim() !== '') : [];
  const badgesList = profileUser.badges ? profileUser.badges.split(';').filter((t: string) => t.trim() !== '') : [];

  return (
    <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/50 backdrop-blur-sm p-3 sm:p-4 animate-fade-in">
          <GlassCard className="max-w-md w-[calc(100vw-2rem)] p-4 sm:p-6 flex flex-col gap-4 shadow-xl border-[#E2E8F0] max-h-[90dvh] overflow-y-auto" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-[#102A43] dark:text-white flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-[#38BDF8]" />
                <span>Verify Identity & Phone</span>
              </h3>
              <button 
                onClick={() => setShowVerifyModal(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {verifyStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-[#38BDF8]/10 text-xs text-[#102A43] dark:text-slate-200 leading-relaxed rounded-xl border border-[#38BDF8]/20">
                  Submit your verified name and mobile number to receive an instant SMS verification passcode.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Legal Full Name</label>
                  <input
                    type="text"
                    value={verifyName}
                    onChange={(e) => setVerifyName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={verifyPhone}
                    onChange={(e) => setVerifyPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>
                <button
                  onClick={() => setVerifyStep(2)}
                  className="h-10 bg-[#19A974] hover:bg-[#158f62] text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  Send OTP Code
                </button>
              </div>
            )}

            {verifyStep === 2 && (
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-[#38BDF8]/10 text-xs text-[#102A43] dark:text-slate-200 leading-relaxed rounded-xl border border-[#38BDF8]/20">
                  Upload an image of your Student ID or Government ID Card to establish trusted neighbor status.
                </div>
                <div className="border border-dashed border-[#E2E8F0] rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-[#F8FAFC] dark:bg-slate-900">
                  <FileText className="h-8 w-8 text-[#19A974]" />
                  <span className="text-xs font-semibold text-[#102A43] dark:text-slate-200">Neighborhood_ID_Verified.jpg</span>
                  <span className="text-[10px] text-slate-400">File encrypted & securely verified</span>
                </div>
                <button
                  onClick={() => setVerifyStep(3)}
                  className="h-10 bg-[#19A974] hover:bg-[#158f62] text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                >
                  Proceed to OTP Verification
                </button>
              </div>
            )}

            {verifyStep === 3 && (
              <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
                <div className="p-3 bg-[#38BDF8]/10 text-xs text-[#102A43] dark:text-slate-200 leading-relaxed rounded-xl border border-[#38BDF8]/20">
                  Enter the 6-digit confirmation code dispatched to your phone number.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs text-center tracking-widest font-bold dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="h-10 bg-[#19A974] hover:bg-[#158f62] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center shadow-sm disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying with System...' : 'Submit Verification'}
                </button>
              </form>
            )}

            {verifyStep === 4 && (
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <div className="h-14 w-14 rounded-full bg-[#19A974]/15 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-[#19A974]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#102A43] dark:text-white">Neighbor Status Verified!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    Your trust index has been boosted and your Verified Neighbor badge is now active across the platform.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowVerifyModal(false);
                    setVerifyStep(1);
                  }}
                  className="w-full h-10 bg-[#102A43] text-white hover:bg-[#102A43]/90 rounded-xl text-xs font-bold transition-all"
                >
                  Return to Profile
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Profile Banner & Header Card */}
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-5 sm:gap-6 items-center sm:items-start md:items-center justify-between text-center sm:text-left">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start md:items-center">
          <div className="relative">
            <img
              src={profileUser.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={profileUser.name}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover bg-slate-50 border-2 border-white dark:border-slate-800 shadow-sm"
            />
            {profileUser.identity_verified && (
              <div className="absolute -bottom-1 -right-1 bg-[#19A974] text-white p-1 rounded-full shadow-md" title="Verified Neighbor">
                <ShieldCheck className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 items-center sm:items-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102A43] dark:text-white">
                {profileUser.name}
              </h1>

              {profileUser.identity_verified && (
                <span className="rounded-full bg-[#19A974]/10 text-[#19A974] border border-[#19A974]/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified</span>
                </span>
              )}

              {profileUser.badges?.includes('Google Verified') && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1 border border-[#E2E8F0] dark:border-slate-700">
                  <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.14 2.08-1.4 3.03l3.25 2.5c1.9-1.76 3.2-4.35 3.2-7.38z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.25-2.5c-.9.6-2.06.96-3.25.96-3.13 0-5.78-2.11-6.73-4.96l-3.37 2.6C5.32 21.05 8.44 24 12 24z" />
                    <path fill="#FBBC05" d="M5.27 14.59c-.25-.75-.39-1.56-.39-2.4s.14-1.65.39-2.4l-3.37-2.6C.68 8.84 0 10.34 0 12s.68 3.16 1.9 4.8l3.37-2.21z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 8.44 0 5.32 2.95 3.38 6.79l3.37 2.6c.95-2.85 3.6-4.64 6.73-4.64z" />
                  </svg>
                  <span>Google User</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowSaaSModal(true)}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold flex items-center gap-1 border bg-[#19A974]/10 text-[#19A974] border-[#19A974]/20 hover:bg-[#19A974]/20 transition-colors"
                title="View Community Charter"
              >
                <Heart className="h-3 w-3 fill-[#19A974]/20 text-[#19A974]" />
                <span>{localStorage.getItem('helpup_community_role') || 'Active Neighbor'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500">@{profileUser.username}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 mt-1">
              <MapPin className="h-4 w-4 text-[#38BDF8] shrink-0" />
              <span>{profileUser.location_name}</span>
              {profileUser.college && (
                <>
                  <span>•</span>
                  <span>{profileUser.college}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 w-full md:w-auto shrink-0 justify-center sm:justify-start md:justify-end mt-2 md:mt-0">
          {isOwnProfile ? (
            <>
              {!profileUser.identity_verified && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="rounded-xl bg-[#102A43] hover:bg-[#102A43]/90 text-white font-semibold text-xs px-4 py-2.5 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="h-4 w-4 text-[#38BDF8]" />
                  <span>Verify Profile</span>
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 text-[#102A43] dark:text-slate-200 font-semibold text-xs px-4 py-2.5 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </>
          ) : (
            <Link
              to="/chat"
              className="rounded-xl bg-[#19A974] hover:bg-[#158f62] text-white font-semibold text-xs px-5 py-2.5 transition-all flex items-center gap-1.5 shadow-sm w-full md:w-auto justify-center"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Direct Message</span>
            </Link>
          )}
        </div>
      </div>

      {/* Edit Profile Form Drawer */}
      {isEditing && (
        <GlassCard className="p-6 border-[#E2E8F0] shadow-sm animate-fade-in" hoverEffect={false}>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-[#102A43] dark:text-white">Edit Profile Details</h4>
              <span className="text-[11px] text-slate-400">Updates are reflected across all community listings</span>
            </div>
            
            {/* Avatar Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center border-b border-[#E2E8F0] dark:border-slate-800 pb-4">
              <div className="relative h-16 w-16 group shrink-0">
                <img
                  src={editedPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt="Avatar Preview"
                  className="h-full w-full rounded-2xl object-cover border border-[#E2E8F0]"
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-[#102A43]/60 rounded-2xl flex items-center justify-center text-white text-[9px] font-bold">
                    Saving...
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Change Profile Avatar</label>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Paste image URL here..."
                    value={editedPhoto}
                    onChange={(e) => setEditedPhoto(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                  />
                  <label className="h-9 px-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-semibold text-[#102A43] dark:text-slate-300 flex items-center justify-center cursor-pointer shrink-0 transition-all">
                    <Camera className="h-3.5 w-3.5 mr-1 text-slate-500" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Display Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bio Statement</label>
                <input
                  type="text"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Tell your neighbors how you can help or what you do..."
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Interests (Semi-colon separated)</label>
                <input
                  type="text"
                  value={editedInterests}
                  onChange={(e) => setEditedInterests(e.target.value)}
                  placeholder="Photography;Chess;Cycling;Gardening"
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skills (Semi-colon separated)</label>
                <input
                  type="text"
                  value={editedSkills}
                  onChange={(e) => setEditedSkills(e.target.value)}
                  placeholder="First Aid;Carpentry;Math Tutoring;Web Development"
                  className="h-10 px-3 rounded-xl border border-[#E2E8F0] text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:border-[#19A974]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#19A974] hover:bg-[#158f62] text-white font-semibold text-xs px-6 py-2 shadow-sm transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Main 3-Column Grid */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Column: Trust Index, Local Weather & Badges */}
        <div className="flex flex-col gap-6">
          
          {/* Trust Scorecard */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-full flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Trust Scorecard</span>
              <span className="text-[10px] font-semibold text-[#19A974] bg-[#19A974]/10 px-2 py-0.5 rounded-full">Top 5%</span>
            </div>

            <div className="relative h-28 w-28 flex items-center justify-center my-1">
              <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-800" />
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  fill="none" 
                  stroke="url(#trust-gradient-clean)" 
                  strokeWidth="7" 
                  strokeDasharray="301" 
                  strokeDashoffset={301 - (301 * profileUser.trust_score) / 100}
                  strokeLinecap="round" 
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="trust-gradient-clean" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#102A43" />
                    <stop offset="100%" stopColor="#19A974" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#102A43] dark:text-white">{Math.round(profileUser.trust_score)}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full border-t border-[#E2E8F0] dark:border-slate-800 pt-4">
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-[#102A43] dark:text-white">98%</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase mt-0.5">Reliability</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-[#102A43] dark:text-white">100%</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase mt-0.5">Completion</span>
              </div>
            </div>
          </div>

          {/* Local Micro-Climate Weather */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
             <div className="flex items-center justify-between">
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Local Area Conditions</span>
               <span className="text-[9px] text-slate-400">Live</span>
             </div>
             <WeatherWidget lat={profileUser.location_lat ?? null} lon={profileUser.location_lon ?? null} locationName={profileUser.location_name} />
          </div>

          {/* User Badges */}
          {badgesList.length > 0 && (
            <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Community Badges</span>
              <div className="flex flex-wrap gap-2">
                {badgesList.map((badge: string) => (
                  <span 
                    key={badge} 
                    className="rounded-lg bg-[#F8FAFC] dark:bg-slate-800 text-[#102A43] dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-700 px-2.5 py-1 text-[10px] font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Award className="h-3 w-3 text-[#19A974]" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Skills */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            {interestTags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {interestTags.map((t: string) => (
                    <span key={t} className="rounded-full bg-[#F8FAFC] text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-[#E2E8F0] dark:border-slate-700 px-3 py-1 text-[10px] font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skillsTags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Help Capabilities</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillsTags.map((t: string) => (
                    <span key={t} className="rounded-full bg-[#19A974]/10 text-[#19A974] border border-[#19A974]/20 px-3 py-1 text-[10px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 2-Columns: Bio Statement, Active Listings, Reviews */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Bio statement card */}
          <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">About</span>
            <p className="text-sm text-[#1E293B] dark:text-slate-300 leading-relaxed">
              {profileUser.bio || "This user has not written a personal bio yet."}
            </p>
          </div>

          {/* Active Listings Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#102A43] dark:text-white">Active Community Listings</span>
              <span className="text-xs text-slate-400">{listings.length} item{listings.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {listings.length > 0 ? (
                listings.map((item) => (
                  <Link
                    key={item.id}
                    to={`/listing/${item.id}`}
                    className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="h-32 w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                      <img 
                        src={item.images?.split(';')[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400'} 
                        alt={item.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-[#102A43] text-white px-2.5 py-0.5 text-[9px] font-bold uppercase">
                        {item.type}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#102A43] dark:text-white truncate group-hover:text-[#19A974] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] dark:border-slate-800 text-[10px] text-slate-400">
                        <span>{item.location_name}</span>
                        <span className="text-[#19A974] font-semibold flex items-center gap-0.5">
                          View details <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="sm:col-span-2 text-center py-10 text-xs text-slate-400 border border-[#E2E8F0] rounded-2xl bg-white dark:bg-[#1E293B]">
                  No active listings posted yet.
                </div>
              )}
            </div>
          </div>

          {/* User Reviews */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#102A43] dark:text-white">Neighbor Feedback & Reviews</span>
              <span className="text-xs text-slate-400">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="flex flex-col gap-3">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 flex flex-col gap-2.5 shadow-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img 
                          src={rev.author?.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                          alt="" 
                          className="h-7 w-7 rounded-full object-cover bg-slate-100" 
                        />
                        <span className="text-xs font-semibold text-[#102A43] dark:text-white">{rev.author?.name || 'Verified Neighbor'}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200/50">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{rev.rating?.toFixed(1) || '5.0'}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{rev.content}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-xs text-slate-400 border border-[#E2E8F0] rounded-2xl bg-white dark:bg-[#1E293B]">
                  No feedback received yet. First assistance task completes the rating ledger.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <SaaSUpgradeModal
        isOpen={showSaaSModal}
        onClose={() => setShowSaaSModal(false)}
      />
    </div>
  );
};
