import React, { useState, useEffect } from 'react';
import { Database, Film, Ticket, Building, Users2, IndianRupee, Server } from 'lucide-react';
import { fetchDashboardStats } from '../../services/adminApi';

export default function SystemSettings() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load system info', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const infoItems = [
    { label: 'Total Movies', value: stats?.totalMovies, icon: Film },
    { label: 'Total Users', value: stats?.totalUsers, icon: Users2 },
    { label: 'Total Bookings', value: stats?.totalBookings, icon: Ticket },
    { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : null, icon: IndianRupee },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#111114] border border-white/[0.05] p-8 rounded-2xl">
        <h3 className="text-sm font-black text-white uppercase mb-6 flex items-center gap-2">
          <Database size={16} className="text-[#FF9F00]" /> System Info
        </h3>

        {loading ? (
          <p className="text-xs text-slate-500 font-medium">Loading system data...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                    <Icon size={14} className="text-[#FF9F00]" /> {item.label}
                  </span>
                  <span className="text-sm font-black text-white">{item.value ?? '—'}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-[#111114] border border-white/[0.05] p-8 rounded-2xl">
        <h3 className="text-sm font-black text-white uppercase mb-6 flex items-center gap-2">
          <Server size={16} className="text-[#FF9F00]" /> Environment
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-xs font-bold text-slate-400 uppercase">Mode</span>
            <span className="text-sm font-black text-white uppercase">{import.meta.env.MODE}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-xs font-bold text-slate-400 uppercase">API Base URL</span>
            <span className="text-xs font-mono text-slate-300">{import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <span className="text-xs font-bold text-slate-400 uppercase">Database</span>
            <span className="flex items-center gap-1.5 text-xs font-black text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}