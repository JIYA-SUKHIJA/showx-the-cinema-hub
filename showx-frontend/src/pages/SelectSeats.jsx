// src/pages/SelectSeats.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useTheme } from '../context/ThemeContext';
import { Armchair, ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const bookedSeats = selectedShow?.bookedSeats || [];
  const pricePerSeat = selectedShow?.price || 0;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Agar koi purana selected seat (localStorage se persist hua) ab "already booked"
  // nikle is show ke liye, use turant selection se hata do
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
      <div className="max-w-2xl mx-auto text-center py-20 text-sm text-slate-400">
        No show selected. Please go back and choose a showtime first.
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className={`max-w-5xl mx-auto border rounded-[32px] p-4 sm:p-8 md:p-10 shadow-2xl transition-all duration-500 relative ${
        isDarkMode ? "bg-slate-950 border-white/[0.04] text-slate-100" : "bg-gradient-to-br from-[#faf9f5] via-[#f5f3eb] to-[#eae7dc] border-stone-200/80 shadow-[0_20px_50px_rgba(218,165,32,0.02)] text-stone-900" 
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600" />
      
      <div className={`flex items-center justify-between border-b pb-5 mb-8 text-xs font-black uppercase tracking-widest ${isDarkMode ? "border-white/[0.04] text-slate-400" : "border-stone-200 text-stone-500"}`}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(-1)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer bg-transparent font-black ${isDarkMode ? "border-white/10 text-slate-300 hover:text-white" : "border-stone-300 text-stone-700 hover:text-stone-950"}`}>
          <ChevronLeft size={14} /> Back
        </motion.button>
        <span className="flex items-center gap-1.5 font-display tracking-widest">
          <Armchair size={14} className={isDarkMode ? "text-amber-500" : "text-amber-600"} /> 
          Theater Configuration Matrix
        </span>
      </div>

      <div className={`mb-8 p-4 rounded-2xl border ${isDarkMode ? "bg-white/[0.01] border-white/[0.05]" : "bg-stone-100/50 border-stone-200"}`}>
        <p className="text-[10px] font-black tracking-wider text-slate-500 uppercase mb-2">Selected Show:</p>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border w-fit ${isDarkMode ? "bg-slate-900 border-white/5 text-white" : "bg-white border-stone-200 text-slate-800"}`}>
          <MapPin size={12} className="text-amber-500" /> {selectedShow.theatre.name} &bull; {selectedShow.showTime} &bull; ₹{pricePerSeat}/seat
        </span>
      </div>

      <div className="relative flex flex-col items-center mb-16 px-4">
        <div className={`w-4/5 h-2 rounded-full transition-all duration-500 ${isDarkMode ? "bg-gradient-to-b from-amber-500 via-amber-400/30 to-transparent" : "bg-gradient-to-b from-amber-600 via-amber-500/20 to-transparent"}`} />
        <span className={`text-[9px] font-black uppercase tracking-[0.5em] mt-4 select-none ${isDarkMode ? "text-amber-400/70" : "text-amber-800"}`}>SCREEN THIS WAY</span>
      </div>

      <div className="overflow-x-auto pb-6 mb-6 scrollbar-thin scrollbar-thumb-white/10 custom-scrollbar"> 
        <div className="min-w-[760px] flex flex-col gap-3.5 px-4 select-none">
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
                        <motion.button disabled={isBooked} onClick={() => handleSeatClick(seatId)} whileHover={!isBooked ? { scale: 1.12 } : {}} whileTap={!isBooked ? { scale: 0.92 } : {}} className={`w-7 h-7 rounded-lg text-[9px] font-mono font-black border transition-all flex items-center justify-center select-none cursor-pointer ${isBooked ? (isDarkMode ? "bg-slate-900 border-slate-950 text-slate-700 opacity-25" : "bg-slate-200 border-slate-300 text-slate-400 opacity-40") : isSelected ? "bg-amber-500 border-amber-500 text-stone-950" : isVIP ? (isDarkMode ? "bg-amber-500/5 border-amber-500/30 text-amber-500" : "bg-amber-50 border-amber-300/60 text-amber-700") : (isDarkMode ? "bg-white/[0.02] border-white/10 text-slate-300" : "bg-stone-50 border-slate-200 text-slate-600")}`}>
                          {num} 
                        </motion.button>
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

      {errorMsg && (
        <p className="text-center text-xs font-bold text-rose-500 mb-4">{errorMsg}</p>
      )}

      <div className="max-w-3xl mx-auto border p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-5 items-center justify-between shadow-xl relative bg-slate-900/40 border-white/[0.05]">
        <div className="flex gap-12 text-xs font-medium self-start sm:self-auto">
          <div>
            <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Tickets</span>
            <span className={`font-mono font-black tracking-wide block min-h-[18px] text-sm ${selectedSeats.length > 0 ? "text-amber-500" : "text-slate-400"}`}>
              {selectedSeats.length > 0 ? `${selectedSeats.length} Seats` : 'None Selected'}
            </span>
          </div>
          <div>
            <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Aggregated Fee</span>
            <span className={`font-black text-lg font-mono ${isDarkMode ? "text-white" : "text-stone-900"}`}> 
              ₹{selectedSeats.length * pricePerSeat}.00
            </span>
          </div>
        </div>

        <motion.button
          whileHover={selectedSeats.length > 0 ? { scale: 1.03, filter: "brightness(1.06)" } : {}}
          whileTap={selectedSeats.length > 0 ? { scale: 0.97 } : {}}
          onClick={handleCheckout}
          disabled={selectedSeats.length === 0 || submitting}
          className={`w-full sm:w-auto px-8 py-3.5 font-black text-xs uppercase tracking-widest rounded-xl transition-all border ${selectedSeats.length > 0 ? (isDarkMode ? "bg-white text-slate-950 border-transparent" : "bg-stone-950 text-white border-transparent") : (isDarkMode ? "bg-white/[0.02] border-white/[0.04] text-slate-600" : "bg-stone-100 border-stone-200 text-stone-400")}`}
        >
          {submitting ? "Booking..." : "Proceed to Payment"} <ChevronRight size={13} strokeWidth={2.5} className="inline-block ml-0.5" /> 
        </motion.button>
      </div>
      
      <div className={`text-center text-[10px] font-mono font-medium mt-10 tracking-wider select-none ${isDarkMode ? "text-slate-600" : "text-stone-400"}`}>
        &copy; 2026 SHOWX HUB // INCUBATED NODE DATA CHANNELS 
      </div>
    </motion.div>
  );
}