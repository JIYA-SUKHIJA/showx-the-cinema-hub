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

const THEATRE_BG_IMAGES = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop",
];

const scrollRevealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
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
      setMovies(moviesData.slice(0, 4));
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

  return (
    <div className="space-y-8 md:space-y-12 pb-16 relative px-1 sm:px-0">
      
      {/* MAIN CAROUSEL BANNER LAYER — Fully fluid height adjustments mapped for layout breakpoints */}
      {loading || carouselBanners.length === 0 ? (
        <HomeHeroSkeleton />
      ) : (
        <div 
          className="relative w-full h-[360px] sm:h-[420px] md:h-[560px] rounded-2xl sm:rounded-[32px] overflow-hidden group shadow-2xl border border-white/5 bg-[#0b0c10]"
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
                src={carouselBanners[currentSlide].image} 
                alt={carouselBanners[currentSlide].title}
                style={{ objectPosition: `center ${carouselBanners[currentSlide].heroFocusY}` }}
                className="w-full h-full object-cover select-none animate-ken-burns"
              />
              
              <div className={`absolute inset-0 z-10 bg-gradient-to-t ${isDarkMode ? "from-slate-950 via-slate-950/60 to-transparent" : "from-stone-950 via-stone-950/50 to-transparent"}`} />
              <div className={`absolute inset-0 z-10 bg-gradient-to-r ${isDarkMode ? "from-slate-950 via-slate-950/60 to-transparent" : "from-stone-950 via-stone-950/50 to-transparent"}`} />
              
              {/* Content Panel Box: Shifted padding configurations relative to viewport coordinates */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end px-4 sm:px-12 md:px-16 pb-8 sm:pb-12 md:pb-16 max-w-3xl text-white">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mb-3 sm:mb-4">
                  <span className="inline-block px-2 py-0.5 text-[8px] sm:text-[9px] font-black tracking-widest bg-amber-500 text-stone-950 rounded-md uppercase shadow-md shadow-amber-500/10">
                    {carouselBanners[currentSlide].badge}
                  </span>
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-amber-500/30 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold tracking-wide text-amber-400 shadow-sm">
                    <Star size={9} className="fill-amber-400 stroke-amber-400" />
                    <span>{carouselBanners[currentSlide].rating}</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-medium text-slate-300 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/5">
                    {carouselBanners[currentSlide].duration}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-300 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/5">
                    <Calendar size={10} className="text-amber-500" />
                    <span>{carouselBanners[currentSlide].date}</span>
                  </div>
                </div>

                <div className="space-y-0.5 sm:space-y-1 mb-2">
                  <p className="text-[10px] sm:text-xs font-mono tracking-widest font-bold text-amber-400 uppercase">
                    {carouselBanners[currentSlide].subtitle}
                  </p>
                  <h2 className="text-xl sm:text-3xl md:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-md">
                    {carouselBanners[currentSlide].title}
                  </h2>
                </div>

                <p className="text-[10px] sm:text-xs font-semibold text-amber-500/90 tracking-wide uppercase mb-1">
                  {carouselBanners[currentSlide].category}
                </p>

                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-300/90 mb-4 sm:mb-6">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate max-w-[240px] sm:max-w-none">{carouselBanners[currentSlide].location}</span>
                </div>
                
                <div className="flex flex-wrap gap-3.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(carouselBanners[currentSlide].link)}
                    className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-xs font-black bg-amber-500 text-stone-950 shadow-lg cursor-pointer flex items-center gap-2 border-none"
                  >
                    <Ticket size={14} /> Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-slate-950/80 cursor-pointer hidden md:block"><ChevronLeft size={18} /></button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-slate-950/80 cursor-pointer hidden md:block"><ChevronRight size={18} /></button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2.5 items-center">
            {carouselBanners.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all cursor-pointer border-none ${currentSlide === idx ? "w-8 bg-amber-500" : "w-2 bg-white/40 hover:bg-white/70"}`} />
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDED MOVIES SECTION — 2 Cards per row forced matrix on absolute mobile ports */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="space-y-4 md:space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-black font-display tracking-tight flex items-center gap-2">
            <Flame size={18} className="text-amber-500" /> Recommended Movies
          </h2>
          <button onClick={() => navigate('/movies')} className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer focus:outline-none">View All</button>
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

      {/* THEATRES SECTION — Automatically switches to stack orientation layout on mobile screens */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollRevealVariants}
        className="space-y-4 md:space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-2xl font-black font-display tracking-tight flex items-center gap-2">
            <Building size={18} className="text-amber-500" /> Book at Your Favorite Theatres
          </h2>
          <button onClick={() => navigate('/theatres')} className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer focus:outline-none">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {loading ? (
            Array.from({ length: 2 }).map((_, idx) => <MovieCardSkeleton key={idx} />)
          ) : (
            theatres.map((t, idx) => (
             <button
                key={t._id}
                onClick={() => navigate(`/theatres?theatreId=${t._id}`)}
                className="relative text-left rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] group h-44 sm:h-52 shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                <img
                  src={THEATRE_BG_IMAGES[idx % THEATRE_BG_IMAGES.length]}
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.04]"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 group-hover:opacity-90 ${isDarkMode ? "bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-slate-950/30" : "bg-gradient-to-t from-stone-950/90 via-stone-950/60 to-stone-950/20"}`} />
                <div className="absolute inset-0 bg-amber-500/5 mix-blend-overlay" />

                <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 transition-transform duration-300 group-hover:translate-y-[-2px]">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/15 backdrop-blur-md border border-amber-500/30 flex items-center justify-center mb-2 sm:mb-3 shadow-md">
                    <Building size={16} className="text-amber-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white drop-shadow-sm truncate">{t.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5 flex items-center gap-1 opacity-90 truncate">
                    <MapPin size={11} className="text-amber-400" /> {t.location}, {t.city}
                  </p>
                  <p className="text-[10px] sm:text-xs text-amber-400 font-bold mt-1.5 tracking-wide font-mono truncate">
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