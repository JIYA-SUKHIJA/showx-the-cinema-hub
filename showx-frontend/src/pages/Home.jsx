// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Flame, Building, Ticket, MapPin, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchItemsByType } from '../services/api';
import axiosInstance from '../services/axiosInstance';
import MovieCard from '../components/molecules/MovieCard';
import { HomeHeroSkeleton, MovieCardSkeleton } from '../components/atoms/Skeletons';
import { optimizeImage } from '../utils/optimizeImage';

const THEATRE_BG_IMAGES = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop",
];

// Trending movies we want prioritized at the top of the homepage carousel.
// Titles must match exactly (case-sensitive) with what's stored in the database.
const TRENDING_TITLES = ["Dhamaal 4", "Housefull 4", "Alpha"];

const scrollRevealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
};

export default function Home() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);

  const carouselBanners = movies.slice(0, 3).map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: "NOW BOOKING IN THEATERS",
    category: `${m.genre || 'Movie'} • ${m.language || ''}`.trim(),
    duration: m.duration || '—',
    rating: m.rating || '—',
    location: "Available across Showx partner theatres",
    date: "In Cinemas Now",
    image: m.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop",
    heroFocusY: m.heroFocusY || 'center',
    badge: m.tag || "NOW SHOWING",
    link: `/movies/${m.id}`,
    trailerLink: "#"
  }));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchItemsByType('movie'),
      axiosInstance.get('/theatres')
    ]).then(([moviesData, theatresRes]) => {
      // Prioritize trending movies at the top of the carousel / recommended list
      const trending = moviesData.filter((m) => TRENDING_TITLES.includes(m.title));
      const rest = moviesData.filter((m) => !TRENDING_TITLES.includes(m.title));
      const orderedMovies = [...trending, ...rest];

      setMovies(orderedMovies.slice(0, 4));
      setTheatres(theatresRes.data.theatres.slice(0, 3));
      setTimeout(() => setLoading(false), 550);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!autoplay || loading || carouselBanners.length === 0) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselBanners.length);
    }, 6000); 
    return () => clearInterval(slideTimer);
  }, [autoplay, carouselBanners.length, loading]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % carouselBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + carouselBanners.length) % carouselBanners.length);
  };

  // Pure hardware-accelerated CSS animations and effects config block
  const premiumLandingStyles = `
    @keyframes slowKenBurns {
      0% { transform: scale(1); }
      50% { transform: scale(1.04); }
      100% { transform: scale(1); }
    }
    .animate-cinematic-burns {
      animation: slowKenBurns 24s ease-in-out infinite;
      will-change: transform;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .premium-header-line::after {
      content: '';
      display: block;
      width: 24px;
      height: 3px;
      background: #F59E0B;
      border-radius: 99px;
      margin-top: 4px;
      transition: width 0.3s ease;
    }
    .group:hover .premium-header-line::after {
      width: 48px;
    }
  `;

  return (
    <div className="space-y-8 md:space-y-12 pb-16 relative px-1 sm:px-0">
      <style>{premiumLandingStyles}</style>
      
      {/* MAIN CAROUSEL BANNER LAYER — Enhanced with cinematic masks and Ken burns effects */}
      {loading || carouselBanners.length === 0 ? (
        <HomeHeroSkeleton />
      ) : (
        <div 
          className="relative w-full h-[360px] sm:h-[420px] md:h-[560px] rounded-2xl sm:rounded-[32px] overflow-hidden group shadow-2xl transition-all duration-300 border border-white/5 bg-[#0b0c10]"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full overflow-hidden"
            >
              <img 
                src={optimizeImage(carouselBanners[currentSlide].image, { width: 1400 })} 
                alt={carouselBanners[currentSlide].title}
                loading="eager"
                fetchpriority="high"
                decoding="async"
                style={{ objectPosition: `center ${carouselBanners[currentSlide].heroFocusY}` }}
                className="w-full h-full object-cover select-none brightness-[0.88] animate-cinematic-burns transition-all duration-700 object-center"
              />
              
              <div className={`absolute inset-0 z-10 bg-gradient-to-t ${isDarkMode ? "from-slate-950 via-slate-950/70 to-transparent" : "from-stone-950 via-stone-950/60 to-transparent"}`} />
              <div className={`absolute inset-0 z-10 bg-gradient-to-r ${isDarkMode ? "from-slate-950 via-slate-950/50 to-transparent" : "from-stone-950 via-stone-950/40 to-transparent"}`} />
              
              {/* Content Panel Box */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 sm:px-12 md:px-16 pb-8 sm:pb-12 md:pb-16 max-w-3xl text-white">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mb-3 sm:mb-4">
                  <span className="inline-block px-2 py-0.5 text-[8px] sm:text-[9px] font-black tracking-widest bg-amber-500 text-stone-950 rounded-md uppercase shadow-md shadow-amber-500/10 transform transition-transform group-hover:scale-105">
                    {carouselBanners[currentSlide].badge}
                  </span>
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-amber-500/30 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold tracking-wide text-amber-400 shadow-sm">
                    <Star size={9} className="fill-amber-400 stroke-amber-400 animate-pulse" />
                    <span>{carouselBanners[currentSlide].rating}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium text-slate-300 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/5">
                    {carouselBanners[currentSlide].duration}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-300 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/5">
                    <Calendar size={10} className="text-amber-500 shrink-0" />
                    <span>{carouselBanners[currentSlide].date}</span>
                  </div>
                </div>

                <div className="space-y-0.5 sm:space-y-1 mb-2">
                  <p className="text-[10px] sm:text-xs font-mono tracking-widest font-bold text-amber-400 uppercase">
                    {carouselBanners[currentSlide].subtitle}
                  </p>
                  <h2 className="text-xl sm:text-3xl md:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-md transition-colors duration-300">
                    {carouselBanners[currentSlide].title}
                  </h2>
                </div>

                <p className="text-[10px] sm:text-xs font-semibold text-amber-500/90 tracking-wide uppercase mb-1">
                  {carouselBanners[currentSlide].category}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-300/90 mb-4 sm:mb-6">
                  <MapPin size={12} className="text-amber-500 shrink-0 transform group-hover:scale-110 transition-transform" />
                  <span className="truncate max-w-[240px] sm:max-w-none">{carouselBanners[currentSlide].location}</span>
                </div>
                
                <div className="flex flex-wrap gap-3.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(carouselBanners[currentSlide].link)}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shadow-lg cursor-pointer flex items-center gap-2 border-none uppercase tracking-wider outline-none active:scale-95 transition-all duration-200"
                  >
                    <Ticket size={14} strokeWidth={2.5} /> Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:bg-slate-950/80 cursor-pointer hidden md:block outline-none"><ChevronLeft size={18} /></button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10 hover:bg-slate-950/80 cursor-pointer hidden md:block outline-none"><ChevronRight size={18} /></button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 items-center">
            {carouselBanners.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all cursor-pointer border-none outline-none ${currentSlide === idx ? "w-8 bg-amber-500" : "w-2 bg-white/40 hover:bg-white/70"}`} />
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDED MOVIES SECTION */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="space-y-4 md:space-y-6"
      >
        <div className="flex items-center justify-between group">
          <h2 className="text-lg md:text-2xl font-black font-display tracking-tight flex items-center gap-2 premium-header-line">
            <Flame size={18} className="text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} /> Recommended Movies
          </h2>
          <button onClick={() => navigate('/movies')} className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer focus:outline-none transition-all">View All</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => <MovieCardSkeleton key={idx} />)
          ) : (
            movies.map(item => (
              <MovieCard key={item.id} movie={item} onActionClick={() => navigate(`/booking/${item.id}/shows`)} />
            ))
          )}
        </div>
      </motion.div>

      {/* THEATRES SECTION — Polished card overlays and Ken Burns scaling */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="space-y-4 md:space-y-6"
      >
        <div className="flex items-center justify-between group">
          <h2 className="text-lg md:text-2xl font-black font-display tracking-tight flex items-center gap-2 premium-header-line">
            <Building size={18} className="text-amber-500" /> Book at Your Favorite Theatres
          </h2>
          <button onClick={() => navigate('/theatres')} className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer focus:outline-none transition-all">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {loading ? (
            Array.from({ length: 2 }).map((_, idx) => <MovieCardSkeleton key={idx} />)
          ) : (
            theatres.map((t, idx) => (
             <button
                key={t._id}
                onClick={() => navigate(`/theatres?theatreId=${t._id}`)}
                className={`relative text-left rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 h-44 sm:h-52 shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 transform hover:-translate-y-1 p-0 bg-transparent cursor-pointer will-change-transform ${
                  isDarkMode ? "border-white/[0.06] hover:border-amber-500/20" : "border-stone-200/80 hover:border-amber-500/30 shadow-stone-100"
                }`}
                >
                <img
                  src={THEATRE_BG_IMAGES[idx % THEATRE_BG_IMAGES.length]}
                  alt={t.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] scale-100 group-hover:scale-[1.05] brightness-[0.85] group-hover:brightness-95 object-center"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 group-hover:opacity-90 ${isDarkMode ? "bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-transparent" : "bg-gradient-to-t from-stone-950/90 via-stone-950/55 to-transparent"}`} />
                <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 transition-transform duration-300 group-hover:translate-y-[-2px]">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/15 backdrop-blur-md border border-amber-500/30 flex items-center justify-center mb-2 sm:mb-3 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                    <Building size={16} className="text-amber-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white drop-shadow-sm truncate group-hover:text-amber-400 transition-colors duration-200">{t.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 flex items-center gap-1 opacity-90 truncate font-sans font-medium">
                    <MapPin size={11} className="text-amber-500 shrink-0" /> {t.location}, {t.city}
                  </p>
                  <p className="text-[10px] sm:text-xs text-amber-400 font-bold mt-2 tracking-wider font-mono truncate uppercase opacity-95">
                    {(t.formats || []).join(' • ')}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>

    </div>
  );
}
