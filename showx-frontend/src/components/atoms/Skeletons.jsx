// src/components/atoms/Skeletons.jsx
import React from 'react';

// Global shimmer block helper tailored for premium dark/light layout parameters
const Shimmer = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-slate-800/50 dark:bg-white/[0.04] ${className}`} />
);

// 1. MOVIE CARDS SKELETON (Used on Home Page and Listing grids)
export function MovieCardSkeleton() {
  return (
    <div className="border rounded-2xl overflow-hidden shadow-lg h-full flex flex-col justify-between bg-slate-900/40 border-white/[0.05]">
      {/* Media Cover Image Aspect Ratio Shell */}
      <div className="w-full aspect-[16/10] sm:aspect-[4/3] p-4 relative bg-slate-950/40">
        <Shimmer className="absolute bottom-3 left-3 w-14 h-4" />
        <Shimmer className="absolute bottom-3 right-3 w-10 h-4" />
      </div>
      
      {/* Metadata Text Deck Shell */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Shimmer className="h-4 w-3/4 rounded-md" />
          <div className="flex gap-1.5">
            <Shimmer className="h-3.5 w-12 rounded" />
            <Shimmer className="h-3.5 w-12 rounded" />
            <Shimmer className="h-3.5 w-10 rounded" />
          </div>
        </div>
        
        {/* Footer Button Actions Shell */}
        <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between gap-2">
          <Shimmer className="h-3.5 w-16 rounded" />
          <div className="flex items-center gap-1.5 shrink-0">
            <Shimmer className="w-8 h-8 rounded-xl" />
            <Shimmer className="w-24 h-8 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. HOME PAGE HERO BANNER SKELETON
export function HomeHeroSkeleton() {
  return (
    <div className="w-full h-[480px] md:h-[560px] rounded-[32px] border border-white/5 bg-[#0b0c10]/40 p-6 sm:p-12 md:p-16 flex flex-col justify-end relative overflow-hidden">
      <div className="space-y-4 max-w-2xl relative z-10">
        <div className="flex gap-2.5">
          <Shimmer className="h-4 w-24 rounded-md" />
          <Shimmer className="h-4 w-12 rounded-md" />
          <Shimmer className="h-4 w-14 rounded-md" />
        </div>
        <div className="space-y-2">
          <Shimmer className="h-4 w-32 rounded" />
          <Shimmer className="h-10 sm:h-12 w-4/5 rounded-2xl" />
        </div>
        <Shimmer className="h-4 w-20 rounded" />
        <Shimmer className="h-4 w-48 rounded" />
        <div className="flex gap-3.5 pt-2">
          <Shimmer className="w-28 h-10 rounded-xl" />
          <Shimmer className="w-32 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// 3. MOVIE DETAILS SUMMARY PAGE SKELETON
export function MovieDetailsSkeleton() {
  return (
    <div className="space-y-12 pb-16 animate-pulse">
      {/* Cinematic Hero Backdrop Frame */}
      <div className="w-full h-[40vh] sm:h-[50vh] rounded-[32px] bg-slate-950/40 border border-white/5" />
      
      {/* Poster Grid Overlaid Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative -mt-48 sm:-mt-64 z-20 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">
        <Shimmer className="w-52 sm:w-56 aspect-[2/3] rounded-2xl shrink-0" />
        <div className="flex-grow space-y-4 w-full md:w-auto flex flex-col items-center md:items-start">
          <Shimmer className="h-5 w-20 rounded-md" />
          <Shimmer className="h-10 w-2/3 max-w-md rounded-xl" />
          <Shimmer className="h-6 w-40 rounded-xl" />
          <Shimmer className="h-5 w-48 rounded-xl" />
        </div>
      </div>

      {/* Main Panel Content Split Columns */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-3">
            <Shimmer className="h-5 w-32 rounded" />
            <Shimmer className="h-4 w-full rounded" />
            <Shimmer className="h-4 w-5/6 rounded" />
          </div>
          <hr className="border-white/[0.05]" />
          <div className="space-y-3">
            <Shimmer className="h-5 w-40 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Shimmer className="h-16 rounded-2xl" />
              <Shimmer className="h-16 rounded-2xl" />
            </div>
          </div>
        </div>
        {/* Timing Sticky Sidebar Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-white/[0.06] bg-slate-900/40 space-y-6">
            <Shimmer className="h-4 w-40 rounded" />
            <div className="flex gap-2 justify-between">
              <Shimmer className="h-12 flex-1 rounded-xl" />
              <Shimmer className="h-12 flex-1 rounded-xl" />
              <Shimmer className="h-12 flex-1 rounded-xl" />
              <Shimmer className="h-12 flex-1 rounded-xl" />
            </div>
            <div className="space-y-3">
              <Shimmer className="h-14 w-full rounded-xl" />
              <Shimmer className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. SEAT SELECTION MAP SKELETON
export function SeatSelectionSkeleton() {
  return (
    <div className="max-w-5xl mx-auto border border-white/[0.04] rounded-[32px] p-4 sm:p-10 bg-slate-950/40 space-y-12">
      {/* Header Shell */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-5">
        <Shimmer className="h-8 w-24 rounded-xl" />
        <Shimmer className="h-4 w-36 rounded-md" />
      </div>

      {/* Screen Arc Shell */}
      <div className="flex flex-col items-center max-w-xl mx-auto space-y-3">
        <Shimmer className="w-4/5 h-2 rounded-full" />
        <Shimmer className="w-24 h-2.5 rounded" />
      </div>

      {/* Grid Seats Rows Allocation Shell */}
      <div className="space-y-3.5 py-4 flex flex-col items-center">
        {Array.from({ length: 6 }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center gap-4 w-full justify-center">
            <Shimmer className="w-4 h-4 rounded" />
            <div className="flex gap-1.5">
              {Array.from({ length: 12 }).map((_, sIdx) => (
                <Shimmer key={sIdx} className="w-7 h-7 rounded-lg" />
              ))}
            </div>
            <Shimmer className="w-4 h-4 rounded" />
          </div>
        ))}
      </div>

      {/* Footer Hub Summary Control Shell */}
      <div className="max-w-3xl mx-auto border border-white/[0.05] p-5 rounded-2xl flex flex-col sm:flex-row gap-5 items-center justify-between bg-slate-900/40">
        <div className="flex gap-12 w-full sm:w-auto">
          <div className="space-y-2"><Shimmer className="h-3 w-16" /><Shimmer className="h-4 w-20" /></div>
          <div className="space-y-2"><Shimmer className="h-3 w-24" /><Shimmer className="h-5 w-16" /></div>
        </div>
        <Shimmer className="w-full sm:w-44 h-12 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

// 5. PAYMENT GATEWAY CHANNELS SKELETON
export function PaymentPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Shimmer className="w-full h-11 rounded-2xl" />
      <div className="flex justify-between w-32 h-4 rounded" />
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Gateway Selection Panel */}
        <div className="md:col-span-3 border border-white/[0.04] rounded-[32px] p-6 sm:p-8 bg-slate-900/40 space-y-6">
          <div className="space-y-2"><Shimmer className="h-5 w-44" /><Shimmer className="h-3.5 w-64" /></div>
          <div className="grid grid-cols-3 gap-3">
            <Shimmer className="h-12 rounded-xl" />
            <Shimmer className="h-12 rounded-xl" />
            <Shimmer className="h-12 rounded-xl" />
          </div>
          <Shimmer className="h-24 w-full rounded-xl" />
          <Shimmer className="h-14 w-full rounded-xl" />
        </div>

        {/* Ledger Summary Sidebar */}
        <div className="md:col-span-2 border border-white/[0.04] rounded-[32px] p-6 bg-slate-950/40 space-y-5">
          <div className="space-y-2"><Shimmer className="h-3 w-16" /><Shimmer className="h-5 w-40" /></div>
          <div className="flex gap-4 items-center border-b border-white/[0.04] pb-4">
            <Shimmer className="w-16 h-24 rounded-xl shrink-0" />
            <div className="space-y-2 flex-grow">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-3 w-24" />
              <Shimmer className="h-5 w-16" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex justify-between"><Shimmer className="h-3.5 w-24" /><Shimmer className="h-3.5 w-12" /></div>
            <div className="flex justify-between"><Shimmer className="h-3.5 w-28" /><Shimmer className="h-3.5 w-12" /></div>
            <div className="flex justify-between"><Shimmer className="h-3.5 w-20" /><Shimmer className="h-3.5 w-12" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. PROFILE PROFILE & DASHBOARD OVERVIEW SKELETON
export function ProfilePageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
      {/* Upper Glass Profile Summary Node */}
      <div className="rounded-3xl p-6 sm:p-8 border border-white/[0.04] bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Shimmer className="w-24 h-24 rounded-2xl shrink-0" />
          <div className="space-y-2 flex flex-col items-center sm:items-start">
            <Shimmer className="h-6 w-32 rounded" />
            <Shimmer className="h-4 w-40 rounded" />
            <Shimmer className="h-5 w-24 rounded-md" />
          </div>
        </div>
        <Shimmer className="w-full sm:w-32 h-10 rounded-xl" />
      </div>

      {/* Split Navigation Columns Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          {/* Virtual Membership Card Shell */}
          <Shimmer className="w-full aspect-[1.58/1] rounded-2xl" />
          {/* Navigation Items Deck List */}
          <div className="rounded-2xl border border-white/[0.04] p-2 space-y-1 bg-slate-900/20">
            <Shimmer className="h-10 w-full rounded-xl" />
            <Shimmer className="h-10 w-full rounded-xl" />
            <Shimmer className="h-10 w-full rounded-xl" />
            <Shimmer className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Dynamic Active Tab Content Container */}
        <div className="lg:col-span-8 border border-white/[0.05] rounded-[32px] p-6 sm:p-8 bg-slate-900/40 space-y-6">
          <div className="space-y-2 border-b border-white/[0.04] pb-4">
            <Shimmer className="h-5 w-36" />
            <Shimmer className="h-3.5 w-52" />
          </div>
          {/* Sub Booking History Row Loader Matrix */}
          <div className="space-y-3.5">
            <Shimmer className="h-20 w-full rounded-2xl" />
            <Shimmer className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}