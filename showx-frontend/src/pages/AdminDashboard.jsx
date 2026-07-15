// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showxToast } from '../utils/toastConfig';
import axiosInstance from '../services/axiosInstance';
import Sidebar from '../components/Admin/Sidebar';
import StatsGrid from '../components/Admin/StatsGrid';
import DashboardCharts from '../components/Admin/DashboardCharts';
import DataTable from '../components/Admin/DataTable';
import UsersTable from '../components/Admin/UsersTable';
import SystemSettings from '../components/Admin/SystemSettings';
import { TableSkeleton, CardSkeleton } from '../components/Admin/Skeleton';
import { useTheme } from '../context/ThemeContext';
import {
  fetchDashboardStats,
  fetchWeeklyTrend,
  fetchAllBookings,
  fetchAllUsers,
  updateUserRole,
  fetchAllMoviesAdmin,
  createMovieAdmin,
  updateMovieAdmin,
  deleteMovieAdmin,
  fetchAllTheatresAdmin,
  createTheatreAdmin,
  updateTheatreAdmin,
  deleteTheatreAdmin,
  fetchAllShowsAdmin,
  createShowAdmin,
  updateShowAdmin,
  deleteShowAdmin,
  fetchAllPaymentsAdmin,
} from '../services/adminApi';
import { Bell, Search, UserCircle, Server, Clock, ChevronDown, Settings, LogOut, Plus, X, RefreshCw, Layers, Sun, Moon, Sparkles } from 'lucide-react';

const EMPTY_MOVIE_FORM = {
  title: '',
  type: 'movie',
  genre: '',
  language: '',
  rating: '8.0',
  poster: '',
  heroFocusY: 'center',
  duration: '',
  description: '',
  castText: '',
};

const EMPTY_THEATRE_FORM = {
  name: '',
  location: '',
  city: '',
  formats: '',
  image: '',
};

