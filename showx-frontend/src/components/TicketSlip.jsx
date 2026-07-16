// src/components/TicketSlip.jsx
import React, { forwardRef } from 'react';
import { CheckCircle2, Ticket, MapPin, CreditCard, Film, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Dynamic theme config connection

// booking shape expected:
// {
//   _id, seats: [], totalAmount, status, createdAt, razorpayPaymentId,
//   show: { showTime, format, screen, movie: { title, poster }, theatre: { name, location } }
// }

const TicketSlip = forwardRef(({ booking }, ref) => {
  const { isDarkMode } = useTheme(); // Reading absolute application theme status

  if (!booking) return null;

  const movie = booking.show?.movie;
  const theatre = booking.show?.theatre;
  const bookingId = booking._id?.slice(-8).toUpperCase() || "SHX-STABLE";

  // Pure hardware-accelerated animations keyframes
  const ticketSlipStyles = `
    @keyframes ticketFadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-ticket-slip {
      animation: ticketFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <div
      ref={ref}
      className={`max-w-md w-full mx-auto border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-300 transform hover:translate-y-[-2px] animate-ticket-slip ${
        isDarkMode 
          ? "bg-slate-900 border-white/[0.05] shadow-black/50" 
          : "bg-white border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(59,130,246,0.18)]"
      }`}
    >
      <style>{ticketSlipStyles}</style>
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400" />

      {/* Header */}
      <div className={`p-6 sm:p-8 text-center bg-gradient-to-b from-white/[0.02] to-transparent border-b ${
        isDarkMode ? "border-b-white/[0.04]" : "border-b-slate-100 bg-slate-50/20"
      }`}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm transform hover:scale-105 transition-transform duration-300">
          <CheckCircle2 size={26} strokeWidth={2.2} className="animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
        <h2 className={`text-xl sm:text-2xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          {movie?.title || 'Movie Ticket'}
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 font-semibold select-none">ShowX Cinema Hub &bull; E-Ticket</p>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div className={`grid grid-cols-2 gap-3 text-center p-3.5 sm:p-4 rounded-2xl border shadow-inner transition-colors duration-300 ${
          isDarkMode ? "bg-slate-950 border-white/[0.04]" : "bg-stone-50 border-stone-100"
        }`}>
          <div className={`border-r ${isDarkMode ? "border-white/5" : "border-stone-200"}`}>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-black tracking-widest select-none">Order Reference</span>
            <span className="text-xs font-mono font-black text-amber-500 block mt-0.5 truncate px-1">{bookingId}</span>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-black tracking-widest select-none">Status</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/20 inline-block mt-0.5 uppercase tracking-wider font-mono">
              {booking.status === 'confirmed' ? 'PAID SUCCESS' : booking.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className={`space-y-3.5 text-xs font-medium border-b pb-5 sm:pb-6 ${isDarkMode ? "border-white/[0.04]" : "border-slate-100"}`}>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><MapPin size={13} /> Multiplex Venue</span>
            <span className={`font-black text-right truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{theatre?.name || 'ShowX Cinema Hub'}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><Film size={13} /> Format / Screen</span>
            <span className={`font-black text-right truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>{booking.show?.format || '—'} &bull; {booking.show?.screen || '—'}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><Calendar size={13} /> Date &amp; Time</span>
            <span className={`font-black text-right truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>
              {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} &bull; {booking.show?.showTime || ''}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><Ticket size={13} /> Reserved Seats</span>
            <span className="font-mono font-black text-amber-500 tracking-wider text-xs sm:text-sm text-right truncate">
              {booking.seats?.join(', ') || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0 select-none font-bold"><CreditCard size={13} /> Amount Paid</span>
            <span className={`font-black text-xs sm:text-sm font-mono text-right ${isDarkMode ? "text-white" : "text-emerald-600"}`}>₹{booking.totalAmount}.00</span>
          </div>
          {booking.razorpayPaymentId && (
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 dark:text-slate-500 shrink-0 select-none font-bold">Payment ID</span>
              <span className="text-[10px] font-mono text-slate-500 text-right truncate">{booking.razorpayPaymentId}</span>
            </div>
          )}
        </div>

        {/* Barcode */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl gap-2 shadow-md border border-slate-100 select-none group/barcode cursor-pointer">
          <div className="w-full h-10 sm:h-12 bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_2px,#fff_2px,#fff_7px)] opacity-95 rounded group-hover/barcode:opacity-100 transition-opacity duration-300" />
          <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.25em] sm:tracking-[0.35em] text-slate-500 truncate max-w-full px-1 uppercase">
            {bookingId}
          </span>
        </div>
      </div>
    </div>
  );
});

TicketSlip.displayName = 'TicketSlip';
export default TicketSlip;