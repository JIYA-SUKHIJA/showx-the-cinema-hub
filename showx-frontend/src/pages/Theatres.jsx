import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, Clapperboard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../services/axiosInstance';

export default function Theatres() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showsLoading, setShowsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All');

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

  // Unique city list derived from the theatres themselves
  const cities = ['All', ...Array.from(new Set(theatres.map((t) => t.city).filter(Boolean)))];

  const filteredTheatres = selectedCity === 'All'
    ? theatres
    : theatres.filter((t) => t.city === selectedCity);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          Our Theatres
        </h1>

        {/* City Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                setSelectedTheatre(null);
              }}
              className={`px-4 py-2 text-xs font-black rounded-xl transition-all duration-300 border cursor-pointer ${
                selectedCity === city
                  ? "bg-amber-500 text-slate-950 border-transparent"
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

      {loading ? (
        <p className="text-sm text-slate-500">Loading theatres...</p>
      ) : filteredTheatres.length === 0 ? (
        <p className="text-sm text-slate-500">No theatres found in {selectedCity}.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTheatres.map((t) => (
            <button
              key={t._id}
              onClick={() => openTheatre(t)}
              className={`text-left rounded-2xl border overflow-hidden transition-all ${
                isDarkMode ? "bg-slate-900/40 border-white/[0.06] hover:border-amber-500/50" : "bg-white border-slate-200 hover:border-amber-500/50"
              }`}
            >
              <div className="w-full aspect-[16/9] bg-slate-800 overflow-hidden">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building size={28} className="text-amber-500" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>{t.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {t.location}{t.location?.includes(t.city) ? '' : `, ${t.city}`}
                </p>
                <p className="text-[10px] text-slate-500 mt-2">{(t.formats || []).join(' • ')}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedTheatre && (
        <div className="space-y-4">
          <h2 className={`text-xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Shows at {selectedTheatre.name}
          </h2>
          {showsLoading ? (
            <p className="text-sm text-slate-500">Loading shows...</p>
          ) : shows.length === 0 ? (
            <p className="text-sm text-slate-500">No shows scheduled at this theatre yet.</p>
          ) : (
            <div className="space-y-3">
              {shows.map((s) => (
                <div key={s._id} className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? "bg-slate-900/40 border-white/[0.06]" : "bg-white border-slate-200"}`}>
                  <div className="flex items-center gap-3">
                    <Clapperboard size={18} className="text-amber-500" />
                    <div>
                      <p className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{s.movie?.title}</p>
                      <p className="text-xs text-slate-500">{s.format} • {s.showTime} • ₹{s.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/booking/${s.movie?._id}/shows`)}
                    className="px-4 py-2 bg-amber-500 text-stone-950 text-xs font-black rounded-lg"
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