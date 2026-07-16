// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from '../context/ThemeContext';
import Toast from '../components/atoms/Toast';
import axiosInstance from '../services/axiosInstance';

const Register = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = "Full name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Please enter a valid email address";
    
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreeTerms) {
      tempErrors.agreeTerms = "You must accept the terms to continue";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      setToast({ message: "Registration successful! Forwarding to log in...", type: 'success' });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const message = err.response?.data?.message || "Account creation failed. Please retry.";
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
      setToast({ message: "Account created with Google! Welcome to ShowX.", type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || "Google sign up failed. Please try again.";
      setToast({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyleClass = (fieldName) => `peer w-full rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none border transition-all duration-300 pt-5 pb-2 min-h-[46px] shadow-sm font-sans font-semibold ${
    isDarkMode 
      ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10" 
      : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60 focus:ring-4 focus:ring-amber-500/10 hover:border-stone-300"
  } ${errors[fieldName] ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/10' : ''}`;

  const labelStyleClass = "absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none";

  const registerKeyframeStyles = `
    @keyframes registerFadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-register-up {
      animation: registerFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <div className="w-full px-1 sm:px-2 animate-register-up">
      <style>{registerKeyframeStyles}</style>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Profile Header Icon Shell[cite: 10] */}
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm transition-all duration-300 transform hover:scale-105 ${
        isDarkMode 
          ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00] hover:border-amber-500/30" 
          : "bg-stone-50 border-stone-200/80 text-amber-600 hover:border-amber-500/40"
      }`}>
        <User size={20} strokeWidth={1.8} />
      </div>

      <h2 className={`text-xl sm:text-2xl font-black text-center tracking-tight transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>
        Create Your Account
      </h2>
      <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-semibold tracking-wide mt-1.5 mb-6 sm:mb-8 select-none">
        Join Showx and start your cinematic journey.[cite: 10]
      </p>

      <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
        
        {/* Full Name Floating Field[cite: 10] */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full group">
            <span className="absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10"><User size={16} /></span>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder=" "
              value={formData.fullName}
              onChange={handleChange}
              className={inputStyleClass('fullName')}
              required
            />
            <label htmlFor="fullName" className={labelStyleClass}>Full Name</label>
          </div>
          {errors.fullName && <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-bold font-mono pl-1">{errors.fullName}</motion.p>}
        </div>

        {/* Email Address Floating Field[cite: 10] */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full group">
            <span className="absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10"><Mail size={16} /></span>
            <input
              id="email"
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              className={inputStyleClass('email')}
              required
            />
            <label htmlFor="email" className={labelStyleClass}>Email Address</label>
          </div>
          {errors.email && <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-bold font-mono pl-1">{errors.email}</motion.p>}
        </div>

        {/* Password Floating Field[cite: 10] */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full group">
            <span className="absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10"><Lock size={16} /></span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              className={inputStyleClass('password')}
              required
            />
            <label htmlFor="password" className={labelStyleClass}>Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-none bg-transparent cursor-pointer p-0 z-10 outline-none transform active:scale-95 transition-all"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-bold font-mono pl-1">{errors.password}</motion.p>}
        </div>

        {/* Confirm Password Floating Field[cite: 10] */}
        <div className="space-y-1">
          <div className="relative flex items-center w-full group">
            <span className="absolute left-4 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10"><Lock size={16} /></span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder=" "
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputStyleClass('confirmPassword')}
              required
            />
            <label htmlFor="confirmPassword" className={labelStyleClass}>Confirm Password</label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-none bg-transparent cursor-pointer p-0 z-10 outline-none transform active:scale-95 transition-all"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <motion.p initial={{opacity:0, y:-4}} animate={{opacity:1, y:0}} className="text-[10px] text-rose-500 font-bold font-mono pl-1">{errors.confirmPassword}</motion.p>}
        </div>

        {/* Terms and Conditions Acceptance Box Block[cite: 10] */}
        <div className="space-y-1 pt-1">
          <div className="flex items-start space-x-2.5 select-none">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => { setAgreeTerms(e.target.checked); if(errors.agreeTerms) setErrors(p=>({...p, agreeTerms:''})); }}
              className="h-4 w-4 mt-0.5 rounded border-gray-300 bg-transparent text-[#FF9F00] focus:ring-0 accent-[#FF9F00] cursor-pointer"
              required
            />
            <label htmlFor="agreeTerms" className="text-[11px] text-slate-400 dark:text-slate-500 font-bold leading-normal cursor-pointer transition-colors hover:text-slate-600">
              I agree to the <span className="text-[#FF9F00] hover:text-amber-500 transition-colors relative group/link inline-block">Terms of Service<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover/link:w-full" /></span> and <span className="text-[#FF9F00] hover:text-amber-500 transition-colors relative group/link2 inline-block">Privacy Policy<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover/link2:w-full" /></span>[cite: 10]
            </label>
          </div>
          {errors.agreeTerms && <p className="text-[10px] text-rose-500 font-bold font-mono pl-1">{errors.agreeTerms}</p>}
        </div>

        {/* Gradient Sign Up Submit Trigger[cite: 10] */}
        <motion.button
          whileHover={{ scale: 1.01, filter: "brightness(1.05)" }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-stone-950 shadow-md shadow-amber-500/5 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none mt-2 min-h-[44px] uppercase tracking-widest"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
        </motion.button>
      </form>

      {/* Separator[cite: 10] */}
      <div className="relative my-6 flex items-center justify-center">
        <div className={`w-full border-t ${isDarkMode ? "border-white/5" : "border-stone-200"}`}></div>
        <span className={`absolute px-4 text-[9px] font-mono font-black tracking-widest uppercase transition-colors ${isDarkMode ? "bg-[#0B0D13] text-slate-600" : "bg-white text-slate-400"}`}>
          or
        </span>
      </div>

      {/* Google Sign Up Button[cite: 10] */}
      <div className="flex justify-center max-w-full overflow-hidden px-1 transform hover:scale-[1.01] transition-transform duration-200">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setToast({ message: "Google sign up failed. Please try again.", type: 'error' })}
          theme={isDarkMode ? "filled_black" : "outline"}
          shape="pill"
          width="100%"
          text="signup_with"
        />
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide mt-6 select-none">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FF9F00] font-black hover:text-amber-500 ml-1 transition-all">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;