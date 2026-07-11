// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, Loader2, Ticket, MapPin, CalendarClock, 
  ChevronLeft, Trash2, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PaymentPageSkeleton } from '../components/atoms/Skeletons';
import { showxToast } from '../utils/toastConfig';
import axiosInstance from '../services/axiosInstance';

export default function Payment() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { selectedMovie, selectedCinema, selectedShowtime, selectedSeats, totalAmount, bookingId, clearBookingSession } = useBooking();
  const { isScriptLoaded, openPaymentModal } = useRazorpay();
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const movieTitle = selectedMovie?.title || 'Active Blockbuster Selection';
  const cinemaName = selectedCinema || 'Showx Premium Multiplex Lounge';
  const showtimeSlot = selectedShowtime || 'Today, Evening Show';
  const seatCount = selectedSeats?.length || 0;

  const basePrice = totalAmount;
  const finalPayable = basePrice;

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (isScriptLoaded) {
      const skeletonTimer = setTimeout(() => setLoading(false), 550);
      return () => clearTimeout(skeletonTimer);
    }
  }, [isScriptLoaded]);

  useEffect(() => {
    if (timeLeft <= 0) {
      showxToast.bookingFailed("SESSION EXPIRED");
      clearBookingSession();
      navigate('/movies');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate, clearBookingSession]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClearSelection = () => {
    clearBookingSession();
    navigate('/movies');
  };

  const handleRazorpayGateway = async (e) => {
    e.preventDefault();

    if (!bookingId) {
      setErrorMsg("No active booking found. Please select seats again.");
      return;
    }

    setIsPaying(true);
    setErrorMsg('');

    try {
      const orderRes = await axiosInstance.post('/payments/create-order', { bookingId });
      const { order, key } = orderRes.data;

      openPaymentModal({ orderId: order.id, amount: order.amount, key }, async (paymentResult) => {
        try {
          await axiosInstance.post('/payments/verify', {
            razorpay_order_id: paymentResult.razorpayOrderId,
            razorpay_payment_id: paymentResult.razorpayPaymentId,
            razorpay_signature: paymentResult.razorpaySignature,
            bookingId,
          });

          setIsPaying(false);
          showxToast.paymentSuccess(paymentResult.razorpayPaymentId);
          showxToast.bookingSuccess(movieTitle);
          clearBookingSession();
          navigate(`/confirmation/${paymentResult.razorpayPaymentId}`);
        } catch (verifyErr) {
          setIsPaying(false);
          setErrorMsg(verifyErr.response?.data?.message || "Payment verification failed.");
          showxToast.paymentFailed();
        }
      });
    } catch (err) {
      console.error(err);
      setIsPaying(false);
      setErrorMsg(err.response?.data?.message || "Could not start payment. Please try again.");
      showxToast.paymentFailed();
    }
  };

  if (loading) {
    return <PaymentPageSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto space-y-5 sm:space-y-6 font-sans antialiased w-full px-1 sm:px-0 overflow-x-hidden"
    >
      
      {/* Top Countdown Session Lock Alert Row */}
      <div className={`p-3.5 rounded-2xl flex flex-col xs:flex-row items-center justify-center text-center xs:text-left gap-2 text-xs font-black tracking-wide border border-dashed ${
        isDarkMode 
          ? "bg-amber-500/5 border-amber-500/20 text-amber-400" 
          : "bg-amber-50 border-amber-400/40 text-amber-800"
      }`}>
        <div className="flex items-center gap-1.5 shrink-0">
          <Clock size={14} className="animate-pulse" />
          <span>Secure Seat Reservation Locked!</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1 xs:mt-0">
          <span className="hidden xs:inline">Completing transaction within:</span>
          <span className="font-mono text-xs sm:text-sm bg-black/10 px-2 py-0.5 rounded border border-current font-black">
            {formatTimer(timeLeft)}
          </span>
        </div>
      </div>

      {/* Control Actions Dispatch Deck */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none outline-none self-start focus:outline-none min-h-[32px] ${
            isDarkMode ? "text-slate-400 hover:text-amber-500" : "text-stone-500 hover:text-amber-700"
          }`}
        >
          <ChevronLeft size={14} strokeWidth={2.5} /> Back to Seat Allocation
        </motion.button>

        {seatCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClearSelection}
            className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors cursor-pointer bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10 hover:border-red-500/30 w-full sm:w-auto text-center min-h-[36px] select-none"
          >
            <Trash2 size={13} /> Remove All Selected Seats
          </motion.button>
        )}
      </div>

      {errorMsg && (
        <p className="text-center text-xs font-bold text-rose-500 font-mono">{errorMsg}</p>
      )}

      {/* Primary Payment Row Shell Splits */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 items-start w-full">
        
        {/* Left Side: Secure payment authorization frame */}
        <div className={`md:col-span-3 border rounded-2xl sm:rounded-[32px] p-5 sm:p-8 shadow-xl space-y-5 sm:space-y-6 transition-all duration-300 w-full ${
          isDarkMode 
            ? "bg-gradient-to-b from-white/[0.02] to-transparent border-white/[0.04] bg-slate-900/40" 
            : "bg-white border-stone-200"
        }`}>
          <div className="space-y-1">
            <h2 className={`text-lg sm:text-xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              Secure Payment
            </h2>
            <p className="text-xs text-slate-500 font-medium">Verified multi-channel security layers active via native API endpoints.</p>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDarkMode ? "bg-slate-950/40 border-white/[0.04]" : "bg-stone-50 border-stone-200"
          }`}>
            <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <span className={`text-xs font-black uppercase tracking-wide block ${isDarkMode ? "text-slate-300" : "text-stone-800"}`}>
                Powered by Razorpay
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                Supports all major Indian credit/debit cards, Netbanking, wallets, and UPI — all inside one secure checkout window.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={seatCount > 0 && !isPaying ? { scale: 1.01, filter: "brightness(1.04)" } : {}}
              whileTap={seatCount > 0 && !isPaying ? { scale: 0.99 } : {}}
              onClick={handleRazorpayGateway}
              disabled={!isScriptLoaded || isPaying || seatCount === 0}
              className={`w-full font-black tracking-wider text-xs uppercase py-3.5 rounded-xl transition-all border flex items-center justify-center gap-2 shadow-lg min-h-[46px] ${
                seatCount > 0
                  ? isDarkMode
                    ? "bg-white text-slate-950 border-transparent shadow-white/5 cursor-pointer"
                    : "bg-stone-950 text-white border-transparent shadow-md cursor-pointer"
                  : isDarkMode
                    ? "bg-white/[0.02] border-white/[0.04] text-slate-600 cursor-not-allowed"
                    : "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              {isPaying ? (
                <>
                  <Loader2 size={14} className="animate-spin shrink-0" /> Verifying Transaction Nodes...
                </>
              ) : seatCount > 0 ? (
                <>
                  <ShieldCheck size={14} className="shrink-0" /> Pay Securely ₹{finalPayable}.00
                </>
              ) : (
                "Cart is Empty"
              )}
            </motion.button>
          </div>
        </div>

        {/* Right Side: Reservation calculations card stack */}
        <div className={`md:col-span-2 border rounded-2xl sm:rounded-[32px] p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5 transition-all duration-300 w-full ${
          isDarkMode ? "bg-slate-950 border-white/[0.04]" : "bg-gradient-to-br from-[#faf9f5] to-[#eae7dc] border-stone-200/80"
        }`}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600 to-yellow-600" />
          
          <div className="space-y-2.5">
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-500 block">Reservation Order</span>
            <h3 className={`text-base sm:text-lg font-display font-black tracking-tight leading-snug truncate ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              {movieTitle}
            </h3>
            
            <div className={`space-y-2 pt-2.5 text-[11px] font-medium border-t w-full overflow-hidden ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
              <p className="text-slate-500 flex items-center gap-1.5 truncate"><MapPin size={12} className="text-amber-600 shrink-0" /> {cinemaName}</p>
              <p className="text-slate-500 flex items-center gap-1.5 truncate"><CalendarClock size={12} className="text-amber-600 shrink-0" /> {showtimeSlot}</p>
              
              <div className="text-slate-500 flex items-start gap-1.5 w-full pt-0.5">
                <Ticket size={12} className="text-amber-600 shrink-0 mt-0.5" /> 
                <div className="flex flex-wrap gap-1 w-full">
                  {seatCount > 0 ? selectedSeats.sort().map((seat) => (
                    <span key={seat} className="font-mono font-bold text-[11px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded border border-amber-500/10 shrink-0">
                      {seat}
                    </span>
                  )) : <span className="font-medium text-slate-400">None Allocation</span>}
                </div>
              </div>
            </div>
          </div>

          <div className={`border-t pt-3.5 space-y-2 text-xs w-full ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
            <div className="flex justify-between font-medium items-center">
              <span className="text-slate-500">Ticket Amount ({seatCount} seats)</span>
              <span className={`font-mono text-right ${isDarkMode ? "text-slate-300" : "text-stone-700"}`}>₹{basePrice}.00</span>
            </div>
            <hr className={`my-1 border-solid ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`} />
            <div className="flex justify-between items-baseline pt-1">
              <span className={`font-black uppercase tracking-wider text-[9px] sm:text-[10px] ${isDarkMode ? "text-white" : "text-stone-900"}`}>Total Grand Payable</span>
              <span className="text-base sm:text-lg font-black text-amber-600 font-mono text-right">₹{finalPayable}.00</span>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}