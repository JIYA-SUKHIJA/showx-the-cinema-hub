// src/components/organisms/SearchModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Clock, Flame, Film, Loader2 } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

const TRENDING_MOVIES = [
  { id: 1, title: "Welcome To The Jungle", genre: "Comedy • Adventure", rating: "8.4" },
  { id: 2, title: "Main Vaapas Aaunga", genre: "Drama • Musical", rating: "9.1" },
  { id: 3, title: "Project Hail Mary", genre: "Science Fiction", rating: "8.8" }
];

export default function SearchModal({ isOpen, onClose, onSearchSubmit }) {
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

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Structural Wrapper Container — Managed dynamic max height dimensions relative to viewports to prevent overflow */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 mt-2 sm:mt-0 max-h-[92vh] sm:max-h-[85vh]"
      >
        {/* Search Input Bar Area */}
        <div className="flex items-center gap-2 px-3.5 py-3 sm:px-4 sm:py-3.5 border-b border-white/5 bg-slate-900/50 min-h-[48px] sm:min-h-[56px] shrink-0">
          <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Search movies, venues, events..."
            className="w-full bg-transparent border-none text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-0 outline-none p-0"
          />

          {isLoading ? (
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
          ) : query ? (
            <button 
              onClick={() => { setQuery(""); setSuggestions([]); }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer border-none bg-transparent focus:outline-none shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Content List Area — Handled flexible scrolling thresholds dynamically */}
        <div className="overflow-y-auto p-3.5 sm:p-4 space-y-5 sm:space-y-6 scrollbar-none sm:scrollbar-thin sm:scrollbar-thumb-white/10 flex-grow">
          
          {query.trim().length >= 2 && suggestions.length > 0 && (
            <div>
              <h4 className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-500 uppercase mb-2 px-1 sm:px-2">Suggestions</h4>
              <div className="space-y-0.5">
                {suggestions.map((item, idx) => {
                  const isCurrentActive = activeIndex === idx;
                  return (
                    <div
                      key={item.id}
                      onClick={() => executeSearch(item.title)}
                      className={`flex items-center justify-between px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl cursor-pointer transition-colors w-full overflow-hidden gap-2 ${
                        isCurrentActive ? "bg-amber-500 text-stone-950" : "hover:bg-white/5 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-grow">
                        <Film className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isCurrentActive ? "text-stone-950" : "text-slate-400"}`} />
                        <span className="text-xs sm:text-sm font-medium truncate">{item.title}</span>
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-mono tracking-wider font-bold uppercase shrink-0 px-1.5 py-0.5 rounded ${
                        isCurrentActive ? "bg-stone-950/20 text-stone-950" : "bg-white/5 text-slate-400"
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
                  <h4 className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-500 uppercase mb-2 px-1 sm:px-2">Recent Searches</h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 px-0.5">
                    {history.map((item, idx) => {
                      const computedIndex = suggestions.length + idx;
                      const isCurrentActive = activeIndex === computedIndex;
                      return (
                        <div
                          key={idx}
                          onClick={() => executeSearch(item)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold cursor-pointer transition-colors border max-w-full overflow-hidden ${
                            isCurrentActive 
                              ? "bg-amber-500 text-stone-950 border-amber-500" 
                              : "bg-white/5 text-slate-300 border-white/5 hover:border-white/20"
                          }`}
                        >
                          <Clock className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px] sm:max-w-none">{item}</span>
                          <button
                            onClick={(e) => clearHistoryItem(e, item)}
                            className={`p-0.5 rounded-full hover:bg-black/20 border-none bg-transparent cursor-pointer transition-colors shrink-0 focus:outline-none ${
                              isCurrentActive ? "text-stone-950" : "text-slate-400 hover:text-white"
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
                <h4 className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-500 uppercase mb-2 px-1 sm:px-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> Trending Searches
                </h4>
                <div className="space-y-0.5">
                  {TRENDING_MOVIES.map((item, idx) => {
                    const computedIndex = suggestions.length + history.length + idx;
                    const isCurrentActive = activeIndex === computedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => executeSearch(item.title)}
                        className={`flex items-center justify-between px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl cursor-pointer transition-colors w-full overflow-hidden gap-2 ${
                          isCurrentActive ? "bg-amber-500 text-stone-950" : "hover:bg-white/5 text-slate-200"
                        }`}
                      >
                        <div className="min-w-0 flex-grow">
                          <p className="text-xs sm:text-sm font-bold truncate text-white group-hover:text-amber-500">{item.title}</p>
                          <p className={`text-[10px] mt-0.5 ${isCurrentActive ? "text-stone-950/80" : "text-slate-400"}`}>{item.genre}</p>
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-black font-mono shrink-0 px-2 py-0.5 rounded ${
                          isCurrentActive ? "bg-stone-950 text-amber-400" : "bg-white/5 text-amber-400"
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
            <div className="text-center py-8 text-slate-500 text-xs font-medium">
              No results discovered matching "{query}"
            </div>
          )}

        </div>

        {/* Lower Key Shortcuts Deck Panel — Auto hidden on small screen sizes to maximize vertical view space */}
        <div className="hidden sm:flex items-center justify-between px-4 py-2 bg-slate-950/40 border-t border-white/5 text-[10px] font-medium text-slate-500 shrink-0">
          <div className="flex gap-4">
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-white/5 text-slate-400 shadow-sm mr-1">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-white/5 text-slate-400 shadow-sm mr-1">Enter</kbd> Select</span>
          </div>
          <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-white/5 text-slate-400 shadow-sm mr-1">Esc</kbd> Close</span>
        </div>

      </div>
    </div>,
    document.body
  );
}