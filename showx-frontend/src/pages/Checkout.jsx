// src/pages/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showxToast } from '../utils/toastConfig';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Dynamic theme listener connection to ensure white premium alignment

export default function Checkout() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); // Reading absolute application theme status
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // LocalStorage se data fetch karein jo SeatSelection se aaya hai
    const data = JSON.parse(localStorage.getItem('currentBooking'));
    if (!data) {
      showxToast.error("No booking details found!");
      navigate('/movies');
    } else {
      setBookingData(data);
    }
  }, [navigate]);

  if (!bookingData) return null;

  // Pure hardware-accelerated fluid entrance keyframes matrix definitions
  const checkoutKeyframeStyles = `
    @keyframes checkoutFadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-checkout-up {
      animation: checkoutFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <div className={`min-h-screen p-3 sm:p-6 md:p-10 flex justify-center items-center w-full overflow-x-hidden transition-colors duration-300 ${
      isDarkMode ? "bg-[#060608] text-white" : "bg-gradient-to-b from-white via-[#f4f9ff] to-[#eef5fc] text-slate-900"
    }`}>
      <style>{checkoutKeyframeStyles}</style>

      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-lg p-5 sm:p-8 rounded-[28px] shadow-2xl transition-all duration-300 border animate-checkout-up transform hover:translate-y-[-2px] ${
          isDarkMode 
            ? "bg-[#111114] border-white/[0.05] shadow-black/40" 
            : "bg-white border-slate-200/85 shadow-[0_25px_60px_-20px_rgba(59,130,246,0.18)]"
        }`}
      >
        {/* Back Link Control Navigation target set to min 44px for safe mobile interactions */}
        <button 
          onClick={() => navigate(-1)} 
          type="button"
          className={`flex items-center gap-2 mb-6 sm:mb-8 bg-transparent border-none outline-none cursor-pointer text-xs font-bold transition-colors min-h-[44px] focus:outline-none relative group ${
            isDarkMode ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-900"
          }`}
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" /> Back
          <span className="absolute bottom-1 left-5 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
        </button>

        <h2 className={`text-xl sm:text-2xl font-black uppercase mb-6 sm:mb-8 tracking-widest font-mono ${
          isDarkMode ? "text-[#FF9F00]" : "text-stone-900 border-b-2 border-amber-500 w-fit pb-1"
        }`}>
          Checkout
        </h2>
        
        {/* Particulars Stack — Enhanced with precise border opacity controls */}
        <div className="space-y-4 sm:space-y-6 select-none">
          <div className={`flex justify-between items-center border-b pb-4 gap-4 w-full overflow-hidden ${isDarkMode ? "border-white/[0.05]" : "border-slate-100"}`}>
            <span className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">Movie</span>
            <span className={`text-xs sm:text-sm font-black text-right truncate max-w-[180px] xs:max-w-none ${isDarkMode ? "text-white" : "text-slate-800"}`}>{bookingData.movieName}</span>
          </div>
          <div className={`flex justify-between items-center border-b pb-4 gap-4 w-full overflow-hidden ${isDarkMode ? "border-white/[0.05]" : "border-slate-100"}`}>
            <span className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">Seats</span>
            <span className="text-xs sm:text-sm font-black text-right font-mono text-amber-500 truncate max-w-[180px] xs:max-w-none">
              {bookingData.selectedSeats?.join(', ')}
            </span>
          </div>
          <div className={`flex justify-between items-baseline border-b pb-4 gap-4 w-full overflow-hidden ${isDarkMode ? "border-white/[0.05]" : "border-slate-100"}`}>
            <span className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">Total Amount</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">₹{bookingData.totalAmount}</span>
          </div>
        </div>

        {/* Dynamic Action Trigger Button Block — Premium hardware elevation lifter[cite: 11] */}
        <motion.button 
          whileHover={{ scale: 1.015, filter: "brightness(1.04)" }}
          whileTap={{ scale: 0.985 }}
          onClick={() => { showxToast.success("Payment Successful!"); navigate('/dashboard'); }}
          type="button"
          className="w-full mt-8 sm:mt-10 bg-[#FF9F00] text-black py-3.5 sm:py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#FF9F00]/95 transition-all flex items-center justify-center gap-2 border-none cursor-pointer text-xs min-h-[44px] focus:outline-none shadow-md shadow-orange-500/10"
        >
          <CreditCard size={14} strokeWidth={2.5} /> Confirm Payment
        </motion.button>
      </motion.div>
    </div>
  );
}