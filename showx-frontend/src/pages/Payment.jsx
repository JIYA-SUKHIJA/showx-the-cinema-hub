// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, Loader2, Ticket, MapPin, CalendarClock, 
  ChevronLeft, CreditCard, Trash2, Clock
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
      className="max-w-5xl mx-auto space-y-6 font-sans antialiased"
    >
      
      <div className={`p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-black tracking-wide border border-dashed ${
        isDarkMode 
          ? "bg-amber-500/5 border-amber-500/20 text-amber-400" 
          : "bg-amber-50 border-amber-400/40 text-amber-800"
      }`}>
        <Clock size={14} className="animate-pulse" />
        <span>Secure Seat Reservation Locked! Completing transaction within:</span>
        <span className="font-mono text-sm bg-black/10 px-2 py-0.5 rounded border border-current">
          {formatTimer(timeLeft)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <motion.button 
          whileHover={{ scale: 1.05, filter: "brightness(1.05)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none outline-none ${
            isDarkMode ? "text-slate-400 hover:text-amber-500" : "text-stone-500 hover:text-amber-700"
          }`}
        >
          <ChevronLeft size={14} strokeWidth={2.5} /> Back to Seat Allocation
        </motion.button>

        {seatCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClearSelection}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors cursor-pointer bg-red-500/5 px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/30"
          >
            <Trash2 size={13} /> Remove All Selected Seats
          </motion.button>
        )}
      </div>

      {errorMsg && (
        <p className="text-center text-xs font-bold text-rose-500">{errorMsg}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        <div className={`md:col-span-3 border rounded-[32px] p-6 sm:p-8 shadow-xl space-y-6 transition-all duration-300 ${
          isDarkMode 
            ? "bg-gradient-to-b from-white/[0.02] to-transparent border-white/[0.04] bg-slate-900/40" 
            : "bg-white border-stone-200"
        }`}>
          <div className="space-y-1.5">
            <h2 className={`text-xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              Secure Payment
            </h2>
            <p className="text-xs text-slate-500 font-medium">Verified multi-channel security layers active via native API endpoints.</p>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isDarkMode ? "bg-slate-950/40 border-white/[0.04]" : "bg-stone-50 border-stone-200"
          }`}>
            <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
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
              whileHover={seatCount > 0 && !isPaying ? { scale: 1.02, filter: "brightness(1.05)" } : {}}
              whileTap={seatCount > 0 && !isPaying ? { scale: 0.98 } : {}}
              onClick={handleRazorpayGateway}
              disabled={!isScriptLoaded || isPaying || seatCount === 0}
              className={`w-full font-black tracking-wider text-xs uppercase py-4 rounded-xl transition-all border flex items-center justify-center gap-2 shadow-lg ${
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
                  <Loader2 size={14} className="animate-spin" /> Verifying Transaction Nodes...
                </>
              ) : seatCount > 0 ? (
                <>
                  <ShieldCheck size={14} /> Pay Securely ₹{finalPayable}.00
                </>
              ) : (
                "Cart is Empty"
              )}
            </motion.button>
          </div>
        </div>

        <div className={`md:col-span-2 border rounded-[32px] p-6 shadow-xl relative overflow-hidden space-y-5 transition-all duration-300 ${
          isDarkMode ? "bg-slate-950 border-white/[0.04]" : "bg-gradient-to-br from-[#faf9f5] to-[#eae7dc] border-stone-200/80"
        }`}>
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-600 to-yellow-600" />
          
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Reservation Order</span>
            <h3 className={`text-lg font-display font-black tracking-tight leading-snug ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              {movieTitle}
            </h3>
            
            <div className={`space-y-2 pt-2 text-[11px] font-medium border-t ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
              <p className="text-slate-500 flex items-center gap-1.5"><MapPin size={13} className="text-amber-600 shrink-0" /> {cinemaName}</p>
              <p className="text-slate-500 flex items-center gap-1.5"><CalendarClock size={13} className="text-amber-600 shrink-0" /> {showtimeSlot}</p>
              <div className="text-slate-500 flex items-start gap-1.5">
                <Ticket size={13} className="text-amber-600 shrink-0 mt-0.5" /> 
                <div className="flex flex-wrap gap-1">
                  {seatCount > 0 ? selectedSeats.sort().map((seat) => (
                    <span key={seat} className="font-mono font-bold text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded border border-amber-500/10">
                      {seat}
                    </span>
                  )) : <span className="font-medium text-slate-400">None Allocation</span>}
                </div>
              </div>
            </div>
          </div>

          <div className={`border-t pt-4 space-y-2.5 text-xs ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Ticket Amount ({seatCount} seats)</span>
              <span className={isDarkMode ? "text-slate-300 font-mono" : "text-stone-700 font-mono"}>₹{basePrice}.00</span>
            </div>
            <hr className={isDarkMode ? "border-white/[0.04] my-1" : "border-stone-200/60 my-1"} />
            <div className="flex justify-between items-baseline pt-1">
              <span className={`font-black uppercase tracking-wider text-[10px] ${isDarkMode ? "text-white" : "text-stone-900"}`}>Total Grand Payable</span>
              <span className="text-lg font-black text-amber-600 font-mono">₹{finalPayable}.00</span>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}