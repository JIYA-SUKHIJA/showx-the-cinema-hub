// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useBooking } from '../context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Shield, Ticket, 
  Camera, Check, X, Edit3, LogOut, Award, Calendar,
  ChevronRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { ProfilePageSkeleton } from '../components/atoms/Skeletons';
import { showxToast } from '../utils/toastConfig';
import axiosInstance from '../services/axiosInstance';
import { fetchMyBookings } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { clearBookingSession } = useBooking();

  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [timeGreeting, setTimeGreeting] = useState("Welcome");

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "Not added yet",
    avatar: "",
    joinDate: "—",
    membership: "Standard",
    totalBookings: 0,
    initials: "",
    cardNumber: "SHX •••• •••• ----"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [activeTab, setActiveTab] = useState('info');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Time based dynamic premium greeting allocation nodes
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setTimeGreeting("Good morning");
    else if (hours < 17) setTimeGreeting("Good afternoon");
    else setTimeGreeting("Good evening");
  }, []);

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
        
        // Sakshi MCA GU ke feedback ke hisab se customized membership triggers:
        // 3 bookings par Silver aur 6 ya usse zyada bookings par Gold card change hoga.
        const membership = count >= 6 ? 'Gold' : count >= 3 ? 'Silver' : 'Standard';

        const updatedUser = {
          ...user,
          name: backendUser.name,
          email: backendUser.email,
          phone: backendUser.phone || "Not added yet",
          avatar: backendUser.avatar || "",
          joinDate,
          totalBookings: count,
          membership,
          initials: backendUser.name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
        };

        setUser(updatedUser);
        setEditedUser(updatedUser);
        setMyBookings(bookingsData);
      } catch (err) {
        console.error("Could not load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings' && myBookings.length === 0) {
      const loadBookings = async () => {
        setBookingsLoading(true);
        const data = await fetchMyBookings();
        const count = data.length;
        
        // Tab synchronization parameters checking rules:
        const membership = count >= 6 ? 'Gold' : count >= 3 ? 'Silver' : 'Standard';
        
        setMyBookings(data);
        setUser((prev) => ({ ...prev, totalBookings: count, membership }));
        setBookingsLoading(false);
      };
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const localPreviewUrl = URL.createObjectURL(file);
    setUser(prev => ({ ...prev, avatar: localPreviewUrl }));

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      await axiosInstance.put('/auth/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      showxToast.adminSuccess("Profile identity photo synchronized successfully");
    } catch (err) {
      console.error("File transmission failure:", err);
      showxToast.error("Failed to map image attachment stream to backend pipeline.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put('/auth/profile', {
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
      });
      
      const savedData = res.data.user;
      setUser((prev) => ({ 
        ...prev, 
        name: savedData.name, 
        email: savedData.email,
        phone: savedData.phone || "Not added yet"
      }));
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

  const completionPercent = [
    user.name, 
    user.email, 
    user.phone !== "Not added yet" ? user.phone : ""
  ].filter(Boolean).length * 33.3;

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className={`min-h-screen font-sans antialiased py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? "bg-slate-950 text-slate-300" : "bg-[#f8f9fa] text-slate-800"
    }`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- BRAND BLOCK CONTAINER HEADER --- */}
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
          isDarkMode 
            ? "bg-slate-950/90 border-white/[0.04] shadow-2xl shadow-black/60" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              
              <div className="relative shrink-0 select-none group">
                <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-amber-500/20 to-transparent shadow-xl">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className={`w-24 h-24 rounded-2xl object-cover border border-white/[0.06] bg-slate-900 transition-opacity duration-300 ${uploadingPhoto ? 'opacity-40' : 'opacity-100'}`}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-xl font-black tracking-tighter text-amber-500 font-mono">
                      {user.initials}
                    </div>
                  )}
                </div>
                
                <label className="absolute bottom-1 right-1 bg-amber-500 hover:bg-amber-400 p-2 rounded-xl border border-slate-950 text-stone-950 shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                    disabled={uploadingPhoto}
                  />
                  <Camera size={12} strokeWidth={2.5} className={uploadingPhoto ? "animate-spin" : ""} />
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                  <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <span className="text-slate-500 text-xs font-mono font-bold tracking-widest block uppercase mb-0.5">{timeGreeting},</span>
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 self-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 tracking-wide font-mono shadow-sm">
                    <Award size={12} />
                    {user.membership} Node
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
              className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-black tracking-wide transition-all duration-300 cursor-pointer bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500/40 ${
                isDarkMode ? "border-white/[0.08] text-slate-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20" : "border-slate-200 text-slate-600 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
              }`}
            >
              <LogOut size={13} />
              Close Session
            </button>
          </div>
        </div>

        {/* --- GRID PLATFORM LAYOUT DECK --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* --- SIDE NAVIGATION DECK ARRAYS --- */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Membership Card with automatic shine tier layout */}
            <div className="relative aspect-[1.58/1] w-full rounded-2xl overflow-hidden p-5 bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 border border-amber-500/20 shadow-2xl flex flex-col justify-between group select-none animate-shimmer-sweep">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[9px] font-black tracking-widest text-amber-500/60 uppercase font-mono">SHOWX PATRON TIER</p>
                  <h3 className="text-xs font-black tracking-wide text-white mt-0.5">{user.membership} Member</h3>
                </div>
                <Award size={18} className="text-amber-500 fill-amber-500/10" />
              </div>
              <div className="space-y-1">
                <p className="font-mono text-sm font-bold tracking-widest text-slate-300">{user.cardNumber}</p>
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Since {user.joinDate}</span>
                  <span className="text-amber-500 flex items-center gap-1 font-mono"><ShieldCheck size={10} /> Active Node</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
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

          {/* --- DISPLAY CONTENT MATRICES PANELS --- */}
          <div className="lg:col-span-8">
            <div className={`border shadow-2xl rounded-2xl p-6 sm:p-8 min-h-[480px] transition-colors duration-300 ${
              isDarkMode ? "bg-slate-950/90 border-white/[0.04] shadow-black/40" : "bg-white border-slate-200"
            }`}>
              
              <AnimatePresence mode="wait">
                {activeTab === 'info' && (
                  <motion.form key="info" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
                      <div className="space-y-0.5">
                        <h3 className={`text-base font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Account Particulars</h3>
                        <p className="text-xs text-slate-500 font-medium">Verify or adjust your primary contact fields.</p>
                      </div>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-amber-500 hover:bg-amber-500/5 px-3 py-1.5 rounded-lg transition-colors border-none bg-transparent cursor-pointer outline-none"
                        >
                          <Edit3 size={13} />
                          Edit Info
                        </button>
                      )}
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest pl-0.5 font-mono">Full Name</label>
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
                            className={`w-full border text-sm font-semibold rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all ${
                              isDarkMode 
                                ? "bg-white/[0.02] border-white/[0.06] text-white disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                                : "bg-stone-50 border-stone-200 text-slate-800 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest pl-0.5 font-mono">Email Address</label>
                          <span className="text-[9px] font-mono font-black text-emerald-400 flex items-center gap-1 uppercase tracking-wide"><CheckCircle2 size={10} /> Verified Node</span>
                        </div>
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
                            className={`w-full border text-sm font-semibold rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all ${
                              isDarkMode 
                                ? "bg-white/[0.02] border-white/[0.06] text-white disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                                : "bg-stone-50 border-stone-200 text-slate-800 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest pl-0.5 font-mono">Phone Number</label>
                          {user.phone === "Not added yet" && (
                            <span className="text-[9px] font-mono font-black text-amber-500 flex items-center gap-1 uppercase tracking-wide"><AlertCircle size={10} /> Pending Map</span>
                          )}
                        </div>
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
                            className={`w-full border text-sm font-semibold rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-amber-500/40 transition-all ${
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
                          className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent outline-none ${
                            isDarkMode ? "border-white/[0.08] text-slate-400 hover:text-white" : "border-stone-200 text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          <X size={13} /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-black transition-all shadow-md border-none cursor-pointer outline-none"
                        >
                          <Check size={13} strokeWidth={2.5} /> Save Changes
                        </button>
                      </div>
                    )}
                  </motion.form>
                )}

                {activeTab === 'bookings' && (
                  <motion.div key="bookings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
                    <div className="space-y-2 border-b border-white/[0.04] pb-4">
                      <h3 className="text-sm font-black">Booking Registry Logs</h3>
                    </div>
                    {bookingsLoading ? (
                      <p className="text-xs text-slate-500 font-medium font-mono">Loading bookings...</p>
                    ) : myBookings.length === 0 ? (
                      <p className="text-xs text-slate-500 font-medium font-mono">No bookings yet. Go book your first show!</p>
                    ) : (
                      <div className="space-y-3">
                        {myBookings.map((b) => (
                          <div key={b._id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between gap-4 relative overflow-hidden transition-all hover:scale-[1.01] ${
                            isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-stone-50 border-slate-200 shadow-sm"
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
                  <motion.div key="security" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-6">
                    <div className="pb-4 border-b border-white/[0.04]">
                      <h3 className={`text-base font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Security & Access</h3>
                      <p className="text-xs text-slate-500 font-medium">Manage your session and local cached data.</p>
                    </div>

                    <div className="space-y-4">
                      <div className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDarkMode ? "bg-white/[0.01] border-white/[0.04]" : "bg-stone-50 border-slate-200"}`}>
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
                          className="px-3 py-1.5 border-none bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[11px] font-bold transition-all cursor-pointer outline-none"
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
}