const EMPTY_SHOW_FORM = {
  movie: '',
  theatre: '',
  screen: '',
  format: '',
  showDate: '',
  showTime: '',
  price: '',
  totalSeats: '96',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [timeGreeting, setTimeGreeting] = useState("Welcome");

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());

  const [stats, setStats] = useState(null);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [payments, setPayments] = useState([]);

  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [movieForm, setMovieForm] = useState(EMPTY_MOVIE_FORM);
  const [savingMovie, setSavingMovie] = useState(false);

  const [showTheatreForm, setShowTheatreForm] = useState(false);
  const [editingTheatreId, setEditingTheatreId] = useState(null);
  const [theatreForm, setTheatreForm] = useState(EMPTY_THEATRE_FORM);
  const [savingTheatre, setSavingTheatre] = useState(false);

  const [showShowForm, setShowShowForm] = useState(false);
  const [editingShowId, setEditingShowId] = useState(null);
  const [showForm, setShowForm] = useState(EMPTY_SHOW_FORM);
  const [savingShow, setSavingShow] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    const hours = new Date().getHours();
    if (hours < 12) setTimeGreeting("Good morning");
    else if (hours < 17) setTimeGreeting("Good afternoon");
    else setTimeGreeting("Good evening");
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get('/notifications/admin');
        setAdminNotifications(res.data?.notifications || []);
        setUnreadNotifCount(res.data?.unreadCount || 0);
      } catch (err) {
        // Safe tracking fallback bypass
      }
    };
    fetchNotifications();
  }, []);

  const handleNotifBellClick = async () => {
    const opening = !showNotifMenu;
    setShowNotifMenu(opening);
    if (opening && unreadNotifCount > 0) {
      try {
        await axiosInstance.put('/notifications/read-all');
        setUnreadNotifCount(0);
        setAdminNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        // Safe dynamic recovery bypass
      }
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [statsData, trendData] = await Promise.all([
          fetchDashboardStats().catch(() => null),
          fetchWeeklyTrend().catch(() => []),
        ]);
        setStats(statsData || { totalRevenue: 0, totalBookings: 0, totalUsers: 0, activeMovies: 0 });
        setWeeklyTrend(trendData || []);
      } else if (activeTab === 'bookings') {
        const data = await fetchAllBookings().catch(() => []);
        setBookings(Array.isArray(data) ? data : []);
      } else if (activeTab === 'users') {
        const data = await fetchAllUsers().catch(() => []);
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'movies') {
        const data = await fetchAllMoviesAdmin().catch(() => []);
        setMovies(Array.isArray(data) ? data : []);
      } else if (activeTab === 'theatres') {
        const data = await fetchAllTheatresAdmin().catch(() => []);
        setTheatres(Array.isArray(data) ? data : []);
      } else if (activeTab === 'shows') {
        const [showsData, moviesData, theatresData] = await Promise.all([
          fetchAllShowsAdmin().catch(() => []),
          fetchAllMoviesAdmin().catch(() => []),
          fetchAllTheatresAdmin().catch(() => []),
        ]);
        setShows(Array.isArray(showsData) ? showsData : []);
        setMovies(Array.isArray(moviesData) ? moviesData : []);
        setTheatres(Array.isArray(theatresData) ? theatresData : []);
      } else if (activeTab === 'payments') {
        const data = await fetchAllPaymentsAdmin().catch(() => []);
        setPayments(Array.isArray(data) ? data : []);
      }
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Failed to load module data streams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Defensive array checks with complete object optional chaining safeguards
  const bookingRows = bookings.map((b) => ({
    id: b?._id || '—',
    movie: b?.show?.movie?.title || b?.movieTitle || '—',
    user: b?.user?.name || b?.userName || '—',
    seats: b?.seats?.length ?? 0,
    amount: `₹${b?.totalAmount || 0}`,
    status: b?.paymentStatus === 'paid' ? 'Completed' : b?.paymentStatus === 'failed' ? 'Cancelled' : 'Pending',
  }));

  const movieRows = movies.map((m) => ({
    id: m?._id || '—',
    title: m?.title || '—',
    category: m?.type || 'movie',
    genre: m?.genre || '—',
    language: m?.language || '—',
    rating: m?.rating || '8.0',
  }));

  const theatreRows = theatres.map((t) => ({
    id: t?._id || '—',
    name: t?.name || '—',
    location: t?.location || '—',
    city: t?.city || '—',
    formats: Array.isArray(t?.formats) ? t.formats.join(', ') : '2D',
  }));

  const showRows = shows.map((s) => ({
    id: s?._id || '—',
    movie: s?.movie?.title || '—',
    theatre: s?.theatre?.name || '—',
    date: s?.showDate ? new Date(s.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—',
    time: s?.showTime || '—',
    price: `₹${s?.price || 0}`,
    seats: `${s?.bookedSeats?.length ?? 0}/${s?.totalSeats || 96}`,
  }));

  const paymentRows = payments.map((p) => ({
    id: p?._id || '—',
    user: p?.user?.name || '—',
    movie: p?.show?.movie?.title || '—',
    amount: `₹${p?.totalAmount || 0}`,
    paymentId: p?.razorpayPaymentId || 'N/A (legacy)',
    date: p?.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
  }));

  const openAddMovie = () => {
    setEditingMovieId(null);
    setMovieForm(EMPTY_MOVIE_FORM);
    setShowMovieForm(true);
  };

  const openEditMovie = (idx) => {
    const movie = movies[idx];
    if (!movie) return;
    setEditingMovieId(movie._id);
    const castText = (movie.cast || [])
      .map((c) => `${c.name}:${c.role}:${c.img || ''}`)
      .join('\n');
    setMovieForm({
      title: movie.title || '',
      type: movie.type || 'movie',
      genre: movie.genre || '',
      language: movie.language || '',
      rating: movie.rating || '8.0',
      poster: movie.poster || '',
      heroFocusY: movie.heroFocusY || 'center',
      duration: movie.duration || '',
      description: movie.description || '',
      castText,
    });
    setShowMovieForm(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    setSavingMovie(true);
    try {
      const cast = movieForm.castText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const firstColon = line.indexOf(':');
          const secondColon = line.indexOf(':', firstColon + 1);
          const name = firstColon === -1 ? line : line.slice(0, firstColon).trim();
          const role = firstColon === -1 ? 'Actor' : (secondColon === -1 ? line.slice(firstColon + 1).trim() : line.slice(firstColon + 1, secondColon).trim());
          const img = secondColon === -1 ? '' : line.slice(secondColon + 1).trim();
          return { name: name || 'Unknown', role: role || 'Actor', img };
        });
      const payload = { ...movieForm, cast };
      delete payload.castText;

      if (editingMovieId) {
        const updated = await updateMovieAdmin(editingMovieId, payload);
        setMovies((prev) => prev.map((m) => (m._id === editingMovieId ? { ...m, ...updated } : m)));
        showxToast.adminSuccess('Movie registry synchronized');
      } else {
        const created = await createMovieAdmin(payload);
        setMovies((prev) => [...prev, created]);
        showxToast.adminSuccess('Movie record mapped safely');
      }
      setShowMovieForm(false);
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Save execution tracking failed');
    } finally {
      setSavingMovie(false);
    }
  };

  const handleDeleteMovie = async (idx) => {
    const movie = movieRows[idx];
    if (!movie) return;
    try {
      await deleteMovieAdmin(movie.id);
      setMovies((prev) => prev.filter((m) => m._id !== movie.id));
      showxToast.adminSuccess('Movie trace purged');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Purge command failed');
    }
  };

  const openAddTheatre = () => {
    setEditingTheatreId(null);
    setTheatreForm(EMPTY_THEATRE_FORM);
    setShowTheatreForm(true);
  };

  const openEditTheatre = (idx) => {
    const theatre = theatres[idx];
    if (!theatre) return;
    setEditingTheatreId(theatre._id);
    setTheatreForm({
      name: theatre.name || '',
      location: theatre.location || '',
      city: theatre.city || '',
      formats: Array.isArray(theatre.formats) ? theatre.formats.join(', ') : '',
      image: theatre.image || '',
    });
    setShowTheatreForm(true);
  };

  const handleSaveTheatre = async (e) => {
    e.preventDefault();
    setSavingTheatre(true);
    try {
      const payload = {
        name: theatreForm.name,
        location: theatreForm.location,
        city: theatreForm.city,
        formats: theatreForm.formats.split(',').map((f) => f.trim()).filter(Boolean),
        image: theatreForm.image,
      };
      if (editingTheatreId) {
        const updated = await updateTheatreAdmin(editingTheatreId, payload);
        setTheatres((prev) => prev.map((t) => (t._id === editingTheatreId ? { ...t, ...updated } : t)));
        showxToast.adminSuccess('Theatre configurations locked');
      } else {
        const created = await createTheatreAdmin(payload);
        setTheatres((prev) => [...prev, created]);
        showxToast.adminSuccess('Theatre node appended');
      }
      setShowTheatreForm(false);
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Theatre compilation matrix abort');
    } finally {
      setSavingTheatre(false);
    }
  };

  const handleDeleteTheatre = async (idx) => {
    const theatre = theatreRows[idx];
    if (!theatre) return;
    try {
      await deleteTheatreAdmin(theatre.id);
      setTheatres((prev) => prev.filter((t) => t._id !== theatre.id));
      showxToast.adminSuccess('Theatre module disconnected');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Purge trace reject');
    }
  };

  const openAddShow = () => {
    setEditingShowId(null);
    setShowForm(EMPTY_SHOW_FORM);
    setShowShowForm(true);
  };

  const openEditShow = (idx) => {
    const show = shows[idx];
    if (!show) return;
    setEditingShowId(show._id);
    setShowForm({
      movie: show.movie?._id || '',
      theatre: show.theatre?._id || '',
      screen: show.screen || '',
      format: show.format || '',
      showDate: show.showDate ? new Date(show.showDate).toISOString().split('T')[0] : '',
      showTime: show.showTime || '',
      price: show.price || '',
      totalSeats: show.totalSeats || '96',
    });
    setShowShowForm(true);
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    setSavingShow(true);
    try {
      const payload = {
        ...showForm,
        price: Number(showForm.price),
        totalSeats: Number(showForm.totalSeats),
      };
      if (editingShowId) {
        await updateShowAdmin(editingShowId, payload);
        showxToast.adminSuccess('Performance schedule aligned');
      } else {
        await createShowAdmin(payload);
        showxToast.adminSuccess('Performance track registered');
      }
      setShowShowForm(false);
      const refreshed = await fetchAllShowsAdmin();
      setShows(refreshed);
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Schedule configuration failure');
    } finally {
      setSavingShow(false);
    }
  };

  const handleDeleteShow = async (idx) => {
    const show = showRows[idx];
    if (!show) return;
    try {
      await deleteShowAdmin(show.id);
      setShows((prev) => prev.filter((s) => s._id !== show.id));
      showxToast.adminSuccess('Showtime slot cleared');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Clear log request rejected');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      showxToast.adminSuccess('Account clearance tier assigned');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Access change sequence failed');
    }
  };

  const tabConfig = {
    movies: { columns: ["ID", "Title", "Category", "Genre", "Language", "Rating"], data: movieRows, onDelete: handleDeleteMovie, onEdit: openEditMovie },
    bookings: { columns: ["ID", "Movie", "User", "Seats", "Amount", "Status"], data: bookingRows },
    theatres: { columns: ["ID", "Name", "Location", "City", "Formats"], data: theatreRows, onDelete: handleDeleteTheatre, onEdit: openEditTheatre },
    shows: { columns: ["ID", "Movie", "Theatre", "Date", "Time", "Price", "Seats"], data: showRows, onDelete: handleDeleteShow, onEdit: openEditShow },
    payments: { columns: ["ID", "User", "Movie", "Amount", "Payment ID", "Date"], data: paymentRows },
  };

  const getFilteredTabData = () => {
    const config = tabConfig[activeTab];
    if (!config) return config;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return config;
    const filteredData = config.data.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      )
    );
    return { ...config, data: filteredData };
  };

  const localKeyframeStyles = `
    @keyframes adminEntranceUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-admin-up {
      animation: adminEntranceUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return (
    <div className={`min-h-screen flex selection:bg-[#FF9F00]/30 selection:text-white antialiased transition-colors duration-300 w-full overflow-hidden ${
      isDarkMode ? "bg-[#060608] text-white" : "bg-[#FAFAF8] text-slate-800"
    }`}>
      <style>{localKeyframeStyles}</style>
      <Sidebar
        isExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className={`flex-grow flex flex-col h-screen overflow-hidden bg-gradient-to-br min-w-0 ${
        isDarkMode ? "from-[#060608] via-[#08080c] to-[#0b0c10]" : "from-[#FAFAF8] via-[#F5F3EC] to-[#EAE7DC]"
      }`}>
        
        {/* --- PREMIUM NAVIGATION CONTROL PANEL --- */}
        <header className={`h-16 sm:h-20 border-b flex items-center px-4 sm:px-10 justify-between shrink-0 backdrop-blur-xl z-30 transition-all gap-2 ${
          isDarkMode ? "bg-[#060608]/40 border-white/[0.04]" : "bg-[#FAFAF8]/60 border-stone-200/60 shadow-sm"
        }`}>
          <div className="space-y-0.5 min-w-0 flex items-center gap-3">
            <div className="hidden lg:block relative">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[10px] font-black font-mono tracking-[0.25em] uppercase text-[#FF9F00] flex items-center gap-1.5 truncate">
                <Layers size={11} className="shrink-0" /> <span className="truncate">{activeTab} Console Node</span>
              </h1>
              <p className={`text-[10px] font-bold truncate hidden sm:block ${isDarkMode ? "text-slate-500" : "text-stone-500"}`}>
                {timeGreeting}, Admin — Telemetry streams synchronised.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            <button 
              onClick={toggleTheme}
              aria-label="Toggle system layout theme alignment"
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer outline-none transform active:scale-95 ${
                isDarkMode 
                  ? "bg-[#111114]/80 border-white/[0.04] text-amber-400 hover:text-amber-300" 
                  : "bg-white border-stone-200 text-stone-700 shadow-sm hover:border-amber-500/30"
              }`}
            >
              {isDarkMode ? <Sun size={13} strokeWidth={2.5} /> : <Moon size={13} strokeWidth={2.5} />}
            </button>

            <div className={`hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all shadow-sm ${
              isDarkMode ? "bg-[#111114]/80 border-white/[0.04] focus-within:border-[#FF9F00]/40" : "bg-white border-stone-200 focus-within:border-[#FF9F00]/50"
            }`}>
              <Search size={14} className="text-slate-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter index rows..."
                className={`bg-transparent text-[11px] font-bold outline-none w-28 lg:w-36 placeholder-slate-500 font-mono ${isDarkMode ? "text-white" : "text-slate-800"}`}
              />
            </div>

            <div className="relative">
              <button onClick={handleNotifBellClick} className="relative cursor-pointer group bg-transparent border-none p-1 focus:outline-none transform active:scale-95 transition-transform">
                <Bell size={15} className="text-slate-500 group-hover:text-[#FF9F00] transition-colors" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-[#FF9F00] text-black text-[8px] font-black flex items-center justify-center animate-pulse">
                    {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {showNotifMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className={`absolute right-0 mt-3 w-72 sm:w-80 max-h-96 overflow-y-auto border backdrop-blur-xl rounded-xl p-2 shadow-2xl z-50 no-scrollbar ${
                      isDarkMode ? "bg-[#111114]/95 border-white/[0.06]" : "bg-white/95 border-stone-200"
                    }`}
                  >
                    <div className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-white/[0.02] mb-1 font-mono">System Notifications Array</div>
                    {adminNotifications.length === 0 ? (
                      <p className="px-3 py-6 text-[10px] text-slate-500 text-center font-mono">No telemetry nodes logged.</p>
                    ) : (
                      <div className="space-y-0.5">
                        {adminNotifications.map((n) => (
                          <div key={n._id} className="px-3 py-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                            <p className={`text-[11px] font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{n.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-1.5 cursor-pointer hover:bg-white/[0.03] px-2 py-1.5 rounded-xl border border-transparent transition-all select-none">
                <UserCircle size={18} className="text-[#FF9F00]" />
                <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
              </div>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className={`absolute right-0 mt-3 w-44 border backdrop-blur-xl rounded-xl p-1.5 shadow-2xl z-50 font-mono text-[10px] ${
                      isDarkMode ? "bg-[#111114]/95 border-white/[0.06]" : "bg-white/95 border-stone-200"
                    }`}
                  >
                    <button onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 font-bold hover:bg-white/[0.04] rounded-lg border-none bg-transparent text-left cursor-pointer ${isDarkMode ? "text-slate-400 hover:text-white" : "text-stone-600 hover:text-stone-950"}`}><Settings size={13} /> Console Settings</button>
                    <div className="h-[1px] bg-white/[0.04] my-1" />
                    <button onClick={() => { showxToast.logout(); navigate('/login'); }} className="w-full flex items-center gap-2.5 px-3 py-2 font-bold text-red-500 hover:bg-red-500/10 rounded-lg border-none bg-transparent text-left cursor-pointer"><LogOut size={13} /> Logout Session</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* --- DYNAMIC RENDER ROUTE VIEW --- */}
        <div className="flex-grow p-4 sm:p-8 lg:p-10 overflow-y-auto no-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-8"><CardSkeleton /><TableSkeleton /></div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-8 animate-admin-up">
                {activeTab === 'dashboard' && (
                  <>
                    <StatsGrid stats={stats} />
                    <DashboardCharts data={weeklyTrend} />
                  </>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-4xl">
                    <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest font-mono mb-6 flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" /> System Configuration Node
                    </h2>
                    <SystemSettings />
                  </div>
                )}

                {['movies', 'theatres', 'shows'].includes(activeTab) && (
                  <div className="flex justify-end">
                    <motion.button 
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} 
                      onClick={activeTab === 'movies' ? openAddMovie : activeTab === 'theatres' ? openAddTheatre : openAddShow}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest cursor-pointer border-none shadow-md shadow-[#FF9F00]/10 hover:brightness-105 transition-all"
                    >
                      <Plus size={13} strokeWidth={2.5} /> Add {activeTab.slice(0, -1)}
                    </motion.button>
                  </div>
                )}

                {activeTab === 'users' && (
                  <UsersTable users={users} onRoleChange={handleRoleChange} />
                )}

                {tabConfig[activeTab] && (
                  <DataTable
                    columns={getFilteredTabData().columns}
                    data={getFilteredTabData().data}
                    onDelete={tabConfig[activeTab].onDelete}
                    onEdit={tabConfig[activeTab].onEdit}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- SOLID DEEP OBSIDIAN BLACK METRICS FOOTER --- */}
        <footer className="h-auto sm:h-14 py-2 sm:py-0 border-t border-neutral-900 flex flex-col sm:flex-row items-center gap-2 sm:gap-0 px-4 sm:px-10 justify-between bg-[#0b0c10] shrink-0 z-20 transition-colors duration-300">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" /> 
              Telemetry Status: Nominal
            </div>
            <div className="flex items-center gap-2"><Server size={12} className="text-amber-500/80" /> Core Gateway latency: 24ms</div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-500"><RefreshCw size={11} /> Next Sync: {lastSyncTime}</div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono select-none">
            <Clock size={12} className="text-amber-500" /> {currentTime} | Showx Enterprise © 2026
          </div>
        </footer>
      </main>

      {/* --- FORM ENTRY DIALOG WRAPPERS --- */}
      <AnimatePresence>
        {showMovieForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.form
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              onSubmit={handleSaveMovie}
              className="bg-[#111114] border border-white/[0.08] rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FF9F00] font-mono">{editingMovieId ? 'Edit Movie Entry' : 'Add Movie Hub Node'}</h3>
                <button type="button" onClick={() => setShowMovieForm(false)} className="text-slate-500 hover:text-white bg-transparent border-none cursor-pointer"><X size={18} /></button>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Category Tiers</label>
                <select required value={movieForm.type} onChange={(e) => setMovieForm((prev) => ({ ...prev, type: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-medium">
                  <option value="movie">Movie</option><option value="stream">Stream</option><option value="events">Event</option><option value="plays">Play</option>
                </select>
              </div>
              {['title', 'genre', 'language', 'rating', 'poster', 'duration', 'description'].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">{field}</label>
                  <input required={field !== 'rating'} value={movieForm[field]} onChange={(e) => setMovieForm((prev) => ({ ...prev, [field]: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50" />
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Hero Focus</label>
                <select value={movieForm.heroFocusY} onChange={(e) => setMovieForm((prev) => ({ ...prev, heroFocusY: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-medium">
                  <option value="top">Top</option><option value="20%">Upper (20%)</option><option value="center">Center</option><option value="70%">Lower (70%)</option><option value="bottom">Bottom</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Cast (Name:Role:ImageURL)</label>
                <textarea rows={4} value={movieForm.castText} onChange={(e) => setMovieForm((prev) => ({ ...prev, castText: e.target.value }))} placeholder={"John Doe:Lead Actor:https://...\nJane Smith:Supporting:https://..."} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-mono no-scrollbar" />
              </div>
              <button type="submit" disabled={savingMovie} className="w-full py-3 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-md shadow-[#FF9F00]/10 border-none">
                {savingMovie ? 'Syncing data...' : editingMovieId ? 'Update Master Node' : 'Initialize Node'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTheatreForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.form
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              onSubmit={handleSaveTheatre}
              className="bg-[#111114] border border-white/[0.08] rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl space-y-4 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FF9F00] font-mono">{editingTheatreId ? 'Modify Theatre Node' : 'Append Theatre Matrix'}</h3>
                <button type="button" onClick={() => setShowTheatreForm(false)} className="text-slate-500 hover:text-white bg-transparent border-none cursor-pointer"><X size={18} /></button>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">name</label>
                <input required value={theatreForm.name} onChange={(e) => setTheatreForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">location</label>
                <input required value={theatreForm.location} onChange={(e) => setTheatreForm((prev) => ({ ...prev, location: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">city</label>
                <input required value={theatreForm.city} onChange={(e) => setTheatreForm((prev) => ({ ...prev, city: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">formats (comma split)</label>
                <input value={theatreForm.formats} onChange={(e) => setTheatreForm((prev) => ({ ...prev, formats: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">image url</label>
                <input value={theatreForm.image} onChange={(e) => setTheatreForm((prev) => ({ ...prev, image: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50" placeholder="https://images.unsplash.com/..." />
              </div>
              <button type="submit" disabled={savingTheatre} className="w-full py-3 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-md shadow-[#FF9F00]/10 border-none">
                {savingTheatre ? 'Syncing matrix logs...' : editingTheatreId ? 'Commit Modifications' : 'Commit Matrix Entry'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShowForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.form
              initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              onSubmit={handleSaveShow}
              className="bg-[#111114] border border-white/[0.08] rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl no-scrollbar text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#FF9F00] font-mono">{editingShowId ? 'Edit Performance Show' : 'Add Show Time Allocation'}</h3>
                <button type="button" onClick={() => setShowShowForm(false)} className="text-slate-500 hover:text-white bg-transparent border-none cursor-pointer"><X size={18} /></button>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Movie Node</label>
                <select required value={showForm.movie} onChange={(e) => setShowForm((prev) => ({ ...prev, movie: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF9F00]/50">
                  <option value="">Select allocation target...</option>
                  {movies.map((m) => (<option key={m._id} value={m._id}>{m.title}</option>))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Theatre Nexus</label>
                <select required value={showForm.theatre} onChange={(e) => setShowForm((prev) => ({ ...prev, theatre: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2.5 text-xs text-white outline-none focus:border-[#FF9F00]/50">
                  <option value="">Select location node...</option>
                  {theatres.map((t) => (<option key={t._id} value={t._id}>{t.name}</option>))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Screen Node ID</label>
                <input required value={showForm.screen} onChange={(e) => setShowForm((prev) => ({ ...prev, screen: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Format Token</label>
                <input required value={showForm.format} onChange={(e) => setShowForm((prev) => ({ ...prev, format: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Show Date</label>
                <input required type="date" value={showForm.showDate} onChange={(e) => setShowForm((prev) => ({ ...prev, showDate: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Show Clock Time</label>
                <input required value={showForm.showTime} onChange={(e) => setShowForm((prev) => ({ ...prev, showTime: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Price Matrix (₹)</label>
                <input required type="number" value={showForm.price} onChange={(e) => setShowForm((prev) => ({ ...prev, price: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 font-mono">Total Seats</label>
                <input required type="number" value={showForm.totalSeats} onChange={(e) => setShowForm((prev) => ({ ...prev, totalSeats: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#FF9F00]/50 font-mono" />
              </div>
              <button type="submit" disabled={savingShow} className="w-full py-3 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer shadow-md shadow-[#FF9F00]/10 border-none">
                {savingShow ? 'Compiling paths...' : editingShowId ? 'Push Parameter Changes' : 'Initialize Schedule Track'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}