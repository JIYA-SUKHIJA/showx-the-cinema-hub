// src/components/templates/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ScrollToTop from '../../utils/ScrollToTop';
import loginHeroImg from '../../assets/Login page.jpg';

const AuthLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex min-h-screen w-full items-center justify-center p-3 sm:p-4 md:p-6 antialiased font-sans transition-colors duration-500 overflow-x-hidden ${
      isDarkMode ? "bg-[#07080c] text-gray-300" : "bg-[#f4f5f7] text-slate-700"
    }`}>
      
      <ScrollToTop />

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle visual theme"
          className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all active:scale-95 flex items-center justify-center shadow-lg ${
            isDarkMode 
              ? "border-white/[0.06] bg-slate-900 text-amber-400 hover:bg-slate-800" 
              : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
          }`}
        >
          {isDarkMode ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Changed aspect ratio utility to render only from tablet/desktop breakpoints up to prevent mobile truncation */}
      <div className={`flex flex-col md:flex-row w-full max-w-5xl h-auto md:aspect-[16/10] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-300 border shadow-2xl ${
        isDarkMode 
          ? "bg-[#0B0D13] border-gray-800/10 shadow-black/80" 
          : "bg-white/80 border-stone-200/60 shadow-stone-400/20 backdrop-blur-md"
      }`}>
        
        {/* Left Side Panel Image - Stays block on desktop and goes completely hidden on small screens */}
        <div className="relative hidden md:block md:w-1/2 h-full overflow-hidden select-none">
          <img 
            src={loginHeroImg} 
            alt="ShowX Cinema Showcase" 
            className="h-full w-full object-cover brightness-[0.98] contrast-[1.02] transition-all duration-500 hover:scale-[1.01]"
          />
          <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none bg-gradient-to-r from-transparent via-transparent ${
            isDarkMode ? "to-[#0B0D13]/30" : "to-white/30"
          }`} />
        </div>

        {/* Right Side Input Form Canvas Container */}
        <div className={`w-full md:w-1/2 p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto border-l-0 md:border-l transition-colors duration-300 ${
          isDarkMode ? "bg-[#0B0D13] border-gray-900/40" : "bg-white/40 border-stone-100"
        }`}>
          <div className="w-full max-w-sm mx-auto">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;