// src/components/templates/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';
import ScrollToTop from '../../utils/ScrollToTop';
import { useTheme } from '../../context/ThemeContext';

export default function MainLayout() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleLayoutScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleLayoutScroll);
    return () => window.removeEventListener('scroll', handleLayoutScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased selection:bg-amber-500/30 selection:text-white transition-colors duration-300 relative overflow-x-hidden ${
      isDarkMode ? "bg-[#060911] text-white" : "bg-gradient-to-b from-white via-[#f4f9ff] to-[#eef5fc] text-slate-900"
    }`}>
      <ScrollToTop />

      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 z-[100] transform-origin-0" 
        style={{ scaleX }} 
      />

      {/* Dynamic ambient background glow system */}
      <div className="absolute top-0 inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/[0.03] rounded-full blur-[120px]" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-yellow-500/[0.02] rounded-full blur-[150px]" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/[0.03] rounded-full blur-[120px]" />
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-[150px]" />
          </>
        )}
      </div>

      {/* Adaptive Sticky Navbar Header Panel Layer */}
      <div className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? isDarkMode
            ? "backdrop-blur-xl border-b bg-slate-950/75 border-slate-900/80 shadow-md shadow-black/10" 
            : "backdrop-blur-xl border-b bg-white/75 border-slate-200/60 shadow-[0_10px_30px_-15px_rgba(59,130,246,0.08)]"
          : "bg-transparent border-b border-transparent"
      }`}>
        <Navbar />
      </div>
      
      <main className="flex-grow z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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