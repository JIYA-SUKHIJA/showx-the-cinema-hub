// src/pages/SelectShow.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CalendarRange, MapPin, Film, Clock, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axiosInstance from '../services/axiosInstance';

export default function SelectShow() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { selectedMovie, setSelectedCinema, setSelectedShowtime, setSelectedShow } = useBooking();

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
      try {
        const res = await axiosInstance.get('/shows');
        const showsForMovie = res.data.shows.filter(
          (s) => s.movie?._id === movieId && s.theatre
        );
        setShows(showsForMovie);
      } catch (err) {
        console.error("Error loading shows:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShows();
  }, [movieId]);

  const handleTimeSelection = (show) => {
    setSelectedCinema(show.theatre?.name || "Theatre Unavailable");
    setSelectedShowtime(show.showTime);
    setSelectedShow(show);
    navigate(`/booking/${movieId}/seats`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 font-sans antialiased">
      
      {/* Top Breadcrumb Context Banner */}
      <div className={`border rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-500 relative overflow-hidden ${
        isDarkMode 
          ? "bg-gradient-to-br from-slate-950 via-[#0a0f1d] to-slate-950 border-white/[0.04]" 
          : "bg-gradient-to-br from-[#faf9f5] via-[#f5f3eb] to-[#eae7dc] border-stone-200/80 shadow-[0_15px_40px_rgba(218,165,32,0.02)]"
      }`}>
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-600 to-yellow-500" />
        <div className="flex items-center gap-3.5 relative z-10">
          <span className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors duration-300 ${
            isDarkMode ? "bg-white/[0.02] border-white/[0.05] text-amber-500" : "bg-stone-100 border-stone-200 text-amber-700"
          }`}>
            <CalendarRange size={18} />
          </span>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
              Booking Phase — 01
            </span>
            <h1 className={`text-xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              Select Cinema & Showtime
            </h1>
          </div>
        </div>
        
        <div className={`px-4 py-2.5 rounded-xl border font-medium relative z-10 ${
          isDarkMode ? "bg-slate-950/80 border-white/[0.04]" : "bg-white/80 border-stone-200 shadow-sm"
        }`}>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 block mb-0.5">Active Film Selection</span>
          <span className={`text-xs font-black tracking-wide flex items-center gap-1.5 ${isDarkMode ? "text-amber-500" : "text-amber-700"}`}>
            <Film size={12} /> {selectedMovie?.title || 'Selected Blockbuster Movie'}
          </span>
        </div>
      </div>

      {/* Cinema Listings Matrix Loops */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-sm text-slate-400 py-10">Loading showtimes...</p>
        ) : shows.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-10">No shows available for this movie yet.</p>
        ) : (
          shows.map((show) => (
            <div 
              key={show._id}
              className={`border rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 space-y-6 ${
                isDarkMode 
                  ? "bg-gradient-to-b from-white/[0.02] to-transparent border-white/[0.04] hover:border-amber-500/20" 
                  : "bg-white border-stone-200/80 hover:border-amber-500/40"
              }`}
            >
              {/* Multiplex Meta Information Block */}
              <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b ${
                isDarkMode ? "border-white/[0.04]" : "border-stone-100"
              }`}>
                <div className="space-y-1">
                  <h2 className={`text-base font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-800"}`}>
                    {show.theatre?.name || "Theatre Unavailable"}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <MapPin size={12} className="text-amber-600 shrink-0" /> {show.theatre?.location || "—"}
                  </p>
                </div>

                {/* Supported Audio/Visual Formats Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1 sm:pt-0">
                  <span 
                    className={`text-[9px] font-black px-2.5 py-1 rounded-md border tracking-wider uppercase font-mono ${
                      isDarkMode 
                        ? "bg-slate-950 text-slate-400 border-white/[0.04]" 
                        : "bg-stone-50 text-stone-600 border-stone-200"
                    }`}
                  >
                    {show.format}
                  </span>
                </div>
              </div>

              {/* Grid Time Selection Chips Layout Block */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <Clock size={11} className="text-amber-600" /> {show.screen} &bull; ₹{show.price} per seat
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  <button
                    onClick={() => handleTimeSelection(show)}
                    className={`py-3.5 px-4 text-xs font-black rounded-xl border transition-all duration-200 cursor-pointer text-center group active:scale-95 flex items-center justify-center gap-1 shadow-sm ${
                      isDarkMode 
                        ? "bg-slate-950 text-amber-500 border-white/[0.04] hover:border-amber-500/40 hover:bg-amber-500/5 hover:text-white" 
                        : "bg-stone-50 text-amber-800 border-stone-200 hover:border-amber-600 hover:bg-stone-950 hover:text-white"
                    }`}
                  >
                    <span>{show.showTime}</span>
                    <ChevronRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}