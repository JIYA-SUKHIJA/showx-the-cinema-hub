// src/components/organisms/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Mapped AnimatePresence safely to eliminate the runtime crash
import { 
  Search, Clapperboard, User, MapPin, ChevronDown, 
  Film, Building, Sparkles, ShieldCheck, Sun, Moon, 
  LogOut, Ticket, HelpCircle, LogIn, Home, Bell, Menu, X
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../services/axiosInstance';
import SearchModal from './SearchModal';

export default function Navbar() {
  const navigate = useNavigate();
  const { clearBookingSession, selectedCity, setSelectedCity } = useBooking();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cities, setCities] = useState(['Karnal']);
  
  // Real-time scrolling listener state flag
  const [isScrolled, setIsScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    const handleScrollMetrics = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScrollMetrics, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollMetrics);
  }, []);

  useEffect(() => {
    const fetchNavbarUser = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile');
        const backendUser = res.data.user;
        setUser((prev) => ({
          ...prev,
          name: backendUser.name,
          email: backendUser.email,
          role: backendUser.role,
        }));
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    fetchNavbarUser();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axiosInstance.get('/cities');
        const cityNames = res.data.cities.map((c) => c.name);
        if (cityNames.length > 0) {
          setCities(cityNames);
        }
      } catch (err) {
        // Fallback silently
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchNotifications = async () => {
      try {
        const endpoint = user.role === 'admin' ? '/notifications/admin' : '/notifications/my';
        const res = await axiosInstance.get(endpoint);
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      } catch (err) {
        // Fallback silently
      }
    };
    fetchNotifications();
  }, [isLoggedIn, user.role]);

  const handleNotifOpen = async () => {
    const opening = !isNotifOpen;
    setIsNotifOpen(opening);

    if (opening && unreadCount > 0) {
      try {
        await axiosInstance.put('/notifications/read-all');
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        // Non-critical operations
      }
    }
  };

  const placeholders = [
    "Search for Movies...",
    "Search for Theatres...",
    "Search for Latest Releases...",
  ];
  const [currentText, setCurrentText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullText = placeholders[placeholderIndex];
    const typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    } else {
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting 
            ? fullText.substring(0, currentText.length - 1)
            : fullText.substring(0, currentText.length + 1)
        );
      }, typingSpeed);
    }
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, placeholderIndex]);

  const getUserInitials = (name) => {
    if (!name) return "UX";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearBookingSession();
      sessionStorage.clear();
      navigate('/login');
    }
  };

  const handleSearchSubmit = (query) => {
    navigate(`/movies?search=${encodeURIComponent(query)}`);
  };

  const handleLocationSelect = (city) => {
    setSelectedCity(city);
    setIsLocationOpen(false);
    
    if (window.location.pathname === '/theatres') {
      if (city === 'All') {
        navigate('/theatres');
      } else {
        navigate(`/theatres?city=${encodeURIComponent(city)}`);
      }
    }
  };

  // Hardware accelerated micro interaction inline layouts
  const nativeKeyframeAnimations = `
    @keyframes simpleFadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-navbar-load {
      animation: simpleFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  const linkBaseStyle = "flex items-center gap-1.5 transition-all duration-300 relative py-1 px-2.5 rounded-xl text-xs font-black tracking-wider uppercase select-none outline-none transform hover:-translate-y-[1px]";

  return (
    <>
      <style>{nativeKeyframeAnimations}</style>
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 will-change-[box-shadow,background-color] ${
        isScrolled 
          ? isDarkMode
            ? "bg-slate-950/95 border-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.8)] py-1"
            : "bg-white/95 border-stone-200 shadow-[0_12px_40px_rgba(218,165,32,0.04)] py-1"
          : isDarkMode 
            ? "bg-slate-950/90 border-white/[0.04] shadow-none" 
            : "bg-white/90 border-stone-200/60 shadow-none"
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6 animate-navbar-load">
          
          {/* Logo Branding Block */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 select-none outline-none focus:opacity-90">
            <div className="relative">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center shadow-md shadow-amber-500/10 border border-amber-400/20 transition-transform duration-500 transform group-hover:scale-105 group-hover:rotate-[5deg]">
                <Clapperboard size={15} className="text-stone-950 fill-stone-950/10" strokeWidth={2.5} />
              </span>
              <div className="absolute inset-0 bg-amber-500 rounded-xl blur-lg opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" />
            </div>
            <div className="flex flex-col justify-center">
              <span className={`font-display text-base sm:text-xl font-black tracking-tight leading-none transition-colors group-hover:text-amber-500 ${
                isDarkMode ? "text-white" : "text-stone-900"
              }`}>
                Showx
              </span>
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-mono text-[8px] sm:text-[9px] font-black tracking-widest uppercase mt-0.5 sm:mt-1">
                The CinemaHub
              </span>
            </div>
          </Link>

          {/* Core Interactive Search Field Container */}
          <div 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center relative flex-grow max-w-xs lg:max-w-md group cursor-pointer"
          >
            <Search size={14} className="absolute left-3.5 text-slate-400 group-hover:text-amber-500 transition-colors z-10 transform group-hover:scale-105 duration-200" />
            <div className={`w-full border rounded-xl pl-11 pr-4 py-2 text-xs font-semibold transition-all duration-300 flex items-center select-none h-10 shadow-sm ${
              isDarkMode 
                ? "bg-white/[0.02] border-white/[0.05] text-slate-400 group-hover:border-white/10 group-hover:bg-white/[0.04]" 
                : "bg-stone-50 border-stone-200/80 text-slate-500 group-hover:border-stone-300 group-hover:bg-stone-100/50"
            }`}>
              <span className="truncate tracking-wide">{currentText || "Search movies, theatres, releases..."}</span>
              <kbd className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
                isDarkMode ? "bg-slate-900 border-white/10 text-slate-500" : "bg-white border-stone-200 text-stone-400"
              }`}>
                /
              </kbd>
            </div>
          </div>

          {/* Action Control Badges Layer */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`md:hidden p-2.5 rounded-xl border cursor-pointer transform active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-slate-300" : "border-stone-200 bg-stone-50/60 text-slate-600"
              }`}
              aria-label="Initialize query selector modal"
            >
              <Search size={14} strokeWidth={2.5} />
            </button>

            {/* Geographical Context Picker */}
            <div className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all border cursor-pointer select-none outline-none transform active:scale-95 shadow-sm focus:ring-2 focus:ring-amber-500/20 ${
                  isDarkMode ? "bg-white/[0.02] border-white/[0.05] text-slate-300 hover:border-white/10" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/60"
                }`}
              >
                <MapPin size={12} className="text-amber-500 shrink-0 transform group-hover:scale-105 duration-200" />
                <span className="max-w-[48px] sm:max-w-[80px] truncate">{selectedCity || 'Karnal'}</span>
                <ChevronDown size={11} className={`transition-transform duration-300 text-slate-400 shrink-0 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLocationOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLocationOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`absolute right-0 mt-2 w-44 border rounded-xl p-1 shadow-2xl z-20 overflow-hidden transform origin-top-right ${
                        isDarkMode ? "bg-slate-900 border-white/[0.06]" : "bg-white border-stone-200 shadow-stone-200/50"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleLocationSelect('All')}
                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg cursor-pointer border-none bg-transparent select-none transition-colors ${
                          selectedCity === 'All' ? "text-amber-600 bg-amber-500/10 font-black" : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        All Cities
                      </button>
                      {cities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleLocationSelect(city)}
                          className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg cursor-pointer border-none bg-transparent select-none transition-colors ${
                            selectedCity === city ? "text-amber-600 bg-amber-500/10 font-black" : isDarkMode ? "text-slate-300 hover:bg-white/5" : "text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Core Theme Switch Controls */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border cursor-pointer transform active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-amber-400 hover:bg-white/5" : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
              }`}
              aria-label="Toggle UI canvas baseline variables mapping"
            >
              {isDarkMode ? <Sun size={13} strokeWidth={2.5} /> : <Moon size={13} strokeWidth={2.5} />}
            </button>

            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={handleNotifOpen}
                  className={`relative p-2.5 rounded-xl border cursor-pointer transform active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                    isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-slate-300 hover:bg-white/5" : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <Bell size={13} strokeWidth={2.5} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center border border-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotifOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className={`absolute right-0 mt-2 w-64 sm:w-80 max-h-96 overflow-y-auto border rounded-2xl shadow-2xl z-20 overflow-x-hidden p-1.5 ${
                          isDarkMode ? "bg-slate-900 border-white/[0.06]" : "bg-white border-stone-200"
                        }`}
                      >
                        <div className={`px-3 py-2 border-b font-mono font-black text-[9px] uppercase tracking-widest pl-1.5 ${
                          isDarkMode ? "border-white/[0.05] text-slate-400" : "border-stone-100 text-stone-500"
                        }`}>
                          Notifications Node
                        </div>
                        {notifications.length === 0 ? (
                          <p className="px-3 py-6 text-[11px] text-slate-400 text-center font-medium">No live notifications logs active.</p>
                        ) : (
                          <div className="space-y-1 pt-1">
                            {notifications.map((n) => (
                              <div
                                key={n._id}
                                className={`px-3 py-2.5 rounded-xl transition-colors ${
                                  isDarkMode ? "hover:bg-white/[0.02]" : "hover:bg-stone-50/60"
                                }`}
                              >
                                <p className={`font-bold text-xs ${isDarkMode ? "text-white" : "text-stone-800"}`}>{n.title}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile Avatar Trigger Engine */}
            {isLoggedIn ? (
              <div className="relative hidden lg:block">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-xs cursor-pointer shadow-sm select-none outline-none transform active:scale-95 transition-all ${
                    isDarkMode 
                      ? "bg-slate-900 border-white/10 text-amber-500 hover:border-amber-500/30" 
                      : "bg-white border-stone-200 text-stone-700 hover:border-slate-400 hover:shadow-md"
                  }`}
                >
                  <span className="relative flex items-center justify-center">
                    {getUserInitials(user.name)}
                    <span className="absolute top-[-8px] right-[-8px] w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        className={`absolute right-0 mt-3 w-64 border rounded-2xl p-1.5 shadow-2xl z-20 backdrop-blur-xl transition-colors duration-300 ${
                          isDarkMode ? "bg-slate-900/95 border-white/[0.08]" : "bg-white/95 border-stone-200"
                        }`}
                      >
                        <div className={`px-3 py-3 border-b flex items-center gap-3 ${isDarkMode ? "border-white/[0.05]" : "border-stone-100"}`}>
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center font-black text-stone-950 select-none shrink-0 font-mono">
                            {getUserInitials(user.name)}
                          </div>
                          <div className="truncate">
                            <p className={`text-xs font-black truncate ${isDarkMode ? "text-white" : "text-stone-800"}`}>{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="p-1 space-y-0.5">
                          <Link to="/profile" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-50"}`}>
                            <User size={13} className="text-amber-500" /> Account Profile
                          </Link>
                          <Link to="/profile" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-50"}`}>
                            <Ticket size={13} className="text-amber-500" /> Your Bookings
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-50"}`}>
                              <ShieldCheck size={13} className="text-amber-500" /> Admin Console
                            </Link>
                          )}
                          <hr className={`my-1 ${isDarkMode ? "border-white/[0.05]" : "border-stone-100"}`} />
                          <Link to="/support" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-50"}`}>
                            <HelpCircle size={13} /> Help & Support
                          </Link>
                          <hr className={`my-1 ${isDarkMode ? "border-white/[0.05]" : "border-stone-100"}`} />
                          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-black text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer border-none bg-transparent text-left outline-none">
                            <LogOut size={13} /> Close Session
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 hover:brightness-105 transition-all shadow-md shadow-amber-500/5 outline-none transform active:scale-95 select-none tracking-widest uppercase">
                <LogIn size={13} strokeWidth={2.5} /> <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2.5 rounded-xl border cursor-pointer focus:outline-none shrink-0 transform active:scale-95 transition-all ${
                isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-slate-300" : "border-stone-200 bg-stone-50 text-stone-700"
              }`}
              aria-label="Toggle drawer layout hierarchy"
            >
              {isMobileMenuOpen ? <X size={14} strokeWidth={2.5} /> : <Menu size={14} strokeWidth={2.5} />}
            </button>

          </div>
        </div>

        {/* Desktop Links Navigation Shelf */}
        <div className={`border-t hidden lg:block ${isDarkMode ? "bg-slate-950/40 border-white/[0.02]" : "bg-stone-50/50 border-stone-200/40"}`}>
          <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-6">
              <NavLink to="/" end className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500 font-black bg-amber-500/5" : isDarkMode ? "text-slate-300 hover:text-white" : "text-stone-600 hover:text-stone-950"}`}>
                <Home size={13} className="shrink-0" /> Home
              </NavLink>
              <NavLink to="/movies" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500 font-black bg-amber-500/5" : isDarkMode ? "text-slate-300 hover:text-white" : "text-stone-600 hover:text-stone-950"}`}>
                <Film size={13} className="shrink-0" /> Movies
              </NavLink>
              <NavLink to="/theatres" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500 font-black bg-amber-500/5" : isDarkMode ? "text-slate-300 hover:text-white" : "text-stone-600 hover:text-stone-950"}`}>
                <Building size={13} className="shrink-0" /> Theatres
              </NavLink>
              <NavLink to="/releases" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500 font-black bg-amber-500/5" : isDarkMode ? "text-slate-300 hover:text-white" : "text-stone-600 hover:text-stone-950"}`}>
                <Sparkles size={13} className="shrink-0" /> Releases
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer Module */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className={`lg:hidden border-t overflow-hidden w-full ${
                isDarkMode ? "bg-slate-950 border-white/[0.05]" : "bg-white border-stone-200"
              }`}
            >
              <div className="px-4 py-5 flex flex-col gap-4 text-sm font-bold">
                {isLoggedIn && (
                  <div className={`flex items-center gap-3 pb-3 border-b ${isDarkMode ? "border-white/[0.05]" : "border-stone-100"}`}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center font-black text-stone-950 select-none font-mono">
                      {getUserInitials(user.name)}
                    </div>
                    <div className="truncate">
                      <p className={`text-sm font-black truncate ${isDarkMode ? "text-white" : "text-stone-800"}`}>{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate font-normal font-mono mt-0.5">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider font-black rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <Home size={14} /> Home Portal
                  </Link>
                  <Link to="/movies" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider font-black rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <Film size={14} /> Movies Matrix
                  </Link>
                  <Link to="/theatres" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider font-black rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <Building size={14} /> Theatres Map
                  </Link>
                  {isLoggedIn && (
                    <>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider font-black rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                        <User size={14} className="text-amber-500" /> Account Profile
                      </Link>
                    </>
                  )}
                  <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider font-black rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <HelpCircle size={14} /> Help & Support
                  </Link>
                </div>

                <div className="pt-2">
                  {isLoggedIn ? (
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-red-500 bg-red-500/10 border-none cursor-pointer text-xs uppercase tracking-wider outline-none"
                    >
                      <LogOut size={13} /> Close Active Session
                    </button>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black bg-amber-500 text-stone-950 shadow-md border-none text-xs uppercase tracking-wider text-center outline-none"
                    >
                      <LogIn size={13} strokeWidth={2.5} /> <span>Sign In to Portal</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearchSubmit={handleSearchSubmit} />
    </>
  );
}