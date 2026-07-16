// src/components/molecules/ProtectedRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; // Dynamic theme config connection to prevent raw layout blinking
import axiosInstance from '../../services/axiosInstance';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isDarkMode } = useTheme(); // Reading absolute application theme status
  const [authState, setAuthState] = useState(null); // null = checking, then { isLoggedIn, role }
  const [isChecking, setIsChecking] = useState(true); //

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile'); //
        setAuthState({ isLoggedIn: true, role: res.data.user?.role || 'user' }); //
      } catch (err) {
        setAuthState({ isLoggedIn: false, role: null }); //
      } finally {
        setIsChecking(false); //
      }
    };
    checkAuth();
  }, []);

  // Upgraded raw loading text into an elite micro-spinning loader synchronized with global theme system
  if (isChecking) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen w-full transition-colors duration-300 font-sans ${
        isDarkMode ? "bg-[#060911] text-white" : "bg-gradient-to-b from-white via-[#f4f9ff] to-[#eef5fc] text-slate-900"
      }`}>
        <div className="flex flex-col items-center gap-3 select-none">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin shrink-0 duration-1000" />
          <p className="text-[10px] font-mono font-black tracking-[0.25em] uppercase text-slate-400 dark:text-slate-500">
            Securing Session
          </p>
        </div>
      </div>
    );
  }

  if (!authState.isLoggedIn) {
    return <Navigate to="/login" replace />; //
  }

  if (requireAdmin && authState.role !== 'admin') {
    return <Navigate to="/" replace />; //
  }

  return children; //
};

export default ProtectedRoute;