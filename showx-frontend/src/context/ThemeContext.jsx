// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if a theme choice is already stored[cite: 8]
    const savedTheme = localStorage.getItem('showx-theme'); // Mapped verbatim to your storage key[cite: 8]
    if (savedTheme) {
      return savedTheme === 'dark'; // Apply matching boolean state[cite: 8]
    }
    // Fallback Requirement: Detect user's environment/system level dark-mode preferences on first visit
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark; 
  });

  useEffect(() => {
    // Persist the state across storage changes verbatim[cite: 8]
    localStorage.setItem('showx-theme', isDarkMode ? 'dark' : 'light'); // Sync value changes safely[cite: 8]
    
    // Apply layout target classes on the root document level to enable Tailwind's 'dark:' variant controls smoothly
    const rootElement = window.document.documentElement;
    if (isDarkMode) {
      rootElement.classList.add('dark');
      rootElement.style.colorScheme = 'dark';
    } else {
      rootElement.classList.remove('dark');
      rootElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  // Toggle state switch mechanism logic matches your base function[cite: 8]
  const toggleTheme = () => setIsDarkMode((prev) => !prev); // Triggers component recalculation cleanly[cite: 8]

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Throws descriptive validation error if accessed outside the main provider boundary[cite: 8]
    throw new Error('useTheme must be wrapped inside a global ThemeProvider element'); // Verbatim guard[cite: 8]
  }
  return context;
}