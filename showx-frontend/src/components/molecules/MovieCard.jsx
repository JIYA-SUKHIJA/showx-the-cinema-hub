// src/components/molecules/MovieCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Clapperboard, MapPin, Tv, Sparkles, Info, Heart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function MovieCard({ movie: item, onActionClick, actionLabel }) {
  const [imgError, setImgError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
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

  const formatsList = item.format ? item.format.split('/').map(f => f.trim()) : ['2D'];
  const genreList = Array.isArray(item.genre) 
  ? item.genre 
  : (item.genre ? item.genre.split('•').map(g => g.trim()) : ['Entertainment']);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015, shadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      className={`border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between h-full relative group ${
        isDarkMode 
          ? "bg-slate-900/40 border-white/[0.05] hover:border-amber-500/40 shadow-xl shadow-black/20" 
          : "bg-white border-slate-200 hover:border-slate-350 shadow-md"
      }`}
    >
      {/* Absolute Dynamic Tag Flag */}
      {(item.tag || item.badge) && (
        <span className="absolute top-3 left-3 z-20 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-gradient-to-r from-amber-600 to-yellow-500 text-stone-950 shadow-md select-none">
          {item.tag || item.badge}
        </span>
      )}

      {/* Wishlist Action Button Overlaid */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
        className={`absolute top-3 right-3 z-20 p-1.5 rounded-xl border backdrop-blur-md transition-all shadow-md cursor-pointer focus:outline-none ${
          isDarkMode
            ? "bg-slate-950/70 border-white/10 text-slate-400 hover:text-rose-500"
            : "bg-white/80 border-slate-200 text-slate-500 hover:text-rose-500"
        }`}
        aria-label="Add to wishlist"
      >
        <Heart 
          size={13} 
          className={`transition-transform duration-200 ${
            isWishlisted ? "fill-rose-500 stroke-rose-500 text-rose-500 scale-110" : "hover:scale-105"
          }`}
        />
      </motion.button>

      {/* Media Cover Layer */}
      <div onClick={handleNavigateToBriefing} className="relative w-full aspect-[16/10] sm:aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer">
        {!imgError ? (
          <motion.img
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            src={posterUrl}
            alt={itemTitle}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover scale-[1.005] group-hover:scale-105 transition-transform duration-700 cubic-bezier(0.16,1,0.3,1)"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
            {isStream ? <Tv size={32} /> : isEventOrPlay ? <Sparkles size={32} /> : <Clapperboard size={32} />}
          </div>
        )}
        
        {/* Subtle shadow gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />
        
        {/* Play Action Hover overlay masking */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <span className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play size={16} className="fill-current ml-0.5" />
          </span>
        </div>

        {/* Runtime Badge Overlay */}
        {item.duration && (
          <span className="absolute bottom-3 left-3 text-[9px] font-bold px-1.5 py-0.5 bg-slate-950/80 backdrop-blur-sm text-slate-300 rounded border border-white/5 font-mono select-none">
            {item.duration}
          </span>
        )}

        {/* Rating Badge Deck Layer */}
        <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-black px-2 py-0.5 bg-slate-950/80 backdrop-blur-sm text-amber-500 rounded border border-white/10 shadow-md font-mono select-none">
          <Star size={10} className="fill-amber-500 stroke-amber-500" /> {item.rating || '8.0'}
        </span>
      </div>

      {/* Card Body Info Matrix */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div onClick={handleNavigateToBriefing} className="cursor-pointer group/title space-y-2.5">
          <h3 className={`text-sm md:text-base font-black tracking-tight group-hover/title:text-amber-500 transition-colors line-clamp-1 relative pb-0.5 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            {itemTitle}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber-500/30 transition-all duration-300 group-hover/title:w-full" />
          </h3>
          
          {/* Genre Chips Cluster */}
          <div className="flex flex-wrap gap-1">
            {genreList.map((genre, i) => (
              <span 
                key={i} 
                className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-wide select-none ${
                  isDarkMode ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600"
                }`}
              >
                {genre}
              </span>
            ))}
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded select-none ${
              isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"
            }`}>
              {item.language || 'Hindi'}
            </span>
          </div>
          
          {isEventOrPlay && item.venue && (
            <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5 truncate">
              <MapPin size={11} className="text-amber-500 shrink-0" /> {item.venue}
            </p>
          )}

          {/* Short description preview */}
          {item.description && (
            <p className="text-[11px] leading-relaxed line-clamp-2 pt-0.5 text-slate-500 font-medium">
              {item.description}
            </p>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${isDarkMode ? "border-white/[0.04]" : "border-slate-100"}`}>
          
          <div className="flex flex-wrap gap-1 max-w-[45%] items-center select-none">
            {isEventOrPlay ? (
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border truncate ${isDarkMode ? "bg-white/[0.02] text-slate-400 border-white/[0.05]" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
                {item.date || 'Live'}
              </span>
            ) : isStream ? (
              <span className="text-[10px] font-mono font-extrabold text-amber-500 tracking-wide">
                {item.price || 'Rent'}
              </span>
            ) : (
              formatsList.map((f, idx) => (
                <span 
                  key={idx} 
                  className={`px-1 py-0.5 text-[8px] font-bold font-mono tracking-wider rounded border uppercase whitespace-nowrap ${
                    isDarkMode 
                      ? "bg-slate-800/40 text-slate-400 border-slate-700/60" 
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {f}
                </span>
              ))
            )}
          </div>

          {/* Step 5 Interactive Button Clusters Enforced */}
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05, bg: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToBriefing();
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer focus:outline-none ${
                isDarkMode 
                  ? "border-white/10 bg-white/[0.02] text-slate-400 hover:text-amber-500" 
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:text-amber-500"
              }`}
              title="View Briefing Summary"
            >
              <Info size={13} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, filter: "brightness(1.06)", shadow: "0 4px 12px rgba(245, 158, 11, 0.15)" }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onActionClick();
              }}
              className={`px-3.5 py-1.5 text-[11px] font-black rounded-xl transition-all shadow-md cursor-pointer focus:outline-none ${
                isDarkMode 
                  ? "bg-white text-slate-950 hover:bg-amber-500 border-transparent" 
                  : "bg-slate-900 text-white hover:bg-amber-500 hover:text-stone-950 border-transparent"
              }`}
            >
              {finalActionLabel}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}