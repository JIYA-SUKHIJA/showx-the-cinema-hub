// src/components/organisms/SearchModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Clock, Flame, Film, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'; // Dynamic theme listener connection to ensure white premium alignment
import axiosInstance from '../../services/axiosInstance';

const TRENDING_MOVIES = [
  { id: 1, title: "Welcome To The Jungle", genre: "Comedy • Adventure", rating: "8.4" },
  { id: 2, title: "Main Vaapas Aaunga", genre: "Drama • Musical", rating: "9.1" },
  { id: 3, title: "Project Hail Mary", genre: "Science Fiction", rating: "8.8" }
];

export default function SearchModal({ isOpen, onClose, onSearchSubmit }) {
  const { isDarkMode } = useTheme(); // Reading absolute application theme status
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('showx_search_history');
    return saved ? JSON.parse(saved) : ["Imtiaz Ali", "Jungle", "Concerts"];
  });
  
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axiosInstance.get(`/movies?search=${encodeURIComponent(query)}`);
        const results = (res.data.movies || []).map((m) => ({
          id: m._id,
          title: m.title,
          year: m.releaseDate ? new Date(m.releaseDate).getFullYear() : '',
          type: m.type || 'movie',
        }));
        setSuggestions(results);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleKeyDown = (e) => {
    const totalItems = suggestions.length + history.length + TRENDING_MOVIES.length;
    if (totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % totalItems);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        let flatList = [...suggestions.map(s => s.title), ...history, ...TRENDING_MOVIES.map(t => t.title)];
        executeSearch(flatList[activeIndex]);
      } else if (query.trim()) {
        executeSearch(query);
      }
    }
  };

  const executeSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    const updatedHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('showx_search_history', JSON.stringify(updatedHistory));
    
    setQuery(searchQuery);
    if (onSearchSubmit) onSearchSubmit(searchQuery);
    onClose();
  };

  const clearHistoryItem = (e, itemToDelete) => {
    e.stopPropagation();
    const updatedHistory = history.filter(item => item !== itemToDelete);
    setHistory(updatedHistory);
    localStorage.setItem('showx_search_history', JSON.stringify(updatedHistory));
  };

  if (!isOpen) return null;

  // Pure hardware-accelerated command menu transitions definitions
  const commandMenuStyles = `
    @keyframes modalBackdropFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes commandMenuScaleUp {
      from { opacity: 0; transform: translateY(-12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-menu-backdrop {
      animation: modalBackdropFade 0.25s ease-out both;
    }
    .animate-menu-panel {
      animation: commandMenuScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-md flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 animate-menu-backdrop">
      <style>{commandMenuStyles}</style>
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Structural Wrapper Container — Seamless Dark/Light Synchronization */}
      <div 
        ref={containerRef}
        className={`relative w-full max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-menu-panel mt-2 sm:mt-0 max-h-[92vh] sm:max-h-[85vh] border transition-colors duration-300 ${
          isDarkMode 
            ? "bg-slate-900 border-white/10 shadow-black/80" 
            : "bg-white border-slate-200/90 shadow-[0_30px_70px_-15px_rgba(59,130,246,0.22)]"
        }`}
      >
        {/* Search Input Bar Area */}
        <div className={`flex items-center gap-2 px-3.5 py-3 sm:px-4 sm:py-3.5 border-b min-h-[48px] sm:min-h-[56px] shrink-0 transition-colors duration-300 ${
          isDarkMode ? "border-white/5 bg-slate-900/50" : "border-slate-100 bg-slate-50/40"
        }`}>
          <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, venues, events..."
            className={`w-full bg-transparent border-none text-xs sm:text-sm focus:outline-none focus:ring-0 outline-none p-0 font-sans font-semibold ${
              isDarkMode ? "text-white placeholder-slate-500" : "text-slate-800 placeholder-slate-400"
            }`}
          />

          {isLoading ? (
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
          ) : query ? (
            <button 
              onClick={() => { setQuery(""); setSuggestions([]); }}
              type="button"
              className={`p-1 rounded-md cursor-pointer border-none bg-transparent focus:outline-none shrink-0 transition-colors ${
                isDarkMode ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Content List Area */}
        <div className="overflow-y-auto p-3.5 sm:p-4 space-y-5 sm:space-y-6 no-scrollbar flex-grow">
          
          {query.trim().length >= 2 && suggestions.length > 0 && (
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-mono font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2 px-1 sm:px-2 select-none">Suggestions</h4>
              <div className="space-y-0.5">
                {suggestions.map((item, idx) => {
                  const isCurrentActive = activeIndex === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => executeSearch(item.title)}
                      className={`flex items-center justify-between px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl cursor-pointer transition-all duration-200 w-full overflow-hidden gap-2 ${
                        isCurrentActive 
                          ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/10" 
                          : isDarkMode ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-grow">
                        <Film className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isCurrentActive ? "text-stone-950" : "text-slate-400"}`} />
                        <span className="text-xs sm:text-sm font-semibold truncate">{item.title}</span>
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-mono tracking-wider font-black uppercase shrink-0 px-1.5 py-0.5 rounded ${
                        isCurrentActive 
                          ? "bg-stone-950/20 text-stone-950" 
                          : isDarkMode ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {query.trim().length < 2 && (
            <>
              {history.length > 0 && (
                <div>
                  <h4 className="text-[10px] sm:text-[11px] font-mono font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2 px-1 sm:px-2 select-none">Recent Searches</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 px-0.5">
                    {history.map((item, idx) => {
                      const computedIndex = suggestions.length + idx;
                      const isCurrentActive = activeIndex === computedIndex;
                      return (
                        <div
                          key={idx}
                          onClick={() => executeSearch(item)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold cursor-pointer transition-all border max-w-full overflow-hidden shadow-sm ${
                            isCurrentActive 
                              ? "bg-amber-500 text-stone-950 border-amber-500" 
                              : isDarkMode 
                                ? "bg-white/5 text-slate-300 border-white/5 hover:border-white/20" 
                                : "bg-slate-50 text-slate-600 border-slate-200/60 hover:border-slate-300 hover:bg-slate-100/50"
                          }`}
                        >
                          <Clock className="w-3 h-3 shrink-0 opacity-70" />
                          <span className="truncate max-w-[144px] sm:max-w-none">{item}</span>
                          <button
                            onClick={(e) => clearHistoryItem(e, item)}
                            type="button"
                            className={`p-0.5 rounded-full hover:bg-black/10 border-none bg-transparent cursor-pointer transition-colors shrink-0 focus:outline-none ${
                              isCurrentActive ? "text-stone-950" : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            }`}
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-[10px] sm:text-[11px] font-mono font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2 px-1 sm:px-2 flex items-center gap-1 select-none">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10 animate-pulse" /> Trending Searches
                </h4>
                <div className="space-y-0.5">
                  {TRENDING_MOVIES.map((item, idx) => {
                    const computedIndex = suggestions.length + history.length + idx;
                    const isCurrentActive = activeIndex === computedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => executeSearch(item.title)}
                        className={`flex items-center justify-between px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl cursor-pointer transition-all duration-200 w-full overflow-hidden gap-2 ${
                          isCurrentActive 
                            ? "bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/10" 
                            : isDarkMode ? "hover:bg-white/5 text-slate-200" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="min-w-0 flex-grow">
                          <p className={`text-xs sm:text-sm font-black truncate ${isCurrentActive ? "text-stone-950" : isDarkMode ? "text-white" : "text-slate-800"}`}>{item.title}</p>
                          <p className={`text-[10px] font-medium mt-0.5 ${isCurrentActive ? "text-stone-950/80" : "text-slate-400 dark:text-slate-500"}`}>{item.genre}</p>
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-black font-mono shrink-0 px-2 py-0.5 rounded ${
                          isCurrentActive ? "bg-stone-950 text-amber-400" : "bg-amber-500/5 text-amber-500"
                        }`}>
                          ★ {item.rating}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {query.trim().length >= 2 && suggestions.length === 0 && !isLoading && (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-medium select-none">
              No results discovered matching "{query}"
            </div>
          )}

        </div>

        {/* Lower Key Shortcuts Deck Panel */}
        <div className={`hidden sm:flex items-center justify-between px-4 py-2 text-[10px] font-mono font-bold shrink-0 select-none border-t transition-colors duration-300 ${
          isDarkMode ? "bg-slate-950/40 border-white/5 text-slate-500" : "bg-slate-50/80 border-slate-100 text-slate-400"
        }`}>
          <div className="flex gap-4">
            <span><kbd className={`px-1.5 py-0.5 rounded border shadow-sm mr-1 ${isDarkMode ? "bg-slate-800 border-white/5 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>↑↓</kbd> Navigate</span>
            <span><kbd className={`px-1.5 py-0.5 rounded border shadow-sm mr-1 ${isDarkMode ? "bg-slate-800 border-white/5 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>Enter</kbd> Select</span>
          </div>
          <span><kbd className={`px-1.5 py-0.5 rounded border shadow-sm mr-1 ${isDarkMode ? "bg-slate-800 border-white/5 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>Esc</kbd> Close</span>
        </div>

      </div>
    </div>,
    document.body
  );
}