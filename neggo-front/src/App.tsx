import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AdDetail } from './pages/AdDetail';
import { ChatList } from './pages/ChatList';
import { ChatRoom } from './pages/ChatRoom';
import { CreateAd } from './pages/CreateAd';
import { Profile } from './pages/Profile';
import { Plans } from './pages/Plans';
import { MyAds } from './pages/MyAds';
import { Favorites } from './pages/Favorites';
import { Settings } from './pages/Settings';
import { Explore } from './pages/Explore';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LandingPage } from './pages/LandingPage';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { AnimatePresence } from 'motion/react';
import { LanguageProvider } from './i18n/LanguageContext';
import { api } from './services/api';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from './components/SEO';
import { cn } from './lib/utils';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const hideNavPaths = ['/chat/room', '/create', '/ad/', '/login', '/register', '/landing'];
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const shouldHideNav = hideNavPaths.some(path => location.pathname.includes(path)) || isLandingPage;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!shouldHideNav && !isLandingPage && <Sidebar />}
      
      <main className={cn(
        "flex-1 relative bg-white min-h-screen shadow-2xl overflow-x-hidden",
        (!isLoginPage && !isLandingPage) && "md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto md:my-6 md:rounded-[40px] md:overflow-hidden md:border md:border-gray-100"
      )}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/app" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/ad/:id" element={<ProtectedRoute><AdDetail /></ProtectedRoute>} />
            <Route path="/chats" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
            <Route path="/chat/room/:id" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/plans" element={<ProtectedRoute><Plans /></ProtectedRoute>} />
            <Route path="/my-ads" element={<ProtectedRoute><MyAds /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
        {!shouldHideNav && <BottomNav />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <ChatProvider>
            <Router>
              <SEO />
              <AppContent />
            </Router>
          </ChatProvider>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}
