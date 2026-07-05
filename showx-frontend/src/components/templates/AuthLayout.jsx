// src/components/templates/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import loginHeroImg from '../../assets/Login page.jpg'; // Retains your verified asset[cite: 7]

const AuthLayout = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex min-h-screen w-full items-center justify-center p-4 antialiased font-sans transition-colors duration-500 ${
      isDarkMode ? "bg-[#07080c] text-gray-300" : "bg-[#f4f5f7] text-slate-700" // Preserves original backdrop styling[cite: 7]
    }`}>
      
      {/* Universal Absolute Theme Utility Controls Toggle */}
      <div className="absolute top-6 right-6 z-40">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle visual theme"
          className={`p-3 rounded-xl border cursor-pointer transition-all active:scale-95 flex items-center justify-center shadow-lg ${
            isDarkMode 
              ? "border-white/[0.06] bg-slate-900 text-amber-400 hover:bg-slate-800" 
              : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
          }`}
        >
          {isDarkMode ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Balanced 50/50 Proportion Layout Shell Frame[cite: 7] */}
      <div className={`flex w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-[2.5rem] transition-all duration-300 border shadow-2xl ${
        isDarkMode 
          ? "bg-[#0B0D13] border-gray-800/10 shadow-black/80" 
          : "bg-white/80 border-stone-200/60 shadow-stone-400/20 backdrop-blur-md"
      }`}>
        
        {/* Left Section Panel Frame: Aspect Panoramic Image Component[cite: 7] */}
        <div className="relative hidden md:block md:w-1/2 h-full overflow-hidden select-none">
          <img 
            src={loginHeroImg} 
            alt="ShowX Cinema Showcase" 
            className="h-full w-full object-cover brightness-[0.98] contrast-[1.02] transition-all duration-500 hover:scale-[1.01]"
          />
          <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none bg-gradient-to-r from-transparent via-transparent ${
            isDarkMode ? "to-[#0B0D13]/30" : "to-white/30" // Integrates smooth overlay transitions seamlessly[cite: 7]
          }`} />
        </div>

        {/* Right Section Core Panel Router Outlet Container Space[cite: 7] */}
        <div className={`w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto border-l transition-colors duration-300 ${
          isDarkMode ? "bg-[#0B0D13] border-gray-900/40" : "bg-white/40 border-stone-100" // Seamless dark/light integration[cite: 7]
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