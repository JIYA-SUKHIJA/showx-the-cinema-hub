// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound({ title = "Screening Block Offline", message = "The link structure or cinema node configuration you requested doesn't exist or was updated." }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto text-center bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] rounded-[32px] p-8 md:p-10 shadow-2xl mt-16 space-y-6 relative">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-amber-500" />
      
      <div className="w-16 h-16 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
        <AlertCircle size={26} strokeWidth={2.2} />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-display font-black tracking-tight text-white">
          {title}
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-xs mx-auto">
          {message}
        </p>
      </div>

      <div className="pt-4">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-white text-slate-950 hover:bg-amber-500 hover:text-slate-950 font-black tracking-wide text-xs uppercase py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-md"
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Return to Dashboard Home
        </button>
      </div>
    </div>
  );
}