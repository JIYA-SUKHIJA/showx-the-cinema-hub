import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showxToast } from '../utils/toastConfig';
import Sidebar from '../components/Admin/Sidebar';
import StatsGrid from '../components/Admin/StatsGrid';
import DashboardCharts from '../components/Admin/DashboardCharts';
import DataTable from '../components/Admin/DataTable';
import UsersTable from '../components/Admin/UsersTable';
import SystemSettings from '../components/Admin/SystemSettings';
import { TableSkeleton, CardSkeleton } from '../components/Admin/Skeleton';
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
import { Bell, Search, UserCircle, Activity, Server, Clock, ChevronDown, Settings, LogOut, Plus, X } from 'lucide-react';

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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
    return () => clearInterval(timer);
  }, []);

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const [statsData, trendData] = await Promise.all([
          fetchDashboardStats(),
          fetchWeeklyTrend(),
        ]);
        setStats(statsData);
        setWeeklyTrend(trendData);
      } else if (activeTab === 'bookings') {
        setBookings(await fetchAllBookings());
      } else if (activeTab === 'users') {
        setUsers(await fetchAllUsers());
      } else if (activeTab === 'movies') {
        setMovies(await fetchAllMoviesAdmin());
      } else if (activeTab === 'theatres') {
        setTheatres(await fetchAllTheatresAdmin());
      } else if (activeTab === 'shows') {
        const [showsData, moviesData, theatresData] = await Promise.all([
          fetchAllShowsAdmin(),
          fetchAllMoviesAdmin(),
          fetchAllTheatresAdmin(),
        ]);
        setShows(showsData);
        setMovies(moviesData);
        setTheatres(theatresData);
      } else if (activeTab === 'payments') {
        setPayments(await fetchAllPaymentsAdmin());
      }
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const bookingRows = bookings.map((b) => ({
    id: b._id,
    movie: b.show?.movie?.title || '—',
    user: b.user?.name || '—',
    seats: b.seats?.length ?? 0,
    amount: `₹${b.totalAmount}`,
    status: b.paymentStatus === 'paid' ? 'Completed' : b.paymentStatus === 'failed' ? 'Cancelled' : 'Pending',
  }));

  const movieRows = movies.map((m) => ({
    id: m._id,
    title: m.title,
    category: m.type,
    genre: m.genre,
    language: m.language,
    rating: m.rating,
  }));

  const theatreRows = theatres.map((t) => ({
    id: t._id,
    name: t.name,
    location: t.location,
    city: t.city,
    formats: (t.formats || []).join(', '),
  }));

  const showRows = shows.map((s) => ({
    id: s._id,
    movie: s.movie?.title || '—',
    theatre: s.theatre?.name || '—',
    date: s.showDate ? new Date(s.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—',
    time: s.showTime,
    price: `₹${s.price}`,
    seats: `${s.bookedSeats?.length ?? 0}/${s.totalSeats}`,
  }));

  const paymentRows = payments.map((p) => ({
    id: p._id,
    user: p.user?.name || '—',
    movie: p.show?.movie?.title || '—',
    amount: `₹${p.totalAmount}`,
    paymentId: p.razorpayPaymentId || 'N/A (legacy)',
    date: new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
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
        showxToast.adminSuccess('Movie updated');
      } else {
        const created = await createMovieAdmin(payload);
        setMovies((prev) => [...prev, created]);
        showxToast.adminSuccess('Movie added');
      }
      setShowMovieForm(false);
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Save failed');
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
      showxToast.adminSuccess('Movie deleted');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Delete failed');
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
      formats: (theatre.formats || []).join(', '),
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
      };
      if (editingTheatreId) {
        const updated = await updateTheatreAdmin(editingTheatreId, payload);
        setTheatres((prev) => prev.map((t) => (t._id === editingTheatreId ? { ...t, ...updated } : t)));
        showxToast.adminSuccess('Theatre updated');
      } else {
        const created = await createTheatreAdmin(payload);
        setTheatres((prev) => [...prev, created]);
        showxToast.adminSuccess('Theatre added');
      }
      setShowTheatreForm(false);
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Save failed');
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
      showxToast.adminSuccess('Theatre deleted');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Delete failed');
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
        showxToast.adminSuccess('Show updated');
      } else {
        await createShowAdmin(payload);
        showxToast.adminSuccess('Show added');
      }
      setShowShowForm(false);
      const refreshed = await fetchAllShowsAdmin();
      setShows(refreshed);
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Save failed');
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
      showxToast.adminSuccess('Show deleted');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Delete failed');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      showxToast.adminSuccess('User role updated');
    } catch (err) {
      showxToast.adminError(err?.response?.data?.message || 'Role update failed');
    }
  };

  const tabConfig = {
    movies: { columns: ["ID", "Title", "Category", "Genre", "Language", "Rating"], data: movieRows, onDelete: handleDeleteMovie, onEdit: openEditMovie },
    bookings: { columns: ["ID", "Movie", "User", "Seats", "Amount", "Status"], data: bookingRows },
    theatres: { columns: ["ID", "Name", "Location", "City", "Formats"], data: theatreRows, onDelete: handleDeleteTheatre, onEdit: openEditTheatre },
    shows: { columns: ["ID", "Movie", "Theatre", "Date", "Time", "Price", "Seats"], data: showRows, onDelete: handleDeleteShow, onEdit: openEditShow },
    payments: { columns: ["ID", "User", "Movie", "Amount", "Payment ID", "Date"], data: paymentRows },
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex">
      <Sidebar
        isExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={true}
        logout={() => { showxToast.logout(); setTimeout(() => navigate('/login'), 1500); }}
      />

      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/[0.05] flex items-center px-10 justify-between shrink-0 bg-[#060608]/50 backdrop-blur-md">
          <h1 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#FF9F00]">{activeTab} Console</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#111114] px-4 py-2 rounded-xl border border-white/[0.05] focus-within:border-[#FF9F00]/50 transition-all">
              <Search size={14} className="text-slate-600" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search data..."
                className="bg-transparent text-[10px] font-bold text-white outline-none w-32"
              />
            </div>
            <div className="relative cursor-pointer group">
              <Bell size={16} className="text-slate-500 hover:text-[#FF9F00] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF9F00] rounded-full animate-ping" />
            </div>
            <div className="relative">
              <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 cursor-pointer hover:bg-white/[0.03] p-1 rounded-lg transition-all">
                <UserCircle size={24} className="text-[#FF9F00]" />
                <ChevronDown size={14} className="text-slate-500" />
              </div>
              {showProfileMenu && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-3 w-40 bg-[#111114] border border-white/[0.05] rounded-xl p-2 shadow-2xl z-50">
                  <button onClick={() => setActiveTab('settings')} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-400 hover:text-white rounded-lg"><Settings size={14} /> Settings</button>
                  <button onClick={() => { showxToast.logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-500/5 rounded-lg"><LogOut size={14} /> Logout</button>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-grow p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-8"><CardSkeleton /><TableSkeleton /></div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {activeTab === 'dashboard' && (
                  <>
                    <StatsGrid isDarkMode={true} stats={stats} />
                    <DashboardCharts isDarkMode={true} data={weeklyTrend} />
                  </>
                )}

                {activeTab === 'settings' && (
                  <div className="max-w-4xl">
                    <h2 className="text-xl font-black uppercase text-slate-500 mb-6">System Configuration</h2>
                    <SystemSettings />
                  </div>
                )}

                {activeTab === 'movies' && (
                  <div className="flex justify-end">
                    <button onClick={openAddMovie} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest">
                      <Plus size={14} /> Add Movie
                    </button>
                  </div>
                )}

                {activeTab === 'theatres' && (
                  <div className="flex justify-end">
                    <button onClick={openAddTheatre} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest">
                      <Plus size={14} /> Add Theatre
                    </button>
                  </div>
                )}

                {activeTab === 'shows' && (
                  <div className="flex justify-end">
                    <button onClick={openAddShow} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest">
                      <Plus size={14} /> Add Show
                    </button>
                  </div>
                )}

                {activeTab === 'users' && (
                  <UsersTable users={users} isDarkMode={true} onRoleChange={handleRoleChange} />
                )}

                {tabConfig[activeTab] && (
                  <DataTable
                    columns={tabConfig[activeTab].columns}
                    data={tabConfig[activeTab].data}
                    isDarkMode={true}
                    onDelete={tabConfig[activeTab].onDelete}
                    onEdit={tabConfig[activeTab].onEdit}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="h-16 border-t border-white/[0.05] flex items-center px-10 justify-between bg-[#060608] shrink-0">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <div className="flex items-center gap-2"><Activity size={12} className="text-emerald-500" /> System Online</div>
            <div className="flex items-center gap-2"><Server size={12} className="text-blue-500" /> Latency: 24ms</div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
            <Clock size={12} /> {currentTime} | Showx Enterprise © 2026
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {showMovieForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleSaveMovie}
              className="bg-[#111114] border border-white/[0.08] rounded-2xl p-8 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black uppercase text-[#FF9F00]">{editingMovieId ? 'Edit Movie' : 'Add Movie'}</h3>
                <button type="button" onClick={() => setShowMovieForm(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Category</label>
                <select
                  required
                  value={movieForm.type}
                  onChange={(e) => setMovieForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50"
                >
                  <option value="movie">Movie</option>
                  <option value="stream">Stream</option>
                  <option value="events">Event</option>
                  <option value="plays">Play</option>
                </select>
              </div>

              {['title', 'genre', 'language', 'rating', 'poster', 'duration', 'description'].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-500">{field}</label>
                  <input
                    required={field !== 'rating'}
                    value={movieForm[field]}
                    onChange={(e) => setMovieForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50"
                  />
                </div>
              ))}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Hero Banner Focus (crop position)</label>
                <select
                  value={movieForm.heroFocusY}
                  onChange={(e) => setMovieForm((prev) => ({ ...prev, heroFocusY: e.target.value }))}
                  className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50"
                >
                  <option value="top">Top</option>
                  <option value="20%">Upper (20%)</option>
                  <option value="center">Center</option>
                  <option value="70%">Lower (70%)</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">
                  Cast (one per line: Name:Role:ImageURL)
                </label>
                <textarea
                  rows={4}
                  value={movieForm.castText}
                  onChange={(e) => setMovieForm((prev) => ({ ...prev, castText: e.target.value }))}
                  placeholder={"John Doe:Lead Actor:https://...\nJane Smith:Supporting:https://..."}
                  className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={savingMovie}
                className="w-full py-3 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {savingMovie ? 'Saving...' : editingMovieId ? 'Update Movie' : 'Create Movie'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTheatreForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleSaveTheatre}
              className="bg-[#111114] border border-white/[0.08] rounded-2xl p-8 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black uppercase text-[#FF9F00]">{editingTheatreId ? 'Edit Theatre' : 'Add Theatre'}</h3>
                <button type="button" onClick={() => setShowTheatreForm(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">name</label>
                <input required value={theatreForm.name} onChange={(e) => setTheatreForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">location</label>
                <input required value={theatreForm.location} onChange={(e) => setTheatreForm((prev) => ({ ...prev, location: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">city</label>
                <input required value={theatreForm.city} onChange={(e) => setTheatreForm((prev) => ({ ...prev, city: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">formats (comma separated)</label>
                <input value={theatreForm.formats} onChange={(e) => setTheatreForm((prev) => ({ ...prev, formats: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>

              <button type="submit" disabled={savingTheatre} className="w-full py-3 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                {savingTheatre ? 'Saving...' : editingTheatreId ? 'Update Theatre' : 'Create Theatre'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShowForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.form
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleSaveShow}
              className="bg-[#111114] border border-white/[0.08] rounded-2xl p-8 w-full max-w-md max-h-[85vh] overflow-y-auto space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black uppercase text-[#FF9F00]">{editingShowId ? 'Edit Show' : 'Add Show'}</h3>
                <button type="button" onClick={() => setShowShowForm(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Movie</label>
                <select
                  required
                  value={showForm.movie}
                  onChange={(e) => setShowForm((prev) => ({ ...prev, movie: e.target.value }))}
                  className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50"
                >
                  <option value="">Select a movie</option>
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Theatre</label>
                <select
                  required
                  value={showForm.theatre}
                  onChange={(e) => setShowForm((prev) => ({ ...prev, theatre: e.target.value }))}
                  className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50"
                >
                  <option value="">Select a theatre</option>
                  {theatres.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Screen (e.g. Screen 1)</label>
                <input required value={showForm.screen} onChange={(e) => setShowForm((prev) => ({ ...prev, screen: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Format (e.g. 2D, IMAX)</label>
                <input required value={showForm.format} onChange={(e) => setShowForm((prev) => ({ ...prev, format: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Show Date</label>
                <input required type="date" value={showForm.showDate} onChange={(e) => setShowForm((prev) => ({ ...prev, showDate: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Show Time (e.g. 18:00)</label>
                <input required value={showForm.showTime} onChange={(e) => setShowForm((prev) => ({ ...prev, showTime: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Price (₹)</label>
                <input required type="number" value={showForm.price} onChange={(e) => setShowForm((prev) => ({ ...prev, price: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Total Seats</label>
                <input required type="number" value={showForm.totalSeats} onChange={(e) => setShowForm((prev) => ({ ...prev, totalSeats: e.target.value }))} className="w-full bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#FF9F00]/50" />
              </div>

              <button type="submit" disabled={savingShow} className="w-full py-3 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
                {savingShow ? 'Saving...' : editingShowId ? 'Update Show' : 'Create Show'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}