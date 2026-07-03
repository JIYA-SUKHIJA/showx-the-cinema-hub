// src/pages/StreamListing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Zap, Sparkles, Film, ArrowRight, Star, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function StreamListing() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');

  // Multi-tier expanded digital catalog collection
  const streamRentals = [
    { 
      id: 's1', 
      title: 'Everything Everywhere All at Once', 
      price: '₹149', 
      rating: '8.5', 
      duration: '139 min',
      category: 'Sci-Fi',
      image: 'https://images.unsplash.com/photo-1478720143033-6a972678aa30?q=80&w=600&auto=format&fit=crop', 
      badge: 'Premiere' 
    },
    { 
      id: 's2', 
      title: 'Spider-Man: Across the Spider-Verse', 
      price: '₹99', 
      rating: '8.7', 
      duration: '140 min',
      category: 'Action',
      image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=600&auto=format&fit=crop', 
      badge: 'Top Rent' 
    },
    { 
      id: 's3', 
      title: 'Oppenheimer', 
      price: '₹199', 
      rating: '8.9', 
      duration: '180 min',
      category: 'Drama',
      image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop', 
      badge: 'Exclusive' 
    },
    { 
      id: 's4', 
      title: 'Interstellar: Vision Variant', 
      price: '₹149', 
      rating: '9.2', 
      duration: '169 min',
      category: 'Sci-Fi',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop', 
      badge: '4K Ultra HD' 
    },
    { 
      id: 's5', 
      title: 'The Dark Knight Rises', 
      price: '₹129', 
      rating: '9.0', 
      duration: '164 min',
      category: 'Action',
      image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop', 
      badge: 'IMAX Audio' 
    },
    { 
      id: 's6', 
      title: 'Knives Out: Glass Onion', 
      price: '₹99', 
      rating: '8.1', 
      duration: '139 min',
      category: 'Mystery',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop', 
      badge: 'Exclusives' 
    }
  ];

  const categories = ['All', 'Action', 'Sci-Fi', 'Drama', 'Mystery'];

  const filteredStreams = activeCategory === 'All'
    ? streamRentals
    : streamRentals.filter(item => item.category === activeCategory);

  const handleDynamicNavigation = (streamId) => {
    navigate(`/stream/${streamId}`);
  };

  return (
    <div className="space-y-12 font-sans antialiased max-w-[1440px] mx-auto px-6 py-4">
      {/* Premium Hero Hub */}
      <div className={`relative rounded-[32px] overflow-hidden p-8 md:p-14 border shadow-xl transition-all duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-br from-slate-950 via-[#0d0a1c] to-slate-950 border-white/[0.04]" 
          : "bg-gradient-to-br from-[#faf8f5] via-[#f3f0e7] to-[#e8e2d5] border-stone-200/80"
      }`}>
        <div className={`absolute inset-0 pointer-events-none z-0 ${
          isDarkMode ? "bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_65%)]" : "bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_65%)]"
        }`} />
        <div className="max-w-xl space-y-4 relative z-10">
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
            isDarkMode ? "bg-amber-500/10 text-gold border-gold/20" : "bg-amber-500/5 text-amber-800 border-amber-500/20 shadow-sm"
          }`}>
            <Zap size={11} className="fill-current" /> Showx Stream Studio
          </span>
          <h1 className={`text-4xl font-display font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-stone-900"}`}>
            Cinema Blockbusters, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Right To Your Couch</span>
          </h1>
          <p className={`text-xs md:text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-stone-600/90"}`}>
            Skip the box office lines. Rent freshly debuted global blockbusters instantly with ultra-low latency streaming channels and premium high-fidelity home cinema codecs.
          </p>
        </div>
      </div>

      {/* Dynamic Navigation Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>New Premieres & Digital Rentals</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border cursor-pointer transition-all active:scale-95 ${
                activeCategory === cat
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

      {/* Media Collection Cards */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStreams.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={() => handleDynamicNavigation(item.id)}
              className={`border rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full relative cursor-pointer ${
                isDarkMode ? "bg-gradient-to-b from-white/[0.03] to-white/[0.01] border-white/[0.05]" : "bg-white border-stone-200"
              }`}
            >
              {/* Media Card Artwork Backing */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded border border-white/10 shadow-md z-10 font-mono">
                  {item.badge}
                </span>
                <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-500 border border-white/10 text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg shadow-md z-10">
                  ★ {item.rating}
                </span>
                
                {/* Embedded Play Action Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center backdrop-blur-[2px]">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-[0_0_20px_rgba(244,197,66,0.4)]"
                  >
                    <Play size={18} className="fill-current ml-0.5" />
                  </motion.span>
                </div>
              </div>

              {/* Data payload summary panel footer */}
              <div className={`p-5 flex flex-col justify-between gap-4 flex-grow transition-colors duration-300 ${isDarkMode ? "bg-slate-900/10" : "bg-stone-50/40"}`}>
                <div className="space-y-1 overflow-hidden min-w-0">
                  <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className={`font-display font-black text-base truncate group-hover:text-amber-500 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-stone-800"}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                    <span className="flex items-center gap-1 font-mono font-bold text-amber-600">
                      <Film size={11} /> Rent: {item.price}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {item.duration}
                    </span>
                  </div>
                </div>
                
                <button className={`w-full py-2.5 font-black text-xs rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1 shrink-0 ${
                  isDarkMode 
                    ? "bg-white text-slate-950 hover:bg-amber-600 hover:text-white" 
                    : "bg-stone-950 text-white hover:bg-amber-600"
                }`}>
                  Buy Pass Now <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}