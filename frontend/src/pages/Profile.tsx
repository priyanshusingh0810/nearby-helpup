import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  MapPin, 
  Activity, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Mail,
  UserCheck,
  CheckCircle,
  FileText,
  Phone,
  Settings,
  Star,
  X
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { WeatherWidget } from '../components/widgets/WeatherWidget';

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

  // Verification Simulation modal states
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1); // 1 = input details, 2 = upload ID doc, 3 = OTP mock, 4 = success
  const [verifyName, setVerifyName] = useState('');
  const [verifyPhone, setVerifyPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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
      setEditedBio(data.bio);
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
      
      // Update global context
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      alert('Failed to update profile info');
    }
  };

  // Simulate OTP code submission
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate a API loading duration
    setTimeout(async () => {
      try {
        if (currentUser?.id) {
          // Verify on backend
          await api.admin.verifyUser(currentUser.id);
          // Reload
          loadProfile();
          setVerifyStep(4);
        }
      } catch (err) {
        alert('Verification process failed.');
      } finally {
        setIsVerifying(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <div className="h-10 w-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex-1 p-8 text-center">
        <h3 className="font-bold text-lg">Profile not found</h3>
      </div>
    );
  }

  // Parse list values
  const interestTags = profileUser.interests ? profileUser.interests.split(';').filter((t: string) => t.trim() !== '') : [];
  const skillsTags = profileUser.skills ? profileUser.skills.split(';').filter((t: string) => t.trim() !== '') : [];
  const languagesTags = profileUser.languages ? profileUser.languages.split(';').filter((t: string) => t.trim() !== '') : [];
  const badgesList = profileUser.badges ? profileUser.badges.split(';').filter((t: string) => t.trim() !== '') : [];

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8 pb-20 w-full">
      
      {/* Verification Simulation Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4">
          <GlassCard className="max-w-sm w-full p-6 flex flex-col gap-4" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5 font-sans">
                <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                <span>Verify Identity & Phone</span>
              </h3>
              <button onClick={() => setShowVerifyModal(false)} className="text-slate-400 hover:text-slate-655">
                <X className="h-5 w-5" />
              </button>
            </div>

            {verifyStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-[11px] text-slate-550 leading-normal rounded-xl border border-indigo-100/10">
                  Submit your phone number to receive a verification OTP code code.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Full Legal Name</label>
                  <input
                    type="text"
                    value={verifyName}
                    onChange={(e) => setVerifyName(e.target.value)}
                    placeholder="e.g. Priyanshu Sharma"
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase text-slate-400">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={verifyPhone}
                    onChange={(e) => setVerifyPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>
                <button
                  onClick={() => setVerifyStep(2)}
                  className="h-10 bg-indigo-650 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Send OTP Code
                </button>
              </div>
            )}

            {verifyStep === 2 && (
              <div className="flex flex-col gap-4">
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-[11px] text-slate-550 leading-normal rounded-xl border border-indigo-100/10">
                  Upload an image of your Student ID or Government ID Card to verify your affiliation.
                </div>
                <div className="border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                  <FileText className="h-8 w-8 text-indigo-500" />
                  <span className="text-[10px] font-semibold text-slate-500">Student_ID_Card.jpg</span>
                  <span className="text-[8px] text-slate-400">Uploaded successfully</span>
                </div>
                <button
                  onClick={() => setVerifyStep(3)}
                  className="h-10 bg-indigo-650 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  Proceed to OTP Verification
                </button>
              </div>
            )}

            {verifyStep === 3 && (
              <form onSubmit={handleVerifySubmit} className="flex flex-col gap-4">
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-[11px] text-slate-550 leading-normal rounded-xl border border-indigo-100/10">
                  Enter the 6-digit OTP code sent to your mobile phone.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase text-slate-400">OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="h-10 px-3 rounded-lg border border-slate-205 text-xs text-center tracking-widest font-bold dark:bg-slate-900 dark:border-slate-850 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="h-10 bg-indigo-650 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center"
                >
                  {isVerifying ? 'Verifying...' : 'Submit Code'}
                </button>
              </form>
            )}

            {verifyStep === 4 && (
              <div className="flex flex-col items-center gap-4 text-center py-4">
                <CheckCircle className="h-12 w-12 text-emerald-500 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold">Verification Complete!</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Your trust score has been boosted and identity verified badge issued.</p>
                </div>
                <button
                  onClick={() => {
                    setShowVerifyModal(false);
                    setVerifyStep(1);
                  }}
                  className="w-full h-10 bg-slate-900 text-white hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-850 rounded-xl text-xs font-bold transition-all"
                >
                  Close Panel
                </button>
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Main Profile Header Card */}
      <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-slate-100/50">
        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-40 blur-sm" />
            <img
              src={profileUser.profile_photo}
              alt={profileUser.name}
              className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl object-cover bg-slate-50 shadow-sm border-2 border-white dark:border-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight font-sans">
                <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-white">{profileUser.name}</span>
              </h2>
              {profileUser.identity_verified && (
                <span className="rounded-full bg-gradient-to-r from-emerald-50 to-emerald-50/80 text-emerald-600 dark:from-emerald-950/40 dark:to-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 text-[9px] font-extrabold uppercase flex items-center gap-1 shadow-sm border border-emerald-200/30 dark:border-emerald-800/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-455">@{profileUser.username}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1.5">
              <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
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

        {/* Buttons Panel */}
        <div className="flex gap-2.5 w-full md:w-auto self-stretch md:self-auto shrink-0 justify-end">
          {isOwnProfile ? (
            <>
              {!profileUser.identity_verified && (
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-bold text-xs px-5 py-3 transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 hover:-translate-y-[1px]"
                >
                  <UserCheck className="h-4.5 w-4.5" />
                  <span>Verify Profile</span>
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl border border-slate-205 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 font-bold text-xs px-5 py-3 transition-all flex items-center gap-1.5"
              >
                <Settings className="h-4.5 w-4.5" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </>
          ) : (
            <Link
              to="/chat"
              className="rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-5 py-3 transition-all flex items-center gap-1.5 dark:bg-slate-800 dark:hover:bg-slate-850 w-full md:w-auto justify-center"
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span>Message</span>
            </Link>
          )}
        </div>
      </GlassCard>

      {/* Edit Profile Form */}
      {isEditing && (
        <GlassCard className="p-6 border-slate-100/50" hoverEffect={false}>
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase text-slate-400">Edit Profile Details</h4>
            
            {/* Profile Avatar Selection Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="relative h-16 w-16 group shrink-0">
                <img
                  src={editedPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt="Avatar Preview"
                  className="h-full w-full rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-slate-955/60 rounded-2xl flex items-center justify-center text-white text-[9px] font-bold">
                    Saving...
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Change Profile Avatar</label>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    placeholder="Paste image URL here..."
                    value={editedPhoto}
                    onChange={(e) => setEditedPhoto(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                  />
                  <label className="h-9 px-4 rounded-lg border border-slate-205 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-350 dark:hover:bg-slate-850 flex items-center justify-center cursor-pointer shrink-0 transition-all">
                    <span>Upload File</span>
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
                <label className="text-[10px] font-bold text-slate-500">Display Name</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">Bio</label>
                <input
                  type="text"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">Interests (Semi-colon separated)</label>
                <input
                  type="text"
                  value={editedInterests}
                  onChange={(e) => setEditedInterests(e.target.value)}
                  placeholder="Photography;Chess;Cycling;Yoga"
                  className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">Skills (Semi-colon separated)</label>
                <input
                  type="text"
                  value={editedSkills}
                  onChange={(e) => setEditedSkills(e.target.value)}
                  placeholder="React;Tutoring;Coaching"
                  className="h-10 px-3 rounded-lg border border-slate-205 text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-10 w-fit px-6 shadow transition-all self-end"
            >
              Save Profile Settings
            </button>
          </form>
        </GlassCard>
      )}

      {/* Main Grid: User Details Feed */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Score Gauges, Badges & Custom Tags */}
        <div className="flex flex-col gap-6">
          
          {/* Trust score Circle Gauges */}
          <GlassCard className="p-5 flex flex-col items-center text-center gap-4 border-slate-100/50">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 w-full text-left">Trust Index Dashboard</h4>
            <div className="relative h-28 w-28 flex items-center justify-center mt-2">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-md animate-glow-pulse" />
              <svg className="absolute inset-0 h-full w-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100 dark:text-slate-900" />
                <circle 
                  cx="56" 
                  cy="56" 
                  r="48" 
                  fill="none" 
                  stroke="url(#trust-grad)" 
                  strokeWidth="8" 
                  strokeDasharray="301" 
                  strokeDashoffset={301 - (301 * profileUser.trust_score) / 100}
                  strokeLinecap="round" 
                  className="transition-all duration-700"
                />
                <defs>
                  <linearGradient id="trust-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-850 dark:text-white font-sans">{Math.round(profileUser.trust_score)}</span>
                <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-wide">Trust Index</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full border-t border-slate-50 dark:border-slate-850 pt-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-white">96%</span>
                <span className="text-[9px] font-bold text-slate-450 uppercase mt-0.5">Borrow Score</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 dark:text-white">99%</span>
                <span className="text-[9px] font-bold text-slate-455 uppercase mt-0.5">Lend Return Rate</span>
              </div>
            </div>
          </GlassCard>

          {/* Local Weather */}
          <GlassCard className="p-5 flex flex-col gap-3 border-slate-100/50">
             <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Local Weather</span>
             <WeatherWidget lat={profileUser.location_lat ?? null} lon={profileUser.location_lon ?? null} locationName={profileUser.location_name} />
          </GlassCard>

          {/* User Badges */}
          {badgesList.length > 0 && (
            <GlassCard className="p-5 flex flex-col gap-3 border-slate-100/50">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Issued Badges</span>
              <div className="flex flex-wrap gap-1.5">
                {badgesList.map((badge: string) => (
                  <span 
                    key={badge} 
                    className="rounded-lg bg-gradient-to-r from-indigo-50/80 to-purple-50/50 text-indigo-600 dark:from-indigo-950/30 dark:to-purple-950/20 dark:text-indigo-400 border border-indigo-100/20 dark:border-indigo-800/20 px-2.5 py-1 text-[9px] font-bold hover:shadow-md hover:shadow-indigo-500/5 transition-shadow duration-300"
                  >
                    🏆 {badge}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Interests & Skills Tags */}
          <GlassCard className="p-5 flex flex-col gap-4 border-slate-100/50">
            {interestTags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Interests</span>
                <div className="flex flex-wrap gap-1.5">
                  {interestTags.map((t: string) => (
                    <span key={t} className="rounded-full bg-slate-100 text-slate-650 dark:bg-slate-900 dark:text-slate-350 px-3 py-1 text-[9px] font-bold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {skillsTags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillsTags.map((t: string) => (
                    <span key={t} className="rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-3 py-1 text-[9px] font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Side: Bio, Listings, Reviews list */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Bio card */}
          <GlassCard className="p-5 flex flex-col gap-3 border-slate-100/50">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Bio Statement</span>
            <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
              {profileUser.bio || "This user has not drafted a bio statement yet."}
            </p>
          </GlassCard>

          {/* User Active Listings */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Active Share Listings</span>
            <div className="grid sm:grid-cols-2 gap-4">
              {listings.length > 0 ? (
                listings.map((item) => (
                  <GlassCard key={item.id} className="overflow-hidden flex flex-col justify-between h-72 border-slate-100/50">
                    <div className="h-32 w-full bg-slate-100 relative dark:bg-slate-950">
                      <img src={item.images.split(';')[0]} alt="" className="h-full w-full object-cover" />
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-650 text-white px-2 py-0.5 text-[8px] font-extrabold uppercase">
                        {item.type}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-1">
                      <h4 className="text-xs font-bold truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="sm:col-span-2 text-center py-8 text-xs text-slate-400 border border-slate-100 rounded-xl dark:border-slate-850">
                  No active listings posted.
                </div>
              )}
            </div>
          </div>

          {/* User Reviews */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Trust Reviews & Feedback</span>
            <div className="flex flex-col gap-3">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <GlassCard key={rev.id} className="p-4 flex flex-col gap-3 border-slate-100/50" hoverEffect={false}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={rev.author.profile_photo} alt="" className="h-6 w-6 rounded-full object-cover bg-slate-50" />
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-350">{rev.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold">{rev.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed italic">
                      "{rev.content}"
                    </p>
                  </GlassCard>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 border border-slate-100 rounded-xl dark:border-slate-850">
                  No reviews submitted yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
