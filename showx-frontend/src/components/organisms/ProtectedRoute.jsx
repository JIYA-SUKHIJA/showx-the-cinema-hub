import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const [authState, setAuthState] = useState(null); // null = checking, then { isLoggedIn, role }
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile');
        setAuthState({ isLoggedIn: true, role: res.data.user?.role || 'user' });
      } catch (err) {
        setAuthState({ isLoggedIn: false, role: null });
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  if (!authState.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && authState.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;