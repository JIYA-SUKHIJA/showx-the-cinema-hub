// src/pages/Settings.jsx
import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`max-w-4xl mx-auto p-6 md:p-10 rounded-3xl border shadow-xl ${
      isDarkMode ? "bg-slate-900/40 border-white/[0.06] text-white" : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div className="border-b border-dashed border-slate-700/20 pb-6 mb-8">
        <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">Manage your profile, preferences, and login credentials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-black rounded-xl bg-amber-500 text-stone-950 shadow-md text-left">
            <User size={14} /> Profile Info
          </button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
              <input 
                type="text" 
                defaultValue="Jiya Sukhija" 
                className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                  isDarkMode ? "bg-white/[0.02] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
                }`}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Phone Number</label>
              <input 
                type="text" 
                defaultValue="+91 9876543210" 
                className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                  isDarkMode ? "bg-white/[0.02] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400">Email Address</label>
            <input 
              type="email" 
              defaultValue="jiya.sukhija@cinema.com" 
              disabled
              className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold opacity-60 cursor-not-allowed ${
                isDarkMode ? "bg-slate-950 border-white/5 text-slate-400" : "bg-stone-100 border-stone-200 text-stone-500"
              }`}
            />
          </div>

          <div className="pt-4 border-t border-slate-700/10 flex justify-end">
            <button className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-600 transition-colors rounded-xl shadow-md cursor-pointer border-none">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}