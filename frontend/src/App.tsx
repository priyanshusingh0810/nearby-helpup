import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { FloatingActionButton } from './components/layout/FloatingActionButton';
import { AIChatbot } from './components/common/AIChatbot';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Heart, X } from 'lucide-react';

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
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Landing, Login & Terms pages do not display default dashboard frame
  const isPlainPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/terms' || location.pathname === '/terms-and-conditions';

  if (isPlainPage || !user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[100dvh] flex bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Slide-in Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-[#102A43]/70 backdrop-blur-sm animate-fade-in">
          <div className="w-72 bg-[#102A43] border-r border-[#1A365D] h-full p-6 flex flex-col relative text-white animate-slide-in">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 p-2 text-[#9FB3C8] hover:text-white hover:bg-[#1A365D] rounded-xl"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex-1 mt-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-9 w-9 rounded-xl bg-[#19A974] flex items-center justify-center text-white shadow-md">
                  <Heart className="h-5 w-5 fill-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Nearby HelpUp</span>
              </div>
              <div className="flex flex-col gap-2 font-medium text-sm">
                <a 
                  href="/home" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-3 rounded-xl hover:bg-[#1A365D] text-[#F0F4F8]"
                >
                  Dashboard
                </a>
                <a 
                  href="/communities" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-3 rounded-xl hover:bg-[#1A365D] text-[#F0F4F8]"
                >
                  Communities
                </a>
                <a 
                  href="/events" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-3 rounded-xl hover:bg-[#1A365D] text-[#F0F4F8]"
                >
                  Local Events
                </a>
                <a 
                  href="/emergency" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-3 rounded-xl hover:bg-[#1A365D] text-[#EF4444] font-bold"
                >
                  Emergency SOS
                </a>
                <a 
                  href="/chat" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-3 rounded-xl hover:bg-[#1A365D] text-[#F0F4F8]"
                >
                  Chat Room
                </a>
                <a 
                  href={`/profile/${user.id}`} 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-3 rounded-xl hover:bg-[#1A365D] text-[#F0F4F8]"
                >
                  My Profile
                </a>
                <a 
                  href="/terms" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-3 rounded-xl hover:bg-[#1A365D] text-[#38BDF8]"
                >
                  Terms & Community Charter
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content body frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
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
