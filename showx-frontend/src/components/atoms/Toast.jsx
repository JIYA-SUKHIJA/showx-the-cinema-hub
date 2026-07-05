import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none max-w-sm w-full">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md shadow-2xl ${
          type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}
      >
        <div className="flex items-center gap-3">
          {type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-xs font-bold tracking-wide">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
}