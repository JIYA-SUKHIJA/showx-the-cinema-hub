// src/components/organisms/Footer.jsx
import React from 'react';
import { 
  Clapperboard, Link2, MessageCircle, Camera, 
  Tent, Headphones, MailCheck, RefreshCcw 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { isDarkMode } = useTheme();

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

      {/* --- SECTION 2: CUSTOMER CARE & UTILITY UTILITIES --- */}
      <div className={`border-b transition-colors duration-300 ${
        isDarkMode ? "bg-slate-950/20 border-white/[0.04]" : "bg-stone-50/40 border-stone-100"
      }`}>
        <div className="max-w-[1440px] mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
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
            <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "text-slate-400 group-hover:text-white" : "text-stone-500 group-hover:text-stone-900"}`}>Resend Booking Confirmation</span>
          </a>

          <a href="#newsletter" className="flex flex-col items-center gap-2 group cursor-pointer">
            <span className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
              isDarkMode ? "bg-white/[0.01] border-white/[0.05] text-slate-400 group-hover:text-amber-500 group-hover:border-amber-500/30" : "bg-white border-stone-200 text-stone-600 group-hover:text-amber-600 group-hover:border-amber-600/30"
            }`}>
              <MailCheck size={19} strokeWidth={1.8} />
            </span>
            <span className={`text-[10px] font-black tracking-widest uppercase ${isDarkMode ? "text-slate-400 group-hover:text-white" : "text-stone-500 group-hover:text-stone-900"}`}>Subscribe to the Newsletter</span>
          </a>
        </div>
      </div>

      {/* --- SECTION 3: EXPANSIVE SEO NAVIGATION LINKS MATRIX --- */}
      <div className="max-w-[1440px] mx-auto px-6 py-12 space-y-8 font-medium">
        
        {/* Row 1: Now Showing */}
        <div className="space-y-2">
          <h4 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Movies Now Showing in Delhi-NCR</h4>
          <p className="leading-relaxed opacity-80 text-[11px] space-x-2">
            {['Alpha', 'Welcome To The Jungle', 'Minions & Monsters', 'Adventure of Jetcat 7D', 'Main Vaapas Aaunga', 'Cocktail 2', 'Carry on Jatta 4'].map((m, i) => (
              <React.Fragment key={m}>
                <a href="#movie" className="hover:text-amber-500 transition-colors">{m}</a>
                {i < 6 && <span className="opacity-30">|</span>}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Row 2: Upcoming Options */}
        <div className="space-y-2">
          <h4 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Upcoming Movies Per Week</h4>
          <p className="leading-relaxed opacity-80 text-[11px] space-x-2">
            {['Upcoming Movies Today', 'Upcoming Movies Tomorrow', 'Upcoming Movies This Weekend'].map((t, i) => (
              <React.Fragment key={t}>
                <a href="#time" className="hover:text-amber-500 transition-colors">{t}</a>
                {i < 2 && <span className="opacity-30">|</span>}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Row 3: Genres */}
        <div className="space-y-2">
          <h4 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Movies By Genre</h4>
          <p className="leading-relaxed opacity-80 text-[11px] space-x-2">
            {['Drama Movies', 'Action Movies', 'Adventure Movies', 'Thriller Movies', 'Comedy Movies', 'Sci-Fi Movies', 'Romantic Movies', 'Horror Movies'].map((g, i) => (
              <React.Fragment key={g}>
                <a href="#genre" className="hover:text-amber-500 transition-colors">{g}</a>
                {i < 7 && <span className="opacity-30">|</span>}
              </React.Fragment>
            ))}
          </p>
        </div>

        {/* Row 4: Languages */}
        <div className="space-y-2">
          <h4 className={`text-[10px] font-black tracking-wider uppercase ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>Movies By Language</h4>
          <p className="leading-relaxed opacity-80 text-[11px] space-x-2">
            {['Movies in English', 'Movies in Hindi', 'Movies in Telugu', 'Movies in Tamil', 'Movies in Malayalam', 'Movies in Kannada', 'Movies in Bengali'].map((l, i) => (
              <React.Fragment key={l}>
                <a href="#lang" className="hover:text-amber-500 transition-colors">{l}</a>
                {i < 6 && <span className="opacity-30">|</span>}
              </React.Fragment>
            ))}
          </p>
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
            <div className="flex gap-6">
              <a href="#" className={`transition-colors duration-200 ${isDarkMode ? "text-slate-400 hover:text-gold" : "text-stone-600 hover:text-amber-600"}`}>
                Privacy Policy
              </a>
              <span className={isDarkMode ? "text-white/10" : "text-stone-300"}>•</span>
              <a href="#" className={`transition-colors duration-200 ${isDarkMode ? "text-slate-400 hover:text-gold" : "text-stone-600 hover:text-amber-600"}`}>
                Terms of Service
              </a>
            </div>
            
            <div className="flex gap-3">
              {[
                { icon: <Link2 size={15} />, label: "Website" },
                { icon: <MessageCircle size={15} />, label: "Contact" },
                { icon: <Camera size={15} />, label: "Gallery" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href="#" 
                  aria-label={social.label} 
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-sm ${
                    isDarkMode 
                      ? "bg-white/[0.02] border-white/[0.05] text-slate-400 hover:border-gold/40 hover:text-gold" 
                      : "bg-white border-stone-200 text-stone-600 hover:border-amber-500/40 hover:text-amber-600 hover:bg-amber-500/5"
                  }`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <p className={`font-mono text-[11px] font-medium ${isDarkMode ? "text-slate-600" : "text-stone-400"}`}>
              &copy; 2026 Showx. Built with React & Tailwind.
            </p>
          </div>
        </div>
      </div>
      
    </footer>
  );
}