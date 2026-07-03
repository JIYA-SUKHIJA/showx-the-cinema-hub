// src/pages/Confirmation.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CheckCircle2, Ticket, MapPin, CreditCard, ChevronRight } from 'lucide-react';

export default function Confirmation() {
  const navigate = useNavigate();
  const { selectedSeats, totalAmount, clearBookingSession } = useBooking();

  const bookingRef = React.useMemo(() => {
    return 'SHX-' + Math.floor(100000 + Math.random() * 900000);
  }, []);

  const handleReturnHome = () => {
    clearBookingSession();
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 border border-white/[0.05] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden my-12 relative group">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400" />

      {/* Success Banner Top */}
      <div className="p-8 text-center bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/[0.04]">
        <div className="w-14 h-14 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CheckCircle2 size={28} strokeWidth={2.2} />
        </div>
        <h2 className="text-2xl font-display font-black tracking-tight text-white">Booking Confirmed</h2>
        <p className="text-slate-400 text-xs mt-1">Your credentials have been securely stored</p>
      </div>

      {/* Ticket Details Body */}
      <div className="p-6 space-y-6">
        
        {/* Reference Numbers */}
        <div className="grid grid-cols-2 gap-4 text-center bg-slate-950 p-4 rounded-2xl border border-white/[0.04] shadow-inner">
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-black tracking-widest">Order Reference</span>
            <span className="text-xs font-mono font-bold text-amber-500">{bookingRef}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block uppercase font-black tracking-widest">Gateway Response</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 inline-block mt-1 uppercase tracking-wide">
              PAID SUCCESS
            </span>
          </div>
        </div>

        {/* Ticket Summary List */}
        <div className="space-y-3.5 text-xs font-medium border-b border-white/[0.04] pb-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5"><MapPin size={13} /> Multiplex Venue</span>
            <span className="font-bold text-white">Showx Cinema Hub</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5"><Ticket size={13} /> Reserved Nodes</span>
            <span className="font-mono font-bold text-amber-500 tracking-wider text-sm">
              {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'A-5, A-6, A-7'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1.5"><CreditCard size={13} /> Settled Invoice</span>
            <span className="font-black text-sm text-white font-mono">₹{totalAmount > 0 ? totalAmount : '600'}.00</span>
          </div>
        </div>

        {/* Visual Mock Barcode Indicator */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl gap-2 shadow-xl border border-white">
          <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,#0f172a,#0f172a_2px,#fff_2px,#fff_7px)] opacity-95 rounded" />
          <span className="text-[9px] font-mono font-black tracking-[0.35em] text-slate-500 select-none">
            {bookingRef}
          </span>
        </div>

        {/* Redirect Button */}
        <button
          onClick={handleReturnHome}
          className="w-full bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 font-black tracking-wide text-xs uppercase py-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
        >
          Return to Dashboard Home <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}