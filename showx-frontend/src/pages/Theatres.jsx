// src/pages/Theatres.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building, MapPin, Clapperboard, ChevronLeft, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../services/axiosInstance';

export default function Theatres() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Read and write directly from the active global browser route query arrays
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTheatreId = searchParams.get('theatreId');
  
  // Dynamic sync map: read "city" query parameter from URL (sent by the navbar dropdown navigation setup)
  const cityParam = searchParams.get('city');

  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  
  // Sync selected local filter condition state automatically with navbar configuration
  const [selectedCity, setSelectedCity] = useState('All');
  const showsSectionRef = useRef(null);

  // Synchronise state dynamically whenever the global navbar dropdown alters the active browser location parameter
  useEffect(() => {
    if (cityParam) {
      setSelectedCity(cityParam);
    } else {
      setSelectedCity('All');
    }
    // Clear out active individual show panel selections to avoid grid structure alignment mismatch
    setSelectedTheatre(null);
  }, [cityParam]);

  useEffect(() => {
    axiosInstance.get('/theatres')
      .then((res) => setTheatres(res.data.theatres || res.data))
      .finally(() => setLoading(false));
  }, []);

  const openTheatre = async (theatre) => {
    setSelectedTheatre(theatre);
    setShowsLoading(true);
    try {
      const res = await axiosInstance.get(`/shows?theatreId=${theatre._id}`);
      setShows(res.data.shows || res.data);
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

  // Master local configurations list array matching global multiplex data points
  const cities = ['All', ...Array.from(new Set(theatres.map((t) => t.city).filter(Boolean)))];

  const filteredTheatres = selectedCity === 'All'
    ? theatres
    : theatres.filter((t) => t.city?.toLowerCase() === selectedCity.toLowerCase());

  const isDeepLinkedView = Boolean(requestedTheatreId) && Boolean(selectedTheatre);

  // Custom standalone hardware-accelerated animations array for premium white canvas
  const premiumGlobalStyles = `
    @keyframes cinematicFadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes microShimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-cinematic-up {
      animation: cinematicFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .animate-shimmer-running {
      animation: microShimmer 1.6s infinite;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  // Explicit dynamic routing helper to mutate sync parameter paths safely
  const handleCityFilterChange = (city) => {
    const currentParams = new URLSearchParams(window.location.search);
    if (city === 'All') {
      currentParams.delete('city');
    } else {
      currentParams.set('city', city);
    }
    setSearchParams(currentParams);
  };

  // ===== Deep-linked view: show ONLY the shows for that theatre =====
  if (isDeepLinkedView) {
    return (
      <div className={`space-y-6 px-1 sm:px-0 w-full overflow-x-hidden animate-cinematic-up ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}>
        <style>{premiumGlobalStyles}</style>
        <button
          onClick={() => navigate('/theatres')}
          className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider cursor-pointer bg-transparent border-none focus:outline-none transition-colors duration-200 min-h-[38px] ${
            isDarkMode ? "text-slate-400 hover:text-amber-500" : "text-stone-500 hover:text-amber-600"
          }`}
        >
          <ChevronLeft size={14} /> All Theatres
        </button>

        <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Shows at {selectedTheatre.name}
        </h2>

        {showsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className={`h-20 w-full rounded-xl relative overflow-hidden ${isDarkMode ? "bg-white/5" : "bg-stone-100"}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-running -translate-x-full" />
              </div>
            ))}
          </div>
        ) : shows.length === 0 ? (
          <p className="text-sm text-slate-500 font-mono pl-1">No shows scheduled at this theatre yet.</p>
        ) : (
          <div className="space-y-3">
            {shows.map((s) => (
              <div key={s._id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-4.5 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm ${
                isDarkMode ? "bg-slate-900/40 border-white/[0.06] hover:border-amber-500/20" : "bg-white border-slate-200/80 hover:border-amber-500/30 shadow-stone-100"
              }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <Clapperboard size={18} className="text-amber-500 shrink-0 transform group-hover:rotate-12 transition-transform" />
                  <div className="min-w-0 flex-grow">
                    <p className={`text-sm font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{s.movie?.title}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{s.format} &bull; {s.showTime} &bull; ₹{s.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/booking/${s.movie?._id}/shows`)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 text-xs font-black rounded-xl border-none cursor-pointer text-center select-none shrink-0 min-h-[40px] uppercase tracking-wider transition-all shadow-md shadow-amber-500/5 active:scale-98 hover:brightness-105"
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
    <div className={`space-y-6 md:space-y-8 px-1 sm:px-0 w-full overflow-x-hidden relative ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}>
      <style>{premiumGlobalStyles}</style>

      {/* Decorative background glow node element */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.01] rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full animate-cinematic-up">
        <div className="space-y-1 relative pl-1">
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Our Theatres
          </h1>
          <div className="w-8 h-[3px] bg-amber-500 rounded-full mt-1 transform origin-left transition-all duration-300" />
        </div>

        {/* City Filter Selection Rows — Perfectly synced to change parameter variables based on user click or selection dropdown arrays */}
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0 flex items-center gap-2">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleCityFilterChange(city)}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all duration-300 border cursor-pointer shrink-0 uppercase tracking-wider min-h-[38px] active:scale-95 ${
                selectedCity.toLowerCase() === city.toLowerCase()
                  ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 border-transparent shadow-[0_4px_14px_rgba(245,158,11,0.25)]"
                  : isDarkMode
                    ? "bg-white/[0.02] text-slate-400 border-white/[0.05] hover:border-white/20 hover:text-white"
                    : "bg-white text-slate-600 border-stone-200 hover:border-slate-400 hover:text-slate-900 hover:shadow-sm"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton Mechanics Block */}
      {loading || (requestedTheatreId && !selectedTheatre) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-6 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`rounded-2xl border p-4 space-y-4 h-72 ${isDarkMode ? "bg-slate-900/40 border-white/[0.05]" : "bg-white border-stone-200"}`}>
              <div className="w-full aspect-[16/9] bg-stone-200 dark:bg-white/5 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-running -translate-x-full" />
              </div>
              <div className="h-4 w-3/4 bg-stone-200 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filteredTheatres.length === 0 ? (
        <div className="text-center py-12 max-w-sm mx-auto space-y-3">
          <p className="text-sm text-slate-500 font-mono">No theatres discovered matching current geographical tokens.</p>
          <button 
            onClick={() => handleCityFilterChange('All')} 
            className="text-xs font-bold text-amber-500 hover:underline bg-transparent border-none cursor-pointer"
          >
            View All Screening Locations
          </button>
        </div>
      ) : (
        /* Grid container layout tracking system optimized with hardware accelerated animations */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-6">
          {filteredTheatres.map((t, index) => (
            <button
              key={t._id}
              type="button"
              onClick={() => openTheatre(t)}
              className={`text-left rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between h-full bg-transparent p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 transform hover:-translate-y-1 shadow-sm opacity-0 animate-cinematic-up group ${
                isDarkMode 
                  ? "bg-slate-900/30 border-white/[0.06] hover:border-amber-500/30 hover:shadow-xl hover:shadow-black/40" 
                  : "bg-white border-stone-200/80 hover:border-amber-500/30 hover:shadow-md hover:shadow-amber-500/[0.03]"
              }`}
              style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'forwards' }}
            >
              {/* Ken Burns slow image zoom handling on hover states */}
              <div className="w-full aspect-[16/9] bg-slate-800 overflow-hidden shrink-0 relative">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.04] transition-transform duration-500 ease-out object-center brightness-[0.92] group-hover:brightness-100"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-950">
                    <Building size={24} className="text-amber-500 opacity-60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>

              {/* Text Meta Content Hierarchy Area */}
              <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className={`text-sm sm:text-base font-black tracking-tight line-clamp-1 transition-colors group-hover:text-amber-600 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-start gap-1.5 font-semibold line-clamp-2 leading-relaxed">
                    <MapPin size={12} className="text-amber-500 shrink-0 mt-0.5 transition-transform group-hover:scale-110" /> 
                    <span>{t.location}{t.location?.includes(t.city) ? '' : `, ${t.city}`}</span>
                  </p>
                </div>

                {/* Available Modalities badging system */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(t.formats || ['2D DIGITAL', 'IMAX 3D']).map((format) => (
                    <span 
                      key={format}
                      className={`px-2 py-0.5 rounded text-[9px] font-black font-mono border tracking-wide transition-all ${
                        isDarkMode 
                          ? "bg-slate-950 text-slate-400 border-white/[0.04] group-hover:text-amber-400 group-hover:border-amber-500/20" 
                          : "bg-stone-50 text-stone-600 border-stone-200 group-hover:bg-stone-900 group-hover:text-white"
                      }`}
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Shows section panel triggered below grid architecture */}
      {selectedTheatre && !requestedTheatreId && (
        <div ref={showsSectionRef} className="space-y-4 scroll-mt-24 pt-6 w-full animate-cinematic-up">
          <div className="border-b border-stone-200/60 dark:border-white/[0.04] pb-2">
            <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Shows at {selectedTheatre.name}
            </h2>
          </div>
          {showsLoading ? (
            <p className="text-sm text-slate-500 font-mono animate-pulse">Loading showtimes...</p>
          ) : shows.length === 0 ? (
            <p className="text-sm text-slate-500 font-mono pl-1">No shows scheduled at this theatre yet.</p>
          ) : (
            <div className="space-y-3">
              {shows.map((s) => (
                <div key={s._id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border gap-4.5 transition-all duration-200 transform hover:-translate-y-0.5 ${isDarkMode ? "bg-slate-900/40 border-white/[0.06] hover:border-amber-500/20" : "bg-white border-slate-200 hover:border-amber-500/30 shadow-sm shadow-stone-100"}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <Clapperboard size={18} className="text-amber-500 shrink-0" />
                    <div className="min-w-0 flex-grow">
                      <p className={`text-sm font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{s.movie?.title}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{s.format} &bull; {s.showTime} &bull; ₹{s.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/booking/${s.movie?._id}/shows`)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 text-xs font-black rounded-xl border-none cursor-pointer text-center select-none shrink-0 min-h-[40px] uppercase tracking-wider shadow-sm hover:brightness-105 active:scale-98"
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