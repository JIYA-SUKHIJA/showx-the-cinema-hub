// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/atoms/Toast';
import axiosInstance from '../services/axiosInstance';

const ResetPassword = () => {
  const { isDarkMode } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Isolated state for second field
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      setToast({ message: "Password changed successfully.", type: 'success' });
      setIsSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.message || "Reset link is invalid or has expired.";
      setToast({ message, type: 'error' });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-1 sm:px-2">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {!isSubmitted ? (
        <>
          {/* Padlock Icon[cite: 10] */}
          <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300 ${
            isDarkMode ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00]" : "bg-stone-100 border-stone-200 text-amber-600"
          }`}>
            <Lock className="w-5 h-5" />
          </div>

          <h2 className={`text-xl sm:text-2xl font-bold text-center tracking-wide transition-colors ${isDarkMode ? "text-white" : "text-slate-800"}`}>
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 text-center mt-1.5 mb-6 sm:mb-8 max-w-[280px] mx-auto leading-relaxed font-semibold">
            Enter a new password for your account. Make sure it's something secure.
          </p>

          <form onSubmit={handleResetSubmit} className="space-y-4 sm:space-y-5" noValidate>

            {/* New Password[cite: 10] */}
            <div className="space-y-1">
              <div className="relative flex items-center w-full">
                <span className="absolute left-4 text-slate-500 z-10"><Lock className="w-4 h-4" /></span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                  className={`peer w-full rounded-xl py-3.5 pl-11 pr-11 text-xs outline-none border transition-all duration-200 pt-5 pb-2 min-h-[46px] ${
                    isDarkMode
                      ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60"
                      : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60"
                  } ${error ? 'border-rose-500/60 focus:border-rose-500' : ''}`}
                  required
                />
                <label htmlFor="password" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-500 font-semibold tracking-wide duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-500 hover:text-amber-500 transition-colors bg-transparent border-none outline-none cursor-pointer z-10"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password — Fixed state maps & layout bounds[cite: 10] */}
            <div className="space-y-1">
              <div className="relative flex items-center w-full">
                <span className="absolute left-4 text-slate-500 z-10"><Lock className="w-4 h-4" /></span>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder=" "
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); if (error) setError(''); }}
                  className={`peer w-full rounded-xl py-3.5 pl-11 pr-11 text-xs outline-none border transition-all duration-200 pt-5 pb-2 min-h-[46px] ${
                    isDarkMode
                      ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60"
                      : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60"
                  } ${error ? 'border-rose-500/60 focus:border-rose-500' : ''}`}
                  required
                />
                <label htmlFor="confirmPassword" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-500 font-semibold tracking-wide duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-slate-500 hover:text-amber-500 transition-colors bg-transparent border-none outline-none cursor-pointer z-10"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-rose-500 font-semibold pl-1">{error}</motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-[#0B0D13] shadow-lg hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none min-h-[44px]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className={`w-full border-t ${isDarkMode ? "border-white/5" : "border-stone-200"}`}></div>
            <span className={`absolute px-4 text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "bg-[#0B0D13] text-slate-600" : "bg-white text-slate-400"}`}>
              or
            </span>
          </div>

          <Link
            to="/login"
            className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3.5 text-xs font-bold transition active:scale-[0.99] min-h-[44px] ${
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
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-5">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h4 className={`text-xl font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Password Changed</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold px-1">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-[#0B0D13] shadow-lg hover:brightness-110 active:scale-[0.99] transition cursor-pointer border-none min-h-[44px]"
          >
            Go to Login
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ResetPassword;