import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css'; // Import the CSS file

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/auth/register', 
        { username, email, password }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.msg || 'Signup failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup} className="auth-form">
        <h2>Create Account</h2>
        {error && <p className="auth-error">{error}</p>}
        
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={10}
            required
          />
        </div>
        
        <button type="submit" className="auth-button">
          Sign Up
        </button>
        
        <p className="auth-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;