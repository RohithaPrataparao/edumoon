import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import Profile from './Profile';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Debug: log when this effect runs and what the path is
    console.log('[Auth.jsx] useEffect running on path:', location.pathname);
    // Only run this logic if we're on an /auth route
    if (location.pathname.startsWith('/auth')) {
      const token = localStorage.getItem('financeapp_token');
      const user = localStorage.getItem('financeapp_user');
      // If logged in, redirect to dashboard from any /auth route except /auth/profile
      if (token && location.pathname !== '/auth/profile') {
        console.log('[Auth.jsx] Redirecting to /dashboard');
        navigate('/dashboard', { replace: true });
      }
      // If not signed up, redirect to signup (but only if not already on signup)
      if (!user && location.pathname !== '/auth/signup') {
        console.log('[Auth.jsx] Redirecting to /auth/signup');
        navigate('/auth/signup', { replace: true });
      }
    }
  }, [navigate, location]);

  return (
    <div className="container">
      <nav className="nav nav-pills flex-column flex-sm-row mb-4">
        <Link className="flex-sm-fill text-sm-center nav-link" to="/auth/signin">Sign In</Link>
        <Link className="flex-sm-fill text-sm-center nav-link" to="/auth/signup">Sign Up</Link>
        <Link className="flex-sm-fill text-sm-center nav-link" to="/auth/profile">Profile</Link>
      </nav>
      <Routes>
        <Route index element={<Navigate to="/auth/signin" replace />} />
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default Auth;
