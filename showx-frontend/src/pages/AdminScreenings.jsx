// src/pages/AdminScreenings.jsx
import React, { useState } from 'react';
import { Film, Plus, Trash2 } from 'lucide-react';

export default function AdminScreenings() {
  // Local active screenings state for dynamic immediate updates
  const [screenings, setScreenings] = useState([
    { id: 1, title: 'Welcome To The Jungle', screen: 'AUDI 01 — IMAX 3D', times: '10:30 AM, 05:00 PM', fill: '88%' },
    { id: 2, title: 'Alpha', screen: 'AUDI 04 — ICE Theatre', times: '01:45 PM, 08:30 PM', fill: '95%' },
    { id: 3, title: 'Main Vaapas Aaunga', screen: 'AUDI 02 — 2D Standard', times: '12:00 PM, 07:30 PM', fill: '62%' },
    { id: 4, title: 'Cocktail 2', screen: 'AUDI 03 — Dolby Atmos', times: '02:30 PM, 09:45 PM', fill: '78%' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newScreen, setNewScreen] = useState('AUDI 01 — IMAX 3D');
  const [newTimes, setNewTimes] = useState('');

  const handleDeployShow = (e) => {
    e.preventDefault();
    if (!newTitle || !newTimes) return;

    const newShow = {
      id: Date.now(),
      title: newTitle,
      screen: newScreen,
      times: newTimes,
      fill: '0%' // New deploy slots start completely empty
    };

    setScreenings([newShow, ...screenings]);
    setNewTitle('');
    setNewTimes('');
  };

  const handleRevokeShow = (id) => {
    setScreenings(screenings.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
            <Film size={20} className="text-amber-500" /> Screening Matrix Schedules
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Deploy or cancel active multiplex cinema auditorium slots dynamically.</p>
        </div>
      </div>

      {/* Dynamic Creation Form Panel */}
      <form onSubmit={handleDeployShow} className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-xl">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Film Title</label>
          <input 
            type="text" 
            placeholder="e.g. Peddhi"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Showtime Allocation</label>
          <input 
            type="text" 
            placeholder="e.g. 04:00 PM, 11:15 PM"
            value={newTimes}
            onChange={(e) => setNewTimes(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <button type="submit" className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md">
          <Plus size={14} strokeWidth={2.5} /> Deploy Show
        </button>
      </form>

      {/* Live Table Registry */}
      <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01] shadow-2xl">
        <table className="w-full text-left text-xs font-medium border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-white/[0.04] text-slate-400 uppercase font-black font-mono tracking-wider text-[10px]">
              <th className="p-4">Active Blockbuster Movie</th>
              <th className="p-4">Auditorium / Format</th>
              <th className="p-4">Timeline Showtimes</th>
              <th className="p-4">Load Threshold</th>
              <th className="p-4 honesty text-right">Operational Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-slate-300">
            {screenings.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-black text-white">{row.title}</td>
                <td className="p-4 font-mono text-[11px] text-slate-400">{row.screen}</td>
                <td className="p-4 font-mono font-semibold text-amber-500">{row.times}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: row.fill }} />
                    </div>
                    <span className="font-mono text-[10px] font-bold">{row.fill}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleRevokeShow(row.id)}
                    className="text-red-400 hover:text-red-300 font-black uppercase text-[10px] bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}