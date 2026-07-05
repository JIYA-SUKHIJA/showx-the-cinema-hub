import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { showxToast } from '../utils/toastConfig';
import Sidebar from '../components/Admin/Sidebar';
import StatsGrid from '../components/Admin/StatsGrid';
import DashboardCharts from '../components/Admin/DashboardCharts';
import DataTable from '../components/Admin/DataTable';
import SystemSettings from '../components/Admin/SystemSettings';
import { TableSkeleton, CardSkeleton } from '../components/Admin/Skeleton';
import { MOVIES_DATA } from '../data/adminData';
import { Bell, Search, UserCircle, Activity, Server, Clock, ChevronDown, Settings, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // Dynamic States
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dynamic Time & Loader
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    setLoading(true);
    const loadTimer = setTimeout(() => setLoading(false), 800);
    return () => { clearTimeout(loadTimer); clearInterval(timer); };
  }, [activeTab]);

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
        
        {/* Dynamic Professional Navbar */}
        <header className="h-20 border-b border-white/[0.05] flex items-center px-10 justify-between shrink-0 bg-[#060608]/50 backdrop-blur-md">
          <h1 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#FF9F00]">{activeTab} Console</h1>
          
          <div className="flex items-center gap-6">
            {/* Working Dynamic Search Bar */}
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

            {/* Functional Profile Section */}
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

        {/* Dashboard Content */}
        <div className="flex-grow p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-8"><CardSkeleton /><TableSkeleton /></div>
            ) : (
              <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {activeTab === 'dashboard' && <><StatsGrid isDarkMode={true} /><DashboardCharts isDarkMode={true} /></>}
                
                {activeTab === 'settings' && (
                  <div className="max-w-4xl">
                    <h2 className="text-xl font-black uppercase text-slate-500 mb-6">System Configuration</h2>
                    <SystemSettings />
                  </div>
                )}
                
                {activeTab !== 'dashboard' && activeTab !== 'settings' && (
                  <DataTable columns={["ID", "Name", "Status"]} data={MOVIES_DATA} isDarkMode={true} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Working Dynamic Footer */}
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
    </div>
  );
}