import React from 'react';

export function TableSkeleton({ isDarkMode }) {
  return (
    <div className={`animate-pulse space-y-3 ${isDarkMode ? "opacity-20" : "opacity-30"}`}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-amber-500/20 rounded-lg w-full"></div>
      ))}
    </div>
  );
}

export function CardSkeleton({ isDarkMode }) {
  return (
    <div className={`animate-pulse h-32 rounded-2xl ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}></div>
  );
}