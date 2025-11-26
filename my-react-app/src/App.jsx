import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// Removed all internal component logic and used imports instead

// 1. Import components from their new /pages directory
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import HomePage from './pages/HomePage.jsx';
import TestAuth from './pages/Test.jsx';
import LogoutPage from './pages/LogoutPage.jsx';

export default function RouterConfig() {
  return (
    // BrowserRouter wraps the entire application
    <BrowserRouter>
      <Routes>
        {/* Route definitions use the imported page components */}
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/test" element={<TestAuth />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}