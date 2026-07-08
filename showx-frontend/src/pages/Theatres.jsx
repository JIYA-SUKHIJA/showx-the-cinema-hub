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

  return (
    <div className="space-y-8">
      <h1 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Our Theatres
      </h1>

      {loading ? (
        <p className="text-sm text-slate-500">Loading theatres...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {theatres.map((t) => (
            <button
              key={t._id}
              onClick={() => openTheatre(t)}
              className={`text-left p-6 rounded-2xl border transition-all ${
                isDarkMode ? "bg-slate-900/40 border-white/[0.06] hover:border-amber-500/50" : "bg-white border-slate-200 hover:border-amber-500/50"
              }`}
            >
              <Building size={20} className="text-amber-500 mb-3" />
              <h3 className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>{t.name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <MapPin size={12} /> {t.location}, {t.city}
              </p>
              <p className="text-[10px] text-slate-500 mt-2">{(t.formats || []).join(' • ')}</p>
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