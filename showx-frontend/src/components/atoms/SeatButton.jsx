// src/components/atoms/SeatButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; // Dynamic theme config connection to manage crisp seating state visibility

export default function SeatButton({ num, isBooked, isSelected, onClick, seatId }) {
  const { isDarkMode } = useTheme(); // Reading absolute application theme status

  // Polished dynamic state assignments mapped for both light and dark visual matrix grids
  let seatStyles = isDarkMode
    ? "bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border-white/[0.04] hover:border-amber-500/40 cursor-pointer shadow-sm"
    : "bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200 hover:border-amber-500/50 cursor-pointer shadow-sm";

  if (isBooked) {
    seatStyles = isDarkMode
      ? "bg-slate-950 text-slate-700 border-transparent opacity-30 cursor-not-allowed select-none shadow-none"
      : "bg-slate-100 text-slate-300 border-transparent opacity-40 cursor-not-allowed select-none shadow-none";
  } else if (isSelected) {
    seatStyles =
      "bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 font-black border-transparent shadow-[0_4px_15px_rgba(245,158,11,0.35)] cursor-pointer";
  }

  return (
    <motion.button
      whileTap={!isBooked ? { scale: 0.92 } : undefined}
      whileHover={!isBooked ? { y: -2, scale: 1.03 } : undefined}
      disabled={isBooked}
      onClick={onClick}
      type="button"
      className={`relative h-10 w-full text-xs font-black font-mono rounded-xl border-b-2 flex items-center justify-center transition-all duration-200 outline-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${seatStyles}`}
      title={`Seat ${seatId}`}
      aria-label={`Seat number ${seatId} ${isBooked ? 'Unavailable' : isSelected ? 'Selected' : 'Available'}`}
    >
      {isBooked ? (
        <Lock size={12} strokeWidth={2.5} className={isDarkMode ? "text-slate-700" : "text-slate-400"} />
      ) : isSelected ? (
        <Check size={12} strokeWidth={3} className="text-stone-950" />
      ) : (
        num
      )}
    </motion.button>
  );
}