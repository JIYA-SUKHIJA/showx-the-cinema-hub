// src/components/atoms/InputField.jsx
import React from 'react';

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
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-400 tracking-wide block">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-inner flex items-center">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
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
          className={`w-full rounded-xl bg-[#11141D] py-3.5 px-4 text-xs text-white placeholder-gray-600 outline-none border border-gray-800/40 focus:border-gray-700/80 transition-all duration-300 ${
            icon ? 'pl-11' : ''
          } ${rightElement ? 'pr-11' : ''}`}
        />
        {rightElement && (
          <div className="absolute right-4 flex items-center justify-center text-gray-500 hover:text-gray-300 transition">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;