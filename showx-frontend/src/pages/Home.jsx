// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star, Flame, Tv, Sparkles, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchItemsByType } from '../services/api';
import MovieCard from '../components/molecules/MovieCard';

export default function Home() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Carousel State Controllers
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Content Mappings
  const [movies, setMovies] = useState([]);
  const [streams, setStreams] = useState([]);
  const [events, setEvents] = useState([]);

  // --- PREMIUM BANNER DATA LAYERS ---
  const carouselBanners = [
    {
      id: "b1",
      title: "Jasmine Sandlas Live",
      subtitle: "THE DREAM TOUR INDIA",
      info: "Delhi // 11th July • Live Music Concert Tour",
      image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1600&auto=format&fit=crop",
      badge: "SELLING FAST",
      link: "/events/e1"
    },
    {
      id: "b2",
      title: "Interstellar Odyssey",
      subtitle: "NOW STREAMING ON-DEMAND",
      info: "Experience Nolan's masterpiece in 4K Dolby Vision at Home",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
      badge: "PREMIERE",
      link: "/stream/s1"
    },
    {
      id: "b3",
      title: "Flat 5% Extra Cashback",
      subtitle: "POP × YES BANK CREDIT CARD",
      info: "Lifetime Free • ₹0 Joining Fees // Get up to ₹100 back instantly",
      image: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=1600&auto=format&fit=crop",
      badge: "BANK OFFER",
      link: "/settings"
    }
  ];

  // Fetch dashboard matrix rows upon mounting
  useEffect(() => {
    fetchItemsByType('movie').then(data => setMovies(data.slice(0, 4)));
    fetchItemsByType('stream').then(data => setStreams(data.slice(0, 4)));
    fetchItemsByType('events').then(data => setEvents(data.slice(0, 4)));
  }, []);

  // Autoplay slider logic loop matching video behavior
  useEffect(() => {
    if (!autoplay) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselBanners.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [autoplay, carouselBanners.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % carouselBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + carouselBanners.length) % carouselBanners.length);
  };

  return (
    <div className="space-y-12 pb-16 relative">
      
      {/* --- HERO IMAGE CAROUSEL COMPONENT OVERLAY (Matches Video Grid) --- */}
      <div 
        className="relative w-full h-[320px] md:h-[420px] rounded-[32px] overflow-hidden group shadow-xl border border-transparent"
        onMouseEnter={() => setAutoplay(false)}
        onMouseLeave={() => setAutoplay(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Ambient Image asset cover */}
            <img 
              src={carouselBanners[currentSlide].image} 
              alt={carouselBanners[currentSlide].title}
              className="w-full h-full object-cover select-none"
            />
            {/* Cinematic Gradients mapping across active modes */}
            <div className={`absolute inset-0 z-10 bg-gradient-to-r ${
              isDarkMode 
                ? "from-slate-950 via-slate-950/70 to-transparent" 
                : "from-stone-900/90 via-stone-900/40 to-transparent"
            }`} />
            
            {/* Dynamic Slider text payloads */}
            <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-8 md:px-16 max-w-xl space-y-4 text-white">
              <span className="inline-block w-fit px-2.5 py-0.5 text-[9px] font-black tracking-widest bg-amber-500 text-stone-950 rounded-md">
                {carouselBanners[currentSlide].badge}
              </span>
              <div className="space-y-1">
                <p className="text-xs md:text-sm font-mono tracking-widest font-bold text-amber-400 uppercase">
                  {carouselBanners[currentSlide].subtitle}
                </p>
                <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight leading-tight drop-shadow-sm">
                  {carouselBanners[currentSlide].title}
                </h2>
              </div>
              <p className="text-xs md:text-sm font-medium text-slate-300/90 line-clamp-2">
                {carouselBanners[currentSlide].info}
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => navigate(carouselBanners[currentSlide].link)}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-white text-stone-950 hover:bg-amber-500 transition-colors shadow-lg cursor-pointer flex items-center gap-1.5 border-none"
                >
                  <Play size={12} className="fill-current" /> Explore Hub
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual Left/Right Utility Triggers */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-xl bg-slate-950/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-slate-950/80 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-xl bg-slate-950/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:bg-slate-950/80 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>

        {/* Carousel tracking index dots deck (Matches Video bottom section) */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {carouselBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer border-none ${
                currentSlide === idx ? "w-6 bg-amber-500" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- SECTION 1: MOVIES LISTING GRID ROW --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight flex items-center gap-2">
            <Flame size={20} className="text-amber-500" /> Recommended Movies
          </h2>
          <button onClick={() => navigate('/movies')} className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map(item => (
            <MovieCard 
              key={item.id} 
              movie={item} 
              onActionClick={() => navigate(`/booking/${item.id}/shows`)} 
            />
          ))}
        </div>
      </div>

      {/* --- SECTION 2: DIGITAL STREAMS HUB --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight flex items-center gap-2">
            <Tv size={20} className="text-amber-500" /> Showx Stream Library
          </h2>
          <button onClick={() => navigate('/stream')} className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {streams.map(item => (
            <MovieCard 
              key={item.id} 
              movie={item} 
              onActionClick={() => navigate(`/stream/${item.id}`)} 
              actionLabel="Rent Stream"
            />
          ))}
        </div>
      </div>

      {/* --- SECTION 3: LIVE EVENTS & CONCERTS --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" /> Live Concerts & Events
          </h2>
          <button onClick={() => navigate('/events')} className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map(item => (
            <MovieCard 
              key={item.id} 
              movie={item} 
              onActionClick={() => navigate(`/events/${item.id}`)} 
              actionLabel="Book Passes"
            />
          ))}
        </div>
      </div>

    </div>
  );
}