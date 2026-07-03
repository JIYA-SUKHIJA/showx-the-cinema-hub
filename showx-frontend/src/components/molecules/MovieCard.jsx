// src/components/molecules/MovieCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Clapperboard, Calendar, MapPin, Tv, Sparkles, Theater, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function MovieCard({ movie: item, onActionClick, actionLabel }) {
  const [imgError, setImgError] = useState(false);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const fallbackImages = {
    "Interstellar Odyssey": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    "Midnight Chase": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
    "The Cyber Frontier": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    "Arijit Singh Live In Concert": "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=600&auto=format&fit=crop",
    "Standup Special with Bassi": "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=600&auto=format&fit=crop",
    "Mughal-E-Azam: The Musical": "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=600&auto=format&fit=crop",
    "Hamlet Adaptation": "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=600&auto=format&fit=crop"
  };

  const itemTitle = item.title || item.name || "Entertainment Listing";
  const posterUrl = item.poster || fallbackImages[itemTitle] || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop";

  const isStream = item.type === 'stream';
  const isEventOrPlay = item.type === 'events' || item.type === 'plays';

  const defaultLabel = isStream ? "Rent Stream" : isEventOrPlay ? "Book Passes" : "Book Tickets";
  const finalActionLabel = actionLabel || defaultLabel;

  const handleNavigateToBriefing = () => {
    const routePrefix = item.type || 'movies';
    navigate(`/${routePrefix}/${item.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`border rounded-2xl overflow-hidden shadow-md transition-all duration-300 flex flex-col justify-between h-full relative group ${
        isDarkMode 
          ? "bg-slate-900/60 border-white/[0.05] hover:border-amber-500/30" 
          : "bg-white border-slate-200 hover:border-slate-400"
      }`}
    >
      {item.tag && (
        <span className="absolute top-3 left-3 z-20 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950">
          {item.tag}
        </span>
      )}

      {/* Media Cover - Links to Briefing */}
      <div onClick={handleNavigateToBriefing} className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer">
        {!imgError ? (
          <img
            src={posterUrl}
            alt={itemTitle}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
            {isStream ? <Tv size={32} /> : isEventOrPlay ? <Sparkles size={32} /> : <Clapperboard size={32} />}
          </div>
        )}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 shadow-lg">
            <Play size={16} className="fill-current ml-0.5" />
          </span>
        </div>
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-black px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm text-amber-500 rounded border border-white/10">
          <Star size={10} className="fill-amber-500 stroke-amber-500" /> {item.rating || '8.0'}
        </span>
      </div>

      {/* Card Info Payload */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div onClick={handleNavigateToBriefing} className="cursor-pointer group/title">
          <h3 className={`text-base font-black tracking-tight group-hover/title:text-amber-500 transition-colors line-clamp-1 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {itemTitle}
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-1">{item.genre} • {item.language || 'Hindi'}</p>
          
          {isEventOrPlay && item.venue && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-2 truncate">
              <MapPin size={11} className="text-amber-500 shrink-0" /> {item.venue}
            </p>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${isDarkMode ? "border-white/[0.04]" : "border-slate-100"}`}>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isDarkMode ? "bg-white/[0.02] text-slate-400 border-white/[0.05]" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
            {isEventOrPlay ? (item.date || 'Live') : (isStream ? item.price : item.format)}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleNavigateToBriefing}
              className={`p-2 rounded-xl border transition-all ${isDarkMode ? "border-white/10 bg-white/[0.02] text-slate-400 hover:text-amber-500" : "border-slate-200 bg-slate-50 text-slate-600 hover:text-amber-500"}`}
              title="View Briefing Summary"
            >
              <Info size={14} />
            </button>
            <button
              onClick={onActionClick}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all ${isDarkMode ? "bg-white text-slate-950 hover:bg-amber-500" : "bg-slate-900 text-white hover:bg-amber-500 hover:text-stone-950"}`}
            >
              {finalActionLabel}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}