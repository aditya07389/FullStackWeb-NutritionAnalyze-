// frontend/src/pages/AuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ===============================
    // 1. Get the token from the URL
    // ===============================
    // Example URL: http://localhost:5173/auth/callback?token=abc123
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token'); // Extract 'token' query parameter

    if (token) {
      // ===============================
      // 2. Save the token to localStorage
      // ===============================
      // This stores the JWT so the app can use it for authenticated API requests
      localStorage.setItem('token', token); 
      
      // ===============================
      // 3. Redirect to home for existing users
      // ===============================
      // Use replace() so the token is removed from the URL
      window.location.replace('/home'); // Redirect to home page
    } else {
      // ===============================
      // 4. Handle error if no token is found
      // ===============================
      // Redirect the user back to the login page with an error query
      navigate('/login?error=google_auth_failed');
    }
  }, [navigate]);

  // ===============================
  // 5. Show a simple loading message
  // ===============================
  return (
    <div>
      <p>Loading... Please wait.</p>
    </div>
  );
};

export default AuthCallback;
