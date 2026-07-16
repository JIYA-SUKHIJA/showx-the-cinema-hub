// src/components/atoms/InputField.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Integrated theme hook to protect light/dark visibility states

const InputField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  icon,
  rightElement 
}) => {
  const { isDarkMode } = useTheme(); // Reading direct system theme states

  return (
    <div className="space-y-1.5 w-full max-w-full overflow-hidden select-none animate-in fade-in duration-200">
      {label && (
        <label className={`text-xs font-bold tracking-wide block transition-colors duration-300 ${
          isDarkMode ? "text-gray-400" : "text-stone-600"
        }`}>
          {label}
        </label>
      )}
      
      {/* Container row upgraded with hardware-accelerated layouts */}
      <div className="relative flex items-center w-full min-h-[44px] group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-amber-500 transition-colors duration-300 z-10 shrink-0">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full rounded-xl py-3.5 px-4 text-xs outline-none border transition-all duration-300 shadow-sm font-sans font-semibold min-h-[44px] ${
            isDarkMode 
              ? "bg-[#11141D] text-white placeholder-gray-600/80 border-gray-800/40 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10" 
              : "bg-stone-50 text-slate-800 placeholder-stone-400/80 border-stone-250/70 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10 hover:border-stone-300"
          } ${icon ? 'pl-11' : ''} ${rightElement ? 'pr-11' : ''}`}
        />
        
        {rightElement && (
          <div className="absolute right-4 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200 z-10 shrink-0">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;