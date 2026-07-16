// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function NotFound({ title = "Screening Block Offline", message = "The link structure or cinema node configuration you requested doesn't exist or was updated." }) {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  // Hardware-accelerated entrance styles configuration
  const errorKeyframeStyles = `
    @keyframes errorFadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-error-up {
      animation: errorFadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  return (
    <div className="max-w-md mx-auto text-center bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] rounded-[32px] p-8 md:p-10 shadow-2xl mt-16 space-y-6 relative animate-error-up">
      <style>{errorKeyframeStyles}</style>
      <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500 rounded-t-[32px]" />
      
      {/* Icon Box Container with premium scale triggers */}
      <div className="w-16 h-16 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-sm transform hover:scale-105 transition-transform duration-300">
        <AlertCircle size={26} strokeWidth={2.2} className="animate-pulse" style={{ animationDuration: '3s' }} />
      </div>
      
      {/* Typography with complete support for white premium lighting rules */}
      <div className="space-y-2 select-none">
        <h2 className={`text-xl font-display font-black tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
          {title}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-semibold max-w-xs mx-auto">
          {message}
        </p>
      </div>

      {/* Control Triggers Deck Element */}
      <div className="pt-4">
        <motion.button
          whileHover={{ scale: 1.01, filter: "brightness(1.05)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/')}
          className={`w-full font-black tracking-widest text-xs uppercase py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md border-none min-h-[44px] ${
            isDarkMode
              ? "bg-white text-slate-950 hover:bg-amber-500"
              : "bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-950"
          }`}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Return to Dashboard Home
        </motion.button>
      </div>
    </div>
  );
}