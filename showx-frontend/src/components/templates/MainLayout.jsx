// src/components/templates/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import { useTheme } from '../../context/ThemeContext';

export default function MainLayout() {
  const location = useLocation();
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased selection:bg-crimson/30 selection:text-white transition-colors duration-300 relative ${
      isDarkMode ? "bg-[#060911] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Decorative Dynamic Ambient Mesh Glow Filters (Only rendered during dark theme configurations) */}
      {isDarkMode && (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-crimson/5 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[150px] pointer-events-none z-0" />
        </>
      )}

      <Navbar />
      
      {/* Fluid Main Dashboard Canvas Wrapper */}
      <main className="flex-grow z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}