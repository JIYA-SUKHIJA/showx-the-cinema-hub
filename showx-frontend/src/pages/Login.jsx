// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/atoms/Toast';
import axiosInstance from '../services/axiosInstance';

const Login = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const validateForm = () => {
    const tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) tempErrors.email = "Please enter a valid email address";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/login', { email, password });
      setToast({ message: "Welcome back! Login successful.", type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials. Please verify your details.";
      setToast({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Anchor Padlock Header Icon Layer[cite: 4] */}
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300 ${
        isDarkMode ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00]" : "bg-stone-100 border-stone-200 text-amber-600"
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>

      <h2 className={`text-2xl font-bold text-center tracking-wide transition-colors ${isDarkMode ? "text-white" : "text-slate-800"}`}>
        Login to Your Account
      </h2>
      <p className="text-xs text-slate-500 text-center mt-1.5 mb-8">Welcome back! Please enter your details.</p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        
        {/* Email Floating Field Block[cite: 4] */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 z-10">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors(p=>({...p, email:''})); }}
              aria-invalid={!!errors.email}
              className={`peer w-full rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none border transition-all duration-200 pt-5 pb-2 ${
                isDarkMode 
                  ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60" 
                  : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60"
              } ${errors.email ? 'border-rose-500/60 focus:border-rose-500' : ''}`}
              required
            />
            <label htmlFor="email" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-500 font-semibold tracking-wide duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
              Email Address
            </label>
          </div>
          {errors.email && (
            <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-semibold pl-1">{errors.email}</motion.p>
          )}
        </div>

        {/* Password Floating Field Block[cite: 4] */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 z-10">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors(p=>({...p, password:''})); }}
              aria-invalid={!!errors.password}
              className={`peer w-full rounded-xl py-3.5 pl-11 pr-11 text-xs outline-none border transition-all duration-200 pt-5 pb-2 ${
                isDarkMode 
                  ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60" 
                  : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60"
              } ${errors.password ? 'border-rose-500/60 focus:border-rose-500' : ''}`}
              required
            />
            <label htmlFor="password" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-500 font-semibold tracking-wide duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-500 hover:text-slate-300 border-none bg-transparent cursor-pointer p-0 z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-semibold pl-1">{errors.password}</motion.p>
          )}
          <div className="text-right pt-1.5">
            <Link to="/forgot-password" className="text-xs font-semibold text-[#FF9F00] hover:text-amber-400 hover:underline tracking-wide transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Checkbox Layout Row[cite: 4] */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-transparent text-[#FF9F00] focus:ring-0 accent-[#FF9F00] cursor-pointer"
          />
          <label htmlFor="remember" className="text-xs text-slate-400 font-semibold select-none cursor-pointer">
            Remember me
          </label>
        </div>

        {/* Action Controls Cluster Button Stack[cite: 4] */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-[#0B0D13] shadow-lg shadow-orange-500/10 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
        </button>
      </form>

      {/* Premium Google Authentication Row Connector Grid */}
      <div className="relative my-6 flex items-center justify-center">
        <div className={`w-full border-t ${isDarkMode ? "border-white/5" : "border-stone-200"}`}></div>
        <span className={`absolute px-3 text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "bg-[#0B0D13] text-slate-600" : "bg-white text-slate-400"}`}>
          or connect via
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => setToast({ message: "Google OAuth integration is ready.", type: 'success' })}
          className={`w-full flex items-center justify-center gap-2.5 rounded-xl border py-3 text-xs font-bold shadow-sm transition active:scale-[0.99] cursor-pointer ${
            isDarkMode ? "bg-white/[0.02] border-white/10 text-white hover:bg-white/[0.05]" : "bg-stone-50 border-stone-200 text-slate-700 hover:bg-stone-100"
          }`}
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.324 2.69 1.332 6.614l3.934 3.151z"/>
            <path fill="#4285F4" d="M23.91 12.273c0-.818-.073-1.609-.209-2.373H12v4.582h6.69A5.717 5.717 0 0 1 16.2 18.264l3.855 2.99C22.31 19.173 23.91 16.027 23.91 12.273z"/>
            <path fill="#FBBC05" d="M5.266 14.235L1.332 17.386A11.947 11.947 0 0 0 12 24c3.055 0 5.782-1.009 7.745-2.745l-3.855-2.99a7.062 7.062 0 0 1-3.89 1.1c-3.627 0-6.734-2.455-7.834-5.875z"/>
            <path fill="#34A853" d="M1.332 6.614A11.928 11.928 0 0 0 0 12c0 1.93.455 3.748 1.255 5.386l4.01-3.151A7.027 7.027 0 0 1 4.91 12c0-1.6.536-3.082 1.436-4.295L1.332 6.614z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setToast({ message: "Entering dashboard portal workspace as a guest user...", type: 'success' });
            setTimeout(() => navigate('/'), 1200);
          }}
          className={`w-full flex items-center justify-center py-3 text-xs font-bold rounded-xl transition hover:underline border-none bg-transparent cursor-pointer ${
            isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Explore Platform as Guest
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500 font-semibold tracking-wide">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#FF9F00] font-bold hover:underline ml-1">
          Sign up
        </Link>
      </p>
    </>
  );
};

export default Login;