// src/components/AIAssistant.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sendAIChatMessage } from '../services/api';

export default function AIAssistant() {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm ShowX AI. Ask me for movie recommendations, plot summaries, or booking help." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendAIChatMessage(trimmed);
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || "AI Assistant is temporarily unavailable. Please try again later.";
      setMessages((prev) => [...prev, { role: 'assistant', text: errMsg }]);
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
        <div className={`fixed bottom-24 right-6 z-[90] w-[90vw] max-w-sm h-[70vh] max-h-[520px] rounded-2xl border shadow-2xl flex flex-col overflow-hidden ${
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
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? "bg-amber-500 text-stone-950 font-semibold"
                    : isDarkMode ? "bg-white/5 text-slate-200" : "bg-slate-100 text-slate-800"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`px-3.5 py-2.5 rounded-2xl text-xs ${isDarkMode ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                  Thinking...
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
              onClick={handleSend}
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