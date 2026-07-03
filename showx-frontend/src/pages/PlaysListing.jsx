// src/pages/PlaysListing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Theater, Award, ArrowRight, Sparkles, Clock, MapPin, Languages, Film } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PlaysListing() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');

  // Significantly expanded local stage play catalog content array
  const plays = [
    { 
      id: 'p1', 
      title: 'The Shakespeare Classic Remix', 
      lang: 'English', 
      duration: '120 min', 
      category: 'Classical',
      venue: 'Royal Opera Amphitheater', 
      ticket: 'From ₹350',
      badge: 'Critically Acclaimed',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'p2', 
      title: 'Mughal-E-Azam Musical', 
      lang: 'Hindi / Urdu', 
      duration: '180 min', 
      category: 'Musical',
      venue: 'Grand Broadway Palace', 
      ticket: 'From ₹500',
      badge: 'Selling Fast',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'p3', 
      title: 'Death of a Salesman: Modern Adaptation', 
      lang: 'English', 
      duration: '145 min', 
      category: 'Drama',
      venue: 'National Center of Dramatic Arts', 
      ticket: 'From ₹400',
      badge: 'Limited Run',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'p4', 
      title: 'Chanakya: Political Mastermind Story', 
      lang: 'Hindi', 
      duration: '135 min', 
      category: 'Classical',
      venue: 'Kamani Auditorium, Delhi', 
      ticket: 'From ₹300',
      badge: 'Housefull',
      image: 'https://images.unsplash.com/photo-1478720143033-6a972678aa30?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'p5', 
      title: 'Phantom of the Opera Arena Tour', 
      lang: 'English', 
      duration: '160 min', 
      category: 'Musical',
      venue: 'Cyber City Convention Hall', 
      ticket: 'From ₹799',
      badge: 'Exclusive Premiere',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop'
    },
    { 
      id: 'p6', 
      title: 'Waiting for Godot: Absurdist Revival', 
      lang: 'English', 
      duration: '110 min', 
      category: 'Drama',
      venue: 'Fine Arts Stage, Sector 17', 
      ticket: 'From ₹250',
      badge: 'Trending Now',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const categories = ['All', 'Classical', 'Musical', 'Drama'];

  const filteredPlays = activeFilter === 'All' 
    ? plays 
    : plays.filter(play => play.category === activeFilter);

  const handlePlaySelection = (playId) => {
    // Navigate dynamically matching your App.jsx path configuration
    navigate(`/plays/${playId}`);
  };

  return (
    <div className="space-y-12 font-sans antialiased max-w-[1440px] mx-auto px-6 py-4">
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

      {/* Dynamic Sub-header Navigation Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>Featured Stage Dramas</h2>
        </div>

        {/* Categories Tab Engine */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border cursor-pointer transition-all active:scale-95 ${
                activeFilter === cat
                  ? "bg-amber-500 text-slate-950 border-transparent shadow-md"
                  : isDarkMode
                    ? "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Section Display Grid Grid */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlays.map((play) => (
            <motion.div
              key={play.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={() => handlePlaySelection(play.id)}
              className={`border rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full relative cursor-pointer ${
                isDarkMode ? "bg-gradient-to-b from-white/[0.03] to-white/[0.01] border-white/[0.05]" : "bg-white border-stone-200"
              }`}
            >
              {/* Media Card Image Box Header */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img src={play.image} alt={play.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90" />
                <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded border border-white/10 shadow-md z-10 font-mono">
                  {play.badge}
                </span>
                <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-500 border border-white/10 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-md shadow-md z-10 flex items-center gap-1">
                  <Languages size={11} /> {play.lang}
                </span>
              </div>

              {/* Central Details Payload Block */}
              <div className={`p-5 flex-grow flex flex-col justify-between space-y-4 ${isDarkMode ? "bg-slate-900/10" : "bg-stone-50/40"}`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                      {play.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1"><Clock size={11} /> {play.duration}</span>
                  </div>
                  <h3 className={`font-display font-black text-lg group-hover:text-amber-500 transition-colors line-clamp-1 ${isDarkMode ? "text-white" : "text-stone-800"}`}>
                    {play.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1"><MapPin size={12} className="text-amber-600 shrink-0" /> {play.venue}</p>
                </div>
                
                {/* Lower Action Ledger Row */}
                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between gap-4">
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}