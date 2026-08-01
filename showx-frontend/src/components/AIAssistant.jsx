// src/components/AIAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, Star, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sendAIChatMessage } from '../services/api';
import { optimizeImage } from '../utils/optimizeImage';

const SUGGESTED_PROMPTS = [
  { emoji: '🔥', label: 'Trending', prompt: 'What movies are trending right now?' },
  { emoji: '😱', label: 'Horror', prompt: 'Recommend horror movies' },
  { emoji: '😂', label: 'Comedy', prompt: 'Suggest funny movies' },
  { emoji: '👨‍👩‍👧', label: 'Family', prompt: 'Best family movies' },
  { emoji: '⭐', label: 'Top Rated', prompt: 'Top rated movies right now' },
  { emoji: '🎥', label: 'Under 2hrs', prompt: 'Movies under 2 hours' },
];

export default function AIAssistant() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm ShowX AI. Ask me for movie recommendations, plot summaries, or booking help.", movies: [] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (overrideText) => {
    const trimmed = (overrideText || input).trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed, movies: [] }]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendAIChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply, movies: data.movies || [] }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || "AI Assistant is temporarily unavailable. Please try again later.";
      setMessages((prev) => [...prev, { role: 'assistant', text: errMsg, movies: [] }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBookNow = (movieId) => {
    setIsOpen(false);
    navigate(`/booking/${movieId}/shows`);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 text-stone-950 shadow-xl flex items-center justify-center cursor-pointer border-none outline-none active:scale-95 transition-transform"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed bottom-20 right-3 left-3 sm:left-auto sm:right-6 z-[90] sm:w-[90vw] w-auto max-w-sm h-[65vh] sm:h-[70vh] max-h-[560px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
          isDarkMode ? "bg-slate-950 border-white/10" : "bg-white border-slate-200"
        }`}>
          {/* Header */}
          <div className={`p-4 border-b flex items-center gap-2 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
            <Sparkles size={16} className="text-amber-500" />
            <span className={`text-sm font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>ShowX AI Assistant</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? "bg-amber-500 text-stone-950 font-semibold"
                    : isDarkMode ? "bg-white/5 text-slate-200" : "bg-slate-100 text-slate-800"
                }`}>
                  {msg.text}
                </div>

                {/* Movie cards, if this assistant reply mentioned real movies */}
                {msg.movies && msg.movies.length > 0 && (
                  <div className="w-full max-w-[92%] mt-2 space-y-2">
                    {msg.movies.map((movie) => (
                      <div
                        key={movie.id}
                        className={`flex gap-2.5 p-2 rounded-xl border ${
                          isDarkMode ? "bg-white/[0.03] border-white/10" : "bg-white border-slate-200"
                        }`}
                      >
                        <img
                          src={optimizeImage(movie.poster, { width: 120 })}
                          alt={movie.title}
                          loading="lazy"
                          decoding="async"
                          className="w-14 h-20 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <p className={`text-xs font-black truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{movie.title}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-0.5">
                                <Star size={10} className="fill-amber-400 stroke-amber-400" /> {movie.rating}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Clock size={10} /> {movie.duration}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBookNow(movie.id)}
                            className="mt-1.5 self-start px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-500 text-stone-950 border-none cursor-pointer active:scale-95 transition-transform uppercase tracking-wide"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleSend(p.prompt)}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border cursor-pointer text-left transition-all active:scale-95 ${
                      isDarkMode
                        ? "bg-white/[0.03] border-white/10 text-slate-300 hover:border-amber-500/40"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400"
                    }`}
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className={`px-3.5 py-2.5 rounded-2xl flex items-center gap-1 ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? "bg-slate-400" : "bg-slate-500"}`} style={{ animationDelay: '0ms' }} />
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? "bg-slate-400" : "bg-slate-500"}`} style={{ animationDelay: '150ms' }} />
                  <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDarkMode ? "bg-slate-400" : "bg-slate-500"}`} style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t flex items-center gap-2 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about movies..."
              className={`flex-1 px-3 py-2.5 rounded-xl text-xs outline-none border ${
                isDarkMode ? "bg-white/5 border-white/10 text-white placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="w-9 h-9 shrink-0 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center cursor-pointer border-none outline-none disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}