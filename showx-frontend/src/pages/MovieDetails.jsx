// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Calendar, MapPin, Film, Share2, Heart, Award, ShieldCheck, Play, ThumbsUp, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchItemById } from '../services/api';
import { MovieDetailsSkeleton } from '../components/atoms/Skeletons';

export default function MovieDetails() {
  const { movieId, streamId, eventId, playId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  const activeId = movieId || streamId || eventId || playId;

  const dateTabs = [
    { day: "FRI", num: "10", month: "Jul" },
    { day: "SAT", num: "11", month: "Jul" },
    { day: "SUN", num: "12", month: "Jul" },
    { day: "MON", num: "13", month: "Jul" }
  ];

  const sampleShowtimes = [
    {
      theater: "PVR Dolby Cinema: Centra Mall",
      sessions: ["10:30 AM", "01:45 PM", "04:30 PM", "08:00 PM"]
    },
    {
      theater: "Wave Cinemas: Elante Hub",
      sessions: ["11:00 AM", "02:30 PM", "06:15 PM", "09:30 PM"]
    }
  ];

  const sampleGallery = [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600",
    "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600"
  ];

  const sampleReviews = [
    { user: "Rahul Sharma", rating: "9", comment: "Absolute laugh riot! Non-stop entertainment from start to finish.", date: "2 days ago", likes: 342 },
    { user: "Priya Malik", rating: "8", comment: "Great action sequences and incredible nostalgia value with this cast.", date: "3 days ago", likes: 198 }
  ];

  useEffect(() => {
    if (activeId) {
      setLoading(true);
      fetchItemById(activeId).then((data) => {
        setItem(data);
        // Subtle timeout for luxury dark fluid transition timing feel
        setTimeout(() => setLoading(false), 550);
      }).catch(() => setLoading(false));
    }
  }, [activeId]);

  /* Replaced generic plain text layout block with beautiful shimmer skeleton */
  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (!item) return <div className="text-center p-20 text-slate-400">Briefing element node not found.</div>;

  const itemTitle = item.title || item.name || "Entertainment Listing";
  const posterUrl = item.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-12 pb-16 relative ${isDarkMode ? "text-white" : "text-slate-900"}`}
    >
      
      {/* --- CINEMATIC HERO BACKDROP BANNER --- */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] rounded-[32px] overflow-hidden bg-slate-950 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-30 filter blur-sm scale-105 pointer-events-none">
          <img src={posterUrl} alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />

        <div className="absolute top-6 right-6 z-20 flex gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 rounded-xl transition-all text-white cursor-pointer"
          >
            <Heart size={15} className={isWishlisted ? "fill-rose-500 stroke-rose-500 text-rose-500" : ""} />
          </motion.button>
          <button className="p-3 bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 rounded-xl transition-all text-white cursor-pointer active:scale-90">
            <Share2 size={15} />
          </button>
        </div>
      </div>

      {/* --- PROPORTIONAL DETAILS SUMMARY OVERLAY --- */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative -mt-48 sm:-mt-64 z-20 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-end">
        <div className="w-52 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-slate-900 group relative">
          <img src={posterUrl} alt={itemTitle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowTrailer(true)}
              className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 shadow-xl cursor-pointer transition-transform border-none outline-none"
            >
              <Play size={20} className="fill-current ml-1" />
            </motion.button>
          </div>
        </div>

        <div className="flex-grow space-y-4 text-center md:text-left text-white">
          <span className="inline-block px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-amber-500 text-stone-950 rounded-md shadow-md">
            {item.tag || item.type}
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-md">
            {itemTitle}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-amber-400">
              <Star size={14} className="fill-current" /> {item.rating || '8.0'} / 10 Interest Metric
            </div>
            <div className="text-slate-300 flex items-center gap-3 bg-black/30 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/5">
              <span>{item.genre}</span>
              <span className="opacity-30">•</span>
              <span>{item.language || 'Hindi'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-300">
            {item.venue ? (
              <>
                <span className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5"><MapPin size={13} className="text-amber-500" /> {item.venue}</span>
                <span className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5"><Calendar size={13} className="text-amber-500" /> {item.date}</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5"><Clock size={13} className="text-amber-500" /> {item.duration || '2h 15m'}</span>
                <span className="flex items-center gap-1 bg-black/30 px-3 py-1.5 rounded-xl border border-white/5"><Film size={13} className="text-amber-500" /> {item.format || '2D / Dolby Cinema'}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT LAYOUT SHELL PANELS --- */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">About the listing</h3>
            <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-stone-600"}`}>
              {item.description || "An elite team stumbles upon structural catalog layers, delivering a top cinematic workflow configuration tailored for premium performance matrices."}
            </p>
          </div>

          <hr className={isDarkMode ? "border-white/[0.05]" : "border-slate-100"} />

          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">Top Performance Profiles (Cast)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(item.cast || [
                { name: 'Akshay Kumar', role: 'Major Rajveer', img: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=150' },
                { name: 'Suniel Shetty', role: 'Anna', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150' }
              ]).map((actor, idx) => (
                <div key={idx} className={`flex items-center gap-3 border p-3 rounded-2xl shadow-sm ${
                  isDarkMode ? "bg-slate-900/40 border-white/[0.05]" : "bg-white border-slate-200"
                }`}>
                  <img src={actor.img} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border-2 border-amber-500/10" />
                  <div className="truncate">
                    <p className="text-xs font-black truncate">{actor.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold tracking-wide">{actor.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className={isDarkMode ? "border-white/[0.05]" : "border-slate-100"} />

          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">Official Media Gallery</h3>
            <div className="grid grid-cols-3 gap-3">
              {sampleGallery.map((url, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-white/5 group cursor-pointer">
                  <img src={url} alt="Scene preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </div>

          <hr className={isDarkMode ? "border-white/[0.05]" : "border-slate-100"} />

          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">Top Audience Reviews</h3>
            <div className="space-y-3">
              {sampleReviews.map((review, idx) => (
                <div key={idx} className={`p-5 rounded-xl border space-y-3 ${
                  isDarkMode ? "bg-slate-900/30 border-white/[0.04]" : "bg-white border-slate-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black">{review.user}</p>
                      <p className="text-[10px] text-slate-500">{review.date}</p>
                    </div>
                    <span className="text-[10px] font-black font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-0.5">
                      ★ {review.rating}/10
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{review.comment}</p>
                  <button className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer">
                    <ThumbsUp size={11} /> Helpful ({review.likes})
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Booking Control Context Panel */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border sticky top-24 shadow-xl ${
            isDarkMode ? "bg-slate-900 border-white/[0.06]" : "bg-white border-slate-200"
          }`}>
            <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-4">
              <Calendar size={15} className="text-amber-500" /> Show Availability Timings
            </h4>

            <div className="flex gap-2 justify-between mb-6">
              {dateTabs.map((tab, idx) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  onClick={() => setSelectedDate(idx)}
                  className={`flex flex-col items-center flex-1 p-2 rounded-xl border cursor-pointer transition-all ${
                    selectedDate === idx
                      ? "bg-amber-500 border-amber-500 text-stone-950 font-black"
                      : isDarkMode
                        ? "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20"
                        : "bg-stone-50 border-slate-200 text-slate-600 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-[9px] font-medium uppercase opacity-80">{tab.day}</span>
                  <span className="text-sm font-black my-0.5">{tab.num}</span>
                  <span className="text-[9px] font-medium opacity-80">{tab.month}</span>
                </motion.button>
              ))}
            </div>

            {item.type === 'stream' ? (
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <p className="text-xs font-bold text-amber-500">ShowX On-Demand Stream Access</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Rent once and unlock unlimited high definition rendering access streams inside personal dashboard portal spaces for 3 full calendar days.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, filter: "brightness(1.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/checkout')}
                  className="w-full text-center px-6 py-3 rounded-xl font-black text-xs bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/10 cursor-pointer border-none"
                >
                  Rent Stream Digital Asset
                </motion.button>
              </div>
            ) : (
              <div className="space-y-5">
                {sampleShowtimes.map((venue, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 truncate">
                      <MapPin size={11} className="text-amber-500 shrink-0" /> {venue.theater}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {venue.sessions.map((time, tIdx) => (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={tIdx}
                          onClick={() => navigate(`/booking/${item.id}/shows`)}
                          className={`px-3 py-2 text-[10px] font-bold font-mono rounded-lg border cursor-pointer transition-colors ${
                            isDarkMode
                              ? "bg-white/[0.02] border-white/10 text-slate-300 hover:bg-amber-500 hover:text-stone-950 hover:border-amber-500"
                              : "bg-stone-50 border-slate-200 text-slate-700 hover:bg-amber-500 hover:text-stone-950 hover:border-amber-500"
                          }`}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={`mt-6 pt-5 border-t space-y-3 ${isDarkMode ? "border-white/5" : "border-stone-100"}`}>
              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award size={13} className="text-amber-500" /> Hub Promotional Offers
              </h5>
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                <p className="font-black text-[11px] text-amber-500 flex items-center gap-1">
                  <ShieldCheck size={12} /> Partner Privilege Banking
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Save up to ₹150 instantly using secure transactional checkouts.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- LIGHTBOX CONTAINER FOR TRAILERS --- */}
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