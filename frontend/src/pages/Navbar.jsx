import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for styling

function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        {/* You can put your logo or app name here */}
        <Link to="/">MyApp</Link>
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
      </ul>
    </nav>
  );
}

export default Navbar;