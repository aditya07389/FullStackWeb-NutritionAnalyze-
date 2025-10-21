// src/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Make sure this path is correct

function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        {/* This Outlet will render your protected pages 
            like <HomePage />, <ChatPage />, etc. */}
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;