import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext'; // 1. Import the provider

// Import your page components
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import MainLayout from './pages/MainLayout';
import ProfilePage from './pages/Profile';
import UserProfileForm from './pages/UserProfileForm';
import NotificationPage from './pages/NotificationPage'; // 2. Import the new page

// This component checks if a user is logged in.
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    // 3. CRITICAL FIX: Wrap the entire app in SocketProvider
    <SocketProvider>
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallback/>} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            
            {/* New user setup page (no navbar) */}
            <Route path="/user-profile-form" element={<UserProfileForm/>}/>

            {/* Main app pages (with Navbar via MainLayout) */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage/>} />
              <Route path="/notifications" element={<NotificationPage />} />
              
              {/* Redirect root to home if logged in */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>
          </Route>

          {/* --- Fallback Route --- */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </Router>
    </SocketProvider>
  );
};

export default App;