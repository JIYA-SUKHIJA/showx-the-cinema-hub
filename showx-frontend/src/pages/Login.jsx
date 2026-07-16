// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
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
  
  // Real-time welcome greeting loops matching premium standards
  const [greeting, setGreeting] = useState('Login to Your Account');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning ☀️');
    else if (hours < 17) setGreeting('Good Afternoon 🌤️');
    else setGreeting('Good Evening 🌙');
  }, []);

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

  const authKeyframeStyles = `
    @keyframes authFadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-auth-up {
      animation: authFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return (
    <div className="w-full px-1 sm:px-2 animate-auth-up">
      <style>{authKeyframeStyles}</style>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Anchor Padlock Header Icon Layer */}
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 transform hover:scale-105 ${
        isDarkMode 
          ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00] hover:border-amber-500/30" 
          : "bg-stone-50 border-stone-200/80 text-amber-600 hover:border-amber-500/40"
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>

      {/* Synchronized Headline with local image contents fallback safeguards */}
      <h2 className={`text-xl sm:text-2xl font-black text-center tracking-tight transition-all duration-300 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        {greeting}
      </h2>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-semibold tracking-wide mt-1.5 mb-6 sm:mb-8">
        Welcome back! Please enter your details.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
        
        {/* Email Floating Field Block */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full">
            <span className="absolute left-4 text-slate-400 peer-focus:text-amber-500 transition-colors z-10">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="email"
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => { setEmail(e.target.value); if(errors.email) setErrors(p=>({...p, email:''})); }}
              aria-invalid={!!errors.email}
              className={`peer w-full rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none border transition-all duration-300 pt-5 pb-2 min-h-[46px] shadow-sm font-sans font-semibold ${
                isDarkMode 
                  ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10" 
                  : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10"
              } ${errors.email ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
              required
            />
            <label htmlFor="email" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-400 font-bold tracking-wider uppercase duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
              Email Address
            </label>
          </div>
          {errors.email && (
            <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-bold font-mono pl-1">{errors.email}</motion.p>
          )}
        </div>

        {/* Password Floating Field Block */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full">
            <span className="absolute left-4 text-slate-400 peer-focus:text-amber-500 transition-colors z-10">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              value={password}
              onChange={(e) => { setPassword(e.target.value); if(errors.password) setErrors(p=>({...p, password:''})); }}
              aria-invalid={!!errors.password}
              className={`peer w-full rounded-xl py-3.5 pl-11 pr-11 text-xs outline-none border transition-all duration-300 pt-5 pb-2 min-h-[46px] shadow-sm font-sans font-semibold ${
                isDarkMode 
                  ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10" 
                  : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10"
              } ${errors.password ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
              required
            />
            <label htmlFor="password" className="absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-400 font-bold tracking-wider uppercase duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-none bg-transparent cursor-pointer p-0 z-10 outline-none transform active:scale-95 transition-all"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-bold font-mono pl-1">{errors.password}</motion.p>
          )}
          <div className="text-right pt-1.5">
            <Link to="/forgot-password" className="text-xs font-bold text-[#FF9F00] hover:text-amber-500 tracking-wide transition-colors relative group/link inline-block">
              Forgot Password?
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover/link:w-full" />
            </Link>
          </div>
        </div>

        {/* Checkbox Layout Row */}
        <div className="flex items-center space-x-2 pt-1 select-none">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 bg-transparent text-[#FF9F00] focus:ring-0 accent-[#FF9F00] cursor-pointer"
          />
          <label htmlFor="remember" className="text-xs text-slate-400 dark:text-slate-500 font-bold cursor-pointer transition-colors hover:text-slate-600">
            Remember me
          </label>
        </div>

        {/* Action Controls Button Stack */}
        <motion.button
          whileHover={{ scale: 1.01, filter: "brightness(1.05)" }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-stone-950 shadow-md shadow-amber-500/5 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none min-h-[44px] uppercase tracking-widest"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
        </motion.button>
      </form>

      {/* Separator */}
      <div className="relative my-6 flex items-center justify-center">
        <div className={`w-full border-t ${isDarkMode ? "border-white/5" : "border-stone-200"}`}></div>
        <span className={`absolute px-4 text-[9px] font-mono font-black tracking-widest uppercase transition-colors ${isDarkMode ? "bg-[#0B0D13] text-slate-600" : "bg-white text-slate-400"}`}>
          or
        </span>
      </div>

      {/* Google Login Wrapper Container */}
      <div className="flex justify-center max-w-full overflow-hidden px-1 transform hover:scale-[1.01] transition-transform duration-200">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          borderColor="transparent"
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
          className={`w-full flex items-center justify-center py-2.5 text-xs font-bold rounded-xl transition-all border-none bg-transparent cursor-pointer min-h-[44px] hover:text-amber-500 ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          Explore Platform as Guest
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide select-none">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#FF9F00] font-black hover:text-amber-500 ml-1 transition-all">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;