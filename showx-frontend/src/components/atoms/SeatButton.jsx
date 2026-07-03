// src/components/atoms/SeatButton.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

export default function SeatButton({ num, isBooked, isSelected, onClick, seatId }) {
  let seatStyles =
    "bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border-white/[0.04] hover:border-gold/40 cursor-pointer";

  if (isBooked) {
    seatStyles =
      "bg-slate-950 text-slate-700 border-transparent opacity-30 cursor-not-allowed";
  } else if (isSelected) {
    seatStyles =
      "bg-gradient-to-br from-crimson to-rose-600 text-white border-transparent shadow-[0_0_20px_rgba(230,57,70,0.5)] cursor-pointer";
  }

  return (
    <motion.button
      whileTap={!isBooked ? { scale: 0.90 } : undefined}
      whileHover={!isBooked ? { y: -3, scale: 1.05 } : undefined}
      disabled={isBooked}
      onClick={onClick}
      className={`relative h-10 w-full text-xs font-bold font-mono rounded-xl border-b-4 flex items-center justify-center transition-all duration-200 shadow-sm ${seatStyles}`}
      title={`Seat ${seatId}`}
    >
      {isBooked ? (
        <Lock size={12} strokeWidth={2.5} className="text-slate-600" />
      ) : isSelected ? (
        <Check size={13} strokeWidth={3} className="text-white" />
      ) : (
        num
      )}
    </motion.button>
  );
}