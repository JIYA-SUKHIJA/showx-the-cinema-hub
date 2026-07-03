// src/pages/AdminSettings.jsx
import React from 'react';
import { Settings, KeySquare, HardDrive } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-white/[0.04] pb-6">
        <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
          <Settings size={20} className="text-amber-500" /> Infrastructure Configurations
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Control global application parameters, active API tokens, and sync layers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-display font-black text-sm"><KeySquare size={16} className="text-amber-500" /> Payment Node Gateway</div>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Razorpay Merchant Mode</label>
              <select className="w-full bg-slate-950 border border-white/[0.06] rounded-xl px-3 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-500/50">
                <option>Sandbox / Test Environment Active</option>
                <option>Live Production Gateway Cluster</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-display font-black text-sm"><HardDrive size={16} className="text-amber-500" /> System Memory Arrays</div>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-white/[0.04]">
              <div>
                <p className="text-xs font-black tracking-wide text-white">Local Cache Architecture</p>
                <p className="text-[11px] text-slate-500 font-medium">Auto-synchronizes seat operations into local storage clusters.</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">ON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}