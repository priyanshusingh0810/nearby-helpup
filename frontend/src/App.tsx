import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { FloatingActionButton } from './components/layout/FloatingActionButton';
import { AIChatbot } from './components/common/AIChatbot';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { 
  Heart, 
  X, 
  Home as HomeIcon, 
  Users, 
  Calendar, 
  AlertTriangle, 
  MessageSquare, 
  User as UserIcon, 
  Scale, 
  ShieldAlert, 
  LogOut, 
  Sun, 
  Moon,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Emergency } from './pages/Emergency';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { ListingDetails } from './pages/ListingDetails';
import { CreateListing } from './pages/CreateListing';
import { AdminDashboard } from './pages/AdminDashboard';
import { Communities } from './pages/Communities';
import { CommunityDetail } from './pages/CommunityDetail';
import { Events } from './pages/Events';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { AppFooter } from './components/layout/AppFooter';

import { Radio } from 'lucide-react';

// Route Lock helper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] w-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-10 w-10 border-4 border-[#00A67E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout Wrapper
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Landing, Login & Terms pages do not display default dashboard frame
  const isPlainPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/terms' || location.pathname === '/terms-and-conditions';

  if (isPlainPage || !user) {
    return <>{children}</>;
  }

  const navLinks = [
    { label: 'Dashboard', path: '/home', icon: HomeIcon },
    { label: 'Communities', path: '/communities', icon: Users },
    { label: 'Local Events', path: '/events', icon: Calendar },
    { label: 'Emergency SOS', path: '/emergency', icon: AlertTriangle, highlight: true },
    { label: 'Chat Room', path: '/chat', icon: MessageSquare },
    { label: 'My Profile', path: `/profile/${user.id}`, icon: UserIcon },
    { label: 'Community Charter', path: '/terms', icon: Scale },
  ];

  const isAdmin = user?.username?.toLowerCase() === 'admin' || user?.id === 1;

  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/home' && location.pathname.startsWith(path));
  };

  return (
    <div className="min-h-[100dvh] flex bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Slide-in Mobile Sidebar Overlay & Drawer */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 flex md:hidden bg-[#102A43]/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-72 max-w-[85vw] bg-[#102A43] border-r border-[#1A365D] h-full p-5 flex flex-col justify-between relative text-white animate-slide-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Section */}
            <div className="flex flex-col gap-5 overflow-y-auto">
              {/* Header with Brand & Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1A365D]">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#19A974] flex items-center justify-center text-white shadow-md">
                    <Heart className="h-5 w-5 fill-white" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white tracking-tight block">Nearby HelpUp</span>
                    <span className="text-[10px] text-[#9FB3C8] font-medium block">Mutual Aid & Sharing</span>
                  </div>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#9FB3C8] hover:text-white hover:bg-[#1A365D] rounded-xl transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User Summary Card */}
              <div className="p-3 rounded-xl bg-[#1A365D]/80 border border-[#38BDF8]/20 flex items-center gap-3">
                <img 
                  src={user.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Neighbor')}&background=19A974&color=fff`} 
                  alt="" 
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#19A974]/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">{user.name}</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-[#19A974] shrink-0" />
                  </div>
                  <span className="text-[10px] text-[#9FB3C8] truncate block">
                    {user.location_name ? user.location_name.split(',')[0] : 'DTU Campus'}
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1 text-xs font-semibold">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        active
                          ? 'bg-[#19A974] text-white shadow-sm font-bold'
                          : item.highlight
                            ? 'text-[#EF4444] hover:bg-[#EF4444]/15 font-bold'
                            : 'text-[#D9E2EC] hover:text-white hover:bg-[#1A365D]'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? 'text-white' : item.highlight ? 'text-[#EF4444]' : 'text-[#829AB1]'}`} />
                      <span className="flex-1">{item.label}</span>
                      {active && <ChevronRight className="h-4 w-4 opacity-75" />}
                    </Link>
                  );
                })}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive('/admin') ? 'bg-amber-600 text-white font-bold' : 'text-amber-300 hover:bg-[#1A365D]'
                    }`}
                  >
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-amber-400" />
                    <span>Admin Operations</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-[#1A365D] flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-[#9FB3C8] font-medium">Appearance</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A365D] hover:bg-[#243E63] text-xs font-medium text-[#F0F4F8] transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5 text-[#38BDF8]" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content body frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className={`flex-1 flex flex-col ${location.pathname === '/chat' ? 'overflow-hidden pb-14 md:pb-0' : 'overflow-y-auto pb-16 md:pb-0'}`}>
          <div className="flex-1">
            {children}
          </div>
          {/* Interactive Pages Footer */}
          {location.pathname !== '/chat' && <AppFooter />}
        </main>
      </div>

      <MobileBottomNav />
      <FloatingActionButton />
      <AIChatbot />
    </div>
  );
};

export const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/communities" element={
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          } />

          <Route path="/communities/:id" element={
            <ProtectedRoute>
              <CommunityDetail />
            </ProtectedRoute>
          } />

          <Route path="/events" element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          } />
          
          <Route path="/emergency" element={
            <ProtectedRoute>
              <Emergency />
            </ProtectedRoute>
          } />

          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />

          <Route path="/profile/:user_id" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/listing/:id" element={
            <ProtectedRoute>
              <ListingDetails />
            </ProtectedRoute>
          } />

          <Route path="/create-listing" element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
