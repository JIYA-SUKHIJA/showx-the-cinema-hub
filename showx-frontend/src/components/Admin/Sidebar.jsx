import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Film, Ticket, Building, User, CreditCard, Settings, ChevronLeft, Clapperboard, CalendarClock, Home } from 'lucide-react';

export default function Sidebar({ isExpanded, toggleSidebar, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'movies', label: 'Movie Hub', icon: Film },
    { id: 'bookings', label: 'Bookings Logs', icon: Ticket },
    { id: 'theatres', label: 'Theatres', icon: Building },
    { id: 'shows', label: 'Show Schedule', icon: CalendarClock },
    { id: 'users', label: 'User Matrix', icon: User },
    { id: 'payments', label: 'Payment Nodes', icon: CreditCard },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <motion.aside 
      animate={{ width: isExpanded ? 280 : 80 }}
      className="shrink-0 min-h-screen bg-[#060608] border-r border-white/[0.05] flex flex-col p-6 transition-all"
    >
      <div className="flex items-center justify-between mb-10">
        {isExpanded && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF9F00] flex items-center justify-center text-black">
              <Clapperboard size={20} strokeWidth={2.5} />
            </div>
            <span className="font-black text-white text-lg tracking-tighter">Showx</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ChevronLeft size={18} className={!isExpanded ? "rotate-180" : ""} />
        </button>
      </div>

      <nav className="space-y-2 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-bold transition-all ${active ? "text-[#FF9F00] bg-[#FF9F00]/10" : "text-slate-500 hover:text-slate-200"}`}>
              <Icon size={18} />
              {isExpanded && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Back to Home is the only exit option here — Logout already lives
          in the header's profile dropdown, so we don't duplicate it. */}
      <Link
        to="/"
        className="flex items-center gap-4 px-4 py-3 text-xs font-bold text-slate-500 hover:text-[#FF9F00] hover:bg-white/[0.03] rounded-xl transition-all"
      >
        <Home size={18} />
        {isExpanded && <span>Back to Home</span>}
      </Link>
    </motion.aside>
  );
}