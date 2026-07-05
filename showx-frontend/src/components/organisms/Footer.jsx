// src/components/organisms/Footer.jsx
import React, { useState } from 'react';
import { 
  Clapperboard, Headphones, RefreshCcw, MailCheck, Tent,
  Globe, MessageSquare, Camera, Film, Link2, ArrowRight,
  ShieldCheck, HelpCircle, FileText, Smartphone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert("Subscription token verified! Welcome to the Showx hub dispatch.");
      setEmail('');
    }
  };

  return (
    <footer className={`relative border-t text-xs mt-20 overflow-hidden transition-all duration-300 ${
      isDarkMode 
        ? "bg-[#070b12] border-white/[0.04] text-slate-400" 
        : "bg-[#fcfbfa] border-stone-200 text-stone-600"
    }`}>
      
      {/* --- SECTION 1: PARTNER CTA BLOCK ("List your Show") --- */}
      <div className={`border-b transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950/60 border-white/[0.04]" : "bg-stone-100/60 border-stone-200"
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left flex-col sm:flex-row">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isDarkMode ? "bg-amber-500/10 text-amber-500" : "bg-amber-500/5 text-amber-700"
            }`}>
              <Tent size={18} />
            </span>
            <p className="text-xs font-medium">
              <span className={`font-display font-black tracking-wide mr-1.5 text-sm uppercase ${isDarkMode ? "text-white" : "text-stone-900"}`}>List your Show</span>
              Got a show, event, activity or a great experience? Partner with us & get listed on Showx - The CinemaHub.
            </p>
          </div>
          <button className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all duration-300 cursor-pointer shrink-0 border shadow-sm ${
            isDarkMode 
              ? "bg-white text-slate-950 border-transparent hover:bg-amber-500" 
              : "bg-stone-950 text-white border-transparent hover:bg-amber-600"
          }`}>
            Contact today!
          </button>
        </div>
      </div>

      {/* --- SECTION 2: CUSTOMER CARE & INTERACTIVE NEWSLETTER MATRIX --- */}
      <div className={`border-b transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950/20 border-white/[0.04]" : "bg-stone-50/40 border-stone-100"
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center lg:col-span-3">
            <a href="#support" className="flex flex-col items-center gap-2 group cursor-pointer">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                isDarkMode ? "bg-white/[0.01] border-white/[0.05] text-slate-400 group-hover:text-amber-500 group-hover:border-amber-500/30" : "bg-white border-stone-200 text-stone-600 group-hover:text-amber-600 group-hover:border-amber-600/30"
              }`}>
                <Headphones size={20} strokeWidth={1.8} />
              </span>
              <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "text-slate-400 group-hover:text-white" : "text-stone-500 group-hover:text-stone-900"}`}>24/7 Customer Care</span>
            </a>

            <a href="#resend" className="flex flex-col items-center gap-2 group cursor-pointer">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                isDarkMode ? "bg-white/[0.01] border-white/[0.05] text-slate-400 group-hover:text-amber-500 group-hover:border-amber-500/30" : "bg-white border-stone-200 text-stone-600 group-hover:text-amber-600 group-hover:border-amber-600/30"
              }`}>
                <RefreshCcw size={18} strokeWidth={1.8} />
              </span>
              <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "text-slate-400 group-hover:text-white" : "text-stone-500 group-hover:text-stone-900"}`}>Resend Ticket Token</span>
            </a>

            <div className="flex flex-col items-center gap-2">
              <span className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                isDarkMode ? "bg-white/[0.01] border-white/[0.05] text-slate-400" : "bg-white border-stone-200 text-stone-600"
              }`}>
                <MailCheck size={19} strokeWidth={1.8} />
              </span>
              <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Stay Catalog Synchronized</span>
            </div>
          </div>

          {/* Integrated Newsletter Form Control */}
          <div className="space-y-2 lg:border-l lg:pl-8 border-white/5">
            <h5 className={`text-[10px] font-black tracking-wider uppercase text-center lg:text-left ${isDarkMode ? "text-slate-400" : "text-stone-700"}`}>Newsletter Hub Dispatch</h5>
            <form onSubmit={handleNewsletterSubmit} className="flex relative items-center">
              <input 
                type="email" 
                required
                placeholder="Enter email mapping..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full text-[11px] px-3.5 py-2.5 rounded-xl border outline-none font-medium pr-10 ${
                  isDarkMode ? "bg-slate-950 border-white/5 text-white focus:border-amber-500/40" : "bg-white border-stone-200 text-slate-800 focus:border-amber-600/40"
                }`}
              />
              <button type="submit" className="absolute right-1.5 p-1.5 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-600 transition-colors border-none cursor-pointer">
                <ArrowRight size={12} strokeWidth={2.5} />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* --- SECTION 3: EXPANSIVE SPLIT LINKS & MATRIX DICTIONARY --- */}
      <div className="max-w-[1440px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 font-medium">
        
        {/* Core Utilities Channels Navigation Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:col-span-8">
          <div className="space-y-2.5">
            <h5 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Customer Support</h5>
            <ul className="space-y-2 text-[11px] list-none p-0">
              <li><a href="#help-center" className="hover:text-amber-500 transition-colors flex items-center gap-1.5"><HelpCircle size={12} /> Help Center</a></li>
              <li><a href="#faqs" className="hover:text-amber-500 transition-colors">Frequently Asked FAQs</a></li>
              <li><a href="#refund" className="hover:text-amber-500 transition-colors flex items-center gap-1.5"><ShieldCheck size={12} /> Refund Policies</a></li>
            </ul>
          </div>
          <div className="space-y-2.5">
            <h5 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Legal Mandates</h5>
            <ul className="space-y-2 text-[11px] list-none p-0">
              <li><a href="#terms" className="hover:text-amber-500 transition-colors flex items-center gap-1.5"><FileText size={12} /> Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-amber-500 transition-colors">Privacy Policy Protection</a></li>
              <li><a href="#terms" className="hover:text-amber-500 transition-colors">Cookie Configurations</a></li>
            </ul>
          </div>
          <div className="space-y-2.5 col-span-2 sm:col-span-1">
            <h5 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Top Movie Genres</h5>
            <ul className="space-y-1.5 text-[11px] list-none p-0 opacity-80">
              <li><a href="#genre" className="hover:text-amber-500 transition-colors">Action Blockbusters</a></li>
              <li><a href="#genre" className="hover:text-amber-500 transition-colors">Sci-Fi Adventures</a></li>
              <li><a href="#genre" className="hover:text-amber-500 transition-colors">Comedy Entertaining</a></li>
            </ul>
          </div>
        </div>

        {/* Download App Channels Integration Display Column */}
        <div className="md:col-span-4 space-y-3 lg:pl-12">
          <h5 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Download App Channels</h5>
          <p className="text-[11px] leading-relaxed opacity-70 font-medium">Secure the synchronized native dashboard utility for automated real-time alerts.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a href="#playstore" className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
              isDarkMode ? "bg-white/[0.02] border-white/10 hover:border-white/20" : "bg-white border-stone-200 hover:bg-stone-50"
            }`}>
              <Smartphone size={15} className="text-amber-500" />
              <div className="text-left font-mono">
                <span className="block text-[8px] opacity-50 uppercase leading-none">GET IT ON</span>
                <span className="text-[11px] font-black tracking-tight block mt-0.5 text-slate-300">Google Play</span>
              </div>
            </a>
            <a href="#appstore" className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${
              isDarkMode ? "bg-white/[0.02] border-white/10 hover:border-white/20" : "bg-white border-stone-200 hover:bg-stone-50"
            }`}>
              <Smartphone size={15} className="text-amber-500" />
              <div className="text-left font-mono">
                <span className="block text-[8px] opacity-50 uppercase leading-none">DOWNLOAD ON THE</span>
                <span className="text-[11px] font-black tracking-tight block mt-0.5 text-slate-300">App Store</span>
              </div>
            </a>
          </div>
        </div>

      </div>

      {/* --- SECTION 4: PRIMARY BRAND BLOCK & COPYRIGHT --- */}
      <div className={`border-t py-10 transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950 border-white/[0.04]" : "bg-stone-100/40 border-stone-200"
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center justify-center shadow-[0_4px_12px_rgba(218,165,32,0.15)] border border-amber-400/20">
                <Clapperboard size={18} className="text-stone-950 fill-stone-950/10" strokeWidth={2.5} />
              </span>
              <span className={`font-display text-xl font-black tracking-tight ${
                isDarkMode ? "text-white" : "text-stone-900"
              }`}>
                Showx <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent text-[10px] font-black tracking-widest uppercase align-middle ml-1.5">— The CinemaHub</span>
              </span>
            </div>
            <p className="text-stone-500/90 max-w-sm text-[11px]">Your premium gateway to next-generation cinematic ticket booking.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 font-semibold tracking-wide">
            
            {/* Social Channels Network Icons Map */}
            <div className="flex gap-2">
              {[
                { icon: <Globe size={14} />, label: "Facebook" },
                { icon: <Link2 size={14} />, label: "Twitter" },
                { icon: <Camera size={14} />, label: "Instagram" },
                { icon: <Film size={14} />, label: "Youtube" },
                { icon: <MessageSquare size={14} />, label: "Linkedin" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={`#${social.label.toLowerCase()}`} 
                  aria-label={social.label} 
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm ${
                    isDarkMode 
                      ? "bg-white/[0.02] border-white/[0.05] text-slate-400 hover:border-amber-500/40 hover:text-amber-500" 
                      : "bg-white border-stone-200 text-stone-600 hover:border-amber-500/40 hover:text-amber-600 hover:bg-amber-500/5"
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <p className={`font-mono text-[11px] font-medium ${isDarkMode ? "text-slate-600" : "text-stone-400"}`}>
              &copy; 2026 Showx Hub. Built with React & Tailwind.
            </p>
          </div>
        </div>
      </div>
      
    </footer>
  );
}