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
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-1.5 w-full max-w-full overflow-hidden">
      {label && (
        <label className={`text-xs font-semibold tracking-wide block transition-colors duration-300 ${
          isDarkMode ? "text-gray-450" : "text-stone-600"
        }`}>
          {label}
        </label>
      )}
      
      {/* Container row upgraded with flexible layout configurations */}
      <div className="relative rounded-xl shadow-inner flex items-center w-full min-h-[44px]">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 z-10 shrink-0">
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
          className={`w-full rounded-xl py-3.5 px-4 text-xs outline-none border transition-all duration-300 min-h-[44px] ${
            isDarkMode 
              ? "bg-[#11141D] text-white placeholder-gray-600 border-gray-800/40 focus:border-gray-700/80" 
              : "bg-stone-50 text-slate-800 placeholder-stone-400 border-stone-250/70 focus:border-amber-500/60"
          } ${icon ? 'pl-11' : ''} ${rightElement ? 'pr-11' : ''}`}
        />
        
        {rightElement && (
          <div className="absolute right-4 flex items-center justify-center text-gray-500 hover:text-gray-300 transition duration-200 z-10 shrink-0">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;