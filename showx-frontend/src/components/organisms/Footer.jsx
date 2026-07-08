// src/components/organisms/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/axiosInstance';
import { 
  Clapperboard, Phone, Mail, ArrowRight, ShieldCheck,
  Globe, Link2, Camera, Film,
  CheckCircle2, ArrowUp, Zap, Sparkles, HelpCircle
} from 'lucide-react';

// Selected professional cinema-focused quotes to rotate dynamically on refresh
const MOVIE_QUOTES = [
  "Cinema is better together.",
  "Lights. Camera. Action.",
  "Where stories come alive, frame by frame.",
  "Your ticket to premium entertainment nodes."
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState('');

  // Auto-select a dynamic movie quote on layout initialization
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOVIE_QUOTES.length);
    setSelectedQuote(MOVIE_QUOTES[randomIndex]);

    // Handle visibility threshold for Back to Top float utility
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post('/newsletter/subscribe', { email: email.trim() });
      toast.success("Welcome aboard! You have successfully subscribed.");
      setEmail('');
    } catch (error) {
      console.error("Newsletter submission failure:", error);
      const errorMsg = error.response?.data?.message || "Failed to sync signup request node.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative border-t text-xs mt-32 bg-slate-950 border-slate-900 text-slate-400 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* --- FLOATING BACK TO TOP BUTTON --- */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
        showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top of page"
          className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer group"
        >
          <ArrowUp size={18} strokeWidth={2.5} className="group-hover:animate-bounce" />
        </button>
      </div>

      {/* --- SECTION 1: TRUST CHIPS SECTION --- */}
      <div className="border-b border-slate-900/60 bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Secure Payments", desc: "PCI-DSS Compliant Matrix" },
              { label: "Instant Booking", desc: "Real-time Seat Assignment" },
              { label: "Verified Shows", desc: "100% Authorized Partners" },
              { label: "24x7 Core Support", desc: "Always Available Nodes" }
            ].map((badge, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/30 border border-slate-900/60 hover:border-slate-800/80 transition-all duration-300 hover:scale-[1.02] group"
              >
                <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </span>
                <div>
                  <p className="font-bold text-slate-200 text-[11px] leading-tight">{badge.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- SECTION 2: BRAND MATRICES & SOCIAL GRAPH --- */}
      <div className="border-b border-slate-900/60 bg-slate-900/10">
        <div className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Enhanced Branding Block */}
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="flex items-center justify-center lg:justify-start gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/30 blur-md rounded-xl transition-all duration-500 group-hover:bg-amber-500/50" />
                <span className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center shadow-md transition-transform duration-500 group-hover:rotate-12">
                  <Clapperboard size={18} className="text-slate-950" strokeWidth={2.5} />
                </span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                ShowX <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent text-[11px] font-black tracking-widest uppercase align-middle ml-2 font-mono">— CinemaHub</span>
              </span>
            </div>
            <p className="text-slate-200 text-xs font-semibold tracking-wide">
              India's Next Generation Movie & Entertainment Platform.
            </p>
            <p className="text-slate-500 text-[11px] font-mono italic flex items-center justify-center lg:justify-start gap-1.5">
              <Sparkles size={11} className="text-amber-500 animate-pulse" /> "{selectedQuote}"
            </p>
          </div>
          
        </div>
      </div>

      {/* --- SECTION 3: BALANCED UTILITY GRID METRICS --- */}
      <div className="max-w-[1440px] mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Quick Links Column */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-black tracking-wider uppercase text-slate-500 font-mono flex items-center gap-1.5">
            <Zap size={10} className="text-amber-500" /> Channels Navigation
          </h5>
          <ul className="space-y-3 text-[11px] list-none p-0 font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/movies", label: "Movies" },
              { to: "/theatres", label: "Theatres" },
              { to: "/releases", label: "Offers" },
              { to: "/support", label: "Contact" }
            ].map((link, idx) => (
              <li key={idx}>
                <Link 
                  to={link.to} 
                  className="hover:text-amber-500 transition-all duration-300 flex items-center gap-1 group relative w-fit focus:outline-none focus:text-amber-500"
                >
                  <span className="transform -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100 text-amber-500">→</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1 group-focus:translate-x-1 relative pb-0.5">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-500/40 transition-all duration-300 group-hover:w-full group-focus:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Channels Column */}
        <div className="space-y-4">
          <h5 className="text-[10px] font-black tracking-wider uppercase text-slate-500 font-mono flex items-center gap-1.5">
            <HelpCircle size={11} className="text-amber-500" /> Support Desk
          </h5>
          <ul className="space-y-3.5 text-[11px] list-none p-0 font-medium">
            <li className="flex items-center gap-2.5 group">
              <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                <Mail size={12} />
              </span>
              <a href="mailto:support@showx.com" className="hover:underline hover:text-slate-200 transition-colors focus:outline-none focus:text-slate-200">support@showx.com</a>
            </li>
            <li className="flex items-center gap-2.5 group">
              <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                <Phone size={12} />
              </span>
              <a href="tel:+91XXXXX XXXXX" className="hover:underline hover:text-slate-200 transition-colors focus:outline-none focus:text-slate-200">+91 XXXXX XXXXX</a>
            </li>
            <li className="flex items-center gap-2.5 group">
              <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors">
                <ShieldCheck size={12} />
              </span>
              <Link to="/support" className="hover:text-amber-500 transition-colors focus:outline-none">Help Center Dispatch</Link>
            </li>
          </ul>
        </div>

        {/* Enhanced Interactive Newsletter Matrix */}
        <div className="space-y-4 sm:col-span-2 md:col-span-2">
          <h5 className="text-[10px] font-black tracking-wider uppercase text-slate-500 font-mono">
            Join 10,000+ Movie Lovers
          </h5>
          <p className="opacity-70 text-[11px] leading-relaxed max-w-sm">
            Subscribe to our automated synchronized node catalog. Receive live system alerts for advanced booking arrays and limited offers.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex relative items-center max-w-sm mt-3 group-input">
            <input 
              type="email" 
              required
              disabled={loading}
              aria-label="Subscribe to our cinema newsletter"
              placeholder={loading ? "Synchronizing system pipelines..." : "Enter your email mappings..."}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-[11px] px-4 py-3 rounded-xl border outline-none font-medium pr-12 bg-slate-900 border-slate-800 text-white placeholder-slate-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all disabled:opacity-40 font-mono"
            />
            <button 
              type="submit" 
              disabled={loading}
              aria-label="Submit subscriber token"
              className="absolute right-1.5 p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all border-none cursor-pointer flex items-center justify-center disabled:opacity-50 hover:scale-105 active:scale-95 shadow-md shadow-amber-500/10 min-w-[28px] h-[28px]"
            >
              {loading ? (
                <span className="w-3 h-3 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <ArrowRight size={13} strokeWidth={3} />
              )}
            </button>
          </form>
        </div>

      </div>

      {/* --- SECTION 5: LEGAL BASEBAR & COMPREHENSIVE REPOSITORY SYNC --- */}
      <div className="border-t py-6 bg-slate-950 border-slate-900">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center justify-center text-center text-[11px] font-medium">
          
          {/* Centered Metadata Sync Blocks */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <p className="text-slate-500 font-mono text-[10px]">
              &copy; {new Date().getFullYear()} ShowX CinemaHub. All system architecture nodes verified.
            </p>
            <span className="hidden sm:inline text-slate-800">|</span>
            <p className="text-slate-600 font-mono text-[10px]">
              Made with <span className="text-red-500 animate-pulse">❤️</span> using React + Node + MongoDB
            </p>
          </div>

        </div>
      </div>
      
    </footer>
  );
}