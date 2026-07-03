// src/pages/SelectSeats.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import SeatButton from '../components/atoms/SeatButton';
import { Armchair, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Correct row sequence containing exactly 8 active structural rows matching the map view
const ROWS = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'J']; 
const SEAT_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);
const SEAT_PRICE = 200; 

export default function SelectSeats() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { selectedSeats, setSelectedSeats, setTotalAmount } = useBooking();

  // Explicitly updated to match the grayed out 'Booked' seats observed in standard session pools
  const [bookedSeats] = useState([
    'B-10', 'C-8', 'C-9', 'C-10', 'D-8', 'D-9', 'D-10', 
    'E-8', 'E-9', 'E-10', 'G-8', 'G-9', 'G-10', 'H-8'
  ]);

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
    setTotalAmount(updatedSeats.length * SEAT_PRICE);
  };

  return (
    <div className={`max-w-5xl mx-auto border rounded-[32px] p-6 sm:p-10 shadow-2xl transition-all duration-500 relative ${
      isDarkMode 
        ? "bg-slate-950 border-white/[0.04] text-slate-100" 
        : "bg-gradient-to-br from-[#faf9f5] via-[#f5f3eb] to-[#eae7dc] border-stone-200/80 shadow-[0_20px_50px_rgba(218,165,32,0.02)] text-stone-900"
    }`}>
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600" />
      
      {/* Upper Context Header Deck */}
      <div className={`flex items-center justify-between border-b pb-5 mb-10 text-xs font-black uppercase tracking-widest ${
        isDarkMode ? "border-white/[0.04] text-slate-400" : "border-stone-200 text-stone-500"
      }`}>
        <span className="flex items-center gap-1.5">
          <Armchair size={14} className={isDarkMode ? "text-amber-500" : "text-amber-600"} /> 
          Multiplex Spatial Grid
        </span>
        <span className="font-mono text-[11px] opacity-60">Layout Node: Active</span>
      </div>

      {/* Premium Glowing Curved Overhead Cinematic Screen Component */}
      <div className="relative flex flex-col items-center mb-16 px-4">
        <div className={`w-4/5 h-2 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? "bg-gradient-to-b from-amber-500 via-amber-400/50 to-transparent shadow-[0_4px_25px_rgba(244,197,66,0.5)]" 
            : "bg-gradient-to-b from-amber-600 via-amber-500/30 to-transparent shadow-[0_4px_20px_rgba(218,165,32,0.3)]"
        }`} />
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] mt-4 ${
          isDarkMode ? "text-amber-500/80" : "text-amber-800"
        }`}>
          Cinematic Screen Vector
        </span>
      </div>

      {/* Row Mapping Matrix Container */}
      <div className="overflow-x-auto pb-6 mb-8 custom-scrollbar">
        <div className="min-w-[800px] flex flex-col gap-3.5 px-4">
          {ROWS.map((row) => (
            <div key={row} className="flex items-center justify-between gap-6">
              {/* Left Row Identifier */}
              <span className={`w-6 text-xs font-black font-mono text-center ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>
                {row}
              </span>

              {/* Grid Array Generator */}
              <div className="flex-grow grid grid-cols-12 gap-3 max-w-3xl mx-auto">
                {SEAT_NUMBERS.map((num) => {
                  const seatId = `${row}-${num}`;
                  return (
                    <SeatButton
                      key={seatId}
                      num={num}
                      seatId={seatId}
                      isBooked={bookedSeats.includes(seatId)}
                      isSelected={selectedSeats.includes(seatId)}
                      onClick={() => handleSeatClick(seatId)}
                    />
                  );
                })}
              </div>

              {/* Right Row Identifier Buffer */}
              <span className={`w-6 text-xs font-black font-mono text-center ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Legend Matrix Wrapper */}
      <div className={`flex justify-center items-center flex-wrap gap-6 py-4 text-[11px] font-black uppercase tracking-wider border-t border-b mb-10 max-w-xl mx-auto ${
        isDarkMode ? "border-white/[0.03] text-slate-400" : "border-stone-200 text-stone-500"
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-md border ${isDarkMode ? "bg-white/[0.03] border-white/[0.04]" : "bg-white border-stone-300"}`} />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-crimson to-rose-600 rounded-md shadow-md shadow-crimson/20" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-md opacity-30 ${isDarkMode ? "bg-slate-950" : "bg-stone-400"}`} />
          <span>Booked</span>
        </div>
      </div>

      {/* Checkout Control Hub Block */}
      <div className={`max-w-3xl mx-auto border p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xl relative ${
        isDarkMode ? "bg-slate-900/40 border-white/[0.05]" : "bg-white/80 border-stone-200"
      }`}>
        <div className="flex gap-10 text-xs font-medium self-start sm:self-auto">
          <div>
            <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>
              Selected Nodes
            </span>
            <span className="font-mono font-bold tracking-wide text-amber-600 block min-h-[18px] text-sm">
              {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'None'}
            </span>
          </div>
          <div>
            <span className={`block text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>
              Aggregated Fee
            </span>
            <span className={`font-black text-lg font-mono ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              ₹{selectedSeats.length * SEAT_PRICE}.00
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          disabled={selectedSeats.length === 0}
          className={`w-full sm:w-auto px-8 py-4 font-black text-xs uppercase tracking-widest rounded-xl transition-all border ${
            selectedSeats.length > 0
              ? isDarkMode
                ? "bg-white text-slate-950 hover:bg-amber-500 border-transparent shadow-lg shadow-white/5 active:scale-95 cursor-pointer"
                : "bg-stone-950 text-white hover:bg-amber-600 border-transparent shadow-md active:scale-95 cursor-pointer"
              : isDarkMode
                ? "bg-white/[0.02] border-white/[0.04] text-slate-600 cursor-not-allowed"
                : "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
          }`}
        >
          Proceed to Payment <ChevronRight size={13} strokeWidth={2.5} className="inline-block ml-0.5" />
        </button>
      </div>
      
      <div className={`text-center text-[10px] font-mono font-medium mt-12 tracking-wider select-none ${
        isDarkMode ? "text-slate-600" : "text-stone-400"
      }`}>
        &copy; 2026 SHOWX HUB // INCUBATED NODE DATA CHANNELS
      </div>
    </div>
  );
}