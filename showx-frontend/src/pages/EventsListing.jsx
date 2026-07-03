// src/pages/EventsListing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Calendar, MapPin, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EventsListing() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');

  // Expanded premium local event listings database with explicit structural parameters
  const events = [
    { 
      id: 'e1', 
      title: 'Unplugged Music Festival', 
      loc: 'Open Air Arena Stadium', 
      date: 'July 18, 2026', 
      price: 'From ₹499', 
      category: 'Concerts',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', 
      badge: 'Selling Fast' 
    },
    { 
      id: 'e2', 
      title: 'Elite Standup Special', 
      loc: 'Central Auditorium Hall', 
      date: 'July 22, 2026', 
      price: 'From ₹299', 
      category: 'Comedy',
      img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=600&auto=format&fit=crop', 
      badge: 'Trending' 
    },
    { 
      id: 'e3', 
      title: 'AI Developer Hack Summit', 
      loc: 'Tech Hub Convention Complex', 
      date: 'Aug 02, 2026', 
      price: 'Registration Free', 
      category: 'Summits',
      img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', 
      badge: 'Exclusive' 
    },
    { 
      id: 'e4', 
      title: 'Sunburn Arena ft. Alan Walker', 
      loc: 'Huda Leisure Ground, Gurugram', 
      date: 'Oct 14, 2026', 
      price: 'From ₹999', 
      category: 'Concerts',
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', 
      badge: 'Almost Full' 
    },
    { 
      id: 'e5', 
      title: 'Zakir Khan Live', 
      loc: 'Sirifort Theatre Auditorium', 
      date: 'Dec 05, 2026', 
      price: 'From ₹699', 
      category: 'Comedy',
      img: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=600&auto=format&fit=crop', 
      badge: 'Must Watch' 
    },
    { 
      id: 'e6', 
      title: 'Global Tech & Innovation Summit', 
      loc: 'Convention Center, Pragati Maidan', 
      date: 'Nov 12, 2026', 
      price: 'Pass Required', 
      category: 'Summits',
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop', 
      badge: 'Premium Exclusive' 
    }
  ];

  const categories = ['All', 'Concerts', 'Comedy', 'Summits'];

  const filteredEvents = activeCategory === 'All' 
    ? events 
    : events.filter(event => event.category === activeCategory);

  const handleEventClick = (eventId) => {
    // Dynamic Programmatic route initialization line targeting src/App.jsx configuration
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="space-y-12 font-sans antialiased max-w-[1440px] mx-auto px-6 py-4">
      {/* Premium Hero Banner */}
      <div className={`relative rounded-[32px] overflow-hidden p-8 md:p-14 border shadow-xl transition-all duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-br from-slate-950 via-[#160e10] to-slate-950 border-white/[0.04]" 
          : "bg-gradient-to-br from-[#faf8f5] via-[#f7f2ed] to-[#ede4dc] border-stone-200/80"
      }`}>
        <div className={`absolute inset-0 pointer-events-none z-0 ${
          isDarkMode ? "bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.06)_0%,transparent_65%)]" : "bg-[radial-gradient(circle_at_center,rgba(230,57,70,0.1)_0%,transparent_65%)]"
        }`} />
        <div className="max-w-xl space-y-4 relative z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${
            isDarkMode ? "bg-amber-500/10 text-gold border-gold/20" : "bg-amber-500/5 text-amber-800 border-amber-500/20"
          }`}>
            <Compass size={12} /> Live Experiences
          </span>
          <h1 className={`text-4xl md:text-5xl font-display font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-stone-900"}`}>
            Unforgettable Events, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Happening Near You</span>
          </h1>
          <p className={`text-xs md:text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-stone-600/90"}`}>
            Discover performance venues, global live performance conventions, and secure verified entry passes smoothly through our ticketing node grid architecture.
          </p>
        </div>
      </div>

      {/* Grid Controls Canvas Header Segment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <h2 className={`text-xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>Trending Live Experiences</h2>
        </div>

        {/* Dynamic Categorization Controls */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide border cursor-pointer transition-all active:scale-95 ${
                activeCategory === cat
                  ? "bg-amber-500 text-slate-950 border-transparent shadow-md"
                  : isDarkMode
                    ? "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                    : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
        
      {/* Grid Content Deployment Canvas */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.01, y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={() => handleEventClick(event.id)}
              className={`border rounded-2xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full relative cursor-pointer ${
                isDarkMode ? "bg-gradient-to-b from-white/[0.03] to-white/[0.01] border-white/[0.05]" : "bg-white border-stone-200"
              }`}
            >
              <div className="aspect-[16/10] bg-slate-950 overflow-hidden relative">
                <img src={event.img} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                
                {/* Visual Status Tag Overlays */}
                <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded border border-white/10 shadow-md z-10 font-mono">
                  {event.badge}
                </span>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-amber-500 text-[10px] font-black font-mono shadow-md z-10">
                  <Calendar size={11} /> {event.date}
                </div>
              </div>

              <div className={`p-5 flex-grow flex flex-col justify-between space-y-4 ${isDarkMode ? "bg-slate-900/10" : "bg-stone-50/40"}`}>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider block">
                    {event.category}
                  </span>
                  <h3 className={`font-display font-black text-lg group-hover:text-amber-500 transition-colors line-clamp-1 ${isDarkMode ? "text-white" : "text-stone-800"}`}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <MapPin size={12} className="text-amber-600 shrink-0" /> {event.loc}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between gap-4">
                  <span className="text-xs font-mono font-black text-amber-500 flex items-center gap-0.5">
                    <Tag size={12} /> {event.price}
                  </span>
                  <button className={`px-4 py-2 font-black text-xs rounded-xl transition-all active:scale-95 cursor-pointer shadow-sm flex items-center gap-1 shrink-0 ${
                    isDarkMode ? "bg-white text-slate-950 hover:bg-amber-600 hover:text-white" : "bg-stone-950 text-white hover:bg-amber-600"
                  }`}>
                    Book Now <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}