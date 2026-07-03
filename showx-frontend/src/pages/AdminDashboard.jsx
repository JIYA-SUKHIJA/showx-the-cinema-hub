// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Clapperboard, Ticket, Users, Settings, 
  RefreshCcw, TrendingUp, Users2, Film, CheckCircle2, 
  Trash2, Plus, Edit, Save, ArrowLeft, X,
  DollarSign, Activity, Percent, Terminal, ShieldAlert,
  ShieldAlert as AlertIcon, XCircle, UserPlus, Check, RotateCcw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme(); 
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // --- REAL-TIME AUTOMATED LOGS ENGINE ---
  const [systemLogs, setSystemLogs] = useState([
    "LOG // 11:14:02 // JWT Validation Module Initiated Successfully.",
    "LOG // 11:14:45 // Seating sync requested for showId: m1-karnal.",
    "LOG // 11:15:10 // Razorpay test signature verification pipeline - STATUS: NOMINAL."
  ]);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const liveServices = ["Auth Token verification", "MongoDB query execution", "Razorpay webhook catch", "Seat-lock TTL timer check", "Vercel pipeline deployment tick"];
      const chosenService = liveServices[Math.floor(Math.random() * liveServices.length)];
      const timestamp = new Date().toLocaleTimeString();
      setSystemLogs(prev => [
        `LOG // ${timestamp} // Continuous polling node: ${chosenService} returned code 200.`,
        ...prev.slice(0, 7) 
      ]);
    }, 4500);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['screenings', 'bookings', 'users', 'settings'].includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('overview');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabClick = (tab) => {
    window.location.hash = tab === 'overview' ? '' : tab;
    setActiveTab(tab);
  };

  // --- DYNAMIC LIVE DATA STORES (CRUDS & STATE MODIFIERS) ---
  const [shows, setShows] = useState([
    { id: 'sh1', title: 'Welcome To The Jungle', type: 'Movie', venue: 'Cinema Screen 1', time: '12:30 PM', price: '250', availability: '42 Seats Left' },
    { id: 'sh2', title: 'Main Vaapas Aaunga', type: 'Movie', venue: 'Cinema Screen 3', time: '04:15 PM', price: '220', availability: '12 Seats Left' },
    { id: 'sh3', title: 'Arijit Singh Live In Concert', type: 'Event', venue: 'HUDA Ground', time: '07:00 PM', price: '1499', availability: 'Sold Out' },
    { id: 'sh4', title: 'Interstellar Odyssey', type: 'Stream', venue: 'Digital Cloud Node', time: 'On-Demand', price: '149', availability: 'Unlimited' },
  ]);

  const [bookings, setBookings] = useState([
    { id: 'B-9021', customer: 'Aman Sharma', show: 'Welcome To The Jungle', seats: 'G-11, G-12', amount: '₹500', status: 'Confirmed' },
    { id: 'B-4811', customer: 'Riya Gupta', show: 'Interstellar Odyssey', seats: 'Digital Pass', amount: '₹149', status: 'Streaming Activated' },
    { id: 'B-3102', customer: 'Rahul Mehta', show: 'Arijit Singh Live In Concert', seats: 'VIP Pass-04', amount: '₹1499', status: 'Confirmed' },
  ]);

  const [users, setUsers] = useState([
    { id: 'u101', name: 'Jiya Sukhija', email: 'jiya.sukhija@cinema.com', role: 'System Admin', joins: 'Jan 2026' },
    { id: 'u102', name: 'Rahul Mehta', email: 'rahul.mehta@nit.com', role: 'Premium User', joins: 'Feb 2026' },
    { id: 'u103', name: 'Aman Sharma', email: 'aman.sharma@gmail.com', role: 'Standard User', joins: 'Mar 2026' },
  ]);

  // Settings Configuration States
  const [configTax, setConfigTax] = useState('35.00');
  const [configTTL, setConfigTTL] = useState('5');
  const [configMode, setConfigMode] = useState('test');

  // Form states for adding entries dynamically
  const [newShow, setNewShow] = useState({ title: '', type: 'Movie', venue: '', time: '', price: '' });

  // --- DYNAMIC HANDLERS ---
  const handleDeleteShow = (id, name) => {
    setShows(prev => prev.filter(s => s.id !== id));
    setSystemLogs(prev => [`LOG // ${new Date().toLocaleTimeString()} // CRITICAL OVERRIDE: Dropped show allocation node [${name}].`, ...prev]);
  };

  const handleCreateShow = (e) => {
    e.preventDefault();
    if (!newShow.title || !newShow.venue) return;
    const formattedShow = {
      id: `sh-${Math.floor(Math.random() * 9000) + 1000}`,
      title: newShow.title,
      type: newShow.type,
      venue: newShow.venue,
      time: newShow.time || '07:00 PM',
      price: `${newShow.price || '200'}`,
      availability: 'Available'
    };
    setShows(prev => [formattedShow, ...prev]);
    setIsModalOpen(false);
    setNewShow({ title: '', type: 'Movie', venue: '', time: '', price: '' });
    setSystemLogs(prev => [`LOG // ${new Date().toLocaleTimeString()} // SUCCESS: Instantiated core allocation for [${formattedShow.title}].`, ...prev]);
  };

  const handleToggleBookingStatus = (id) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = b.status === 'Cancelled' ? 'Confirmed' : 'Cancelled';
        setSystemLogs(prevLogs => [`LOG // ${new Date().toLocaleTimeString()} // ALTERATION: Booking ${id} modified to [${nextStatus}].`, ...prevLogs]);
        return { ...b, status: nextStatus };
      }
      return b;
    }));
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        setSystemLogs(prevLogs => [`LOG // ${new Date().toLocaleTimeString()} // PERMISSION SHIFT: Escalated ${u.name} to [${newRole}].`, ...prevLogs]);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setSystemLogs(prev => [`LOG // ${new Date().toLocaleTimeString()} // CORE UPDATE: Environmental variables flushed successfully. Tax Mode set to [${configMode}].`, ...prev]);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className={`min-h-screen font-sans flex transition-colors duration-500 ${
      isDarkMode ? "bg-[#0a0f1d] text-slate-100" : "bg-[#f5f3eb] text-stone-900"
    }`}>
      
      {/* --- SIDE NAVIGATION DECK MODULE --- */}
      <div className={`w-64 flex flex-col justify-between p-4 shrink-0 z-20 transition-colors duration-500 border-r ${
        isDarkMode ? "bg-[#060911] border-white/[0.04]" : "bg-white border-stone-200 shadow-xl"
      }`}>
        <div className="space-y-8">
          <div className={`flex items-center gap-3 px-1 py-3 border-b ${isDarkMode ? "border-white/[0.03]" : "border-stone-100"}`}>
            <div className="relative shrink-0">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(218,165,32,0.3)] border border-amber-400/20">
                <Clapperboard size={16} className="text-stone-950 fill-stone-950/10" strokeWidth={2.5} />
              </span>
            </div>
            <span className={`font-display text-xl tracking-tight font-black transition-colors truncate ${
              isDarkMode ? "text-white" : "text-stone-900"
            }`}>
              Showx
              <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-mono text-[9px] font-black tracking-widest uppercase ml-1.5 align-middle">
                – THE CINEMAHUB
              </span>
            </span>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'OVERVIEW', icon: <LayoutDashboard size={14} /> },
              { id: 'screenings', label: 'SCREENINGS', icon: <Clapperboard size={14} /> },
              { id: 'bookings', label: 'BOOKINGS', icon: <Ticket size={14} /> },
              { id: 'users', label: 'USERS', icon: <Users size={14} /> },
              { id: 'settings', label: 'SETTINGS', icon: <Settings size={14} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider transition-all border text-left cursor-pointer ${
                  activeTab === tab.id
                    ? isDarkMode 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-md"
                        : "bg-amber-50 border-amber-200 text-amber-600 shadow-sm"
                    : isDarkMode
                        ? "border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]"
                        : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border border-transparent text-left cursor-pointer bg-transparent ${
            isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/[0.02] border-t-white/[0.03]" : "text-stone-500 hover:text-stone-900 hover:bg-stone-50 border-t-stone-200"
          }`}
        >
          <ArrowLeft size={14} /> Return To Storefront
        </button>
      </div>

      {/* --- MAIN INTERACTIVE VIEW AREA --- */}
      <div className="flex-grow p-8 overflow-y-auto h-screen space-y-8 relative">
        <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
          isDarkMode ? "bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_65%)]" : "bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_65%)]"
        }`} />

        <div className="relative z-10 space-y-8">
          
          <div className={`flex items-center justify-between border-b pb-6 ${isDarkMode ? "border-white/[0.04]" : "border-stone-200"}`}>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.2em] font-black text-amber-500">Root Node Overrides</span>
              <h1 className={`text-3xl font-black font-display tracking-tight uppercase mt-0.5 ${isDarkMode ? "text-white" : "text-stone-900"}`}>
                {activeTab === 'overview' ? 'Operational Core Matrix' : `Manage ${activeTab}`}
              </h1>
            </div>
            <button 
              onClick={() => setSystemLogs(prev => [`LOG // ${new Date().toLocaleTimeString()} // Manual environment cache cleared via dashboard master hook sync.`, ...prev])}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-black text-xs bg-amber-500 text-stone-950 shadow-lg hover:bg-amber-600 hover:shadow-amber-500/20 transition-all border-none cursor-pointer"
            >
              <RefreshCcw size={12} /> Force System Sync
            </button>
          </div>

          {/* --- MODULE OVERVIEW VIEW TAB --- */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: 'Total Revenue', value: '₹4,82,900', trend: '+12.4%', up: true, icon: <DollarSign size={15} /> },
                  { title: 'System Occupancy', value: '78.3%', trend: '+4.2%', up: true, icon: <Percent size={15} /> },
                  { title: 'Active Accounts', value: `${users.length} Nodes`, trend: '+1 New', up: true, icon: <Users2 size={15} /> },
                  { title: 'Allocated Listings', value: `${shows.length} Slots`, trend: 'Active', up: true, icon: <Film size={15} /> }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-6 rounded-[24px] border transition-colors duration-300 shadow-sm ${
                    isDarkMode ? "bg-slate-900/40 border-white/[0.04]" : "bg-white border-stone-200 shadow-stone-900/5"
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <p className={`text-[10px] uppercase tracking-wider font-bold ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>{stat.title}</p>
                      <span className={`w-8 h-8 rounded-xl border flex items-center justify-center text-amber-500 ${
                        isDarkMode ? "bg-white/[0.02] border-white/[0.05]" : "bg-stone-50 border-stone-100"
                      }`}>
                        {stat.icon}
                      </span>
                    </div>
                    <h3 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>{stat.value}</h3>
                    <div className={`flex items-center justify-between pt-3 mt-3 border-t ${isDarkMode ? "border-white/[0.04]" : "border-stone-100"}`}>
                      <span className={`text-[10px] font-semibold ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>vs previous cycle</span>
                      <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded ${stat.up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 p-6 rounded-[24px] border space-y-6 shadow-sm ${isDarkMode ? "bg-slate-900/40 border-white/[0.04]" : "bg-white border-stone-200"}`}>
                  <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? "text-white" : "text-stone-900"}`}>
                    <Activity size={14} className="text-amber-500" /> Cinema Throughput Matrix
                  </h3>
                  <div className={`h-48 flex items-end gap-3 pt-4 border-b pb-2 ${isDarkMode ? "border-white/5" : "border-stone-100"}`}>
                    {[40, 55, 50, 85, 75, 70, 90].map((bar, i) => (
                      <div key={i} className="flex-grow flex flex-col items-center gap-2 group">
                        <div style={{ height: `${bar}%` }} className="w-full rounded-t-lg bg-gradient-to-t from-amber-500/20 to-amber-500 group-hover:to-yellow-400 transition-all shadow-md" />
                        <span className={`text-[10px] font-bold font-mono ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`p-6 rounded-[24px] border flex flex-col justify-between space-y-4 shadow-sm ${isDarkMode ? "bg-slate-900/40 border-white/[0.04]" : "bg-white border-stone-200"}`}>
                  <div>
                    <h3 className={`text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-stone-900"}`}>
                      <Terminal size={14} className="text-amber-500" /> Live Environment Logs
                    </h3>
                    <div className={`space-y-2 font-mono text-[10px] p-3 rounded-xl h-40 overflow-y-auto border ${
                      isDarkMode ? "bg-black/30 text-slate-400 border-white/5" : "bg-stone-50 text-stone-600 border-stone-100"
                    }`}>
                      {systemLogs.map((log, index) => (
                        <p key={index} className="truncate border-l-2 border-amber-500/40 pl-2 animate-fadeIn">{log}</p>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Status // Integrity Nominal
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- ACTIVE SCREENINGS VIEW (CRUD MAPPED) --- */}
          {activeTab === 'screenings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>Allocated Shows & Event Nodes</h2>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-stone-950 rounded-xl text-xs font-black shadow-md border-none cursor-pointer"
                >
                  <Plus size={14} /> Allocate New Listing
                </button>
              </div>
              <div className={`border rounded-[20px] overflow-hidden shadow-sm ${isDarkMode ? "border-white/[0.04] bg-slate-900/40" : "border-stone-200 bg-white"}`}>
                <table className="w-full text-left text-xs font-medium">
                  <thead className={`font-black tracking-wider uppercase text-[10px] border-b ${isDarkMode ? "bg-white/[0.02] text-slate-400 border-white/[0.04]" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
                    <tr>
                      <th className="p-4">Listing Title</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Venue Assignment</th>
                      <th className="p-4">Time Slot</th>
                      <th className="p-4">Base Fare</th>
                      <th className="p-4">Matrix Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? "divide-white/[0.03]" : "divide-stone-100"}`}>
                    {shows.map((show) => (
                      <tr key={show.id} className={`transition-colors ${isDarkMode ? "hover:bg-white/[0.01]" : "hover:bg-stone-50"}`}>
                        <td className={`p-4 font-black ${isDarkMode ? "text-slate-200" : "text-stone-800"}`}>{show.title}</td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded border text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "bg-white/5 border-white/10 text-slate-400" : "bg-stone-100 border-stone-200 text-stone-600"}`}>{show.type}</span></td>
                        <td className={`p-4 ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>{show.venue}</td>
                        <td className={`p-4 font-mono ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>{show.time}</td>
                        <td className="p-4 font-mono font-black text-amber-500">₹{show.price}</td>
                        <td className="p-4 text-emerald-500 font-bold">{show.availability}</td>
                        <td className="p-4 text-right space-x-2">
                          <button className={`p-1.5 border rounded-lg cursor-pointer ${isDarkMode ? "bg-white/5 border-white/5 text-slate-400 hover:text-red-400" : "bg-stone-50 border-stone-200 text-stone-500 hover:text-red-500"}`} onClick={() => handleDeleteShow(show.id, show.title)}>
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* --- BOOKINGS REGISTER VIEW (LIVE STATUS MODIFIER) --- */}
          {activeTab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>System Core Bookings Registry</h2>
              <div className={`border rounded-[20px] overflow-hidden shadow-sm ${isDarkMode ? "border-white/[0.04] bg-slate-900/40" : "border-stone-200 bg-white"}`}>
                <table className="w-full text-left text-xs font-medium">
                  <thead className={`font-black tracking-wider uppercase text-[10px] border-b ${isDarkMode ? "bg-white/[0.02] text-slate-400 border-white/[0.04]" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Customer Base</th>
                      <th className="p-4">Target Event</th>
                      <th className="p-4">Allocated Seats</th>
                      <th className="p-4">Total Settled</th>
                      <th className="p-4">Status Ledger</th>
                      <th className="p-4 text-right">Actions Override</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? "divide-white/[0.03]" : "divide-stone-100"}`}>
                    {bookings.map((book) => (
                      <tr key={book.id} className={`transition-colors ${isDarkMode ? "hover:bg-white/[0.01]" : "hover:bg-stone-50"}`}>
                        <td className="p-4 font-mono text-amber-500 font-black">{book.id}</td>
                        <td className={`p-4 font-black ${isDarkMode ? "text-white" : "text-stone-800"}`}>{book.customer}</td>
                        <td className={`p-4 ${isDarkMode ? "text-slate-300" : "text-stone-600"}`}>{book.show}</td>
                        <td className={`p-4 font-mono ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>{book.seats}</td>
                        <td className={`p-4 font-mono font-bold ${isDarkMode ? "text-slate-200" : "text-stone-800"}`}>{book.amount}</td>
                        <td className="p-4">
                          <span className={`flex items-center gap-1 font-bold ${book.status === 'Cancelled' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {book.status === 'Cancelled' ? <XCircle size={12} /> : <CheckCircle2 size={12} />} {book.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleToggleBookingStatus(book.id)}
                            className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer border ${
                              book.status === 'Cancelled'
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-stone-950"
                                : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                            }`}
                          >
                            {book.status === 'Cancelled' ? 'Restore Order' : 'Cancel Ticket'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* --- USERS LEDGER VIEW (LIVE ROLE ESCALATION) --- */}
          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>Active Accounts Master Records</h2>
              <div className={`border rounded-[20px] overflow-hidden shadow-sm ${isDarkMode ? "border-white/[0.04] bg-slate-900/40" : "border-stone-200 bg-white"}`}>
                <table className="w-full text-left text-xs font-medium">
                  <thead className={`font-black tracking-wider uppercase text-[10px] border-b ${isDarkMode ? "bg-white/[0.02] text-slate-400 border-white/[0.04]" : "bg-stone-50 text-stone-500 border-stone-200"}`}>
                    <tr>
                      <th className="p-4">User ID Node</th>
                      <th className="p-4">Full Identity Name</th>
                      <th className="p-4">Email Mapping</th>
                      <th className="p-4">Access Permissions</th>
                      <th className="p-4 text-right">Alter Authority</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? "divide-white/[0.03]" : "divide-stone-100"}`}>
                    {users.map((user) => (
                      <tr key={user.id} className={`transition-colors ${isDarkMode ? "hover:bg-white/[0.01]" : "hover:bg-stone-50"}`}>
                        <td className={`p-4 font-mono ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>{user.id}</td>
                        <td className={`p-4 font-black ${isDarkMode ? "text-slate-200" : "text-stone-800"}`}>{user.name}</td>
                        <td className={`p-4 ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide uppercase border ${
                            user.role === 'System Admin' 
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                              : user.role === 'Premium User'
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className={`px-2 py-1 text-[11px] font-bold rounded-lg focus:outline-none cursor-pointer ${
                              isDarkMode ? "bg-slate-800 border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-800"
                            }`}
                          >
                            <option value="Standard User">Standard User</option>
                            <option value="Premium User">Premium User</option>
                            <option value="System Admin">System Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* --- SYSTEM CONSTANTS VIEW (FUNCTIONAL CONFIG COMMIT) --- */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-6">
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>System Environment Constants</h2>
              
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2"
                  >
                    <Check size={14} strokeWidth={3} /> Global Constants Successfully Flushed and Deployed Live.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`p-6 rounded-[24px] border space-y-6 shadow-sm ${isDarkMode ? "bg-slate-900/40 border-white/[0.04]" : "bg-white border-stone-200"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Convenience Tax Fee (INR)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-bold text-slate-500">₹</span>
                      <input type="text" value={configTax} onChange={(e) => setConfigTax(e.target.value)} className={`w-full border rounded-xl pl-7 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500 ${isDarkMode ? "bg-white/[0.02] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Seat Autolock Expiry Window (Mins)</label>
                    <input type="number" value={configTTL} onChange={(e) => setConfigTTL(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500 ${isDarkMode ? "bg-white/[0.02] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Razorpay Integration Mode</label>
                  <select value={configMode} onChange={(e) => setConfigMode(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-amber-500 cursor-pointer ${isDarkMode ? "bg-[#0c1220] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}>
                    <option value="test">Simulated Sandbox Environment (Test Mode)</option>
                    <option value="live">Production Gateway Node (Live Mode)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3 items-start">
                  <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className={`text-[11px] leading-relaxed font-semibold ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>
                    Modifying deployment configurations triggers dynamic cache invalidation across system Vercel & Render microservices instantly.
                  </p>
                </div>

                <div className={`pt-4 border-t flex justify-end ${isDarkMode ? "border-white/[0.04]" : "border-stone-100"}`}>
                  <button 
                    onClick={handleSaveSettings}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-black bg-amber-500 text-stone-950 rounded-xl shadow-lg hover:bg-amber-600 transition-colors border-none cursor-pointer"
                  >
                    <Save size={14} /> Commit Settings Overrides
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* --- DYNAMIC CREATION MODAL OVERLAY --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className={`w-full max-w-md rounded-[24px] p-6 relative z-10 shadow-2xl space-y-4 border ${
                isDarkMode ? "bg-[#090d16] border-white/10" : "bg-white border-stone-200"
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? "border-white/5" : "border-stone-100"}`}>
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-500">Allocate Performance Instance</h3>
                <button onClick={() => setIsModalOpen(false)} className={`bg-transparent border-none cursor-pointer ${isDarkMode ? "text-slate-400 hover:text-white" : "text-stone-400 hover:text-stone-900"}`}><X size={16} /></button>
              </div>

              <form onSubmit={handleCreateShow} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1.5">
                  <label className={`block text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Listing Title</label>
                  <input required type="text" placeholder="e.g. Welcome To The Jungle" value={newShow.title} onChange={e => setNewShow({...newShow, title: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 ${isDarkMode ? "bg-white/[0.02] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Category</label>
                    <select value={newShow.type} onChange={e => setNewShow({...newShow, type: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 cursor-pointer ${isDarkMode ? "bg-[#090d16] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`}>
                      <option value="Movie">Movie</option>
                      <option value="Stream">Stream</option>
                      <option value="Event">Event</option>
                      <option value="Play">Play</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Base Price (INR)</label>
                    <input required type="number" placeholder="250" value={newShow.price} onChange={e => setNewShow({...newShow, price: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 ${isDarkMode ? "bg-white/[0.02] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-[10px] font-black uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Venue Assigned</label>
                  <input required type="text" placeholder="e.g. Screen 1, In-App Stream or Stadium" value={newShow.venue} onChange={e => setNewShow({...newShow, venue: e.target.value})} className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 ${isDarkMode ? "bg-white/[0.02] border-white/10 text-white" : "bg-stone-50 border-stone-200 text-stone-900"}`} />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl transition-all shadow-lg border-none cursor-pointer">
                    Commit Allocation Log
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}