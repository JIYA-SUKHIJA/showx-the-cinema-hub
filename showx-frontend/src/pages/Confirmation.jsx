// src/pages/Confirmation.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CheckCircle2, Ticket, MapPin, CreditCard, ChevronRight } from 'lucide-react';

export default function Confirmation() {
  const navigate = useNavigate();
  const { bookingId } = useParams(); 
  const { selectedSeats, totalAmount, clearBookingSession } = useBooking();

  const handleReturnHome = () => {
    clearBookingSession();
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-white/[0.05] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden my-6 sm:my-12 relative group w-full px-1 sm:px-0">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400" />

      {/* Success Banner Top */}
      <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/[0.04]">
        <div className="w-12 h-14 sm:w-14 sm:h-14 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-inner">
          <CheckCircle2 size={26} strokeWidth={2.2} />
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">Booking Confirmed</h2>
        <p className="text-slate-400 text-xs mt-1">Your credentials have been securely stored</p>
      </div>

      {/* Ticket Details Body */}
      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        
        {/* Reference Numbers — Balanced flex layout alignment dynamically */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-center bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-white/[0.04] shadow-inner w-full overflow-hidden">
          <div className="xs:border-r xs:border-white/5 pb-2.5 xs:pb-0">
            <span className="text-[9px] sm:text-[10px] text-slate-500 block uppercase font-black tracking-widest">Order Reference</span>
            <span className="text-xs font-mono font-bold text-amber-500 block mt-0.5 truncate px-1">{bookingId || "SHX-STABLE"}</span>
          </div>
          <div className="pt-1.5 xs:pt-0">
            <span className="text-[9px] sm:text-[10px] text-slate-500 block uppercase font-black tracking-widest">Gateway Response</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 inline-block mt-0.5 uppercase tracking-wide font-mono">
              PAID SUCCESS
            </span>
          </div>
        </div>

        {/* Ticket Summary List */}
        <div className="space-y-3.5 text-xs font-medium border-b border-white/[0.04] pb-5 sm:pb-6 w-full overflow-hidden">
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><MapPin size={13} /> Multiplex Venue</span>
            <span className="font-bold text-white text-right truncate">Showx Cinema Hub</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><Ticket size={13} /> Reserved Nodes</span>
            <span className="font-mono font-bold text-amber-500 tracking-wider text-xs sm:text-sm text-right truncate max-w-[200px] xs:max-w-none">
              {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'A-5, A-6, A-7'}
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1.5 shrink-0"><CreditCard size={13} /> Settled Invoice</span>
            <span className="font-black text-xs sm:text-sm text-white font-mono text-right">₹{totalAmount > 0 ? totalAmount : '600'}.00</span>
          </div>
        </div>

        {/* Visual Mock Barcode Indicator */}
        <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl gap-2 shadow-xl border border-white select-none">
          <div className="w-full h-10 sm:h-12 bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_2px,#fff_2px,#fff_7px)] opacity-95 rounded" />
          <span className="text-[8px] sm:text-[9px] font-mono font-black tracking-[0.25em] sm:tracking-[0.35em] text-slate-500 truncate max-w-full px-1">
            {bookingId || "SHX-STABLE"}
          </span>
        </div>

        {/* Redirect Button */}
        <button
          onClick={handleReturnHome}
          className="w-full bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 font-black tracking-wide text-xs uppercase py-3.5 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 border-none min-h-[44px] focus:outline-none"
        >
          Return to Dashboard Home <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}