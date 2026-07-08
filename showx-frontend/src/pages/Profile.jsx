// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useBooking } from '../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Shield, Ticket, 
  Camera, Check, X, Edit3, LogOut, Award, Calendar,
  ChevronRight, CreditCard, ShieldCheck
} from 'lucide-react';
import { ProfilePageSkeleton } from '../components/atoms/Skeletons';
import { showxToast } from '../utils/toastConfig';
import axiosInstance from '../services/axiosInstance';
import { fetchMyBookings } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { clearBookingSession } = useBooking();

  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "Not added yet",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
    joinDate: "—",
    membership: "Standard",
    totalBookings: 0,
    initials: "",
    cardNumber: "SHX •••• •••• ----"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/auth/profile');
        const backendUser = res.data.user;
        const joinDate = new Date(backendUser.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });

        const bookingsData = await fetchMyBookings();
        const count = bookingsData.length;
        const membership = count >= 10 ? 'Gold' : count >= 5 ? 'Silver' : 'Standard';

        setUser((prev) => ({
          ...prev,
          name: backendUser.name,
          email: backendUser.email,
          joinDate,
          totalBookings: count,
          membership,
          initials: backendUser.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase(),
        }));
        setMyBookings(bookingsData);
      } catch (err) {
        console.error("Could not load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings' && myBookings.length === 0) {
      const loadBookings = async () => {
        setBookingsLoading(true);
        const data = await fetchMyBookings();
        const count = data.length;
        const membership = count >= 10 ? 'Gold' : count >= 5 ? 'Silver' : 'Standard';
        setMyBookings(data);
        setUser((prev) => ({ ...prev, totalBookings: count, membership }));
        setBookingsLoading(false);
      };
      loadBookings();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put('/auth/profile', {
        name: editedUser.name,
        email: editedUser.email,
      });
      setUser((prev) => ({ ...prev, ...res.data.user }));
      setIsEditing(false);
      showxToast.profileUpdated();
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error("Logout call failed", err);
    } finally {
      clearBookingSession();
      sessionStorage.clear();
      showxToast.logout();
      navigate("/login");
    }
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className={`min-h-screen font-sans antialiased py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950 text-slate-300" : "bg-[#f8f9fa] text-slate-800"
    }`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
          isDarkMode 
            ? "bg-slate-950/90 border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="relative shrink-0 select-none">
                <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-amber-500/20 to-transparent">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-2xl object-cover border border-white/[0.06] bg-slate-900"
                  />
                </div>
                <button type="button" className="absolute bottom-1 right-1 bg-amber-500 hover:bg-amber-600 p-2 rounded-xl border border-slate-950 text-stone-950 shadow-xl transition-all duration-150 cursor-pointer">
                  <Camera size={12} strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                  <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{user.name}</h1>
                  <span className="inline-flex items-center gap-1.5 self-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 tracking-wide">
                    <Award size={12} />
                    {user.membership}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar size={13} className="text-amber-500" /> Member since {user.joinDate}</span>
                  <span className="flex items-center gap-1.5"><Ticket size={13} className="text-amber-500" /> {user.totalBookings} Bookings</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer bg-transparent ${
                isDarkMode ? "border-white/[0.08] text-slate-300 hover:bg-red-500/10 hover:text-red-500" : "border-slate-200 text-slate-600 hover:bg-red-500/10 hover:text-red-500"
              }`}
            >
              <LogOut size={13} />
              Close Session
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="relative aspect-[1.58/1] w-full rounded-2xl overflow-hidden p-5 bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 border border-amber-500/20 shadow-2xl flex flex-col justify-between group select-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black tracking-widest text-amber-500/60 uppercase">SHOWX PATRON TIER</p>
                  <h3 className="text-xs font-black tracking-wide text-white mt-0.5">{user.membership} Member</h3>
                </div>
                <Award size={18} className="text-amber-500 fill-amber-500/10" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-sm font-bold tracking-widest text-slate-300">{user.cardNumber}</p>
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Since {user.joinDate}</span>
                  <span className="text-amber-500 flex items-center gap-1"><ShieldCheck size={10} /> Active Node</span>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border p-1.5 space-y-0.5 ${
              isDarkMode ? "bg-slate-900/30 border-white/[0.04]" : "bg-white border-slate-200 shadow-sm"
            }`}>
              {[
                { id: 'info', label: 'Personal Profile', icon: User },
                { id: 'bookings', label: 'Booking History', icon: Ticket },
                { id: 'security', label: 'Security & Access', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 text-left bg-transparent border-none outline-none cursor-pointer group ${
                      active 
                        ? "bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/5" 
                        : isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:bg-stone-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={14} className={active ? "text-stone-950" : "text-amber-500"} />
                      {tab.label}
                    </span>
                    <ChevronRight size={14} className={`transition-all ${active ? 'text-stone-950' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className={`border shadow-2xl rounded-2xl p-6 sm:p-8 min-h-[480px] transition-colors duration-300 ${
              isDarkMode ? "bg-slate-950/90 border-white/[0.04]" : "bg-white border-slate-200"
            }`}>
              
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.form key="info" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
                      <div className="space-y-0.5">
                        <h3 className={`text-base font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Account Particulars</h3>
                        <p className="text-xs text-slate-500 font-medium">Verify or adjust your primary contact fields.</p>
                      </div>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-amber-500 hover:bg-amber-500/5 px-3 py-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                        >
                          <Edit3 size={13} />
                          Edit Info
                        </button>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest pl-0.5">Full Name</label>
                        <div className="relative rounded-xl shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <User size={15} />
                          </div>
                          <input
                            type="text"
                            name="name"
                            disabled={!isEditing}
                            value={isEditing ? editedUser.name : user.name}
                            onChange={handleInputChange}
                            className={`w-full border text-sm font-semibold rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
                              isDarkMode 
                                ? "bg-white/[0.02] border-white/[0.06] text-white disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                                : "bg-stone-50 border-stone-200 text-slate-800 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest pl-0.5">Email Address</label>
                        <div className="relative rounded-xl shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <Mail size={15} />
                          </div>
                          <input
                            type="email"
                            name="email"
                            disabled={!isEditing}
                            value={isEditing ? editedUser.email : user.email}
                            onChange={handleInputChange}
                            className={`w-full border text-sm font-semibold rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
                              isDarkMode 
                                ? "bg-white/[0.02] border-white/[0.06] text-white disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                                : "bg-stone-50 border-stone-200 text-slate-800 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest pl-0.5">Phone Number</label>
                        <div className="relative rounded-xl shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                            <Phone size={15} />
                          </div>
                          <input
                            type="text"
                            name="phone"
                            disabled={!isEditing}
                            value={isEditing ? editedUser.phone : user.phone}
                            onChange={handleInputChange}
                            className={`w-full border text-sm font-semibold rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
                              isDarkMode 
                                ? "bg-white/[0.02] border-white/[0.06] text-white disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                                : "bg-stone-50 border-stone-200 text-slate-800 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.04]">
                        <button
                          type="button"
                          onClick={() => { setIsEditing(false); setEditedUser({ ...user }); }}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent ${
                            isDarkMode ? "border-white/[0.08] text-slate-400 hover:text-white" : "border-stone-200 text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          <X size={13} /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-black transition-all shadow-md border-none cursor-pointer"
                        >
                          <Check size={13} strokeWidth={2.5} /> Save Changes
                        </button>
                      </div>
                    )}
                  </motion.form>
                )}

                {activeTab === 'bookings' && (
                  <motion.div key="bookings" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="pb-4 border-b border-white/[0.04]">
                      <h3 className={`text-base font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Your Booking History</h3>
                      <p className="text-xs text-slate-500 font-medium">All your past and upcoming ticket bookings.</p>
                    </div>

                    {bookingsLoading ? (
                      <p className="text-xs text-slate-500 font-medium">Loading bookings...</p>
                    ) : myBookings.length === 0 ? (
                      <p className="text-xs text-slate-500 font-medium">No bookings yet. Go book your first show!</p>
                    ) : (
                      <div className="space-y-3">
                        {myBookings.map((b) => (
                          <div key={b._id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden ${
                            isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-stone-50 border-slate-200"
                          }`}>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                  {b.show?.movie?.title || 'Movie'}
                                </span>
                                <span className={`text-[9px] font-black font-mono px-1.5 py-0.2 rounded uppercase ${
                                  b.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800/40 text-slate-400"
                                }`}>{b.status}</span>
                              </div>
                              <p className="text-[11px] font-medium text-slate-500">{b.show?.theatre?.name || 'Theatre'}</p>
                              <p className="text-[10px] font-medium text-slate-400 font-mono">
                                {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • Seats: {b.seats.join(', ')}
                              </p>
                            </div>
                            <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end shrink-0">
                              <span className="text-[10px] text-slate-500 font-mono tracking-wider block">ID: {b._id.slice(-8).toUpperCase()}</span>
                              <span className="text-sm font-black text-amber-500 font-mono mt-0.5">₹{b.totalAmount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="pb-4 border-b border-white/[0.04]">
                      <h3 className={`text-base font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Security & Access</h3>
                      <p className="text-xs text-slate-500 font-medium">Manage your session and local cached data.</p>
                    </div>

                    <div className="space-y-4">
                      <div className={`p-4 border rounded-xl flex items-center justify-between ${isDarkMode ? "bg-white/[0.01] border-white/[0.04]" : "bg-stone-50 border-slate-200"}`}>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Local Cached Allocations</p>
                          <p className="text-[11px] text-slate-500 font-medium">Clear out dynamic layout logs or transaction parameters manually.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            clearBookingSession();
                            showxToast.adminSuccess('Local session cache cleared');
                          }} 
                          className="px-3 py-1.5 border-none bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          Clear Session
                        </button>
                      </div>

                      <div className={`p-4 border rounded-xl ${isDarkMode ? "bg-white/[0.01] border-white/[0.04]" : "bg-stone-50 border-slate-200"}`}>
                        <p className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Password Management</p>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">Coming soon — password change will be available in a future update.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;