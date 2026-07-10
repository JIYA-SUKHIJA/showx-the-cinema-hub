// src/components/Admin/Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext'; // Dynamic theme config loader link
import { LayoutDashboard, Film, Ticket, Building, User, CreditCard, Settings, ChevronLeft, Clapperboard, CalendarClock, Home, Menu, X } from 'lucide-react'; //

export default function Sidebar({ isExpanded, toggleSidebar, activeTab, setActiveTab }) {
  const { isDarkMode } = useTheme(); // Reading direct system theme states
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }, //
    { id: 'movies', label: 'Movie Hub', icon: Film }, //
    { id: 'bookings', label: 'Bookings Logs', icon: Ticket }, //
    { id: 'theatres', label: 'Theatres', icon: Building }, //
    { id: 'shows', label: 'Show Schedule', icon: CalendarClock }, //
    { id: 'users', label: 'User Matrix', icon: User }, //
    { id: 'payments', label: 'Payment Nodes', icon: CreditCard }, //
    { id: 'settings', label: 'System Settings', icon: Settings } //
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setIsMobileOpen(false); // close drawer after picking a tab on mobile
  };

  const sidebarInner = (expanded) => (
    <>
      {/* --- LOGO BRAND HUB AREA --- */}
      <div className="flex items-center justify-between mb-8 px-1.5 h-10">
        {expanded ? (
          <div className="flex items-center gap-2.5 group">
            <div className="w-8.5 h-8.5 rounded-xl bg-[#FF9F00] flex items-center justify-center text-black shadow-md shadow-[#FF9F00]/20 transition-transform duration-500 group-hover:rotate-12">
              <Clapperboard size={16} strokeWidth={2.5} />
            </div>
            <span className={`font-black text-base tracking-tight font-display transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}>
              Showx <span className="text-[9px] text-[#FF9F00] font-mono block tracking-wider -mt-1 uppercase font-black">Console</span>
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-xl bg-[#FF9F00] flex items-center justify-center text-black shadow-md shadow-[#FF9F00]/20">
              <Clapperboard size={16} strokeWidth={2.5} />
            </div>
          </div>
        )}

        {/* Mobile-only close button inside the drawer */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className={`md:hidden p-1.5 rounded-lg border-none bg-transparent cursor-pointer ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* --- NAVIGATION LINKS MATRIX INDEX --- */}
      <nav className="space-y-1.5 flex-grow mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center rounded-xl text-xs font-bold transition-all relative border-none bg-transparent cursor-pointer focus:outline-none h-11 ${
                expanded ? "px-4 gap-3.5" : "justify-center p-0"
              } ${
                active
                  ? "text-[#FF9F00] bg-[#FF9F00]/[0.06] font-black"
                  : isDarkMode
                    ? "text-slate-500 hover:text-slate-200 hover:bg-white/[0.01]"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50/80"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 w-[3px] h-5 bg-[#FF9F00] rounded-r-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <div className="flex items-center justify-center w-5 h-5 shrink-0 relative">
                <Icon size={16} className={`transition-colors duration-300 ${
                  active
                    ? "text-[#FF9F00]"
                    : isDarkMode
                      ? "text-slate-500 group-hover:text-slate-300"
                      : "text-stone-400 group-hover:text-stone-700"
                }`} />
              </div>

              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  className="truncate"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      {/* --- FOOTER EXIT PATH ROUTE --- */}
      <Link
        to="/"
        onClick={() => setIsMobileOpen(false)}
        className={`flex items-center rounded-xl text-xs font-bold transition-all focus:outline-none h-11 ${
          expanded ? "px-4 gap-3.5" : "justify-center p-0"
        } ${
          isDarkMode
            ? "text-slate-500 hover:text-[#FF9F00] hover:bg-[#FF9F00]/[0.02]"
            : "text-stone-400 hover:text-[#FF9F00] hover:bg-[#FF9F00]/[0.04]"
        }`}
      >
        <div className="flex items-center justify-center w-5 h-5 shrink-0">
          <Home size={16} />
        </div>
        {expanded && <span>Back to Home</span>}
      </Link>
    </>
  );

  return (
    <>
      {/* --- MOBILE TOP HAMBURGER (fixed, only visible below md) --- */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className={`md:hidden fixed top-3 left-3 z-50 p-2.5 rounded-xl border shadow-lg cursor-pointer ${
          isDarkMode ? "bg-[#111114] border-white/[0.08] text-slate-200" : "bg-white border-stone-200 text-stone-700"
        }`}
        aria-label="Open admin menu"
      >
        <Menu size={18} />
      </button>

      {/* --- DESKTOP SIDEBAR (collapsible, always visible md and up) --- */}
      <motion.aside
        animate={{ width: isExpanded ? 260 : 76 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`hidden md:flex shrink-0 min-h-screen flex-col p-4 select-none border-r transition-colors duration-300 relative z-40 ${
          isDarkMode
            ? "bg-[#060608] border-white/[0.04]"
            : "bg-white border-stone-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.01)]"
        }`}
      >
        <button
          onClick={toggleSidebar}
          aria-label={isExpanded ? "Collapse Sidebar Menu" : "Expand Sidebar Menu"}
          className={`absolute -right-3 top-7 w-6 h-6 rounded-full border flex items-center justify-center shadow-md transition-all cursor-pointer z-50 focus:outline-none ${
            isDarkMode
              ? "bg-[#111114] border-white/[0.08] text-slate-400 hover:text-white"
              : "bg-white border-stone-300 text-stone-500 hover:text-stone-900"
          }`}
        >
          <ChevronLeft size={12} strokeWidth={3} className={`transition-transform duration-300 ${!isExpanded ? "rotate-180" : ""}`} />
        </button>

        {sidebarInner(isExpanded)}
      </motion.aside>

      {/* --- MOBILE OFF-CANVAS DRAWER --- */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`md:hidden fixed top-0 left-0 h-screen w-72 max-w-[85vw] flex flex-col p-4 select-none border-r z-50 overflow-y-auto ${
                isDarkMode ? "bg-[#060608] border-white/[0.04]" : "bg-white border-stone-200/80"
              }`}
            >
              {sidebarInner(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}