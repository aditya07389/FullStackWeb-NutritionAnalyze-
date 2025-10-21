import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate(); // 2. Initialize useNavigate

  // 3. Create the same logout handler function here
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to the login page
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/home">MyApp</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/chat">Chat</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/how-it-works">How It Works</Link>
        </li>
        <li>
          {/* 4. Add the button with the onClick event */}
          <button onClick={handleLogout} className="navbar-logout-button">
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;