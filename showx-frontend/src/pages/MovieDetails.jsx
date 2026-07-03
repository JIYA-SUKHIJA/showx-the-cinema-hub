// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, MapPin, Film, Share2, Heart, Award, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchItemById } from '../services/api';

export default function MovieDetails() {
  const { movieId, streamId, eventId, playId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const activeId = movieId || streamId || eventId || playId;

  useEffect(() => {
    if (activeId) {
      setLoading(true);
      fetchItemById(activeId).then((data) => {
        setItem(data);
        setLoading(false);
      });
    }
  }, [activeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-xs font-mono font-bold uppercase tracking-widest text-amber-500 animate-pulse">
        Fetching Structural Briefing Context...
      </div>
    );
  }

  if (!item) return <div className="text-center p-20 text-slate-400">Briefing element node not found.</div>;

  return (
    <div className={`space-y-12 pb-16 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
      
      {/* --- CINEMATIC HERO BACKDROP CONTEXT BANNER --- */}
      <div className="relative w-full rounded-[32px] overflow-hidden bg-slate-950 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-25 filter blur-xl scale-110 pointer-events-none">
          <img src={item.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600"} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />

        <div className="relative z-20 max-w-[1440px] mx-auto px-8 py-12 md:py-20 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Card Poster Asset Block */}
          <div className="w-56 h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-slate-900">
            <img src={item.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600"} alt={item.title} className="w-full h-full object-cover" />
          </div>

          {/* Metadata Descriptions */}
          <div className="flex-grow space-y-6 text-center md:text-left">
            <span className="inline-block px-3 py-1 text-[9px] font-black tracking-widest uppercase bg-amber-500 text-stone-950 rounded-md shadow-md">
              {item.tag || item.type}
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-display tracking-tight text-white leading-tight">
              {item.title}
            </h1>

            {/* Live Interaction Ratings Bar Wrapper */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md text-amber-400">
                <Star size={14} className="fill-current" /> {item.rating} / 10 Interest Metric
              </div>
              <div className="text-slate-400 flex items-center gap-4">
                <span>{item.genre}</span>
                <span className="opacity-30">•</span>
                <span>{item.language || 'Hindi'}</span>
              </div>
            </div>

            {/* Run Parameters or Address Logs depending on context matching */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-300">
              {item.venue ? (
                <>
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-amber-500" /> {item.venue}</span>
                  <span className="flex items-center gap-1"><Calendar size={13} className="text-amber-500" /> {item.date}</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1"><Clock size={13} className="text-amber-500" /> {item.duration || '130 min'}</span>
                  <span className="flex items-center gap-1"><Film size={13} className="text-amber-500" /> {item.format || '4K Stream'}</span>
                </>
              )}
            </div>

            {/* Primary Booking Trigger */}
            <div className="pt-4 flex flex-wrap justify-center md:justify-start items-center gap-4">
              <button
                onClick={() => navigate(item.type === 'stream' ? '/checkout' : `/booking/${item.id}/shows`)}
                className="px-8 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-xl hover:shadow-amber-500/10 transition-transform active:scale-95 cursor-pointer"
              >
                {item.type === 'stream' ? "Rent Stream Now" : "Book Live Sessions"}
              </button>
              <div className="flex gap-2">
                <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white cursor-pointer"><Heart size={15} /></button>
                <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-white cursor-pointer"><Share2 size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- DETAIL BRIEFINGS MATRIX SECTION BLOCK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column Description Contexts */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">About the listing</h3>
            <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-stone-600"}`}>
              {item.description || "No supplemental brief logs mapped across current localized catalog clusters. Content features certified premium performance matrices."}
            </p>
          </div>

          <hr className={isDarkMode ? "border-white/[0.05]" : "border-slate-100"} />

          {/* Cast Listing Module Context */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tight">Top Performance Profiles (Cast)</h3>
            <div className="flex flex-wrap gap-6">
              {(item.cast || [{ name: 'Industry Artist', role: 'Performer', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150' }]).map((actor, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-500/5 border border-slate-500/10 p-2.5 rounded-2xl w-48 shadow-sm">
                  <img src={actor.img} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-black truncate">{actor.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold tracking-wide">{actor.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Promotional Blocks Offer Units */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-white/[0.01] border-white/[0.05]" : "bg-stone-50 border-stone-200"}`}>
            <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 mb-4">
              <Award size={15} className="text-amber-500" /> Premium Hub Offers
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                <p className="font-black text-amber-500 flex items-center gap-1">
                  <ShieldCheck size={12} /> HDFC Bank Credit Offer
                </p>
                <p className="text-slate-400 font-medium leading-relaxed">Get 20% instant liquidity reduction up to ₹150 on transactional workflows.</p>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                <p className="font-black text-amber-500 flex items-center gap-1">
                  <ShieldCheck size={12} /> Stream Access Discount Pass
                </p>
                <p className="text-slate-400 font-medium leading-relaxed">Rent digital assets using local codes for zero convenience fee processing limits.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}