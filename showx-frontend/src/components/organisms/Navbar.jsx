// src/components/organisms/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile toggle anchor trigger state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cities, setCities] = useState(['Karnal']);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "user",
  });

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
        // Keep fallback
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
        // Silent recovery
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
        // Non-critical
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

  const linkBaseStyle = "flex items-center gap-1.5 transition-all duration-300 relative py-1 px-1 rounded-md text-xs font-bold tracking-wide";

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ${
        isDarkMode 
          ? "bg-slate-950/90 border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
          : "bg-white/90 border-stone-200/60 shadow-[0_4px_30px_rgba(218,165,32,0.03)]"
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 lg:gap-6">
          
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center shadow-[0_4px_15px_rgba(218,165,32,0.2)] border border-amber-400/20 transition-transform duration-300 group-hover:scale-105">
                <Clapperboard size={16} className="text-stone-950 fill-stone-950/10" strokeWidth={2.5} />
              </span>
              <div className="absolute inset-0 bg-amber-500 rounded-xl blur-md opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity" />
            </div>
            <span className={`font-display text-xl sm:text-2xl tracking-tight font-black transition-colors ${
              isDarkMode ? "text-white" : "text-stone-900"
            }`}>
              Showx
              <span className="hidden sm:inline-block bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-mono text-[9px] sm:text-[10px] font-black tracking-widest uppercase ml-2 align-middle">
                — The CinemaHub
              </span>
            </span>
          </Link>

          {/* Search Box: Kept perfectly hidden on small interfaces, visible from md devices and up */}
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
              <span className="truncate">{currentText || "Search movies, theatres, releases..."}</span>
              <kbd className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono border shadow-sm ${
                isDarkMode ? "bg-slate-900 border-white/10 text-slate-500" : "bg-white border-stone-200 text-stone-400"
              }`}>
                /
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`md:hidden p-2 rounded-xl border cursor-pointer ${
                isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-slate-400" : "border-stone-200 bg-stone-50 text-slate-600"
              }`}
            >
              <Search size={15} strokeWidth={2.5} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isDarkMode ? "bg-white/[0.02] border-white/[0.05] text-slate-300" : "bg-stone-50 border-stone-200 text-stone-700"
                }`}
              >
                <MapPin size={13} className="text-amber-600" />
                <span className="max-w-[50px] sm:max-w-none truncate">{selectedCity || 'Karnal'}</span>
                <ChevronDown size={11} className={`transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
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
                            setIsLocationOpen(false);
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
              className={`p-2 rounded-xl border cursor-pointer ${isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-amber-400" : "border-stone-200 bg-stone-50 text-stone-700"}`}
            >
              {isDarkMode ? <Sun size={15} strokeWidth={2.5} /> : <Moon size={15} strokeWidth={2.5} />}
            </button>

            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={handleNotifOpen}
                  className={`relative p-2 rounded-xl border cursor-pointer ${
                    isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-slate-300" : "border-stone-200 bg-stone-50 text-stone-700"
                  }`}
                >
                  <Bell size={15} strokeWidth={2.5} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center border border-white">
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
                        className={`absolute right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto border rounded-2xl shadow-2xl z-20 ${
                          isDarkMode ? "bg-slate-900 border-white/[0.06]" : "bg-white border-stone-200"
                        }`}
                      >
                        <div className={`px-4 py-3 border-b font-black text-xs uppercase tracking-wide ${
                          isDarkMode ? "border-white/[0.05] text-slate-400" : "border-stone-100 text-stone-500"
                        }`}>
                          Notifications
                        </div>
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-xs text-slate-500 text-center">No notifications yet.</p>
                        ) : (
                          <div className="p-1.5 space-y-1">
                            {notifications.map((n) => (
                              <div
                                key={n._id}
                                className={`px-3 py-2.5 rounded-xl text-xs ${
                                  isDarkMode ? "hover:bg-white/[0.04]" : "hover:bg-stone-50"
                                }`}
                              >
                                <p className={`font-bold ${isDarkMode ? "text-white" : "text-stone-800"}`}>{n.title}</p>
                                <p className="text-slate-500 mt-0.5">{n.message}</p>
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

            {/* Account Trigger Deck Controls */}
            {isLoggedIn ? (
              <div className="relative hidden lg:block">
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
                          <Link to="/profile" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                            <Ticket size={14} /> Your Bookings
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsProfileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-600 hover:bg-stone-100"}`}>
                              <ShieldCheck size={14} className="text-amber-500" /> Admin Console
                            </Link>
                          )}
                          <hr className={isDarkMode ? "border-white/[0.05]" : "border-stone-100"} />
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
              <Link to="/login" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/10">
                <LogIn size={14} strokeWidth={2.5} /> <span>Sign In</span>
              </Link>
            )}

            {/* Responsive Mobile Drawer Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border cursor-pointer focus:outline-none ${
                isDarkMode ? "border-white/[0.06] bg-white/[0.02] text-slate-300" : "border-stone-200 bg-stone-50 text-stone-700"
              }`}
              aria-label="Toggle structural menu drawer"
            >
              {isMobileMenuOpen ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
            </button>

          </div>
        </div>

        {/* Desktop Second Row Menu — Hides completely on devices below 1024px */}
        <div className={`border-t hidden lg:block ${isDarkMode ? "bg-slate-950/40 border-white/[0.02]" : "bg-stone-50/60 border-stone-200/40"}`}>
          <div className="max-w-[1440px] mx-auto px-6 h-12 flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-6">
              <NavLink to="/" end className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Home size={13} /> Home
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
              <NavLink to="/movies" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Film size={13} /> Movies
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
              <NavLink to="/theatres" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Building size={13} /> Theatres
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
              <NavLink to="/releases" className={({ isActive }) => `${linkBaseStyle} ${isActive ? "text-amber-500" : isDarkMode ? "text-slate-300" : "text-stone-600"}`}>
                {({ isActive }) => (
                  <>
                    <Sparkles size={13} /> Releases
                    {isActive && <motion.div layoutId="navUnderline" className="absolute bottom-[-14px] left-0 right-0 h-[2px] bg-amber-500" />}
                  </>
                )}
              </NavLink>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC RESPONSIVE MOBILE EXPANDED MENU DRAWER LAYOUT --- */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={`lg:hidden border-t overflow-hidden w-full transition-colors ${
                isDarkMode ? "bg-slate-950 border-white/[0.05]" : "bg-white border-stone-200"
              }`}
            >
              <div className="px-4 py-5 flex flex-col gap-4 text-sm font-bold">
                {isLoggedIn && (
                  <div className={`flex items-center gap-3 pb-3 border-b ${isDarkMode ? "border-white/[0.05]" : "border-stone-100"}`}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 flex items-center justify-center font-black text-stone-950 select-none">
                      {getUserInitials(user.name)}
                    </div>
                    <div className="truncate">
                      <p className={`text-sm font-black truncate ${isDarkMode ? "text-white" : "text-stone-800"}`}>{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate font-normal">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <Home size={15} /> Home Portal
                  </Link>
                  <Link to="/movies" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <Film size={15} /> Movies Matrix
                  </Link>
                  <Link to="/theatres" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <Building size={15} /> Theatres Map
                  </Link>
                  {isLoggedIn && (
                    <>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                        <User size={15} className="text-amber-500" /> Account Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                          <ShieldCheck size={15} className="text-amber-500" /> Admin Console
                        </Link>
                      )}
                    </>
                  )}
                  <Link to="/support" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isDarkMode ? "text-slate-300 hover:bg-white/[0.04]" : "text-stone-700 hover:bg-stone-50"}`}>
                    <HelpCircle size={15} /> Help & Support
                  </Link>
                </div>

                <div className="pt-2">
                  {isLoggedIn ? (
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-red-500 bg-red-500/10 border-none cursor-pointer"
                    >
                      <LogOut size={15} /> Close Active Session
                    </button>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black bg-amber-500 text-stone-950 shadow-md border-none"
                    >
                      <LogIn size={15} strokeWidth={2.5} /> <span>Sign In to Portal</span>
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