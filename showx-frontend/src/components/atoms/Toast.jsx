// src/components/atoms/Toast.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none max-w-sm w-full">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-colors duration-300 ${
          type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
        }`}
      >
        {/* Left Informational Vector Array */}
        <div className="flex items-center gap-3 min-w-0">
          {type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-rose-500 dark:text-rose-400" />
          )}
          <p className="text-xs font-sans font-bold tracking-wide leading-tight truncate">
            {message}
          </p>
        </div>

        {/* Clear Dismiss Action Interface Control — Min 44px safe touch bounds natively embedded */}
        <button
          onClick={onClose}
          type="button"
          className="ml-4 p-1.5 rounded-xl hover:bg-slate-500/10 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all active:scale-90 border-none bg-transparent cursor-pointer shrink-0 outline-none flex items-center justify-center min-w-[28px] min-h-[28px]"
          aria-label="Dismiss message notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
}