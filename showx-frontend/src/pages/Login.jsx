// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
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
      await axiosInstance.post('/auth/login', { email, password, rememberMe });
      setToast({ message: "Welcome back! Login successful.", type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials. Please verify your details.";
      setToast({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      setToast({ message: "Welcome! Google login successful.", type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || "Google login failed. Please try again.";
      setToast({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-1 sm:px-2">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Anchor Padlock Header Icon Layer */}
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300 ${
        isDarkMode ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00]" : "bg-stone-100 border-stone-200 text-amber-600"
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>

      <h2 className={`text-xl sm:text-2xl font-bold text-center tracking-wide transition-colors ${isDarkMode ? "text-white" : "text-slate-800"}`}>
        Login to Your Account
      </h2>
      <p className="text-xs text-slate-500 text-center mt-1.5 mb-6 sm:mb-8">Welcome back! Please enter your details.</p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
        
        {/* Email Floating Field Block */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full">
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
              className={`peer w-full rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none border transition-all duration-200 pt-5 pb-2 min-h-[46px] ${
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

        {/* Password Floating Field Block */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full">
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
              className={`peer w-full rounded-xl py-3.5 pl-11 pr-11 text-xs outline-none border transition-all duration-200 pt-5 pb-2 min-h-[46px] ${
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

        {/* Checkbox Layout Row */}
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

        {/* Action Controls Cluster Button Stack */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-[#0B0D13] shadow-lg hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none min-h-[44px]"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
        </button>
      </form>

      {/* Separator */}
      <div className="relative my-6 flex items-center justify-center">
        <div className={`w-full border-t ${isDarkMode ? "border-white/5" : "border-stone-200"}`}></div>
        <span className={`absolute px-4 text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "bg-[#0B0D13] text-slate-600" : "bg-white text-slate-400"}`}>
          or
        </span>
      </div>

      {/* Google Login Wrapper Container */}
      <div className="flex justify-center max-w-full overflow-hidden px-1">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setToast({ message: "Google login failed. Please try again.", type: 'error' })}
          theme={isDarkMode ? "filled_black" : "outline"}
          shape="pill"
          width="100%"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 mt-4">
        <button
          type="button"
          onClick={() => {
            setToast({ message: "Entering dashboard portal workspace as a guest user...", type: 'success' });
            setTimeout(() => navigate('/'), 1200);
          }}
          className={`w-full flex items-center justify-center py-2.5 text-xs font-bold rounded-xl transition hover:underline border-none bg-transparent cursor-pointer min-h-[44px] ${
            isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Explore Platform as Guest
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500 font-semibold tracking-wide">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#FF9F00] font-bold hover:underline ml-1">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;