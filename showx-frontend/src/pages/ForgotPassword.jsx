// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/atoms/Toast';
import axiosInstance from '../services/axiosInstance';

const ForgotPassword = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setToast({ message: "Recovery credentials dispatched successfully.", type: 'success' });
      setIsSubmitted(true);
    } catch (err) {
      setToast({ message: "Request dispatch failed. Try again.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Pure hardware-accelerated transitions cluster configurations
  const forgotKeyframeStyles = `
    @keyframes forgotFadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-forgot-up {
      animation: forgotFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <div className="w-full px-1 sm:px-2 animate-forgot-up">
      <style>{forgotKeyframeStyles}</style>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Primary Modal View Panel Grid Layer */}
      {!isSubmitted ? (
        <>
          {/* Padlock Icon Box — Enhanced subtle transitions */}
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 transform hover:scale-105 ${
            isDarkMode 
              ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00] hover:border-amber-500/30" 
              : "bg-stone-50 border-stone-200/80 text-amber-600 hover:border-amber-500/40"
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h2 className={`text-xl sm:text-2xl font-black text-center tracking-tight transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Forgot Password?
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1.5 mb-6 sm:mb-8 max-w-[280px] mx-auto leading-relaxed font-semibold select-none">
            No worries! Enter your email and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleResetSubmit} className="space-y-4 sm:space-y-5" noValidate>
            
            {/* Email Address Input Block Container — Pristine White SaaS Polish */}
            <div className="space-y-1">
              <div className="relative flex items-center w-full group">
                <span className="absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
                  className={`peer w-full rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none border transition-all duration-300 pt-5 pb-2 min-h-[46px] shadow-sm font-sans font-semibold ${
                    isDarkMode 
                      ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10" 
                      : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10 hover:border-stone-300"
                  } ${error ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
                  required
                />
                <label htmlFor="email" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-400 font-bold tracking-wider uppercase duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
                  Email Address
                </label>
              </div>
              {error && (
                <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-bold font-mono pl-1">{error}</motion.p>
              )}
            </div>

            {/* Radiant Send Reset Link Trigger Button Option */}
            <motion.button
              whileHover={{ scale: 1.01, filter: "brightness(1.05)" }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-stone-950 shadow-md shadow-amber-500/5 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none min-h-[44px] uppercase tracking-widest"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
            </motion.button>
          </form>

          {/* Separation Divider layout frame */}
          <div className="relative my-6 flex items-center justify-center">
            <div className={`w-full border-t ${isDarkMode ? "border-white/5" : "border-stone-200"}`}></div>
            <span className={`absolute px-4 text-[9px] font-mono font-black tracking-widest uppercase transition-colors ${isDarkMode ? "bg-[#0B0D13] text-slate-600" : "bg-white text-slate-400"}`}>
              or
            </span>
          </div>

          {/* Action Navigation: Back to Login button block */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
            <Link 
              to="/login" 
              className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3.5 text-xs font-bold transition-all min-h-[44px] no-underline shadow-sm ${
                isDarkMode 
                  ? "bg-[#11141D] border-gray-800/40 text-slate-300 hover:bg-[#151924] hover:text-white" 
                  : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </motion.div>
        </>
      ) : (
        /* Dispatched success feedback screen alternative layer view */
        <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} className="text-center py-4 space-y-5">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          
          <div className="space-y-2">
            <h4 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>Link Dispatched</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold px-1">
              We have sent a secure password recovery link to <span className="text-[#FF9F00] font-black break-all">{email}</span>.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="w-full text-center text-xs text-[#FF9F00] font-black uppercase tracking-wider hover:text-amber-500 bg-transparent border-none outline-none pt-4 cursor-pointer transition-colors min-h-[44px]"
          >
            Resend Email Link
          </button>

          <div className={`pt-5 border-t ${isDarkMode ? "border-white/5" : "border-stone-100"}`}>
            <Link to="/login" className="text-xs text-slate-400 hover:text-amber-500 transition-colors font-bold relative group/return inline-block">
              Return to Sign In Page
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover/return w-full" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ForgotPassword;