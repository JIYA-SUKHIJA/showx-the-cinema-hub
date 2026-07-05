// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/atoms/Toast';

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setToast({ message: "Recovery credentials dispatched successfully.", type: 'success' });
      setIsSubmitted(true);
    } catch (err) {
      setToast({ message: "Request dispatch failed. Try again.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Primary Modal View Panel Grid Layer */}
      {!isSubmitted ? (
        <>
          {/* Padlock Icon Box[cite: 5] */}
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300 ${
            isDarkMode ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00]" : "bg-stone-100 border-stone-200 text-amber-600"
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <h2 className={`text-2xl font-bold text-center tracking-wide transition-colors ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Forgot Password?
          </h2>
          <p className="text-xs text-slate-500 text-center mt-1.5 mb-8 max-w-[280px] mx-auto leading-relaxed font-semibold">
            No worries! Enter your email and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleResetSubmit} className="space-y-5" noValidate>
            
            {/* Email Address Input Block Container[cite: 5] */}
            <div className="space-y-1">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-500 z-10"><Mail className="w-4 h-4" /></span>
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(error) setError(''); }}
                  className={`peer w-full rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none border transition-all duration-200 pt-5 pb-2 ${
                    isDarkMode 
                      ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60" 
                      : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60"
                  } ${error ? 'border-rose-500/60 focus:border-rose-500' : ''}`}
                  required
                />
                <label htmlFor="email" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-500 font-semibold tracking-wide duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
                  Email Address
                </label>
              </div>
              {error && (
                <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-[10px] text-rose-500 font-semibold pl-1">{error}</motion.p>
              )}
            </div>

            {/* Radiant Send Reset Link Trigger Button Option[cite: 5] */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-[#0B0D13] shadow-lg shadow-orange-500/10 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
            </button>
          </form>

          {/* Separation Divider layout frame[cite: 5] */}
          <div className="relative my-6 flex items-center justify-center">
            <div className={`w-full border-t ${isDarkMode ? "border-white/5" : "border-stone-200"}`}></div>
            <span className={`absolute px-4 text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "bg-[#0B0D13] text-slate-600" : "bg-white text-slate-400"}`}>
              or
            </span>
          </div>

          {/* Action Navigation: Back to Login button block[cite: 5] */}
          <Link 
            to="/login" 
            className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3.5 text-xs font-bold transition active:scale-[0.99] ${
              isDarkMode 
                ? "bg-[#11141D] border-gray-800/40 text-slate-300 hover:bg-[#151924]" 
                : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </>
      ) : (
        /* Dispatched success feedback screen alternative layer view[cite: 5] */
        <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}} className="text-center py-4 space-y-5">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <h4 className={`text-xl font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Link Dispatched</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold">
              We have sent a secure password recovery link to <span className="text-[#FF9F00] font-bold break-all">{email}</span>.[cite: 5]
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="w-full text-center text-xs text-[#FF9F00] font-bold hover:text-amber-400 hover:underline bg-transparent border-none outline-none pt-4 cursor-pointer transition-colors"
          >
            Resend Email Link
          </button>

          <div className={`pt-5 border-t ${isDarkMode ? "border-white/5" : "border-stone-100"}`}>
            <Link to="/login" className="text-xs text-slate-400 hover:text-amber-500 transition-colors font-semibold">
              Return to Sign In Page
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ForgotPassword;