// src/components/organisms/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Clapperboard, User, MapPin, ChevronDown, 
  Film, Tv, Sparkles, Theater, ShieldCheck, Sun, Moon, 
  LogOut, Ticket, Settings, HelpCircle, LogIn
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { useTheme } from '../../context/ThemeContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const navigate = useNavigate();
  const { clearBookingSession, selectedCity, setSelectedCity } = useBooking(); // Swapped local city hook with global context hook
  const { isDarkMode, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Dynamic Auth Mock State Placeholder
  const isLoggedIn = true;

  const user = {
    name: "Jiya Sukhija",
    email: "jiya.sukhija@cinema.com",
    role: "admin", 
    activeBookingsCount: 2,
    latestBookingId: "SHX-582910"
  };

  const placeholders = [
    "Search for Movies...",
    "Search for On-Demand Streams...",
    "Search for Live Music Concerts...",
    "Search for Theatre Plays & Standup Comedy..."
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

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const getUserInitials = (name) => {
    if (!name) return "UX";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    clearBookingSession();
    sessionStorage.clear();
    navigate('/login');
  };

  const handleSearchSubmit = (query) => {
    navigate(`/movies?search=${encodeURIComponent(query)}`);
  };

  const cities = ['Karnal', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Chandigarh'];
  const linkBaseStyle = "flex items-center gap-1.5 transition-all duration-300 relative py-1 px-1 rounded-md text-xs font-bold tracking-wide";

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ${
        isDarkMode 
          ? "bg-slate-950/90 border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
          : "bg-white/90 border-stone-200/60 shadow-[0_4px_30px_rgba(218,165,32,0.03)]"
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-6">
          
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center shadow-[0_4px_15px_rgba(218,165,32,0.2)] border border-amber-400/20 transition-transform duration-300 group-hover:scale-105">
                <Clapperboard size={18} className="text-stone-950 fill-stone-950/10" strokeWidth={2.5} />
              </span>
              <div className="absolute inset-0 bg-amber-500 rounded-xl blur-md opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />
            </div>
            <span className={`font-display text-2xl tracking-tight font-black transition-colors ${
              isDarkMode ? "text-white" : "text-stone-900"
            }`}>
              Showx
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-mono text-[10px] font-black tracking-widest uppercase ml-2 align-middle">
                — The CinemaHub
              </span>
            </span>
          </Link>

          <div 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center relative flex-grow max-w-md group cursor-pointer"
          >
            <Search size={16} className="absolute left-3.5 text-slate-500 group-hover:text-amber-500 transition-colors" />
            <div className={`w-full border rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium transition-all duration-300 shadow-inner flex items-center select-none h-10 ${
              isDarkMode 
                ? "bg-white/[0.03] hover:bg-white/[0.05] border-white/[0.06] text-slate-400" 
                : "bg-stone-50 hover:bg-stone-100/70 border-stone-200 text-slate-500"
            }`}>
              <span>{currentText || "Search movies, streams, events..."}</span>
              <kbd className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono border shadow-sm ${
                isDarkMode ? "bg-slate-900 border-white/10 text-slate-500" : "bg-white border-stone-200 text-stone-400"
              }`}>
                /
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`md:hidden p-2.5 rounded-xl border cursor-pointer ${
                isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-slate-400" : "border-stone-200 bg-stone-50 text-slate-600"
              }`}
            >
              <Search size={15} strokeWidth={2.5} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isDarkMode ? "bg-white/[0.02] border-white/[0.05] text-slate-300" : "bg-stone-50 border-stone-200 text-stone-700"
                }`}
              >
                <MapPin size={14} className="text-amber-600" />
                <span>{selectedCity || 'Karnal'}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLocationOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLocationOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={`absolute right-0 mt-2 w-48 border rounded-xl p-1.5 shadow-2xl z-20 ${
                        isDarkMode ? "bg-slate-900 border-white/[0.06]" : "bg-white border-stone-200"
                      }`}
                    >
                      {cities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer border-none bg-transparent ${
                            selectedCity === city ? "text-amber-600 bg-amber-500/10" : isDarkMode ? "text-slate-300" : "text-stone-600"
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

            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border cursor-pointer ${isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-amber-400" : "border-stone-200 bg-stone-50 text-stone-700"}`}
            >
              {isDarkMode ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
            </button>

            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs cursor-pointer shadow-md select-none ${
                    isDarkMode ? "bg-slate-800 border-white/10 text-slate-300" : "bg-stone-50 border-stone-200 text-stone-700"
                  }`}
                >
                  {getUserInitials(user.name)}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        className={`absolute right-0 mt-3 w-64 border rounded-2xl p-2 shadow-2xl z-20 backdrop-blur-xl transition-colors duration-300 ${
                          isDarkMode ? "bg-slate-900/95 border-white/[0.08]" : "bg-white/95 border-stone-200"
                        }`}
                      >
                        <div className={`px-3 py-3 border-b flex items-center gap-3 ${isDarkMode ? "border-white/[0.05]" : "border-stone-100"}`}>
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center font-black text-stone-950 select-none shrink-0">
                            {getUserInitials(user.name)}
                          </div>
                          <div className="truncate">
                            <p className={`text-sm font-black truncate ${isDarkMode ? "text-white" : "text-stone-800"}`}>{user.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>

                        <div className="p-1 space-y-0.5">
                          <Link to="/profile" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                            <User size={14} className="text-amber-500" /> Account Profile
                          </Link>
                          <Link to={`/confirmation/${user.latestBookingId}`} onClick={() => setIsProfileOpen(false)} className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                            <span className="flex items-center gap-2.5"><Ticket size={14} /> Your Bookings</span>
                            {user.activeBookingsCount > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-black border border-amber-500/20 uppercase tracking-wide">{user.activeBookingsCount} Active</span>}
                          </Link>
                          <Link to="/stream" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                            <Tv size={14} /> Streaming Library
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                              <ShieldCheck size={14} className="text-amber-500" /> Admin Console
                            </Link>
                          )}
                          <hr className={isDarkMode ? "border-white/[0.05]" : "border-stone-100"} />
                          <Link to="/settings" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                            <Settings size={14} /> Settings
                          </Link>
                          <Link to="/support" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                            <HelpCircle size={14} /> Help & Support
                          </Link>
                          <hr className={isDarkMode ? "border-white/[0.05]" : "border-stone-100"} />
                          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-black text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer border-none bg-transparent text-left">
                            <LogOut size={14} /> Close Session
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/10">
                <LogIn size={14} strokeWidth={2.5} /> <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* --- LOWER BAR --- */}
        <div className={`border-t hidden sm:block ${isDarkMode ? "bg-slate-950/40 border-white/[0.02]" : "bg-stone-50/60 border-stone-200/40"}`}>
          <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-6">
              <NavLink to="/movies" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Film size={13} /> Movies
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
              <NavLink to="/stream" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Tv size={13} /> Stream
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
              <NavLink to="/events" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Sparkles size={13} /> Events
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
              <NavLink to="/plays" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Theater size={13} /> Plays
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSearchSubmit={handleSearchSubmit} />
    </>
  );
}