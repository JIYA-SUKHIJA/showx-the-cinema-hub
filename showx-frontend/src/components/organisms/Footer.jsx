// src/components/organisms/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Mapped imports to resolve the active component runtime crash
import { 
  Clapperboard, Phone, Mail, ShieldCheck,
  ArrowUp, HelpCircle, Tv, Compass, Shield, Cpu, Zap, X, Copy, Check
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
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Pure hardware-accelerated animations block to match Stripe/Linear smoothness
  const premiumFooterStyles = `
    @keyframes subtleShimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-sweep-shimmer {
      animation: subtleShimmer 2s infinite;
    }
  `;

  return (
    <footer className="relative mt-24 md:mt-32 bg-[#04060a] text-slate-400 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden border-t border-slate-900/80 w-full">
      <style>{premiumFooterStyles}</style>
      
      {/* BACKGROUND DECORATIVE RADIANT GLOW BULBS */}
      <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-amber-500/[0.02] rounded-full blur-[100px] md:blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-orange-600/[0.015] rounded-full blur-[100px] md:blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />

      {/* --- SCROLL TO TOP FLOATING PILL --- */}
      <div className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
        showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}>
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll back to top of page"
          className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.25)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.45)] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer border-none outline-none group"
        >
          <ArrowUp size={16} strokeWidth={2.5} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-active:scale-95" />
        </button>
      </div>

      {/* ================= STAGE 1: CINEMATIC CALL-TO-ACTION ELEMENT ================= */}
      <div className="relative border-b border-slate-900/60 bg-gradient-to-b from-[#060912]/80 to-transparent w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 md:py-14 text-center relative z-10">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 md:w-64 md:h-24 bg-amber-500/[0.03] rounded-full blur-2xl pointer-events-none" />
          
          <span className="text-[8px] min-[360px]:text-[9px] font-mono font-black tracking-[0.3em] text-amber-500 uppercase block mb-2 select-none">
            NOW SHOWING
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-display mb-2.5">
            Ready for Your Next Blockbuster?
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 max-w-sm sm:max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed px-2">
            Experience premium ticket reservations and explore cinematic seating arrangements flawlessly.
          </p>
          
          <Link to="/movies" className="inline-block focus:outline-none">
            <button type="button" className="relative px-6 py-3 text-[10px] min-[360px]:text-[11px] sm:text-xs font-black uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-105 rounded-xl shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-98 cursor-pointer border-none outline-none overflow-hidden group/btn">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-sweep-shimmer transition-transform" />
              Explore Movies
            </button>
          </Link>
        </div>
      </div>

      {/* ================= STAGE 2: PREMIUM HIGH-FIDELITY TRUST CARDS ================= */}
      <div className="border-b border-slate-900/60 bg-[#04060a]/30 w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Secure Payments", desc: "PCI-DSS Certified Checkout", icon: Shield },
              { label: "Instant Booking", desc: "Real-time Seat Assignment", icon: Compass },
              { label: "Verified Shows", desc: "100% Authorized Partners", icon: Tv },
              { label: "24x7 Support", desc: "Always Available for You", icon: Cpu }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3.5 rounded-xl sm:rounded-2xl bg-[#090d16]/10 border border-slate-900/80 hover:border-amber-500/10 hover:bg-[#090d16]/30 transition-all duration-300 hover:-translate-y-0.5 shadow-sm group relative overflow-hidden"
                >
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-500/5 text-amber-500 flex items-center justify-center border border-amber-500/10 transition-all duration-300 group-hover:bg-amber-500/10 group-hover:border-amber-500/20 shrink-0">
                    <Icon size={13} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-black text-slate-200 text-[11px] leading-tight tracking-wide transition-colors group-hover:text-amber-400 truncate">{card.label}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{card.desc}</p>
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
          <div className="flex items-center gap-2.5 group w-fit select-none">
            <div className="w-8 h-8 rounded-xl bg-[#FF9F00] flex items-center justify-center text-black shadow-md shadow-[#FF9F00]/10 transition-transform duration-500 group-hover:rotate-12">
              <Clapperboard size={14} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-black tracking-tight text-white font-display leading-none">
                ShowX
              </span>
              <span className="text-[8px] font-mono font-black tracking-widest text-amber-500 uppercase mt-0.5">
                THE CINEMAHUB
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-medium lg:pr-6 pt-1 max-w-xl">
            A premium movie ticketing platform offering real-time show status tracking, instant seating allocations, and immersive booking environments seamlessly.
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[9px] min-[360px]:text-[10px] font-mono text-slate-500/80 pt-1 select-none">
            {["Book Movies", "Reserve Seats", "Discover Theatres", "Enjoy Cinema"].map((t) => (
              <span key={t} className="flex items-center gap-1">&bull; {t}</span>
            ))}
          </div>
        </div>

        {/* Column 2: Explore Links */}
        <div className="space-y-3.5 col-span-1 lg:col-span-3">
          <h5 className="text-[9px] min-[360px]:text-[10px] font-mono font-black tracking-widest uppercase text-slate-500 flex items-center gap-1.5 select-none">
            <Zap size={10} className="text-amber-500" /> Explore
          </h5>
          <ul className="space-y-2.5 text-[11px] list-none p-0 font-medium">
            {[
              { to: "/", label: "Home Portal" },
              { to: "/movies", label: "Movies Indexed" },
              { to: "/theatres", label: "Theatres Map" },
              { to: "/support", label: "Help Center" }
            ].map((link, idx) => (
              <li key={idx}>
                <Link to={link.to} className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 group relative w-fit focus:outline-none focus:text-amber-400">
                  <span className="transition-transform duration-200 sm:group-hover:translate-x-1 relative pb-0.5 block">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber-500 transition-all duration-300 sm:group-hover:w-full group-focus:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Support Section */}
        <div className="space-y-3.5 col-span-1 lg:col-span-3">
          <h5 className="text-[9px] min-[360px]:text-[10px] font-mono font-black tracking-widest uppercase text-slate-500 flex items-center gap-1.5 select-none">
            <HelpCircle size={11} className="text-amber-500" /> Support
          </h5>
          <ul className="space-y-2.5 text-[11px] list-none p-0 font-medium">
            <li>
              <button 
                onClick={() => setActiveModal('support_email')}
                type="button"
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-400 transition-colors"
              >
                <span className="w-6 h-6 rounded-lg bg-[#070b14] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-colors shrink-0">
                  <Mail size={11} />
                </span>
                <span className="group-hover:text-slate-200 transition-colors truncate">support@showx.com</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal('support_phone')}
                type="button"
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-400 transition-colors"
              >
                <span className="w-6 h-6 rounded-lg bg-[#070b14] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-colors shrink-0">
                  <Phone size={11} />
                </span>
                <span className="group-hover:text-slate-200 transition-colors font-mono text-[10px] truncate">+91 XXXXX XXXXX</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal('privacy')}
                type="button"
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-400 transition-colors"
              >
                <span className="w-6 h-6 rounded-lg bg-[#070b14] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-colors shrink-0">
                  <ShieldCheck size={11} />
                </span>
                <span className="group-hover:text-amber-400 transition-colors">Privacy Policy</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal('terms')}
                type="button"
                className="flex items-center gap-2.5 group bg-transparent border-none p-0 cursor-pointer text-left text-slate-400 font-medium text-[11px] outline-none w-full focus:text-amber-400 transition-colors"
              >
                <span className="w-6 h-6 rounded-lg bg-[#070b14] border border-slate-900 flex items-center justify-center text-slate-500 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-colors shrink-0">
                  <ShieldCheck size={11} />
                </span>
                <span className="group-hover:text-amber-400 transition-colors">Terms & Conditions</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* ================= STAGE 4: HIGH-FIDELITY LEGAL BASEBAR ================= */}
      <div className="border-t bg-[#020306] border-slate-900 py-5 sm:py-6 w-full">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono font-medium text-slate-500 w-full">
          
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center md:text-left select-none">
            <p>&copy; 2026 ShowX – The CinemaHub.</p>
            <span className="hidden sm:inline text-slate-800">|</span>
            <p className="text-slate-600">All Rights Reserved.</p>
          </div>

          <div className="flex items-center gap-4 text-slate-400 select-none text-[10px]">
            <button onClick={() => setActiveModal('privacy')} type="button" className="bg-transparent border-none p-0 text-slate-500 hover:text-amber-400 cursor-pointer font-mono outline-none focus:text-amber-400 transition-colors">Privacy</button>
            <span className="text-slate-800">/</span>
            <button onClick={() => setActiveModal('terms')} type="button" className="bg-transparent border-none p-0 text-slate-500 hover:text-amber-400 cursor-pointer font-mono outline-none focus:text-amber-400 transition-colors">Terms</button>
            <span className="text-slate-800">/</span>
            <Link to="/support" className="text-slate-500 hover:text-amber-400 transition-colors focus:outline-none">Help Center</Link>
          </div>

        </div>
      </div>

      {/* ================= HIGH-FIDELITY PREMIUM DYNAMIC ACCENT MODALS ================= */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-[#070b14] border border-white/[0.06] p-5 sm:p-6 shadow-2xl text-slate-300 flex flex-col max-h-[85vh] overflow-hidden"
            >
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 shrink-0">
                <h4 className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-black uppercase font-mono tracking-widest text-[#FF9F00] flex items-center gap-2 select-none">
                  {activeModal === 'privacy' || activeModal === 'terms' ? <ShieldCheck size={13} /> : <HelpCircle size={13} />}
                  {activeModal === 'privacy' && 'Data Telemetry Privacy Protocol'}
                  {activeModal === 'terms' && 'Terms & Configuration Guidelines'}
                  {activeModal === 'support_email' && 'System Communications Node'}
                  {activeModal === 'support_phone' && 'Hotline Telemetry Node'}
                </h4>
                <button 
                  onClick={() => setActiveModal(null)}
                  type="button"
                  className="p-1 rounded-lg bg-transparent border-none text-slate-500 hover:text-white cursor-pointer transition-colors outline-none focus:outline-none"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="text-[11px] leading-relaxed font-sans space-y-4 overflow-y-auto pr-1 no-scrollbar flex-grow">
                {activeModal === 'support_email' && (
                  <div className="text-center py-2 space-y-4">
                    <p className="text-slate-400 font-medium">Official technical support line mapped for real-time ticket or venue routing assistance.</p>
                    <div className="flex items-center justify-between bg-[#03050a] border border-slate-900 rounded-xl px-4 py-3 font-mono text-xs text-white gap-2 shadow-inner">
                      <span className="truncate select-all">support@showx.com</span>
                      <button 
                        onClick={() => handleCopyToClipboard('support@showx.com')}
                        type="button"
                        className="bg-transparent border-none text-amber-500 hover:text-amber-400 cursor-pointer flex items-center gap-1.5 focus:outline-none shrink-0 transition-colors font-bold"
                      >
                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        <span className="text-[10px] font-mono uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'support_phone' && (
                  <div className="text-center py-2 space-y-4">
                    <p className="text-slate-400 font-medium">Secure automated customer helpline. Available 24/7 for booking confirmations.</p>
                    <div className="flex items-center justify-between bg-[#03050a] border border-slate-900 rounded-xl px-4 py-3 font-mono text-xs text-white gap-2 shadow-inner">
                      <span className="truncate select-all">+91 98765 43210</span>
                      <button 
                        onClick={() => handleCopyToClipboard('+91 98765 43210')}
                        type="button"
                        className="bg-transparent border-none text-amber-500 hover:text-amber-400 cursor-pointer flex items-center gap-1.5 focus:outline-none shrink-0 transition-colors font-bold"
                      >
                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        <span className="text-[10px] font-mono uppercase tracking-wider">{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'privacy' && (
                  <div className="space-y-4 font-medium text-slate-400">
                    <p className="font-bold text-white text-xs">1. User Data Pipeline Isolation</p>
                    <p>This platform operates as a secure major project configuration. All incoming tokens, session objects, and password arrays are cryptographically processed before mapping to database nodes.</p>
                    <p className="font-bold text-white text-xs">2. Payment Matrix Simulation</p>
                    <p>All financial gateway tracking logs generated during seat booking execution arrays use sandbox configuration modes. No actual legal currencies are parsed through these pipelines.</p>
                  </div>
                )}

                {activeModal === 'terms' && (
                  <div className="space-y-4 font-medium text-slate-400">
                    <p className="font-bold text-white text-xs">1. System Access Clearances</p>
                    <p>By accessing this full-stack deployment workspace, you recognize that the environment constitutes a secure movie platform model. Ticket triggers remain authorized for customer auditing only.</p>
                    <p className="font-bold text-white text-xs">2. Seating Matrix Allocation</p>
                    <p>Users are permitted to initialize booking streams. If an instance remains pending without validation confirmations for more than 10 intervals, the seat map array clears details automatically.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-900 pt-3 mt-4 flex justify-end shrink-0">
                <button 
                  onClick={() => setActiveModal(null)}
                  type="button"
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-lg border-none hover:brightness-105 active:scale-95 cursor-pointer outline-none transition-all shadow-md focus:outline-none"
                >
                  Acknowledge Protocol
                </button>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </footer>
  );
}