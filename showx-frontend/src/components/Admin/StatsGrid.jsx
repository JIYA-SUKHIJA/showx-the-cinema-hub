// src/components/Admin/StatsGrid.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, TrendingDown, DollarSign, Ticket, Users, Film } from 'lucide-react';

export default function StatsGrid({ stats }) {
  const { isDarkMode } = useTheme();

  // Baseline structural fallbacks matching administrative schemas
  const metricsData = [
    {
      label: "Total Gross Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: DollarSign,
      trend: "+12.4%",
      isPositive: true,
      accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      label: "Total Bookings Issued",
      value: (stats?.totalBookings || 0).toLocaleString(),
      icon: Ticket,
      trend: "+8.1%",
      isPositive: true,
      accent: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    },
    {
      label: "Verified Accounts",
      value: (stats?.totalUsers || 0).toLocaleString(),
      icon: Users,
      trend: "+4.3%",
      isUp: true,
      isPositive: true,
      accent: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    {
      label: "Active Catalog Shards",
      value: (stats?.activeMovies || 0).toLocaleString(),
      icon: Film,
      trend: "-1.2%",
      isPositive: false,
      accent: "text-rose-500 bg-rose-500/10 border-rose-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
      {metricsData.map((node, idx) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={idx}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`border p-5 rounded-2xl relative overflow-hidden transition-colors duration-300 shadow-sm flex flex-col justify-between h-36 ${
              isDarkMode 
                ? "bg-[#111114]/40 border-white/[0.04] shadow-black/40 hover:border-amber-500/30" 
                : "bg-white border-stone-200/80 shadow-stone-900/5 hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-start justify-between relative z-10">
              <span className={`text-[10px] font-black font-mono uppercase tracking-wider ${
                isDarkMode ? "text-slate-500" : "text-stone-400"
              }`}>
                {node.label}
              </span>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${node.accent}`}>
                <Icon size={13} strokeWidth={2.5} />
              </div>
            </div>

            <div className="space-y-1 relative z-10 mt-2">
              <h3 className={`text-xl font-black font-mono tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {node.value}
              </h3>
              
              <div className="flex items-center justify-between text-[9px] font-mono font-black uppercase tracking-wider">
                <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border ${
                  node.isPositive 
                    ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" 
                    : "text-rose-500 bg-rose-500/5 border-rose-500/10"
                }`}>
                  {node.isPositive ? <TrendingUp size={10} strokeWidth={2.5} /> : <TrendingDown size={10} strokeWidth={2.5} />}
                  {node.trend}
                </span>
                <span className={`text-[9px] font-medium tracking-normal ${isDarkMode ? "text-slate-600" : "text-stone-400"}`}>
                  vs last interval audit
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}