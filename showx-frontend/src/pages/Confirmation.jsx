// src/pages/Confirmation.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion'; // Upgraded and fixed the ReferenceError completely
import { CheckCircle2, Ticket, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Dynamic theme config hook connection

export default function Confirmation() {
  const navigate = useNavigate();
  const { bookingId } = useParams(); 
  const { selectedSeats, totalAmount, clearBookingSession } = useBooking();
  const { isDarkMode } = useTheme(); // Reading system light/dark layer triggers

  const handleReturnHome = () => {
    clearBookingSession();
    navigate('/');
  };

  // Pure hardware-accelerated stub animation utilities
  const stubKeyframeStyles = `
    @keyframes stubEntranceUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-stub-up {
      animation: stubEntranceUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <div className="w-full px-1 sm:px-0 flex justify-center items-center py-4 animate-stub-up">
      <style>{stubKeyframeStyles}</style>
      
      <div className={`max-w-md w-full border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-6 sm:my-12 relative group transition-all duration-300 transform hover:translate-y-[-2px] ${
        isDarkMode 
          ? "bg-slate-900 border-white/[0.05] shadow-black/50" 
          : "bg-white border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(59,130,246,0.18)]"
      }`}>
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400" />

        {/* Success Banner Top — Polished contrast */}
        <div className={`p-6 sm:p-8 text-center bg-gradient-to-b from-white/[0.02] to-transparent border-b ${
          isDarkMode ? "border-white/[0.04]" : "border-slate-100 bg-slate-50/30"
        }`}>
          <div className="w-12 h-14 sm:w-14 sm:h-14 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm transform hover:scale-105 transition-transform duration-300">
            <CheckCircle2 size={26} strokeWidth={2.2} className="animate-pulse" style={{ animationDuration: '3s' }} />
          </div>
          <h2 className={`text-xl sm:text-2xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Booking Confirmed
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-semibold select-none">
            Your credentials have been securely stored
          </p>
        </div>

        {/* Ticket Details Body */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          
          {/* Reference Numbers — Balanced micro tracking components */}
          <div className={`grid grid-cols-1 xs:grid-cols-2 gap-3 text-center p-3.5 sm:p-4 rounded-2xl border shadow-inner w-full overflow-hidden transition-colors duration-300 ${
            isDarkMode ? "bg-slate-950 border-white/[0.04]" : "bg-stone-50 border-stone-100"
          }`}>
            <div className={`xs:border-r pb-2.5 xs:pb-0 ${isDarkMode ? "border-white/5" : "border-stone-200"}`}>
              <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-black tracking-widest select-none">Order Reference</span>
              <span className="text-xs font-mono font-black text-amber-500 block mt-0.5 truncate px-1">{bookingId || "SHX-STABLE"}</span>
            </div>
            <div className="pt-1.5 xs:pt-0">
              <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-black tracking-widest select-none">Gateway Response</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/20 inline-block mt-0.5 uppercase tracking-wider font-mono">
                PAID SUCCESS
              </span>
            </div>
          </div>

          {/* Ticket Summary List Parameters */}
          <div className={`space-y-3.5 text-xs font-medium border-b pb-5 sm:pb-6 w-full overflow-hidden ${isDarkMode ? "border-white/[0.04]" : "border-slate-100"}`}>
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><MapPin size={13} /> Multiplex Venue</span>
              <span className={`font-black text-right truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>Showx Cinema Hub</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><Ticket size={13} /> Reserved Nodes</span>
              <span className="font-mono font-black text-amber-500 tracking-wider text-xs sm:text-sm text-right truncate max-w-[200px] xs:max-w-none">
                {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'A-5, A-6, A-7'}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><CreditCard size={13} /> Settled Invoice</span>
              <span className={`font-black text-xs sm:text-sm font-mono text-right ${isDarkMode ? "text-white" : "text-emerald-600"}`}>₹{totalAmount > 0 ? totalAmount : '600'}.00</span>
            </div>
          </div>

          {/* Visual Mock Barcode Indicator */}
          <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl gap-2 shadow-md border border-slate-100 select-none group/barcode cursor-pointer">
            <div className="w-full h-10 sm:h-12 bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_2px,#fff_2px,#fff_7px)] opacity-95 rounded group-hover/barcode:opacity-100 transition-opacity duration-300" />
            <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.25em] sm:tracking-[0.35em] text-slate-500 truncate max-w-full px-1 uppercase">
              {bookingId || "SHX-STABLE"}
            </span>
          </div>

          {/* Redirect Button Controller */}
          <motion.button
            whileHover={{ scale: 1.015, filter: "brightness(1.05)" }}
            whileTap={{ scale: 0.985 }}
            onClick={handleReturnHome}
            type="button"
            className={`w-full font-black tracking-widest text-xs uppercase py-3.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 border-none min-h-[44px] focus:outline-none ${
              isDarkMode 
                ? "bg-white text-slate-950 hover:bg-amber-500" 
                : "bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-950"
            }`}
          >
            Return to Dashboard Home <ChevronRight size={13} strokeWidth={2.5} />
          </motion.button>
        </div>

      </div>
    </div>
  );
}