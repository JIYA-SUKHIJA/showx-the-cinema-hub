// src/components/Admin/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
import { Server, Database, DollarSign, Film, Users, Ticket, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { fetchDashboardStats } from '../../services/adminApi';

export default function SystemSettings() {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const mode = import.meta.env.MODE === 'production' ? 'Production' : 'Development';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={`p-5 rounded-2xl border space-y-4 ${
        isDarkMode ? "bg-[#111114]/40 border-white/[0.04]" : "bg-white border-stone-200/80 shadow-sm shadow-stone-900/5"
      }`}>
        <h4 className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>
          <Database size={12} /> System Info
        </h4>

        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RefreshCw size={12} className="animate-spin" /> Loading live stats...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/[0.04]" : "bg-stone-50 border-stone-100"}`}>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                <Film size={11} /> Total Movies
              </div>
              <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-stone-900"}`}>{stats?.totalMovies ?? 0}</p>
            </div>
            <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/[0.04]" : "bg-stone-50 border-stone-100"}`}>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                <Users size={11} /> Total Users
              </div>
              <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-stone-900"}`}>{stats?.totalUsers ?? 0}</p>
            </div>
            <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/[0.04]" : "bg-stone-50 border-stone-100"}`}>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                <Ticket size={11} /> Total Bookings
              </div>
              <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-stone-900"}`}>{stats?.totalBookings ?? 0}</p>
            </div>
            <div className={`p-3 rounded-xl border ${isDarkMode ? "bg-white/[0.02] border-white/[0.04]" : "bg-stone-50 border-stone-100"}`}>
              <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                <DollarSign size={11} /> Total Revenue
              </div>
              <p className={`text-lg font-black ${isDarkMode ? "text-white" : "text-stone-900"}`}>₹{stats?.totalRevenue ?? 0}</p>
            </div>
          </div>
        )}
      </div>

      <div className={`p-5 rounded-2xl border h-fit space-y-3 ${
        isDarkMode ? "bg-[#111114]/40 border-white/[0.04]" : "bg-white border-stone-200/80 shadow-sm shadow-stone-900/5"
      }`}>
        <h4 className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>
          <Server size={12} /> Environment
        </h4>
        <div className="space-y-3 font-mono text-[9px] text-slate-500">
          <div className={`flex justify-between border-b pb-1.5 ${isDarkMode ? "border-white/[0.02]" : "border-stone-100"}`}>
            <span>Mode:</span>
            <span className={`font-bold ${isDarkMode ? "text-slate-300" : "text-stone-700"}`}>{mode}</span>
          </div>
          <div className={`flex justify-between border-b pb-1.5 ${isDarkMode ? "border-white/[0.02]" : "border-stone-100"}`}>
            <span>API Base URL:</span>
            <span className={`font-bold truncate max-w-[160px] ${isDarkMode ? "text-slate-300" : "text-stone-700"}`}>{apiBaseUrl}</span>
          </div>
          <div className="flex justify-between">
            <span>Database:</span>
            <span className="font-bold text-emerald-500">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}