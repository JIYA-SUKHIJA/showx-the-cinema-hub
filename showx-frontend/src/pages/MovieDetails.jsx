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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 pb-16 relative text-[#111827] bg-gradient-to-b from-white via-[#f4f9ff] to-[#eef5fc] min-h-screen"
    >

      {/* --- LUMINOUS HERO BANNER (single background, content floats directly on it) --- */}
      <div className="relative w-full h-[480px] sm:h-[520px] rounded-[32px] overflow-hidden bg-slate-100 shadow-[0_20px_60px_-15px_rgba(59,130,246,0.25)]">
        <div className="absolute inset-0 z-0">
        <img src={optimizeImage(posterUrl, 1200)} alt="" className="w-full h-full object-cover object-center scale-105 brightness-110 saturate-[1.05]" />
        </div>
        {/* single light transparent overlay for a bright, airy hero */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-white/5 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/10 to-transparent z-10" />

        <div className="absolute top-6 right-6 z-30 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-3 bg-white/70 backdrop-blur-xl hover:bg-white border border-white/60 rounded-xl transition-all text-[#111827] cursor-pointer shadow-md"
          >
            <Heart size={15} className={isWishlisted ? "fill-rose-500 stroke-rose-500 text-rose-500" : ""} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="p-3 bg-white/70 backdrop-blur-xl hover:bg-white border border-white/60 rounded-xl transition-all text-[#111827] cursor-pointer shadow-md"
          >
            <Share2 size={15} />
          </motion.button>
        </div>

        {/* --- FLOATING GLASSMORPHISM CONTENT sits directly on the hero, poster overlaps the bottom edge --- */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-10">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8 md:gap-10 items-center md:items-end">

            <motion.div
              whileHover={{ scale: 1.03, rotate: -0.5 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className="w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_45px_-10px_rgba(0,0,0,0.3)] border-4 border-white shrink-0 bg-slate-100 translate-y-1/4"
            >
             <img src={optimizeImage(posterUrl)} alt={itemTitle} className="w-full h-full object-cover" />
            </motion.div>

            <div
              className="flex-grow w-full md:w-auto h-auto space-y-3 text-center md:text-left px-6 py-4 sm:px-8 sm:py-5 rounded-[24px] mb-0"
              style={{
                background: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 25px 70px -20px rgba(59,130,246,0.3)',
              }}
            >
              <span className="inline-block px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-[#111827] text-white rounded-md shadow-sm">
                {item.tag || item.type}
              </span>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-[#111827]">
                {itemTitle}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-bold">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  <Star size={14} className="fill-amber-500 text-amber-500" /> {item.rating || '8.0'} / 10 Interest Metric
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  {item.genre}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                >
                  {item.language || 'Hindi'}
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs font-semibold">
                {item.venue ? (
                  <>
                    <span className="flex items-center gap-1 bg-white/80 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl shadow-sm">
                      <MapPin size={13} className="text-blue-500" /> {item.venue}
                    </span>
                    <span className="flex items-center gap-1 bg-white/80 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl shadow-sm">
                      <Calendar size={13} className="text-blue-500" /> {item.date}
                    </span>
                  </>
                ) : (
                  <>
                    <motion.span
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
                    >
                      <Clock size={13} /> {item.duration || '2h 15m'}
                    </motion.span>
                    <span className="flex items-center gap-1 bg-white/80 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl shadow-sm">
                      <Film size={13} className="text-blue-500" /> {item.format || '2D / Dolby Cinema'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT LAYOUT SHELL PANELS --- */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-14 sm:pt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4 p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_40px_-15px_rgba(59,130,246,0.15)]">
            <h3 className="text-xl font-black tracking-tight text-[#111827]">About the listing</h3>
            <p className="text-sm leading-relaxed font-medium text-slate-600">
              {item.description || "No description available for this listing yet."}
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_40px_-15px_rgba(59,130,246,0.15)]">
            <h3 className="text-xl font-black tracking-tight text-[#111827]">Top Performance Profiles (Cast)</h3>
            {item.cast && item.cast.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.cast.map((actor, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="flex items-center gap-3 border border-slate-200 bg-white p-3 rounded-2xl shadow-sm transition-all"
                  >
                    {actor.img && (
                      <img src={actor.img} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border-2 border-blue-100" />
                    )}
                    <div className="truncate">
                      <p className="text-xs font-black truncate text-[#111827]">{actor.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold tracking-wide">{actor.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium">Cast information coming soon.</p>
            )}
          </div>

          <div className="space-y-4 p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_40px_-15px_rgba(59,130,246,0.15)]">
            <h3 className="text-xl font-black tracking-tight text-[#111827]">About the Experience</h3>
            <p className="text-xs text-slate-500 font-medium">
              Enjoy this title at any of our partner theatres listed below, with premium seating and audio formats.
            </p>
          </div>
        </div>

        {/* Dynamic Booking Control Context Panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl sticky top-24 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_25px_60px_-20px_rgba(59,130,246,0.25)]">
            <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-4 text-[#111827]">
              <Calendar size={15} className="text-blue-500" /> Show Availability Timings
            </h4>

            {showsLoading ? (
              <p className="text-xs text-slate-500 font-medium">Loading showtimes...</p>
            ) : Object.keys(showsByTheatre).length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs font-bold text-amber-700">No shows scheduled yet</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  This title doesn't have any showtimes available right now. Please check back soon.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(showsByTheatre).map(([theatreName, theatreShows]) => (
                  <div key={theatreName} className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1 truncate">
                      <MapPin size={11} className="text-blue-500 shrink-0" /> {theatreName}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {theatreShows.map((show) => (
                        <motion.button
                          whileHover={{ scale: 1.06, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          key={show._id}
                          onClick={() => navigate(`/booking/${item.id}/shows`)}
                          className="px-3 py-2 text-[10px] font-bold font-mono rounded-lg border cursor-pointer transition-colors bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 shadow-sm"
                        >
                          {new Date(show.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • {show.showTime}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Award size={13} className="text-amber-500" /> Hub Promotional Offers
              </h5>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <p className="font-black text-[11px] text-blue-700 flex items-center gap-1">
                  <ShieldCheck size={12} /> Partner Privilege Banking
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Save up to ₹150 instantly using secure transactional checkouts.</p>
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl z-10"
            >
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black transition-colors cursor-pointer z-20"
              >
                <X size={16} />
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