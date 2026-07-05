import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { showxToast } from '../utils/toastConfig';
import { CreditCard, Ticket, ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-[#060608] text-white p-10 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[#111114] border border-white/[0.05] p-8 rounded-3xl"
      >
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-white flex items-center gap-2 mb-8">
          <ArrowLeft size={16} /> Back
        </button>

        <h2 className="text-2xl font-black uppercase text-[#FF9F00] mb-8">Checkout</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between border-b border-white/[0.05] pb-4">
            <span className="text-sm font-bold text-slate-400">Movie</span>
            <span className="text-sm font-black">{bookingData.movieName}</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.05] pb-4">
            <span className="text-sm font-bold text-slate-400">Seats</span>
            <span className="text-sm font-black">{bookingData.selectedSeats?.join(', ')}</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.05] pb-4">
            <span className="text-sm font-bold text-slate-400">Total Amount</span>
            <span className="text-2xl font-black text-emerald-500">₹{bookingData.totalAmount}</span>
          </div>
        </div>

        <button 
          onClick={() => { showxToast.success("Payment Successful!"); navigate('/dashboard'); }}
          className="w-full mt-10 bg-[#FF9F00] text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#FF9F00]/90 transition-all flex items-center justify-center gap-2"
        >
          <CreditCard size={18} /> Confirm Payment
        </button>
      </motion.div>
    </div>
  );
}