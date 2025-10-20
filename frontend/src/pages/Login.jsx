// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const LoginPage = () => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = 'http://localhost:5001'; // Your backend URL and port

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { loginIdentifier, password }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.msg || 'Login failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Welcome Back</h2>
        {error && <p className="auth-error">{error}</p>}
        
        <div className="input-group">
          <label>Username or Email</label>
          <input
            type="text"
            value={loginIdentifier}
            onChange={(e) => setLoginIdentifier(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="auth-button">
          Log In
        </button>

        <p className="auth-link">
          No account? <Link to="/signup">Sign Up</Link>
        </p>

        <hr />

        {/* Google Login Button */}
        <a
          href={`${BACKEND_URL}/api/auth/google`}
          className="google-login-button"
        >
          Sign in with Google
        </a>
      </form>
    </div>
  );
};

export default LoginPage;
