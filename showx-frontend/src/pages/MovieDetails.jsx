// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Calendar, MapPin, Film, Share2, Heart, Award, ShieldCheck, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchItemById, fetchShowsForMovie } from '../services/api';
import { MovieDetailsSkeleton } from '../components/atoms/Skeletons';
import { optimizeImage } from '../utils/optimizeImage';

export default function MovieDetails() {
  const { movieId, streamId, eventId, playId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const [shows, setShows] = useState([]);
  const [showsLoading, setShowsLoading] = useState(true);

  const activeId = movieId || streamId || eventId || playId;

  useEffect(() => {
    if (activeId) {
      setLoading(true);
      fetchItemById(activeId).then((data) => {
        setItem(data);
        setTimeout(() => setLoading(false), 550);
      }).catch(() => setLoading(false));
    }
  }, [activeId]);

  useEffect(() => {
    if (activeId) {
      setShowsLoading(true);
      fetchShowsForMovie(activeId)
        .then((data) => setShows(data))
        .finally(() => setShowsLoading(false));
    }
  }, [activeId]);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (!item) return <div className="text-center p-20 text-slate-400">Briefing element node not found.</div>;

  const itemTitle = item.title || item.name || "Entertainment Listing";
  const posterUrl = item.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600";

  const showsByTheatre = shows.reduce((acc, show) => {
    const theatreName = show.theatre?.name || 'Unknown Theatre';
    if (!acc[theatreName]) acc[theatreName] = [];
    acc[theatreName].push(show);
    return acc;
  }, {});

  // High-performance hardware-accelerated cinematic styles
  const cinematicDetailsStyles = `
    @keyframes slowCinematicZoom {
      0% { transform: scale(1.03); }
      50% { transform: scale(1.06); }
      100% { transform: scale(1.03); }
    }
    .animate-cinematic-hero {
      animation: slowCinematicZoom 28s ease-in-out infinite;
      will-change: transform;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes livePulse {
      0% { transform: scale(0.95); opacity: 0.5; }
      50% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(0.95); opacity: 0.5; }
    }
    .animate-live-pulse {
      animation: livePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-12 pb-16 relative text-[#111827] bg-gradient-to-b from-white via-[#f4f9ff] to-[#eef5fc] min-h-screen"
    >
      <style>{cinematicDetailsStyles}</style>

      {/* --- LUMINOUS HERO BANNER (Enhanced Vignette & Parallax Mask Layer) --- */}
      <div className="relative w-full h-[480px] sm:h-[520px] rounded-[32px] overflow-hidden bg-slate-900 shadow-[0_25px_60px_-15px_rgba(59,130,246,0.2)] border border-white/40">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src={optimizeImage(posterUrl, 1200)} 
            alt="" 
            className="w-full h-full object-cover object-center animate-cinematic-hero brightness-[0.92] saturate-[1.08] transition-all duration-700" 
          />
        </div>
        
        {/* Advanced multi-stage contrast masks for maximum textual alignment */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-black/10 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/[0.02] backdrop-blur-[0.5px] z-10 pointer-events-none" />

        <div className="absolute top-6 right-6 z-30 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-3 bg-white/80 backdrop-blur-xl hover:bg-white border border-white/80 rounded-xl transition-all text-[#111827] cursor-pointer shadow-md flex items-center justify-center outline-none"
          >
            <Heart size={15} className={isWishlisted ? "fill-rose-500 stroke-rose-500 text-rose-500 transition-all scale-110" : "transition-transform"} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="p-3 bg-white/80 backdrop-blur-xl hover:bg-white border border-white/80 rounded-xl transition-all text-[#111827] cursor-pointer shadow-md flex items-center justify-center outline-none"
          >
            <Share2 size={15} />
          </motion.button>
        </div>

        {/* --- FLOATING GLASSMORPHISM CONTENT --- */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-10">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-end">

            {/* Premium Elevation lift poster card frame[cite: 11] */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] border-[4px] border-white shrink-0 bg-slate-100 translate-y-1/4 will-change-transform cursor-pointer"
            >
              <img src={optimizeImage(posterUrl)} alt={itemTitle} className="w-full h-full object-cover scale-[1.005] hover:scale-105 transition-transform duration-500 object-center" />
            </motion.div>

            {/* SaaS Glossy Info Node Shell[cite: 11] */}
            <div
              className="flex-grow w-full md:w-auto h-auto space-y-3.5 text-center md:text-left px-6 py-5 sm:px-8 sm:py-6 rounded-[28px] mb-0 border border-white/60 shadow-[0_25px_70px_-20px_rgba(59,130,246,0.25)] transition-all duration-300 transform hover:translate-y-[-2px]"
              style={{
                background: 'rgba(255, 255, 255, 0.78)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <span className="inline-block px-2.5 py-0.5 text-[8px] sm:text-[9px] font-mono font-black tracking-widest uppercase bg-[#111827] text-white rounded-md shadow-sm select-none">
                {item.tag || item.type}
              </span>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-[#111827] font-display">
                {itemTitle}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-bold select-none">
                <motion.div
                  whileHover={{ scale: 1.04, y: -1 }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100/70 to-yellow-50/70 border border-amber-200/60 text-amber-800 px-3 py-1.5 rounded-xl shadow-sm transition-all font-mono"
                >
                  <Star size={13} className="fill-amber-500 text-amber-500 animate-pulse" /> {item.rating || '8.0'} / 10 Interest Metric
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.04, y: -1 }}
                  className="bg-blue-50/70 border border-blue-200/60 text-blue-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  {item.genre}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.04, y: -1 }}
                  className="bg-purple-50/70 border border-purple-200/60 text-purple-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  {item.language || 'Hindi'}
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold select-none">
                {item.venue ? (
                  <>
                    <span className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 text-slate-600 px-3 py-1.5 rounded-xl shadow-sm font-medium">
                      <MapPin size={12} className="text-blue-500 shrink-0" /> {item.venue}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 text-slate-600 px-3 py-1.5 rounded-xl shadow-sm font-medium">
                      <Calendar size={12} className="text-blue-500 shrink-0" /> {item.date}
                    </span>
                  </>
                ) : (
                  <>
                    <motion.span
                      whileHover={{ scale: 1.04, y: -1 }}
                      className="flex items-center gap-1.5 bg-orange-50/80 border border-orange-200/60 text-orange-700 px-3 py-1.5 rounded-xl shadow-sm transition-all font-mono font-bold"
                    >
                      <Clock size={12} /> {item.duration || '2h 15m'}
                    </motion.span>
                    <span className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 text-slate-600 px-3 py-1.5 rounded-xl shadow-sm font-medium">
                      <Film size={12} className="text-blue-500 shrink-0" /> {item.format || '2D / Dolby Cinema'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT LAYOUT SHELL PANELS[cite: 11] --- */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-14 sm:pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2 space-y-10">
          
          {/* Listing Deck Card */}
          <div className="space-y-4 p-6 rounded-3xl bg-white border border-slate-200/60 hover:border-blue-500/10 hover:shadow-xl transition-all duration-300 shadow-[0_10px_35px_-15px_rgba(59,130,246,0.08)]">
            <h3 className="text-xl font-black tracking-tight text-[#111827] relative pb-1">About the listing</h3>
            <p className="text-sm leading-relaxed font-medium text-slate-500 font-sans">
              {item.description || "No description available for this listing yet."}
            </p>
          </div>

          {/* Cast Profile Row Array Layout */}
          <div className="space-y-4 p-6 rounded-3xl bg-white border border-slate-200/60 hover:border-blue-500/10 hover:shadow-xl transition-all duration-300 shadow-[0_10px_35px_-15px_rgba(59,130,246,0.08)]">
            <h3 className="text-xl font-black tracking-tight text-[#111827]">Top Performance Profiles (Cast)</h3>
            {item.cast && item.cast.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.cast.map((actor, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="flex items-center gap-3 border border-slate-100 bg-white hover:border-amber-500/20 p-3.5 rounded-2xl shadow-sm transition-all duration-300 will-change-transform"
                  >
                    {actor.img && (
                      <img src={actor.img} alt="" loading="lazy" className="w-12 h-12 rounded-xl object-cover shrink-0 border-2 border-slate-50 shadow-sm object-center" />
                    )}
                    <div className="truncate">
                      <p className="text-xs font-black truncate text-[#111827] hover:text-amber-500 transition-colors duration-200">{actor.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-bold tracking-wide uppercase mt-0.5">{actor.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-mono font-bold select-none">Cast information coming soon.</p>
            )}
          </div>

          {/* Experience Grid Block Container */}
          <div className="space-y-4 p-6 rounded-3xl bg-white border border-slate-200/60 hover:border-blue-500/10 hover:shadow-xl transition-all duration-300 shadow-[0_10px_35px_-15px_rgba(59,130,246,0.08)]">
            <h3 className="text-xl font-black tracking-tight text-[#111827]">About the Experience</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium font-sans leading-relaxed">
              Enjoy this title at any of our partner theatres listed below, with premium seating and audio formats.
            </p>
          </div>
        </div>

        {/* Dynamic Booking Control Context Panel — SaaS Right Matrix Alignment[cite: 11] */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl sticky top-24 bg-white border border-slate-200/70 shadow-[0_30px_70px_-25px_rgba(59,130,246,0.18)] hover:shadow-[0_30px_70px_-20px_rgba(59,130,246,0.25)] transition-shadow duration-300">
            <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-[#111827] select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-live-pulse" />
              Show Availability Timings
            </h4>

            {showsLoading ? (
              <p className="text-xs text-slate-400 font-mono font-bold animate-pulse">Loading showtimes...</p>
            ) : Object.keys(showsByTheatre).length === 0 ? (
              <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl shadow-inner">
                <p className="text-xs font-black text-amber-800 uppercase tracking-wide">No shows scheduled yet</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                  This title doesn't have any showtimes available right now. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="space-y-5 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
                {Object.entries(showsByTheatre).map(([theatreName, theatreShows]) => (
                  <div key={theatreName} className="space-y-2">
                    <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate select-none uppercase tracking-wider font-mono">
                      <MapPin size={11} className="text-blue-500 shrink-0" /> {theatreName}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {theatreShows.map((show) => (
                        <motion.button
                          whileHover={{ scale: 1.04, y: -1 }}
                          whileTap={{ scale: 0.96 }}
                          key={show._id}
                          onClick={() => navigate(`/booking/${item.id}/shows`)}
                          type="button"
                          className="px-3 py-2 text-[10px] font-black font-mono rounded-xl border cursor-pointer transition-all duration-200 bg-stone-50 border-stone-200/80 text-stone-600 hover:bg-gradient-to-r hover:from-stone-900 hover:to-stone-800 hover:text-white hover:border-transparent shadow-sm outline-none"
                        >
                          {new Date(show.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {show.showTime}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <h5 className="text-[10px] font-mono font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 select-none">
                <Award size={13} className="text-amber-500" /> Hub Promotional Offers
              </h5>
              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-1 transition-all hover:bg-blue-50 group cursor-pointer">
                <p className="font-black text-[11px] text-blue-700 flex items-center gap-1 uppercase tracking-wide">
                  <ShieldCheck size={12} className="group-hover:scale-110 transition-transform" /> Partner Privilege Banking
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed font-sans">Save up to ₹150 instantly using secure transactional checkouts.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {showTrailer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setShowTrailer(false)} />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl z-10"
            >
              <button
                onClick={() => setShowTrailer(false)}
                type="button"
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black transition-colors cursor-pointer z-20 outline-none"
              >
                <X size={15} />
              </button>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Movie Trailer Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}