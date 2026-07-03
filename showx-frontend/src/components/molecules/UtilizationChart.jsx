// src/components/molecules/UtilizationChart.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function UtilizationChart() {
  const dailyLoads = [
    { day: 'Mon', percentage: 45 },
    { day: 'Tue', percentage: 58 },
    { day: 'Wed', percentage: 62 },
    { day: 'Thu', percentage: 78 },
    { day: 'Fri', percentage: 91 },
    { day: 'Sat', percentage: 95 },
    { day: 'Sun', percentage: 88 },
  ];

  return (
    <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.05] rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-display text-lg font-black tracking-tight text-white">Cinema Throughput Matrix</h3>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">Seat utilization across the last 7 screening days</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 bg-gold/10 text-gold border border-gold/20 rounded-lg font-mono font-bold shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> LIVE
        </span>
      </div>

      <div className="h-52 flex items-end justify-between gap-3 pt-6 border-b border-white/[0.05] px-2">
        {dailyLoads.map((item, i) => (
          <div key={item.day} className="relative flex-1 flex flex-col items-center gap-3 group h-full justify-end">
            <span className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-slate-950 text-gold text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-white/10 shadow-xl transition-opacity duration-200">
              {item.percentage}%
            </span>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${item.percentage}%` }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-gradient-to-t from-crimson to-gold rounded-t-lg border-t border-white/20 shadow-[0_0_15px_rgba(244,197,66,0.1)] group-hover:brightness-110 transition-all duration-300"
            />

            <span className="text-[10px] font-black text-slate-500 font-mono tracking-wider pb-3 transition-colors group-hover:text-slate-300">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}