// src/pages/SelectSeats.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useTheme } from '../context/ThemeContext';
import { Armchair, ChevronRight, ChevronLeft, MapPin, Sparkles, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeatSelectionSkeleton } from '../components/atoms/Skeletons';
import axiosInstance from '../services/axiosInstance';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'J'];
const SEAT_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function SelectSeats() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { selectedSeats, setSelectedSeats, setTotalAmount, selectedShow, setBookingId } = useBooking();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const bookedSeats = selectedShow?.bookedSeats || [];
  const pricePerSeat = selectedShow?.price || 0;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (bookedSeats.length > 0) {
      setSelectedSeats((prev) => prev.filter((seat) => !bookedSeats.includes(seat)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShow]);

  useEffect(() => {
    setTotalAmount(selectedSeats.length * pricePerSeat);
  }, [selectedSeats, pricePerSeat, setTotalAmount]);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;
    let updatedSeats;
    if (selectedSeats.includes(seatId)) {
      updatedSeats = selectedSeats.filter((seat) => seat !== seatId);
    } else {
      if (selectedSeats.length >= 10) return;
      updatedSeats = [...selectedSeats, seatId];
    }
    setSelectedSeats(updatedSeats);
  };

  const handleKeyDown = (e, seatId, isBooked) => {
    if (isBooked) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSeatClick(seatId);
    }
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0 || !selectedShow) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await axiosInstance.post('/bookings', {
        showId: selectedShow._id,
        seats: selectedSeats,
      });
      setBookingId(res.data.booking._id);
      navigate('/checkout');
    } catch (err) {
      const message = err.response?.data?.message || "Could not create booking. Please try again.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <SeatSelectionSkeleton />;
  }

  if (!selectedShow) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 text-sm text-slate-400 font-mono">
        No show selected. Please go back and choose a showtime first.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-5xl mx-auto border rounded-[24px] sm:rounded-[32px] p-3.5 sm:p-8 md:p-10 shadow-2xl transition-all duration-500 relative w-full overflow-hidden ${
        isDarkMode 
          ? "bg-slate-950 border-white/[0.04] text-slate-100 shadow-black/80" 
          : "bg-gradient-to-br from-[#FAFAF8] via-[#F4F2E9] to-[#EAE6D8] border-stone-200/80 shadow-[0_30px_60px_rgba(218,165,32,0.03)] text-stone-900" 
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500" />
      
      {/* --- HEADER DESK PANEL --- */}
      <div className={`flex items-center justify-between border-b pb-4 sm:pb-5 mb-6 sm:mb-8 text-[10px] sm:text-xs font-black uppercase tracking-widest ${isDarkMode ? "border-white/[0.04] text-slate-400" : "border-stone-200 text-stone-500"}`}>
        <motion.button 
          whileHover={{ scale: 1.03, x: -2 }} 
          whileTap={{ scale: 0.97 }} 
          onClick={() => navigate(-1)} 
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer bg-transparent font-black focus:outline-none focus:ring-2 focus:ring-amber-500/40 min-h-[36px] ${isDarkMode ? "border-white/10 text-slate-300 hover:text-white" : "border-stone-300 text-stone-700 hover:text-stone-950"}`}
        >
          <ChevronLeft size={13} /> Back
        </motion.button>
        <span className="flex items-center gap-1.5 font-display tracking-widest text-right">
          <Armchair size={13} className={isDarkMode ? "text-amber-500 animate-pulse" : "text-amber-600 animate-pulse"} /> 
          <span className="hidden xs:inline">Theater Configuration Matrix</span>
          <span className="xs:hidden">Layout Grid</span>
        </span>
      </div>

      {/* --- SHOW IDENTIFICATION CARD --- */}
      <div className={`mb-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${isDarkMode ? "bg-white/[0.01] border-white/[0.05]" : "bg-white/60 border-stone-200/60 backdrop-blur-sm shadow-sm"}`}>
        <p className="text-[9px] sm:text-[10px] font-black tracking-wider text-slate-400 uppercase mb-2 font-mono flex items-center gap-1">
          <Sparkles size={11} className="text-amber-500" /> Selected Show Node:
        </p>
        <div className={`text-[11px] sm:text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border w-fit transition-transform hover:scale-[1.01] max-w-full ${isDarkMode ? "bg-slate-900 border-white/5 text-white" : "bg-[#FAFAF8] border-stone-200 text-stone-800 shadow-sm"}`}>
          <MapPin size={12} className="text-amber-500 shrink-0" /> 
          <span className="truncate">{selectedShow.theatre.name} &bull; {selectedShow.showTime} &bull; ₹{pricePerSeat}/seat</span>
        </div>
      </div>

      {/* --- SEAT STATUS MATRIX LEGEND --- */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2.5 mb-6 sm:mb-8 text-[9px] sm:text-[10px] font-black uppercase tracking-wider font-mono">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded border ${isDarkMode ? "bg-white/[0.02] border-white/10" : "bg-stone-50 border-slate-200"}`} />
          <span className="opacity-70">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded border bg-amber-500 border-amber-500" />
          <span className="text-amber-500">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded border opacity-40 ${isDarkMode ? "bg-slate-900 border-slate-950" : "bg-slate-200 border-slate-300"}`} />
          <span className="opacity-40">Booked</span>
        </div>
      </div>

      {/* --- CINEMA CURVED SCREEN GRAPHIC --- */}
      <div className="relative flex flex-col items-center mb-10 sm:mb-14 px-2">
        <div className={`w-11/12 sm:w-4/5 h-2 rounded-full transition-all duration-700 ${
          isDarkMode 
            ? "bg-gradient-to-b from-amber-500 via-amber-500/20 to-transparent blur-[1px] shadow-[0_4px_20px_rgba(245,158,11,0.15)]" 
            : "bg-gradient-to-b from-amber-600 via-amber-500/10 to-transparent blur-[0.5px] shadow-[0_4px_15px_rgba(217,119,6,0.08)]"
        }`} />
        <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] mt-3.5 select-none ${isDarkMode ? "text-amber-400/60" : "text-amber-800/80"}`}>SCREEN THIS WAY</span>
      </div>

      {/* --- INTERACTIVE SEAT GRID — Active Horizontal Pan Control on Mobile Bounds --- */}
      <div className="overflow-x-auto pb-4 mb-4 no-scrollbar cursor-grab active:cursor-grabbing w-full"> 
        <div className="min-w-[760px] flex flex-col gap-3 px-4 select-none relative mx-auto">
          
          {/* Real-time Dynamic Tooltip Popover Overlay */}
          <AnimatePresence>
            {hoveredSeat && (
              <motion.div 
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{ left: hoveredSeat.x, top: hoveredSeat.y - 36 }}
                className="absolute z-30 transform -translate-x-1/2 pointer-events-none px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono font-black text-white shadow-xl flex items-center gap-1.5"
              >
                <span className="text-amber-500">{hoveredSeat.id}</span>
                <span className="opacity-40">|</span>
                <span>₹{pricePerSeat}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {ROWS.map((row) => {
            const isVIP = row === 'A' || row === 'B';
            return (
              <div key={row} className="flex items-center justify-between gap-4">
                <span className={`w-6 text-xs font-black font-mono text-center shrink-0 ${isVIP ? "text-amber-500" : isDarkMode ? "text-slate-500" : "text-stone-400"}`}>{row}</span>
                <div className="flex-grow flex justify-center items-center gap-2 max-w-4xl mx-auto">
                  {SEAT_NUMBERS.map((num) => {
                    const seatId = `${row}-${num}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const insertGap = num === 3 || num === 9;
                    
                    return (
                      <React.Fragment key={seatId}>
                        <motion.div
                          onMouseEnter={(e) => {
                            if (isBooked) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const containerRect = e.currentTarget.parentElement.parentElement.parentElement.getBoundingClientRect();
                            setHoveredSeat({
                              id: seatId,
                              x: rect.left - containerRect.left + rect.width / 2,
                              y: rect.top - containerRect.top
                            });
                          }}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className="relative"
                        >
                          <button 
                            disabled={isBooked} 
                            onClick={() => handleSeatClick(seatId)}
                            onKeyDown={(e) => handleKeyDown(e, seatId, isBooked)}
                            tabIndex={isBooked ? -1 : 0}
                            aria-label={`Seat row ${row} number ${num}, ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
                            className={`w-7 h-7 rounded-lg text-[9px] font-mono font-black border flex items-center justify-center select-none cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                              isBooked 
                                ? (isDarkMode ? "bg-slate-900 border-slate-950 text-slate-700 opacity-25 cursor-not-allowed" : "bg-slate-200 border-slate-300 text-slate-400 opacity-40 cursor-not-allowed") 
                                : isSelected 
                                  ? "bg-amber-50 border-amber-500 text-stone-950 scale-105 shadow-md shadow-amber-500/20" 
                                  : isVIP 
                                    ? (isDarkMode ? "bg-amber-500/5 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500" : "bg-amber-50 border-amber-300/60 text-amber-700 hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500") 
                                    : (isDarkMode ? "bg-white/[0.02] border-white/10 text-slate-300 hover:border-amber-500/50 hover:text-amber-500" : "bg-stone-50 border-slate-200 text-slate-600 hover:border-amber-500/50 hover:text-amber-600")
                            }`}
                          >
                            {num} 
                          </button>
                        </motion.div>
                        {insertGap && <div className="w-6 sm:w-8" />}
                      </React.Fragment>
                    );
                  })}
                </div>
                <span className={`w-6 text-xs font-black font-mono text-center shrink-0 ${isVIP ? "text-amber-500" : isDarkMode ? "text-slate-500" : "text-stone-400"}`}>{row}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- SELECTED SEAT SUMMARY CHIPS CLUSTER --- */}
      <div className="max-w-3xl mx-auto mb-4 px-1 min-h-[26px]">
        <AnimatePresence>
          {selectedSeats.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex flex-wrap gap-1.5 items-center justify-start"
            >
              <span className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-500 mr-1 select-none">Active Token Array:</span>
              {selectedSeats.map(seat => (
                <motion.span 
                  key={seat}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={() => handleSeatClick(seat)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-black bg-amber-500/10 border border-amber-500/30 text-amber-500 cursor-pointer hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-colors"
                >
                  {seat} <span className="opacity-40 text-[8px] font-sans">✕</span>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {errorMsg && (
        <p className="text-center text-xs font-bold text-rose-500 mb-4 font-mono">{errorMsg}</p>
      )}

      {/* --- STICKY STAGE PAYMENT FOOTER PLATFORM — Adaptive Flex Direction --- */}
      <div className={`max-w-3xl mx-auto border p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-between shadow-xl backdrop-blur-md transition-all ${
        isDarkMode 
          ? "bg-slate-900/60 border-white/[0.05]" 
          : "bg-white/70 border-stone-200/80 shadow-md shadow-stone-900/5"
      }`}>
        <div className="flex gap-8 sm:gap-12 text-xs font-medium w-full sm:w-auto justify-between sm:justify-start">
          <div>
            <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Tickets</span>
            <span className={`font-mono font-black tracking-wide block min-h-[18px] text-sm transition-colors ${selectedSeats.length > 0 ? "text-amber-500" : "text-slate-400"}`}>
              {selectedSeats.length > 0 ? `${selectedSeats.length} Selected` : 'None Selected'}
            </span>
          </div>
          <div>
            <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Aggregated Fee</span>
            <span className={`font-black text-lg font-mono tracking-tight transition-colors ${selectedSeats.length > 0 ? "text-amber-500" : isDarkMode ? "text-white" : "text-stone-900"}`}> 
              ₹{selectedSeats.length * pricePerSeat}.00
            </span>
          </div>
        </div>

        <motion.button
          whileHover={selectedSeats.length > 0 ? { scale: 1.02, filter: "brightness(1.04)" } : {}}
          whileTap={selectedSeats.length > 0 ? { scale: 0.98 } : {}}
          onClick={handleCheckout}
          disabled={selectedSeats.length === 0 || submitting}
          className={`w-full sm:w-auto px-6 py-3.5 font-black text-xs uppercase tracking-widest rounded-xl transition-all border outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 min-h-[44px] flex items-center justify-center ${
            selectedSeats.length > 0 
              ? (isDarkMode ? "bg-white text-slate-950 border-transparent cursor-pointer" : "bg-stone-950 text-white border-transparent cursor-pointer") 
              : (isDarkMode ? "bg-white/[0.01] border-white/[0.03] text-slate-700 cursor-not-allowed" : "bg-stone-100 border-stone-200/60 text-stone-400 cursor-not-allowed")
          }`}
        >
          {submitting ? "Booking..." : "Proceed to Payment"} <ChevronRight size={13} strokeWidth={2.5} className="inline-block ml-0.5" /> 
        </motion.button>
      </div>
      
      <div className={`text-center text-[10px] font-mono font-medium mt-8 sm:mt-10 tracking-wider select-none ${isDarkMode ? "text-slate-600" : "text-stone-500/60"}`}>
        &copy; {new Date().getFullYear()} SHOWX HUB // INCUBATED NODE DATA CHANNELS 
      </div>
    </motion.div>
  );
}