// src/pages/MovieListing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Sparkles, LayoutGrid, SearchX } from 'lucide-react';
import MovieCard from '../components/molecules/MovieCard';
import { useTheme } from '../context/ThemeContext';
import { MovieCardSkeleton } from '../components/atoms/Skeletons';
import { fetchAllMovies } from '../services/api';

export default function MovieListing() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [allMovies, setAllMovies] = useState([]);

  // Re-fetch whenever the ?search= query param in the URL changes —
  // this is what actually connects the search bar to this page.
  useEffect(() => {
    setLoading(true);
    fetchAllMovies(searchQuery)
      .then((data) => setAllMovies(data))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const genres = ['All', ...Array.from(new Set(allMovies.map((m) => m.genre).filter(Boolean)))];
  const filteredMovies = selectedGenre === 'All' 
    ? allMovies 
    : allMovies.filter(m => m.genre === selectedGenre);

  return (
    <div className="space-y-10">
      
      {/* OTT Cinematic Headline Intro Banner */}
      <div className={`relative rounded-3xl overflow-hidden border p-8 md:p-12 transition-all duration-300 ${
        isDarkMode 
          ? "bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent border-white/[0.04]" 
          : "bg-gradient-to-r from-slate-100 via-slate-50 to-transparent border-slate-200"
      }`}>
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop')` }} />
        <div className="max-w-xl space-y-4 relative z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-crimson/10 text-crimson text-[10px] font-black tracking-widest uppercase rounded-lg border border-crimson/20 w-fit">
            <Flame size={12} /> Live Box Office Catalog
          </div>
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {searchQuery ? (
              <>Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">"{searchQuery}"</span></>
            ) : (
              <>Discover Your Next<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">Cinematic Tour</span></>
            )}
          </h1>
          <p className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Reserve active multiplex seats instantly. Access high-resolution theater grids across all premium formats including IMAX, Dolby Atmos, and 4K Spatial Sound clusters.
          </p>
        </div>
      </div>

      {/* Chips Filter Matrix */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 transition-colors duration-300 ${isDarkMode ? "border-white/[0.04]" : "border-slate-200"}`}>
        <div className="flex flex-wrap items-center gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all duration-300 border cursor-pointer ${
                selectedGenre === genre
                  ? "bg-gold text-slate-950 border-transparent shadow-[0_4px_15px_rgba(244,197,66,0.25)]"
                  : isDarkMode
                    ? "bg-white/[0.02] text-slate-400 border-white/[0.05] hover:border-white/20 hover:text-white"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono">
          <LayoutGrid size={14} className="text-gold" />
          <span>Showing {filteredMovies.length} Active Nodes</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={16} className="text-gold" />
          <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            {searchQuery ? 'Search Results' : 'Curated Showtimes Right Now'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <MovieCardSkeleton key={idx} />
            ))
          ) : filteredMovies.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <SearchX size={40} className="text-slate-400 mb-3" />
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