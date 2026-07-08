import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import MovieCard from '../components/molecules/MovieCard';
import { MovieCardSkeleton } from '../components/atoms/Skeletons';
import { useTheme } from '../context/ThemeContext';
import { fetchAllMovies } from '../services/api';

export default function Releases() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllMovies()
      .then((data) => {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMovies(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-amber-500" />
        <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          New & Trending Releases
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => <MovieCardSkeleton key={idx} />)
        ) : (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onActionClick={() => navigate(`/booking/${movie.id}/shows`)}
              actionLabel="Buy Tickets"
            />
          ))
        )}
      </div>
    </div>
  );
}