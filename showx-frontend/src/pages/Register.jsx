// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
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

  const inputStyleClass = (fieldName) => `peer w-full rounded-xl py-3.5 pl-11 pr-4 text-xs outline-none border transition-all duration-200 pt-5 pb-2 ${
    isDarkMode 
      ? "bg-[#11141D] text-white border-gray-800/40 focus:border-amber-500/60" 
      : "bg-stone-50 text-slate-800 border-stone-200 focus:border-amber-500/60"
  } ${errors[fieldName] ? 'border-rose-500/60 focus:border-rose-500' : ''}`;

  const labelStyleClass = "absolute left-11 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-[11px] text-slate-500 font-semibold tracking-wide duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-amber-500 cursor-text select-none";

  return (
    <>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Profile Header Icon Shell[cite: 6] */}
      <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-inner transition-colors duration-300 ${
        isDarkMode ? "bg-[#11141D] border-gray-800/60 text-[#FF9F00]" : "bg-stone-100 border-stone-200 text-amber-600"
      }`}>
        <User size={20} strokeWidth={1.8} />
      </div>

      <h2 className={`text-2xl font-bold text-center tracking-wide transition-colors ${isDarkMode ? "text-white" : "text-slate-800"}`}>
        Create Your Account
      </h2>
      <p className="text-xs text-slate-500 text-center mt-1.5 mb-8">Join Showx and start your cinematic journey.</p>

      <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
        
        {/* Full Name Floating Field[cite: 6] */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 z-10"><User size={16} /></span>
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
          {errors.fullName && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-[10px] text-rose-500 font-semibold pl-1">{errors.fullName}</motion.p>}
        </div>

        {/* Email Address Floating Field[cite: 6] */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 z-10"><Mail size={16} /></span>
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
          {errors.email && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-[10px] text-rose-500 font-semibold pl-1">{errors.email}</motion.p>}
        </div>

        {/* Password Floating Field[cite: 6] */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 z-10"><Lock size={16} /></span>
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
              className="absolute right-4 text-slate-500 border-none bg-transparent cursor-pointer p-0 z-10"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-[10px] text-rose-500 font-semibold pl-1">{errors.password}</motion.p>}
        </div>

        {/* Confirm Password Floating Field[cite: 6] */}
        <div className="space-y-1">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 z-10"><Lock size={16} /></span>
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
              className="absolute right-4 text-slate-500 border-none bg-transparent cursor-pointer p-0 z-10"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-[10px] text-rose-500 font-semibold pl-1">{errors.confirmPassword}</motion.p>}
        </div>

        {/* Terms and Conditions Acceptance Box Block[cite: 6] */}
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
            <label htmlFor="agreeTerms" className="text-[11px] text-slate-500 font-semibold leading-normal cursor-pointer">
              I agree to the <span className="text-[#FF9F00] hover:underline">Terms of Service</span> and <span className="text-[#FF9F00] hover:underline">Privacy Policy</span>
            </label>
          </div>
          {errors.agreeTerms && <p className="text-[10px] text-rose-500 font-semibold pl-1">{errors.agreeTerms}</p>}
        </div>

        {/* Gradient Sign Up Submit Trigger[cite: 6] */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-[#FF9F00] to-[#FF6A00] py-3.5 text-xs font-black text-[#0B0D13] shadow-lg shadow-orange-500/10 hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 border-none mt-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 font-semibold tracking-wide mt-8">
        Already have an account?{' '}
        <Link to="/login" className="text-[#FF9F00] font-bold hover:underline ml-1">
          Login
        </Link>
      </p>
    </>
  );
};

export default Register;