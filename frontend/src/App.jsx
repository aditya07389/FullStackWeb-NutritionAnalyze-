import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Import your page components
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
import AuthCallback from './pages/AuthCallback';
import MainLayout from './pages/MainLayout'; // <-- Import the layout
import ProfilePage from './pages/Profile';
import UserProfileForm from './pages/UserProfileForm';
// This component checks if a user is logged in.
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  // If a token exists, render the child routes (the <Outlet />).
  // Otherwise, navigate to the login page.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes (NO Navbar) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback/>} />
        <Route path="/user-profile-form" element={<UserProfileForm/>}/>


        {/* --- Protected Routes (WITH Navbar) --- */}
        {/* Step 1: The user must be authenticated to access this group. */}
        <Route element={<ProtectedRoute />}>
          
          {/* Step 2: If authenticated, render the MainLayout. */}
          {/* MainLayout will display the Navbar and an <Outlet /> for its children. */}
          <Route element={<MainLayout />}>

            {/* Step 3: Render the HomePage inside the MainLayout's <Outlet /> */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage/>} />
            
            {/* We can add a redirect here so if a logged-in user goes to "/", they land on "/home" */}
            <Route path="/" element={<Navigate to="/signup" replace />} />

          </Route>
        </Route>

        {/* --- Fallback Route --- */}
        {/* If no other route matches, redirect to login. */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </Router>
  );
};

export default App;
