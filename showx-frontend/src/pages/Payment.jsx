// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useRazorpay } from '../hooks/useRazorpay';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, Loader2, Ticket, MapPin, CalendarClock, 
  ChevronLeft, CreditCard, Trash2, Clock, Percent, Smartphone, Building 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { PaymentPageSkeleton } from '../components/atoms/Skeletons';
import { showxToast } from '../utils/toastConfig';

export default function Payment() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { selectedMovie, selectedCinema, selectedShowtime, selectedSeats, totalAmount, clearBookingSession } = useBooking();
  const { isScriptLoaded, openPaymentModal } = useRazorpay();
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(true);

  const movieTitle = selectedMovie?.title || 'Active Blockbuster Selection';
  const cinemaName = selectedCinema || 'Showx Premium Multiplex Lounge';
  const showtimeSlot = selectedShowtime || 'Today, Evening Show';
  const seatCount = selectedSeats?.length || 0;
  const basePrice = seatCount * 200;
  const convenientFee = seatCount > 0 ? 30 * seatCount : 0; 

  const GST_RATE = 0.18; 
  const gstAmount = Math.round(convenientFee * GST_RATE);

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('gateway');

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

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'SHOWX50') {
      setDiscount(50);
      setIsPromoApplied(true);
    } else {
      setPromoError('Invalid code. Try "SHOWX50"');
    }
  };

  const finalPayable = seatCount > 0 ? (basePrice + convenientFee + gstAmount - discount) : 0;

  const handleClearSelection = () => {
    clearBookingSession();
    navigate('/movies');
  };

  const handleRazorpayGateway = async (e) => {
    e.preventDefault();
    setIsPaying(true);

    try {
      const mockBackendOrderData = {
        orderId: 'SHX-' + Math.floor(100000 + Math.random() * 900000),
        amount: finalPayable * 100 
      };

      openPaymentModal(mockBackendOrderData, (paymentResult) => {
        console.log('Payment captured verified token:', paymentResult);
        setIsPaying(false);
        clearBookingSession(); 
        showxToast.paymentSuccess(mockBackendOrderData.orderId);
        showxToast.bookingSuccess(movieTitle);
        navigate(`/confirmation/${mockBackendOrderData.orderId}`);
      });

    } catch (err) {
      console.error(err);
      setIsPaying(false);
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
      
      {/* --- SESSION TIMER REMINDER OVERLAY HEADER --- */}
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

      {/* Return Flow Controls */}
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

      {/* Main Checkout Operational Section Splitter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* --- LEFT HAND SIDE: SECURE PAYMENTS GATEWAY SELECTION --- */}
        <div className={`md:col-span-3 border rounded-[32px] p-6 sm:p-8 shadow-xl space-y-6 transition-all duration-300 ${
          isDarkMode 
            ? "bg-gradient-to-b from-white/[0.02] to-transparent border-white/[0.04] bg-slate-900/40" 
            : "bg-white border-stone-200"
        }`}>
          <div className="space-y-1.5">
            <h2 className={`text-xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>
              Secure Payment Methods
            </h2>
            <p className="text-xs text-slate-500 font-medium">Verified multi-channel security layers active via native API endpoints.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'gateway', label: 'Razorpay', icon: ShieldCheck },
              { id: 'card', label: 'Cards', icon: CreditCard },
              { id: 'upi', label: 'UPI App', icon: Smartphone }
            ].map((method) => {
              const Icon = method.icon;
              const active = selectedMethod === method.id;
              return (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer bg-transparent ${
                    active 
                      ? "border-amber-500 text-amber-500 bg-amber-500/5 font-black" 
                      : isDarkMode ? "border-white/10 text-slate-400 hover:border-white/20" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} />
                  <span>{method.label}</span>
                </motion.button>
              );
            })}
          </div>

          {selectedMethod === 'gateway' && (
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 animate-in fade-in duration-200 ${
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
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wide text-slate-400">Cardholder Name</label>
                <input type="text" placeholder="Jiya Sukhija" className={`w-full text-xs p-3.5 rounded-xl border outline-none ${isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-amber-500/40" : "bg-stone-50 border-slate-200 text-slate-800"}`} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wide text-slate-400">Card Number Matrix</label>
                <input type="text" placeholder="4532 •••• •••• 8824" maxLength="19" className={`w-full text-xs p-3.5 rounded-xl border outline-none ${isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-amber-500/40" : "bg-stone-50 border-slate-200 text-slate-800"}`} />
              </div>
            </div>
          )}

          {selectedMethod === 'upi' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wide text-slate-400">Virtual Payment Address (UPI ID)</label>
                <input type="text" placeholder="jiya@okhdfcbank" className={`w-full text-xs p-3.5 rounded-xl border outline-none ${isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-amber-500/40" : "bg-stone-50 border-slate-200 text-slate-800"}`} />
              </div>
            </div>
          )}

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

        {/* --- RIGHT HAND SIDE: LIVE CINEMA BOOKING RECEIPT SLATE --- */}
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

          <div className={`pt-4 border-t ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isPromoApplied}
                className={`text-xs px-3 py-2 rounded-xl border outline-none font-mono tracking-wider flex-grow ${
                  isDarkMode ? "bg-slate-900 border-white/5 text-white focus:border-amber-500/30" : "bg-white border-stone-200 text-slate-800"
                }`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isPromoApplied || !promoCode.trim()}
                className={`px-3 py-2 rounded-xl text-xs font-black tracking-wide border-none transition cursor-pointer ${
                  isPromoApplied ? "bg-emerald-500/10 text-emerald-400" : "bg-white text-stone-950 hover:bg-amber-500"
                }`}
              >
                {isPromoApplied ? "Applied" : "Apply"}
              </motion.button>
            </form>
            {promoError && <p className="text-[10px] text-rose-500 font-bold mt-1 pl-1">{promoError}</p>}
            {isPromoApplied && <p className="text-[10px] text-emerald-500 font-bold mt-1 pl-1">Voucher saved ₹50.00!</p>}
          </div>

          <div className={`border-t pt-4 space-y-2.5 text-xs ${isDarkMode ? "border-white/[0.04]" : "border-stone-200/60"}`}>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Ticket Base Fare ({seatCount} x ₹200)</span>
              <span className={isDarkMode ? "text-slate-300 font-mono" : "text-stone-700 font-mono"}>₹{basePrice}.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Integrated Convenience Fee</span>
              <span className={isDarkMode ? "text-slate-300 font-mono" : "text-stone-700 font-mono"}>₹{convenientFee}.00</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-slate-500">Central GST (18% on convenience fee)</span>
              <span className={isDarkMode ? "text-slate-300 font-mono" : "text-stone-700 font-mono"}>₹{gstAmount}.00</span>
            </div>
            {isPromoApplied && (
              <div className="flex justify-between font-bold text-emerald-500">
                <span>Voucher Code Discount</span>
                <span className="font-mono">- ₹{discount}.00</span>
              </div>
            )}
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