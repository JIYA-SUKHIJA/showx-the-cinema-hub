// src/pages/Payment.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Loader2, Film, Ticket, MapPin, CalendarClock, ChevronLeft, CreditCard, Trash2 } from 'lucide-react';

export default function Payment() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { selectedMovie, selectedCinema, selectedShowtime, selectedSeats, totalAmount, clearBookingSession } = useBooking();
  const { isScriptLoaded, openPaymentModal } = useRazorpay();
  const [isPaying, setIsPaying] = useState(false);

  // Fallback defaults if the context session was refreshed mid-flight
  const movieTitle = selectedMovie?.title || 'Active Blockbuster Selection';
  const cinemaName = selectedCinema || 'Showx Premium Multiplex Lounge';
  const showtimeSlot = selectedShowtime || 'Today, Evening Show';
  const seatCount = selectedSeats?.length || 0;
  const basePrice = seatCount * 200;
  const convenientFee = seatCount > 0 ? 30 : 0;
  const finalPayable = totalAmount > 0 ? totalAmount + convenientFee : 0;

  const handleClearSelection = () => {
    clearBookingSession();
    // Redirect back to main directory after clear out out
    navigate('/movies');
  };

  const handleRazorpayGateway = async (e) => {
    e.preventDefault();
    setIsPaying(true);

    try {
      const mockBackendOrderData = {
        orderId: 'SHX-' + Math.floor(100000 + Math.random() * 900000),
        amount: finalPayable * 100 // Convert total scale currency to base integers (paise)
      };

      openPaymentModal(mockBackendOrderData, (paymentResult) => {
        console.log('Payment captured verified token:', paymentResult);
        setIsPaying(false);
        // Safely pass the actual order ID dynamically into the routing path
        navigate(`/confirmation/${mockBackendOrderData.orderId}`);
      });

    } catch (err) {
      console.error(err);
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans antialiased">
      
      {/* Return Flow Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
            isDarkMode ? "text-slate-400 hover:text-gold" : "text-stone-500 hover:text-amber-700"
          }`}
        >
          <ChevronLeft size={14} strokeWidth={2.5} /> Back to Seat Allocation
        </button>

        {/* Dynamic Clear Selection Button */}
        {seatCount > 0 && (
          <button
            onClick={handleClearSelection}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors cursor-pointer bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30"
          >
            <Trash2 size={13} /> Remove All Selected Seats
          </button>
        )}
      </div>

      {/* Main Checkout Operational Section Splitter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* --- LEFT HAND SIDE: SECURE PAYMENTS GATEWAY SELECTION (3 Columns) --- */}
        <div className={`md:col-span-3 border rounded-[32px] p-6 sm:p-8 shadow-xl space-y-6 transition-all duration-300 ${
          isDarkMode 
            ? "bg-gradient-to-b from-white/[0.02] to-transparent border-white/[0.04]" 
            : "bg-white border-stone-200"
        }`}>
          <div className="space-y-1.5">
            <h2 className={`text-xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              Secure Payment Methods
            </h2>
            <p className="text-xs text-slate-500 font-medium">Verified multi-channel security layers active via native API endpoints.</p>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDarkMode ? "bg-slate-950/40 border-white/[0.04]" : "bg-stone-50 border-stone-200"
          }`}>
            <CreditCard size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className={`text-xs font-black uppercase tracking-wide block ${isDarkMode ? "text-slate-300" : "text-stone-800"}`}>
                Instant Gateway Settlement
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Supports all major Indian credit nodes, corporate debit cards, immediate NetBanking, and UPI aggregators directly inside a single modal overlay dashboard.
              </p>
            </div>
          </div>

          {/* Interactive Trigger Button */}
          <div className="pt-4">
            <button
              onClick={handleRazorpayGateway}
              disabled={!isScriptLoaded || isPaying || seatCount === 0}
              className={`w-full font-black tracking-wider text-xs uppercase py-4 rounded-xl transition-all border flex items-center justify-center gap-2 shadow-lg ${
                seatCount > 0
                  ? isDarkMode
                    ? "bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 border-transparent shadow-white/5 active:scale-98 cursor-pointer"
                    : "bg-stone-950 text-white hover:bg-amber-600 border-transparent shadow-md active:scale-98 cursor-pointer"
                  : isDarkMode
                    ? "bg-white/[0.02] border-white/[0.04] text-slate-600 cursor-not-allowed"
                    : "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              {isPaying ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Verifying Transaction Nodes...
                </>
              ) : seatCount > 0 ? (
                <>
                  <ShieldCheck size={14} /> Pay Securely ₹{finalPayable}.00
                </>
              ) : (
                "Cart is Empty"
              )}
            </button>
          </div>
        </div>

        {/* --- RIGHT HAND SIDE: LIVE CINEMA BOOKING RECEIPT SLATE (2 Columns) --- */}
        <div className={`md:col-span-2 border rounded-[32px] p-6 shadow-xl relative overflow-hidden space-y-6 transition-all duration-300 ${
          isDarkMode 
            ? "bg-slate-950 border-white/[0.04]" 
            : "bg-gradient-to-br from-[#faf9f5] to-[#eae7dc] border-stone-200/80"
        }`}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600 to-yellow-600" />
          
          {/* Movie Meta Box Header */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Reservation Order</span>
            <h3 className={`text-lg font-display font-black tracking-tight leading-snug ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              {movieTitle}
            </h3>
            
            <div className={`space-y-2 pt-2 text-[11px] font-medium border-t ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
              <p className="text-slate-500 flex items-center gap-1.5"><MapPin size={13} className="text-amber-600 shrink-0" /> {cinemaName}</p>
              <p className="text-slate-500 flex items-center gap-1.5"><CalendarClock size={13} className="text-amber-600 shrink-0" /> {showtimeSlot}</p>
              <p className="text-slate-500 flex items-center gap-1.5">
                <Ticket size={13} className="text-amber-600 shrink-0" /> 
                Seats: <span className="font-mono font-bold text-amber-600">{seatCount > 0 ? selectedSeats.sort().join(', ') : 'None'}</span>
              </p>
            </div>
          </div>

          {/* Pricing Ledger Spreadsheet Breakdown */}
          <div className={`border-t pt-4 space-y-2.5 text-xs ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Ticket Base Fare ({seatCount} x ₹200)</span>
              <span className={isDarkMode ? "text-slate-300 font-mono" : "text-stone-700 font-mono"}>₹{basePrice}.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Integrated Convenience Fee</span>
              <span className={isDarkMode ? "text-slate-300 font-mono" : "text-stone-700 font-mono"}>₹{convenientFee}.00</span>
            </div>
            <hr className={isDarkMode ? "border-white/[0.04] my-1" : "border-stone-200/60 my-1"} />
            <div className="flex justify-between items-baseline pt-1">
              <span className={`font-black uppercase tracking-wider text-[10px] ${isDarkMode ? "text-white" : "text-stone-900"}`}>Total Gross Amount</span>
              <span className="text-lg font-black text-amber-600 font-mono">₹{finalPayable}.00</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}