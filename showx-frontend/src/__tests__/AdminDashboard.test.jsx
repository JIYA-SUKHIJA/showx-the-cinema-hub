// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Film, Ticket, Users, Settings, RefreshCw, 
  Layout, ShieldAlert, Plus, UserCheck, KeySquare, HardDrive
} from 'lucide-react';
import UtilizationChart from '../components/molecules/UtilizationChart';

// ==========================================
// 1. SUB-PAGE VIEW: SCREENINGS (DYNAMIC ACTIONS)
// ==========================================
function AdminScreenings() {
  const [screenings, setScreenings] = useState([
    { id: 1, title: 'Welcome To The Jungle', screen: 'AUDI 01 — IMAX 3D', times: '10:30 AM, 05:00 PM', fill: '88%' },
    { id: 2, title: 'Alpha', screen: 'AUDI 04 — ICE Theatre', times: '01:45 PM, 08:30 PM', fill: '95%' },
    { id: 3, title: 'Main Vaapas Aaunga', screen: 'AUDI 02 — 2D Standard', times: '12:00 PM, 07:30 PM', fill: '62%' },
    { id: 4, title: 'Cocktail 2', screen: 'AUDI 03 — Dolby Atmos', times: '02:30 PM, 09:45 PM', fill: '78%' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTimes, setNewTimes] = useState('');

  const handleDeployShow = (e) => {
    e.preventDefault();
    if (!newTitle || !newTimes) return;

    const newShow = {
      id: Date.now(),
      title: newTitle,
      screen: 'AUDI 01 — IMAX 3D',
      times: newTimes,
      fill: '0%'
    };

    setScreenings([newShow, ...screenings]);
    setNewTitle('');
    setNewTimes('');
  };

  const handleRevokeShow = (id) => {
    setScreenings(screenings.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
          <Film size={20} className="text-amber-500" /> Screening Matrix Schedules
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Deploy or cancel active multiplex cinema auditorium slots dynamically.</p>
      </div>

      <form onSubmit={handleDeployShow} className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-xl">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Film Title</label>
          <input 
            type="text" 
            placeholder="e.g. Peddhi"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Showtime Allocation</label>
          <input 
            type="text" 
            placeholder="e.g. 04:00 PM, 11:15 PM"
            value={newTimes}
            onChange={(e) => setNewTimes(e.target.value)}
            className="w-full bg-slate-950 border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <button type="submit" className="w-full py-3 text-xs font-black uppercase tracking-wider rounded-xl bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md border-0">
          <Plus size={14} strokeWidth={2.5} /> Deploy Show
        </button>
      </form>

      <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01] shadow-2xl">
        <table className="w-full text-left text-xs font-medium border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-white/[0.04] text-slate-400 uppercase font-black font-mono tracking-wider text-[10px]">
              <th className="p-4">Active Blockbuster Movie</th>
              <th className="p-4">Auditorium / Format</th>
              <th className="p-4">Timeline Showtimes</th>
              <th className="p-4">Load Threshold</th>
              <th className="p-4 text-right">Operational Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-slate-300">
            {screenings.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-black text-white">{row.title}</td>
                <td className="p-4 font-mono text-[11px] text-slate-400">{row.screen}</td>
                <td className="p-4 font-mono font-semibold text-amber-500">{row.times}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: row.fill }} />
                    </div>
                    <span className="font-mono text-[10px] font-bold">{row.fill}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleRevokeShow(row.id)}
                    className="text-red-400 hover:text-red-300 font-black uppercase text-[10px] bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 2. SUB-PAGE VIEW: BOOKINGS LEDGER
// ==========================================
function AdminBookings() {
  const dataset = [
    { id: 'SHX-849204', name: 'Aman Sharma', seats: 'C-5, C-6, C-7', price: '₹630.00', status: 'SETTLED' },
    { id: 'SHX-129482', name: 'Riya Malhotra', seats: 'A-1, A-2', price: '₹430.00', status: 'SETTLED' },
    { id: 'SHX-948203', name: 'Vikram Singh', seats: 'J-10, J-11, J-12', price: '₹630.00', status: 'SETTLED' }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-white/[0.04] pb-6">
        <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
          <Ticket size={20} className="text-amber-500" /> Ticket Settlement Ledger
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time auditing track of processed customer orders.</p>
      </div>

      <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01] shadow-2xl">
        <table className="w-full text-left text-xs font-medium border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-white/[0.04] text-slate-400 uppercase font-black font-mono tracking-wider text-[10px]">
              <th className="p-4">Invoice Reference</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Allocated Nodes</th>
              <th className="p-4">Gross Settled</th>
              <th className="p-4">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-slate-300">
            {dataset.map((row, index) => (
              <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-mono font-bold text-amber-500">{row.id}</td>
                <td className="p-4 font-semibold text-white">{row.name}</td>
                <td className="p-4 font-mono text-slate-400">{row.seats}</td>
                <td className="p-4 font-mono font-bold text-white">{row.price}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-[9px] font-black font-mono tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 3. SUB-PAGE VIEW: IAM USER DIRECTORY
// ==========================================
function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/[0.04] pb-6">
        <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
          <Users size={20} className="text-amber-500" /> IAM Security User Roles
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Review system personnel access privileges and active operations accounts.</p>
      </div>

      <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01] shadow-2xl">
        <table className="w-full text-left text-xs font-medium border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-white/[0.04] text-slate-400 uppercase font-black font-mono tracking-wider text-[10px]">
              <th className="p-4">Operator Profile</th>
              <th className="p-4">Assigned Access Level</th>
              <th className="p-4">Session Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-slate-300">
            <tr className="hover:bg-white/[0.02] transition-colors">
              <td className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 font-bold text-xs border border-amber-500/20 flex items-center justify-center shadow-inner">JS</div>
                <div>
                  <p className="font-bold text-white">Jiya Sukhija</p>
                  <p className="text-[10px] text-slate-500 font-mono">jiya@example.com</p>
                </div>
              </td>
              <td className="p-4"><span className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-md bg-stone-900 border border-white/[0.04] text-amber-500">ROOT_ADMINISTRATOR</span></td>
              <td className="p-4"><div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] font-mono"><UserCheck size={13} /> ACTIVE_ROOT</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==========================================
// 4. SUB-PAGE VIEW: SYSTEM ARCHITECTURE CONFIGS
// ==========================================
function AdminSettings() {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/[0.04] pb-6">
        <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
          <Settings size={20} className="text-amber-500" /> Infrastructure Configurations
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Control global application parameters, active API tokens, and sync layers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-display font-black text-sm"><KeySquare size={16} className="text-amber-500" /> Payment Node Gateway</div>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Razorpay Merchant Mode</label>
              <select className="w-full bg-slate-950 border border-white/[0.06] rounded-xl px-3 py-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-500/50">
                <option>Sandbox / Test Environment Active</option>
                <option>Live Production Gateway Cluster</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-white font-display font-black text-sm"><HardDrive size={16} className="text-amber-500" /> System Memory Arrays</div>
          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-white/[0.04]">
              <div>
                <p className="text-xs font-black tracking-wide text-white">Local Cache Architecture</p>
                <p className="text-[11px] text-slate-500 font-medium">Auto-synchronizes seat operations into local storage clusters.</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">ON</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. PARENT MAIN CORE CONTROLLER MODULE
// ==========================================
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { clearBookingSession } = useBooking();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Set default initial rendering view state
  const [activeTab, setActiveTab] = useState('overview');

  // Multi-route fallback listener captures directly loaded browser extensions perfectly
  useEffect(() => {
    const parseInitialHash = () => {
      const currentHash = window.location.hash.replace('#', '').toLowerCase();
      if (['overview', 'screenings', 'bookings', 'users', 'settings'].includes(currentHash)) {
        setActiveTab(currentHash);
      }
    };

    parseInitialHash();
    window.addEventListener('hashchange', parseInitialHash);
    return () => window.removeEventListener('hashchange', parseInitialHash);
  }, []);

  // Explicit interceptor overrides default browser jumping anchors to guarantee instant React state updates
  const handleTabSelection = (e, tabKey) => {
    e.preventDefault();
    setActiveTab(tabKey);
    window.location.hash = tabKey;
  };

  const metrics = [
    { title: 'Total Revenue', value: '₹4,82,900', change: '+12.4%', icon: <BarChart3 size={18} /> },
    { title: 'System Occupancy', value: '78.3%', change: '+4.2%', icon: <Ticket size={18} /> },
    { title: 'Active Users', value: '1,248', change: '-2.1%', icon: <Users size={18} /> },
    { title: 'Top Movies', value: 'Welcome To The Jungle', change: 'Stable', icon: <Film size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#060911] flex text-stone-100 font-sans antialiased">
      
      {/* --- ADAPTIVE SIDEBAR --- */}
      <aside className={`bg-slate-950 border-r border-white/[0.04] transition-all duration-300 ease-[0.25,1,0.5,1] flex flex-col justify-between shadow-2xl relative z-20 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div>
          <div className="h-20 flex items-center justify-between px-4 border-b border-white/[0.04]">
            <div className={`flex items-center gap-2.5 pl-1 ${!isSidebarOpen && 'hidden'}`}>
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center font-black text-stone-950 text-sm shadow-[0_0_15px_rgba(244,197,66,0.2)]">S</span>
              <span className="font-display font-black text-sm tracking-tight text-white">Showx<span className="text-amber-500 font-mono text-xs ml-0.5">Console</span></span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-amber-500/40 text-slate-400 hover:text-amber-500 transition-all cursor-pointer mx-auto border-0">
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          <nav className="p-4 space-y-1.5">
            {[
              { label: 'Overview', key: 'overview', icon: <BarChart3 size={16} /> },
              { label: 'Screenings', key: 'screenings', icon: <Film size={16} /> },
              { label: 'Bookings', key: 'bookings', icon: <Ticket size={16} /> },
              { label: 'Users', key: 'users', icon: <Users size={16} /> },
              { label: 'Settings', key: 'settings', icon: <Settings size={16} /> }
            ].map((item) => (
              <a 
                key={item.key} 
                href={`#${item.key}`}
                onClick={(e) => handleTabSelection(e, item.key)}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition-all duration-200 group border ${
                  activeTab === item.key 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-sm shadow-amber-500/5' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02] border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                <span className={!isSidebarOpen ? 'hidden' : 'block'}>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div onClick={() => { clearBookingSession(); navigate('/'); }} className="p-4 border-t border-white/[0.04] flex items-center gap-3.5 cursor-pointer hover:bg-red-500/5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/[0.06] flex items-center justify-center font-bold text-xs text-amber-500 group-hover:border-red-500/40 text-center">JS</div>
          <div className={`text-xs ${!isSidebarOpen ? 'hidden' : 'block'}`}>
            <p className="font-black text-slate-300 group-hover:text-red-400">Jiya Sukhija</p>
            <p className="text-slate-500 font-mono text-[10px] uppercase">System Admin</p>
          </div>
        </div>
      </aside>

      {/* --- DYNAMIC RENDERING SURFACE --- */}
      <main className="flex-grow p-6 md:p-10 space-y-10 overflow-y-auto relative z-10">
        {activeTab === 'overview' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-6">
              <div>
                <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2"><Layout size={20} className="text-amber-500" /> Operational Core Matrix</h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time load vectors and physical checkout transaction clusters.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((card) => (
                <div key={card.title} className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.05] p-6 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{card.title}</span>
                      <span className="text-3xl font-black text-white font-mono">{card.value}</span>
                    </div>
                    <span className="text-amber-500 bg-amber-500/5 border border-amber-500/10 w-11 h-11 rounded-xl flex items-center justify-center shadow-inner">{card.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 shadow-2xl"><UtilizationChart /></div>
              <div className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.05] p-6 rounded-2xl flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="flex items-center gap-2 mb-4"><ShieldAlert size={16} className="text-amber-500" /><h3 className="text-xs font-black text-white uppercase tracking-widest">Node Operations</h3></div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Distributed computing architecture registers zero packet drops. Active memory arrays allocated to live spatial seating nodes are optimized at native execution speeds.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hot-swapping views instantly via interceptor states */}
        {activeTab === 'screenings' && <AdminScreenings />}
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'users' && <AdminUsers />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>

    </div>
  );
}