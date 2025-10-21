import React from 'react';
import './Home.css'; // Make sure you have some styles for your homepage

const HomePage = () => {
  // The logout logic is no longer needed here

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome!</h1>
        <p>You have successfully logged in.</p>
        <p>You can now navigate using the links in the header, or log out.</p>
      </div>
    </div>
  );
};

export default HomePage;

