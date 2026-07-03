// src/pages/AdminUsers.jsx
import React from 'react';
import { Users, UserCheck } from 'lucide-react';

export default function AdminUsers() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-white/[0.04] pb-6">
        <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
          <Users size={20} className="text-amber-500" /> IAM Security User Roles
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Review system personnel access privileges and active operations accounts.</p>
      </div>

      <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01] shadow-2xl">
        <table className="w-full text-left text-xs font-medium border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-white/[0.04] text-slate-400 uppercase font-black font-mono tracking-wider text-[10px]">
              <th className="p-4">Operator Profile</th>
              <th className="p-4">Assigned Access Level</th>
              <th className="p-4">Session Token Status</th>
              <th className="p-4 text-right">Administrative Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-slate-300">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/20 flex items-center justify-center shadow-inner">JS</div>
                <div>
                  <p className="font-bold text-white">Jiya Sukhija</p>
                  <p className="text-[10px] text-slate-500 font-mono">jiya@example.com</p>
                </div>
              </td>
              <td className="p-4"><span className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-md bg-stone-900 border border-white/[0.04] text-amber-500">ROOT_ADMINISTRATOR</span></td>
              <td className="p-4"><div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] font-mono"><UserCheck size={13} /> ACTIVE_ROOT</div></td>
              <td className="p-4 text-right"><span className="text-slate-500 text-[10px] font-black uppercase tracking-wider select-none">SYSTEM PROTECTED</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}