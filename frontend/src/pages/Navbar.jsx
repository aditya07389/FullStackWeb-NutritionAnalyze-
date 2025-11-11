import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useSocket } from '../context/SocketContext'; // 1. Import the useSocket hook

// --- Bell Icon (Inline SVG) ---
// We add an icon here. You can replace this with one from a library if you prefer.
const BellIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
// --- End of Icon ---

function Navbar() {
  const navigate = useNavigate();
  const { unreadCount } = useSocket(); // 2. Get the live unread count from the context

  const handleLogout = () => {
    localStorage.removeItem('token');
    // We also disconnect the socket on logout
    // The SocketContext will handle this automatically if the token is gone
    navigate('/login');
    window.location.reload(); // Force a reload to clear all state and disconnect socket
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
        
        {/* --- 3. Add Notification Bell --- */}
        <li>
          <Link to="/notifications" className="navbar-notification-bell">
            <BellIcon />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
        </li>
        {/* --- End of Notification Bell --- */}

        <li>
          <button onClick={handleLogout} className="navbar-logout-button">
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

