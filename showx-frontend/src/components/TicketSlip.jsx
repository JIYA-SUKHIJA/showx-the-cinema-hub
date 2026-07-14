// src/components/TicketSlip.jsx
import React, { forwardRef } from 'react';
import { CheckCircle2, Ticket, MapPin, CreditCard, Film, Calendar } from 'lucide-react';

// booking shape expected:
// {
//   _id, seats: [], totalAmount, status, createdAt, razorpayPaymentId,
//   show: { showTime, format, screen, movie: { title, poster }, theatre: { name, location } }
// }

const TicketSlip = forwardRef(({ booking }, ref) => {
  if (!booking) return null;

  const movie = booking.show?.movie;
  const theatre = booking.show?.theatre;
  const bookingId = booking._id?.slice(-8).toUpperCase() || "SHX-STABLE";

  return (
    <div
      ref={ref}
      className="max-w-md w-full mx-auto bg-slate-900 border border-white/[0.05] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400" />

      {/* Header */}
      <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/[0.04]">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-inner">
          <CheckCircle2 size={26} strokeWidth={2.2} />
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
          {movie?.title || 'Movie Ticket'}
        </h2>
        <p className="text-slate-400 text-xs mt-1">ShowX Cinema Hub &bull; E-Ticket</p>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        <div className="grid grid-cols-2 gap-3 text-center bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-white/[0.04] shadow-inner">
          <div className="border-r border-white/5">
            <span className="text-[9px] sm:text-[10px] text-slate-500 block uppercase font-black tracking-widest">Order Reference</span>
            <span className="text-xs font-mono font-bold text-amber-500 block mt-0.5 truncate px-1">{bookingId}</span>
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 block uppercase font-black tracking-widest">Status</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 inline-block mt-0.5 uppercase tracking-wide font-mono">
              {booking.status === 'confirmed' ? 'PAID SUCCESS' : booking.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-3.5 text-xs font-medium border-b border-white/[0.04] pb-5 sm:pb-6">
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><MapPin size={13} /> Multiplex Venue</span>
            <span className="font-bold text-white text-right truncate">{theatre?.name || 'ShowX Cinema Hub'}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><Film size={13} /> Format / Screen</span>
            <span className="font-bold text-white text-right truncate">{booking.show?.format || '—'} &bull; {booking.show?.screen || '—'}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><Calendar size={13} /> Date &amp; Time</span>
            <span className="font-bold text-white text-right truncate">
              {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} &bull; {booking.show?.showTime || ''}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><Ticket size={13} /> Reserved Seats</span>
            <span className="font-mono font-bold text-amber-500 tracking-wider text-xs sm:text-sm text-right truncate">
              {booking.seats?.join(', ') || '—'}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><CreditCard size={13} /> Amount Paid</span>
            <span className="font-black text-xs sm:text-sm text-white font-mono text-right">₹{booking.totalAmount}.00</span>
          </div>
          {booking.razorpayPaymentId && (
            <div className="flex justify-between items-center gap-4">
              <span className="text-slate-400 shrink-0">Payment ID</span>
              <span className="text-[10px] font-mono text-slate-500 text-right truncate">{booking.razorpayPaymentId}</span>
            </div>
          )}
        </div>

        {/* Barcode */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl gap-2 shadow-xl border border-white select-none">
          <div className="w-full h-10 sm:h-12 bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_2px,#fff_2px,#fff_7px)] opacity-95 rounded" />
          <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.25em] sm:tracking-[0.35em] text-slate-500 truncate max-w-full px-1">
            {bookingId}
          </span>
        </div>
      </div>
    </div>
  );
});

TicketSlip.displayName = 'TicketSlip';
export default TicketSlip;