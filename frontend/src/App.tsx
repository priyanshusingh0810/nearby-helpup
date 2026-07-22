import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { FloatingActionButton } from './components/layout/FloatingActionButton';
import { AIChatbot } from './components/common/AIChatbot';

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

// Route Lock helper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
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

  // Landing & Login pages do not display default dashboard frame
  const isPlainPage = location.pathname === '/' || location.pathname === '/login';

  if (isPlainPage || !user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Slide-in Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-950/60 backdrop-blur-sm">
          <div className="w-64 bg-white dark:bg-slate-950 h-full p-6 flex flex-col relative animate-slide-in">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 rounded-lg"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 mt-8">
              {/* Insert Sidebar content natively for mobile menu */}
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl">🤝</span>
                <span className="text-lg font-bold">HelpUp</span>
              </div>
              <div className="flex flex-col gap-3 font-semibold text-sm">
                <a href="/home" className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">Dashboard</a>
                <a href="/emergency" className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-rose-500">Emergency Board</a>
                <a href="/chat" className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">Chat Room</a>
                <a href={`/profile/${user.id}`} className="p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">My Profile</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content body frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Navbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </div>

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
