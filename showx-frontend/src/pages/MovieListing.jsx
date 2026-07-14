// src/pages/MovieListing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Sparkles, LayoutGrid, SearchX } from 'lucide-react';
import MovieCard from '../components/molecules/MovieCard';
import { useTheme } from '../context/ThemeContext';
import { MovieCardSkeleton } from '../components/atoms/Skeletons';
import { fetchAllMovies } from '../services/api';

// Fixed genre categories — matches the standardized values set by migrateGenres.js
const FIXED_GENRES = [
  'Action', 'Comedy', 'Drama', 'Thriller', 'Horror',
  'Romance', 'Sci-Fi', 'Animation', 'Family', 'Sports',
  'Adventure', 'Crime', 'War',
];

export default function MovieListing() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [allMovies, setAllMovies] = useState([]);
  const [showAllGenres, setShowAllGenres] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchAllMovies(searchQuery)
      .then((data) => setAllMovies(data))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  // Only show genre chips that actually have at least one movie
  const activeGenres = FIXED_GENRES.filter((g) =>
    allMovies.some((m) => Array.isArray(m.genre) && m.genre.includes(g))
  );
  const genres = ['All', ...activeGenres];
  const visibleGenres = showAllGenres ? genres : genres.slice(0, 9);

  const filteredMovies = selectedGenre === 'All'
    ? allMovies
    : allMovies.filter((m) => Array.isArray(m.genre) && m.genre.includes(selectedGenre));

  return (
    <div className="space-y-6 md:space-y-10 px-1 sm:px-0">
      
      {/* OTT Cinematic Headline Intro Banner — Added padding scales relative to viewports */}
      <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border p-5 sm:p-8 md:p-12 transition-all duration-300 ${
        isDarkMode 
          ? "bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent border-white/[0.04]" 
          : "bg-gradient-to-r from-slate-100 via-slate-50 to-transparent border-slate-200"
      }`}>
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop')` }} />
        <div className="max-w-xl space-y-3 sm:space-y-4 relative z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-crimson/10 text-crimson text-[9px] sm:text-[10px] font-black tracking-widest uppercase rounded-lg border border-crimson/20 w-fit">
            <Flame size={11} /> Live Box Office Catalog
          </div>
          <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {searchQuery ? (
              <>Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">"{searchQuery}"</span></>
            ) : (
              <>Discover Your Next<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300 block sm:inline sm:ml-2">Cinematic Tour</span></>
            )}
          </h1>
          <p className={`text-[11px] sm:text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Reserve active multiplex seats instantly. Access high-resolution theater grids across all premium formats including IMAX, Dolby Atmos, and 4K Spatial Sound clusters.
          </p>
        </div>
      </div>

      {/* Chips Filter Matrix — Optimized grid columns toggle with responsive scroll behaviors */}
      <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 sm:pb-6 transition-colors duration-300 ${isDarkMode ? "border-white/[0.04]" : "border-slate-200"}`}>
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1.5 md:pb-0 flex items-center gap-2">
         {visibleGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => {
                if (genre === 'All' && searchQuery) {
                  navigate('/movies');
                } else {
                  setSelectedGenre(genre);
                }
              }}
              className={`px-3.5 py-2 text-[11px] sm:text-xs font-black rounded-xl transition-all duration-300 border cursor-pointer shrink-0 ${
                selectedGenre === genre
                  ? "bg-amber-500 text-slate-950 border-transparent shadow-[0_4px_15px_rgba(244,197,66,0.25)]"
                  : isDarkMode
                    ? "bg-white/[0.02] text-slate-400 border-white/[0.05] hover:border-white/20 hover:text-white"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {genre}
            </button>
          ))}
          {genres.length > 9 && (
            <button
              onClick={() => setShowAllGenres((prev) => !prev)}
              className={`px-3.5 py-2 text-[11px] sm:text-xs font-black rounded-xl transition-all duration-300 border cursor-pointer shrink-0 ${
                isDarkMode
                  ? "bg-white/[0.02] text-amber-500 border-white/[0.05] hover:border-white/20"
                  : "bg-slate-100 text-amber-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              {showAllGenres ? 'Show Less' : `+${genres.length - 9} More`}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-500 font-mono shrink-0">
          <LayoutGrid size={13} className="text-amber-500" />
          <span>Showing {filteredMovies.length} Active Nodes</span>
        </div>
      </div>

      {/* Grid Canvas — Upgraded to strict grid-cols-2 on mobile devices and keeping original configurations on desktop */}
      <div>
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Sparkles size={15} className="text-amber-500" />
          <h2 className={`text-base sm:text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {searchQuery ? 'Search Results' : 'Curated Showtimes Right Now'}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <MovieCardSkeleton key={idx} />
            ))
          ) : filteredMovies.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <SearchX size={36} className="text-slate-400 mb-3" />
              <p className={`text-sm font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                No movies found{searchQuery ? ` for "${searchQuery}"` : ''}
              </p>
              <p className="text-xs text-slate-500 mt-1">Try a different search term or browse all movies.</p>
            </div>
          ) : (
            filteredMovies.map((movie) => (
              <motion.div key={movie.id} layout>
                <MovieCard 
                  movie={movie} 
                  onActionClick={() => navigate(`/booking/${movie.id}/shows`)} 
                  actionLabel="Reserve Seats"
                />
              </motion.div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}