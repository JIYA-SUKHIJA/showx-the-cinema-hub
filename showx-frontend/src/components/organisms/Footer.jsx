// src/components/organisms/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clapperboard, Phone, Mail, ShieldCheck,
  ArrowUp, Sparkles, HelpCircle,
  Tv, Compass, Shield, ShieldAlert, Cpu, Zap, X, Copy, Check
} from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'support_email' | 'support_phone' | null
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setCopied(false);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeModal]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="relative mt-24 md:mt-32 bg-[#06080c] text-slate-400 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden border-t border-slate-900 w-full">
      
      {/* BACKGROUND DECORATIVE RADIANT GLOW BULBS */}
      <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-amber-500/[0.02] rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-orange-600/[0.02] rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

      {/* --- FLOATING BACK TO TOP FLOATING PILL --- */}
      <div className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 transition-all duration-300 ${
        showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top of page"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer group"
        >
          <ArrowUp size={16} md:size={18} strokeWidth={2.5} className="motion-safe:group-hover:animate-bounce" />
        </button>
      </div>

      {/* ================= STAGE 1: CINEMATIC CALL-TO-ACTION ELEMENT ================= */}
      <div className="relative border-b border-slate-900 bg-gradient-to-b from-[#080b12] to-transparent w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 md:py-14 text-center relative z-10">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 md:w-64 md:h-24 bg-amber-500/[0.04] rounded-full blur-2xl pointer-events-none" />
          
          <span className="text-[9px] sm:text-[10px] font-mono font-black tracking-[0.25em] sm:tracking-[0.3em] text-amber-500 uppercase block mb-2">
            NEXT GEN HUB ENTRY
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-display mb-2.5">
            Ready for Your Next Blockbuster?
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm sm:max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed px-2">
            Experience ultra-premium ticket generation loops and synchronized seating matrix grids seamlessly.
          </p>
          <Link to="/movies">
            <button className="px-5 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 rounded-xl shadow-lg shadow-amber-500/10 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-none outline-none">
              Explore Movies
            </button>
          </Link>
        </div>
      </div>

      {/* ================= STAGE 2: PREMIUM HIGH-FIDELITY TRUST CARDS — Adaptive Mobile Stack ================= */}
      <div className="border-b border-slate-900/60 bg-[#06080c]/50 w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Secure Payments", desc: "PCI-DSS Compliant Matrix", icon: Shield },
              { label: "Instant Booking", desc: "Real-time Seat Assignment", icon: Compass },
              { label: "Verified Shows", desc: "100% Authorized Partners", icon: Tv },
              { label: "24x7 Core Support", desc: "Always Available Nodes", icon: Cpu }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3.5 rounded-xl sm:rounded-2xl bg-[#0b0f19]/30 border border-slate-900/80 hover:border-amber-500/20 transition-all duration-300 sm:hover:scale-[1.02] shadow-sm shadow-black/40 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/5 text-amber-500 flex items-center justify-center border border-amber-500/10 transition-all duration-500 sm:group-hover:rotate-12">
                    <Icon size={14} strokeWidth={2.2} />
                  </span>
                  <div>
                    <p className="font-black text-slate-200 text-[11px] leading-tight tracking-wide">{card.label}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= STAGE 3: PRIMARY MULTI-COLUMN INTERFACE GRID ================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 w-full">
        
        {/* Column 1: Brand Identity */}
        <div className="space-y-4 lg:col-span-6 col-span-1 sm:col-span-2 lg:col-span-6">
          <div className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-[#FF9F00] flex items-center justify-center text-black shadow-md shadow-[#FF9F00]/10">
              <Clapperboard size={15} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm sm:text-base font-black tracking-tight text-white font-display leading-none">
                ShowX
              </span>
              <span className="text-[8px] font-mono font-black tracking-widest text-amber-500 uppercase mt-0.5">
                THE CINEMAHUB
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium lg:pr-6 pt-1 max-w-xl">
            A premium full-stack node gateway handling synchronized theater tracking, real-time allocation frameworks, and structural interface grids seamlessly.
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-mono text-slate-500 pt-0.5">
            {["Book Movies", "Reserve Seats", "Discover Theatres", "Enjoy Cinema"].map((t) => (
              <span key={t} className="flex items-center gap-1">• {t}</span>
            ))}
          </div>
        </div>

        {/* Column 2: Explore Navigation Links */}
        <div className="space-y-3.5 col-span-1 lg:col-span-3">
          <h5 className="text-[10px] font-mono font-black tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
            <Zap size={10} className="text-amber-500" /> Explore Nodes
          </h5>
          <ul className="space-y-2.5 text-[11px] list-none p-0 font-medium">
            {[
              { to: "/", label: "Home Portal" },
              { to: "/movies", label: "Movies Indexed" },
              { to: "/theatres", label: "Theatres Map" },
              { to: "/support", label: "Help Center Dispatch" }
            ].map((link, idx) => (
              <li key={idx}>
                <Link to={link.to} className="hover:text-amber-500 transition-colors flex items-center gap-1 group relative w-fit focus:outline-none focus:text-amber-500">
                  <span className="transition-transform duration-200 sm:group-hover:translate-x-0.5 relative pb-0.5">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500/40 transition-all duration-300 sm:group-hover:w-full group-focus:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Secure Support Core */}
        <div className="space-y-3.5 col-span-1 lg:col-span-3">
          <h5 className="text-[10px] font-mono font-black tracking-wider uppercase text-slate-500 flex items-center gap-1.5">
            <HelpCircle size={11} className="text-amber-500" /> Support Core
          </h5>
          <ul className="space-y-2.5 text-[11px] list-none p-0 font-medium">
            <li>
              <button 
                onClick={() => setActiveModal('support_email')}
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-500"
              >
                <span className="w-6 h-6 rounded-lg bg-[#0b0f19] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors shrink-0">
                  <Mail size={12} />
                </span>
                <span className="group-hover:text-slate-200 transition-colors truncate">support@showx.com</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal('support_phone')}
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-500"
              >
                <span className="w-6 h-6 rounded-lg bg-[#0b0f19] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors shrink-0">
                  <Phone size={12} />
                </span>
                <span className="group-hover:text-slate-200 transition-colors font-mono text-[10px] truncate">+91 XXXXX XXXXX</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal('privacy')}
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-500"
              >
                <span className="w-6 h-6 rounded-lg bg-[#0b0f19] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors shrink-0">
                  <ShieldCheck size={12} />
                </span>
                <span className="group-hover:text-amber-500 transition-colors">Privacy Policy</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal('terms')}
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-500"
              >
                <span className="w-6 h-6 rounded-lg bg-[#0b0f19] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors shrink-0">
                  <ShieldAlert size={12} />
                </span>
                <span className="group-hover:text-amber-500 transition-colors">Terms Matrix</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* ================= STAGE 4: HIGH-FIDELITY LEGAL BASEBAR ================= */}
      <div className="border-t bg-[#040609] border-slate-900/80 py-5 sm:py-6 w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono font-medium text-slate-500 w-full">
          
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center md:text-left">
            <p>&copy; 2026 ShowX – The CinemaHub.</p>
            <span className="hidden sm:inline text-slate-800">|</span>
            <p className="text-slate-600">All Architecture Rights Reserved.</p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 select-none text-[10px]">
            <button onClick={() => setActiveModal('privacy')} className="bg-transparent border-none p-0 text-slate-400 hover:text-amber-500 cursor-pointer font-mono outline-none">Privacy</button>
            <span className="text-slate-800">/</span>
            <button onClick={() => setActiveModal('terms')} className="bg-transparent border-none p-0 text-slate-400 hover:text-amber-500 cursor-pointer font-mono outline-none">Terms</button>
            <span className="text-slate-800">/</span>
            <Link to="/support" className="hover:text-amber-500 transition-colors focus:outline-none">Help Shards</Link>
          </div>

        </div>
      </div>

      {/* ================= HIGH-FIDELITY PREMIUM DYNAMIC ACCENT MODALS ================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0b0f19] border border-white/[0.08] p-5 sm:p-6 shadow-2xl text-slate-300 flex flex-col max-h-[85vh]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
              <h4 className="text-[11px] sm:text-xs font-black uppercase font-mono tracking-widest text-[#FF9F00] flex items-center gap-2">
                {activeModal.startsWith('support_') ? <HelpCircle size={14} /> : activeModal === 'privacy' ? <Shield size={14} /> : <ShieldAlert size={14} />}
                {activeModal === 'privacy' && 'Data Telemetry Privacy Protocol'}
                {activeModal === 'terms' && 'Terms & Configuration Guidelines'}
                {activeModal === 'support_email' && 'System Communications Node'}
                {activeModal === 'support_phone' && 'Hotline Telemetry Node'}
              </h4>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg bg-transparent border-none text-slate-500 hover:text-white cursor-pointer transition-colors outline-none"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-[11px] leading-relaxed font-sans space-y-4 overflow-y-auto pr-1 no-scrollbar">
              {activeModal === 'support_email' && (
                <div className="text-center py-2 space-y-4">
                  <p className="text-slate-400">Official technical infrastructure support line mapped for system configuration audits.</p>
                  <div className="flex items-center justify-between bg-[#06080c] border border-slate-800 rounded-xl px-4 py-3 font-mono text-xs text-white gap-2">
                    <span className="truncate">support@showx.com</span>
                    <button 
                      onClick={() => handleCopyToClipboard('support@showx.com')}
                      className="bg-transparent border-none text-amber-500 hover:text-amber-400 cursor-pointer flex items-center gap-1.5 focus:outline-none shrink-0"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span className="text-[10px] font-mono uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'support_phone' && (
                <div className="text-center py-2 space-y-4">
                  <p className="text-slate-400">Secure automated telecommunication dispatcher. Sandbox active trace monitoring routed.</p>
                  <div className="flex items-center justify-between bg-[#06080c] border border-slate-800 rounded-xl px-4 py-3 font-mono text-xs text-white gap-2">
                    <span className="truncate">+91 98765 43210</span>
                    <button 
                      onClick={() => handleCopyToClipboard('+91 98765 43210')}
                      className="bg-transparent border-none text-amber-500 hover:text-amber-400 cursor-pointer flex items-center gap-1.5 focus:outline-none shrink-0"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span className="text-[10px] font-mono uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'privacy' && (
                <div className="space-y-4">
                  <p className="font-bold text-white text-xs">1. User Data Pipeline Isolation</p>
                  <p className="text-slate-400">This platform operates as a secure major project stack configuration. All incoming tokens, session objects, and password arrays are cryptographically hashed using standard application hooks before mapping to database nodes.</p>
                  <p className="font-bold text-white text-xs">2. Payment Matrix Simulation</p>
                  <p className="text-slate-400">All financial gateway webhooks and tracking logs generated during seat booking execution arrays use sandbox configuration modes. No actual legal currencies are parsed through these pipeline shards.</p>
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="space-y-4">
                  <p className="font-bold text-white text-xs">1. System Access Clearances</p>
                  <p className="text-slate-400">By accessing this full-stack deployment workspace, you recognize that the environment constitutes an academic execution model. Secondary admin panel triggers remain authorized for system auditing only.</p>
                  <p className="font-bold text-white text-xs">2. Seating Matrix Allocation</p>
                  <p className="text-slate-400">Users are permitted to initialize multiple transaction streams. If an instance remains pending without token validation confirmations for more than 10 intervals, the seat map array clears details automatically.</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-3 mt-4 flex justify-end shrink-0">
              <button 
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-lg border-none hover:brightness-105 active:scale-95 cursor-pointer outline-none transition-all shadow-md"
              >
                Acknowledge Protocol
              </button>
            </div>
            
          </div>
        </div>
      )}
      
    </footer>
  );
}