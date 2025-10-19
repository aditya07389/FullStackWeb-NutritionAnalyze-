import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome!</h1>
        <p>You have successfully logged in.</p>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default HomePage;