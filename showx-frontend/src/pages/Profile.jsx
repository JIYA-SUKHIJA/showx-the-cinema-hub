// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useBooking } from '../context/BookingContext';
import { 
  User, Mail, Phone, Shield, Ticket, 
  Camera, Check, X, Edit3, LogOut, Award, Calendar,
  ChevronRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle, Trash2
} from 'lucide-react';
import { ProfilePageSkeleton } from '../components/atoms/Skeletons';
import { showxToast } from '../utils/toastConfig';
import axiosInstance from '../services/axiosInstance';
import { fetchMyBookings } from '../services/api';

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [activeTab, setActiveTab] = useState('info');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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

    if (file.size > 2 * 1024 * 1024) {
      showxToast.error("Please choose an image under 2MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setUser((prev) => ({ ...prev, avatar: dataUrl }));
      await axiosInstance.put('/auth/profile', { avatar: dataUrl });
      showxToast.adminSuccess("Profile photo updated successfully");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      showxToast.error("Failed to update profile photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setUploadingPhoto(true);
    try {
      setUser((prev) => ({ ...prev, avatar: "" }));
      await axiosInstance.put('/auth/profile', { avatar: "" });
      showxToast.adminSuccess("Profile photo removed");
    } catch (err) {
      showxToast.error("Failed to remove profile photo.");
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

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className={`min-h-screen font-sans antialiased py-6 sm:py-12 px-3 sm:px-6 lg:px-8 transition-colors duration-300 w-full overflow-x-hidden animate-fadeIn ${
      isDarkMode ? "bg-slate-950 text-slate-300" : "bg-[#f8f9fa] text-slate-800"
    }`}>
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        
        {/* --- MAIN HEADER PROFILE HERO CARD --- */}
        <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 border transition-all duration-300 ${
          isDarkMode 
            ? "bg-slate-950/90 border-white/[0.04] shadow-2xl shadow-black/60" 
            : "bg-white border-slate-200 shadow-sm"
        }`}>
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative z-10 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left w-full md:w-auto">
              
              {/* Profile Photo Avatar Engine Shell */}
              <div className="relative shrink-0 select-none group pb-2 sm:pb-0">
                <div className="relative rounded-full p-[2px] bg-gradient-to-br from-amber-500/30 to-transparent shadow-xl transition-transform duration-300 hover:scale-[1.02]">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white/[0.06] bg-slate-900 transition-opacity duration-300 ${uploadingPhoto ? 'opacity-40' : 'opacity-100'}`}
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-xl font-black tracking-tighter text-amber-500 font-mono">
                      {user.initials}
                    </div>
                  )}

                  {/* Micro-interaction hover mask container */}
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer">
                    <Camera size={14} className="text-amber-400" />
                    <span className="text-[8px] font-black uppercase text-white tracking-wider">Update</span>
                  </div>
                </div>
                
                {/* Independent dynamic context actions launcher button */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                  <label className="bg-amber-500 hover:bg-amber-400 p-1.5 rounded-full border border-slate-950 text-stone-950 shadow-xl transition-all duration-250 cursor-pointer flex items-center justify-center focus:outline-none h-6 w-6">
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploadingPhoto} />
                    <Camera size={10} strokeWidth={2.5} className={uploadingPhoto ? "animate-spin" : ""} />
                  </label>
                  {user.avatar && (
                    <button type="button" onClick={handleRemovePhoto} className="bg-rose-500 hover:bg-rose-600 p-1.5 rounded-full border border-slate-950 text-white shadow-xl transition-all duration-250 cursor-pointer flex items-center justify-center focus:outline-none h-6 w-6">
                      <Trash2 size={10} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 w-full mt-2 sm:mt-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                  <h1 className={`text-xl sm:text-2xl font-black tracking-tight leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    <span className="text-slate-500 text-[10px] font-mono font-bold tracking-widest block uppercase mb-0.5">{timeGreeting},</span>
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 self-center px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-amber-500/10 border border-amber-500/20 text-amber-500 tracking-wide font-mono shadow-sm w-fit transition-all duration-300 hover:bg-amber-500/20">
                    <Award size={11} />
                    {user.membership} Node
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-amber-500 shrink-0" /> Member since {user.joinDate}</span>
                  <span className="flex items-center gap-1.5"><Ticket size={12} className="text-amber-500 shrink-0" /> {user.totalBookings} Bookings</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-black tracking-wide bg-transparent focus:outline-none min-h-[44px] sm:min-h-[40px] uppercase transition-all duration-300 active:scale-[0.98] ${
                isDarkMode ? "border-white/[0.08] text-slate-300 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20" : "border-slate-200 text-slate-600 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
              }`}
            >
              <LogOut size={13} />
              Close Session
            </button>
          </div>
        </div>

        {/* --- DASHBOARD SPLIT CONTENT INNER MATRIX --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
          
          {/* Left Column Controls Deck — Removed Gold membership tier card completely */}
          <div className="lg:col-span-4 w-full">
            <div className={`rounded-xl sm:rounded-2xl border p-1 sm:p-1.5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden no-scrollbar shrink-0 gap-1 ${
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
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-200 text-left bg-transparent border-none outline-none cursor-pointer group whitespace-nowrap shrink-0 lg:w-full min-h-[44px] sm:min-h-[40px] focus:outline-none ${
                      active 
                        ? "bg-amber-500 text-stone-950 font-black shadow-md" 
                        : isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:bg-stone-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={13} className={`${active ? "text-stone-950" : "text-amber-500 shrink-0"} transition-transform duration-300 group-hover:scale-110`} />
                      {tab.label}
                    </span>
                    <ChevronRight size={13} className={`hidden lg:block transition-transform duration-200 ${active ? 'text-stone-950 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Panel Workspace Form Display */}
          <div className="lg:col-span-8 w-full transition-all duration-300">
            <div className={`border shadow-2xl rounded-xl sm:rounded-2xl p-4 sm:p-8 min-h-[440px] w-full overflow-hidden ${
              isDarkMode ? "bg-slate-950/90 border-white/[0.04] shadow-black/40" : "bg-white border-slate-200"
            }`}>
              
              {activeTab === 'info' && (
                <form onSubmit={handleSaveProfile} className="space-y-5 sm:space-y-6 animate-slideUp">
                  <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.04] gap-2">
                    <div className="space-y-0.5 min-w-0">
                      <h3 className={`text-sm sm:text-base font-bold tracking-wide truncate ${isDarkMode ? "text-white" : "text-slate-800"}`}>Account Particulars</h3>
                      <p className="text-xs text-slate-500 font-medium truncate">Verify or adjust your primary contact fields.</p>
                    </div>
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1 text-xs font-black text-amber-500 hover:bg-amber-500/5 px-2.5 py-1.5 rounded-lg transition-all border-none bg-transparent cursor-pointer outline-none shrink-0 min-h-[36px] active:scale-95"
                      >
                        <Edit3 size={12} />
                        Edit Info
                      </button>
                    )}
                  </div>

                  <div className="space-y-4 sm:space-y-5">
                    <div className="space-y-1.5">
                      <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest pl-0.5 font-mono">Full Name</label>
                      <div className="relative rounded-xl shadow-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 z-10"><User size={14} /></div>
                        <input
                          type="text"
                          name="name"
                          disabled={!isEditing}
                          value={isEditing ? editedUser.name : user.name}
                          onChange={handleInputChange}
                          className={`w-full border text-xs sm:text-sm font-semibold rounded-xl py-3.5 pl-11 pr-4 focus:outline-none transition-all min-h-[44px] ${
                            isDarkMode 
                              ? "bg-white/[0.02] border-white/[0.06] text-white focus:border-amber-500/60 disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                              : "bg-stone-50 border-stone-200 text-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest pl-0.5 font-mono">Email Address</label>
                        <span className="text-[8px] font-mono font-black text-emerald-400 flex items-center gap-0.5 uppercase tracking-wide shrink-0 transition-opacity duration-300"><CheckCircle2 size={10} className="animate-pulse" /> Verified Node</span>
                      </div>
                      <div className="relative rounded-xl shadow-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 z-10"><Mail size={14} /></div>
                        <input
                          type="email"
                          name="email"
                          disabled={!isEditing}
                          value={isEditing ? editedUser.email : user.email}
                          onChange={handleInputChange}
                          className={`w-full border text-xs sm:text-sm font-semibold rounded-xl py-3.5 pl-11 pr-4 focus:outline-none transition-all min-h-[44px] ${
                            isDarkMode 
                              ? "bg-white/[0.02] border-white/[0.06] text-white focus:border-amber-500/60 disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                              : "bg-stone-50 border-stone-200 text-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest pl-0.5 font-mono">Phone Number</label>
                        {user.phone === "Not added yet" && (
                          <span className="text-[8px] font-mono font-black text-amber-500 flex items-center gap-0.5 uppercase tracking-wide shrink-0"><AlertCircle size={10} /> Pending Map</span>
                        )}
                      </div>
                      <div className="relative rounded-xl shadow-sm w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 z-10"><Phone size={14} /></div>
                        <input
                          type="text"
                          name="phone"
                          disabled={!isEditing}
                          value={isEditing ? editedUser.phone : user.phone}
                          onChange={handleInputChange}
                          className={`w-full border text-xs sm:text-sm font-semibold rounded-xl py-3.5 pl-11 pr-4 focus:outline-none transition-all min-h-[44px] ${
                            isDarkMode 
                              ? "bg-white/[0.02] border-white/[0.06] text-white focus:border-amber-500/60 disabled:border-transparent disabled:bg-white/[0.005] disabled:text-slate-400" 
                              : "bg-stone-50 border-stone-200 text-slate-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 disabled:border-transparent disabled:bg-stone-100/50 disabled:text-slate-500"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.04]">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setEditedUser({ ...user }); }}
                        className={`inline-flex items-center gap-1 px-3.5 py-2.5 border rounded-lg text-xs font-bold transition-all cursor-pointer bg-transparent outline-none min-h-[44px] sm:min-h-[36px] active:scale-95 ${
                          isDarkMode ? "border-white/[0.08] text-slate-400 hover:text-white" : "border-stone-200 text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <X size={12} /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-black transition-all shadow-md border-none cursor-pointer outline-none min-h-[44px] sm:min-h-[36px] active:scale-95"
                      >
                        <Check size={12} strokeWidth={2.5} /> Save Changes
                      </button>
                    </div>
                  )}
                </form>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-4 sm:space-y-6 animate-slideUp">
                  <div className="space-y-1 border-b border-white/[0.04] pb-3.5">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400">Booking Registry Logs</h3>
                  </div>
                  {bookingsLoading ? (
                    <p className="text-xs text-slate-500 font-medium font-mono">Loading bookings...</p>
                  ) : myBookings.length === 0 ? (
                    <p className="text-xs text-slate-500 font-medium font-mono">No bookings records discovered on network nodes.</p>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.map((b) => (
                        <div key={b._id} className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col sm:flex-row justify-between gap-3 relative overflow-hidden transition-all duration-200 hover:scale-[1.005] ${
                          isDarkMode ? "bg-slate-950/40 border-white/5" : "bg-stone-50 border-slate-200 shadow-sm"
                        }`}>
                          <div className="space-y-1 min-w-0 flex-grow">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-xs sm:text-sm font-black truncate max-w-[180px] xs:max-w-none ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                {b.show?.movie?.title || 'Movie'}
                              </span>
                              <span className={`text-[8px] font-black font-mono px-1.5 py-0.2 rounded uppercase tracking-wide ${
                                b.status === 'confirmed' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800/40 text-slate-400"
                              }`}>{b.status}</span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 truncate">{b.show?.theatre?.name || 'Theatre'}</p>
                            <p className="text-[10px] font-medium text-slate-400 font-mono mt-1 truncate">
                              {new Date(b.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} &bull; Seats: {b.seats.join(', ')}
                            </p>
                          </div>
                          <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-white/5 font-mono">
                            <span className="text-[9px] text-slate-500 tracking-wider block">ID: {b._id.slice(-8).toUpperCase()}</span>
                            <span className="text-xs sm:text-sm font-black text-amber-500 mt-0.5">₹{b.totalAmount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4 sm:space-y-6 animate-slideUp">
                  <div className="pb-3.5 border-b border-white/[0.04]">
                    <h3 className={`text-sm sm:text-base font-bold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"}`}>Security & Access</h3>
                    <p className="text-xs text-slate-500 font-medium">Manage your session and local cached data.</p>
                  </div>

                  <div className="space-y-4">
                    <div className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${isDarkMode ? "bg-white/[0.01] border-white/[0.04]" : "bg-stone-50 border-slate-200"}`}>
                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Local Cached Allocations</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Clear out dynamic layout logs or transaction parameters manually.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          clearBookingSession();
                          showxToast.adminSuccess('Local session cache cleared');
                        }} 
                        className="w-full sm:w-auto px-4 py-2.5 border-none bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-[11px] font-bold transition-all cursor-pointer outline-none min-h-[44px] sm:min-h-[34px] active:scale-95"
                      >
                        Clear Session
                      </button>
                    </div>

                    <div className={`p-4 border rounded-xl transition-all duration-300 ${isDarkMode ? "bg-white/[0.01] border-white/[0.04]" : "bg-stone-50 border-slate-200"}`}>
                      <p className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Password Management</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">Coming soon — password change will be available in a future update.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}