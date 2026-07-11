// src/pages/Checkout.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showxToast } from '../utils/toastConfig';
import { CreditCard, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-[#060608] text-white p-3 sm:p-6 md:p-10 flex justify-center items-center w-full overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#111114] border border-white/[0.05] p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl relative"
      >
        {/* Back Link Control Navigation target set to min 44px for safe mobile interactions */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-slate-500 hover:text-white flex items-center gap-2 mb-6 sm:mb-8 bg-transparent border-none outline-none cursor-pointer text-xs font-bold transition-colors min-h-[44px] focus:outline-none"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FF9F00] mb-6 sm:mb-8 tracking-wide">
          Checkout
        </h2>
        
        {/* Particulars Stack — Enhanced with flexible auto-wrapping layout properties */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.05] pb-4 gap-4 w-full overflow-hidden">
            <span className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">Movie</span>
            <span className="text-xs sm:text-sm font-black text-right truncate max-w-[180px] xs:max-w-none">{bookingData.movieName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/[0.05] pb-4 gap-4 w-full overflow-hidden">
            <span className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">Seats</span>
            <span className="text-xs sm:text-sm font-black text-right font-mono text-amber-500 truncate max-w-[180px] xs:max-w-none">
              {bookingData.selectedSeats?.join(', ')}
            </span>
          </div>
          <div className="flex justify-between items-baseline border-b border-white/[0.05] pb-4 gap-4 w-full overflow-hidden">
            <span className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">Total Amount</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">₹{bookingData.totalAmount}</span>
          </div>
        </div>

        {/* Dynamic Action Trigger Button Block */}
        <button 
          onClick={() => { showxToast.success("Payment Successful!"); navigate('/dashboard'); }}
          className="w-full mt-8 sm:mt-10 bg-[#FF9F00] text-black py-3.5 sm:py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#FF9F00]/90 transition-all flex items-center justify-center gap-2 border-none cursor-pointer text-xs min-h-[44px] focus:outline-none shadow-lg shadow-orange-500/5 active:scale-[0.99]"
        >
          <CreditCard size={15} strokeWidth={2.5} /> Confirm Payment
        </button>
      </motion.div>
    </div>
  );
}