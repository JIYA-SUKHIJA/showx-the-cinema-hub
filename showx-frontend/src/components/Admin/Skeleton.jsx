// src/components/Admin/Skeleton.jsx
import React from 'react';

// Custom reusable shimmer component for hardware-accelerated fluid loading rows
const ShimmerNode = ({ className }) => (
  <div className={`animate-pulse bg-white/[0.03] border border-white/[0.01] rounded-xl ${className}`} />
);

// 1. CARD SKELETON (For top KPI metrics grids row)
export function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none w-full">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div 
          key={idx}
          className="bg-[#111114]/20 border border-white/[0.04] p-5 rounded-2xl flex flex-col justify-between h-36 backdrop-blur-md"
        >
          <div className="flex items-start justify-between">
            <ShimmerNode className="h-3.5 w-28" />
            <ShimmerNode className="w-7 h-7 rounded-lg" />
          </div>
          <div className="space-y-2 mt-2">
            <ShimmerNode className="h-7 w-20 rounded-md" />
            <div className="flex justify-between items-center pt-1">
              <ShimmerNode className="h-3 w-10" />
              <ShimmerNode className="h-3 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 2. TABLE SKELETON (For bottom tabular list logs matrices)
export function TableSkeleton() {
  return (
    <div className="bg-[#111114]/20 border border-white/[0.04] rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm w-full p-6 space-y-4">
      {/* Table Title / Utility Bar Shell */}
      <div className="flex justify-between items-center border-b border-white/[0.02] pb-4">
        <ShimmerNode className="h-4 w-40" />
        <ShimmerNode className="h-8 w-24 rounded-lg" />
      </div>

      {/* Table Rows Mimic Matrix */}
      <div className="space-y-3.5 pt-2">
        {/* Table Header row mimic */}
        <div className="grid grid-cols-5 gap-4 border-b border-white/[0.02] pb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerNode key={i} className="h-3.5 w-16" />
          ))}
        </div>
        
        {/* Table Data rows mimic loops */}
        {Array.from({ length: 5 }).map((_, rIdx) => (
          <div key={rIdx} className="grid grid-cols-5 gap-4 items-center py-1">
            <ShimmerNode className="h-4 w-12 text-slate-500" />
            <ShimmerNode className="h-4 w-32" />
            <ShimmerNode className="h-4 w-24" />
            <ShimmerNode className="h-4 w-16" />
            <div className="flex justify-end"><ShimmerNode className="h-7 w-16 rounded-lg" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}