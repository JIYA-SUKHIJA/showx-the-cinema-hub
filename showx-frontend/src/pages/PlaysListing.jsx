// src/pages/PlaysListing.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Theater, Award, ArrowRight, Sparkles, Clock, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PlaysListing() {
  const { isDarkMode } = useTheme();

  const plays = [
    { id: 'p1', title: 'The Shakespeare Classic Remix', lang: 'English', duration: '120 min', venue: 'Royal Opera Amphitheater', ticket: '₹350' },
    { id: 'p2', title: 'Mughal-E-Azam Musical', lang: 'Hindi / Urdu', duration: '180 min', venue: 'Grand Broadway Palace', ticket: '₹500' }
  ];

  return (
    <div className="space-y-12">
      {/* Banner Component */}
      <div className={`relative rounded-[32px] overflow-hidden p-8 md:p-14 border shadow-xl transition-all duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-br from-slate-950 via-[#1c150c] to-slate-950 border-white/[0.04]" 
          : "bg-gradient-to-br from-[#faf8f2] via-[#f5ede4] to-[#ebdccf] border-stone-200/80"
      }`}>
        <div className={`absolute inset-0 pointer-events-none z-0 ${
          isDarkMode ? "bg-[radial-gradient(circle_at_center,rgba(244,197,66,0.06)_0%,transparent_65%)]" : "bg-[radial-gradient(circle_at_center,rgba(244,197,66,0.1)_0%,transparent_65%)]"
        }`} />
        <div className="max-w-xl space-y-4 relative z-10">
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
            isDarkMode ? "bg-amber-500/10 text-gold border-gold/20" : "bg-amber-500/5 text-amber-800 border-amber-500/20"
          }`}>
            <Theater size={12} /> Dramatic Arts
          </span>
          <h1 className={`text-4xl md:text-5xl font-display font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-stone-900"}`}>
            Theatrical Masterpieces <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Live Production Stages</span>
          </h1>
          <p className={`text-xs md:text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-stone-600/90"}`}>
            Witness standard dramatic art forms and classical orchestral plays. Reserve front-row acoustic configurations instantly through premium seating grids.
          </p>
        </div>
      </div>

      {/* Primary Section */}
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Sparkles size={16} className="text-amber-500" />
          <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>Featured Stage Dramas</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plays.map((play) => (
            <motion.div
              key={play.id}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className={`border rounded-2xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 relative group ${
                isDarkMode ? "bg-gradient-to-b from-white/[0.03] to-white/[0.01] border-white/[0.05]" : "bg-white border-stone-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black tracking-widest uppercase text-amber-500 px-2.5 py-0.5 rounded-md bg-amber-500/5 border border-amber-500/10">{play.lang}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1"><Clock size={11} /> {play.duration}</span>
                </div>
                <h3 className={`font-display font-black text-xl tracking-tight transition-colors group-hover:text-amber-500 ${isDarkMode ? "text-white" : "text-stone-800"}`}>{play.title}</h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><MapPin size={12} className="text-amber-600 shrink-0" /> {play.venue}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pass Value</p>
                  <p className="text-sm font-black text-amber-500 font-mono">{play.ticket}</p>
                </div>
                <button className={`px-5 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer ${
                  isDarkMode ? "bg-white text-slate-950 hover:bg-amber-600 hover:text-white" : "bg-stone-950 text-white hover:bg-amber-600"
                }`}>
                  Select Seating <ArrowRight size={13} strokeWidth={2.5} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}