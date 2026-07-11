// src/pages/Theatres.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building, MapPin, Clapperboard, ChevronLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../services/axiosInstance';

export default function Theatres() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const requestedTheatreId = searchParams.get('theatreId');

  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All');
  const showsSectionRef = useRef(null);

  useEffect(() => {
    axiosInstance.get('/theatres')
      .then((res) => setTheatres(res.data.theatres))
      .finally(() => setLoading(false));
  }, []);

  const openTheatre = async (theatre) => {
    setSelectedTheatre(theatre);
    setShowsLoading(true);
    try {
      const res = await axiosInstance.get(`/shows?theatreId=${theatre._id}`);
      setShows(res.data.shows);
    } finally {
      setShowsLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && requestedTheatreId && theatres.length > 0 && !selectedTheatre) {
      const match = theatres.find((t) => t._id === requestedTheatreId);
      if (match) {
        openTheatre(match);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, requestedTheatreId, theatres]);

  useEffect(() => {
    if (selectedTheatre && !requestedTheatreId && showsSectionRef.current) {
      showsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTheatre, requestedTheatreId]);

  const cities = ['All', ...Array.from(new Set(theatres.map((t) => t.city).filter(Boolean)))];

  const filteredTheatres = selectedCity === 'All'
    ? theatres
    : theatres.filter((t) => t.city === selectedCity);

  const isDeepLinkedView = Boolean(requestedTheatreId) && Boolean(selectedTheatre);

  // ===== Deep-linked view: show ONLY the shows for that theatre, no grid, no scroll jump =====
  if (isDeepLinkedView) {
    return (
      <div className="space-y-6 px-1 sm:px-0 w-full overflow-x-hidden">
        <button
          onClick={() => navigate('/theatres')}
          className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider cursor-pointer bg-transparent border-none focus:outline-none ${
            isDarkMode ? "text-slate-400 hover:text-amber-500" : "text-stone-500 hover:text-amber-700"
          }`}
        >
          <ChevronLeft size={14} /> All Theatres
        </button>

        <h2 className={`text-lg sm:text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Shows at {selectedTheatre.name}
        </h2>

        {showsLoading ? (
          <p className="text-sm text-slate-500 font-mono">Loading shows...</p>
        ) : shows.length === 0 ? (
          <p className="text-sm text-slate-500 font-mono">No shows scheduled at this theatre yet.</p>
        ) : (
          /* Stacking orientation updated to support extreme 320px width thresholds */
          <div className="space-y-3">
            {shows.map((s) => (
              <div key={s._id} className={`flex flex-col xs:flex-row xs:items-center justify-between p-4 rounded-xl border gap-4.5 ${isDarkMode ? "bg-slate-900/40 border-white/[0.06]" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <Clapperboard size={18} className="text-amber-500 shrink-0" />
                  <div className="min-w-0 flex-grow">
                    <p className={`text-sm font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{s.movie?.title}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{s.format} &bull; {s.showTime} &bull; ₹{s.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/booking/${s.movie?._id}/shows`)}
                  className="w-full xs:w-auto px-4 py-2.5 bg-amber-500 text-stone-950 text-xs font-black rounded-lg border-none cursor-pointer text-center select-none shrink-0 min-h-[38px] uppercase tracking-wide"
                >
                  Book Show
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ===== Normal view: full theatre grid + city filter =====
  return (
    <div className="space-y-6 md:space-y-8 px-1 sm:px-0 w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Our Theatres
        </h1>

        {/* City Filter Selection Rows — Enabled mobile horizontally fluid swipe parameters */}
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0 flex items-center gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                setSelectedTheatre(null);
              }}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all duration-300 border cursor-pointer shrink-0 ${
                selectedCity === city
                  ? "bg-amber-500 text-slate-950 border-transparent shadow-[0_4px_12px_rgba(245,158,11,0.2)]"
                  : isDarkMode
                    ? "bg-white/[0.02] text-slate-400 border-white/[0.05] hover:border-white/20 hover:text-white"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading || (requestedTheatreId && !selectedTheatre) ? (
        <p className="text-sm text-slate-500 font-mono">Loading theatres...</p>
      ) : theatres.length === 0 ? (
        <p className="text-sm text-slate-500 font-mono">No theatres found in {selectedCity}.</p>
      ) : (
        /* Grid container layout tracking system optimized with flexible layout dimensions */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-6">
          {filteredTheatres.map((t) => (
            <button
              key={t._id}
              onClick={() => openTheatre(t)}
              className={`text-left rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between h-full bg-transparent p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
                isDarkMode ? "bg-slate-900/40 border-white/[0.06] hover:border-amber-500/40" : "bg-white border-slate-200 hover:border-amber-500/40"
              }`}
            >
              <div className="w-full aspect-[16/9] bg-slate-800 overflow-hidden shrink-0 relative">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building size={24} className="text-amber-500" />
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className={`text-sm sm:text-base font-black tracking-tight line-clamp-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{t.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-medium line-clamp-2 leading-relaxed">
                    <MapPin size={11} className="text-amber-600 shrink-0" /> {t.location}{t.location?.includes(t.city) ? '' : `, ${t.city}`}
                  </p>
                </div>
                <p className="text-[10px] font-mono font-bold tracking-wider text-amber-500 mt-4 uppercase">
                  {(t.formats || []).join(' &bull; ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Shows section panel */}
      {selectedTheatre && !requestedTheatreId && (
        <div ref={showsSectionRef} className="space-y-4 scroll-mt-24 pt-4 w-full">
          <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Shows at {selectedTheatre.name}
          </h2>
          {showsLoading ? (
            <p className="text-sm text-slate-500 font-mono">Loading shows...</p>
          ) : shows.length === 0 ? (
            <p className="text-sm text-slate-500 font-mono">No shows scheduled at this theatre yet.</p>
          ) : (
            <div className="space-y-3">
              {shows.map((s) => (
                <div key={s._id} className={`flex flex-col xs:flex-row xs:items-center justify-between p-4 rounded-xl border gap-4.5 ${isDarkMode ? "bg-slate-900/40 border-white/[0.06]" : "bg-white border-slate-200"}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <Clapperboard size={18} className="text-amber-500 shrink-0" />
                    <div className="min-w-0 flex-grow">
                      <p className={`text-sm font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{s.movie?.title}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{s.format} &bull; {s.showTime} &bull; ₹{s.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/booking/${s.movie?._id}/shows`)}
                    className="w-full xs:w-auto px-4 py-2.5 bg-amber-500 text-stone-950 text-xs font-black rounded-lg border-none cursor-pointer text-center select-none shrink-0 min-h-[38px] uppercase tracking-wide"
                  >
                    Book Show
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}