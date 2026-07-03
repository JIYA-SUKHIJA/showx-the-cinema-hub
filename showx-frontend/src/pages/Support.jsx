// src/pages/Support.jsx
import React, { useState } from 'react';
import { ChevronDown, Ticket, Tv } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Support() {
  const { isDarkMode } = useTheme();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { question: "How do I claim a refund on canceled tickets?", answer: "Cancellations made up to 2 hours before showtime are eligible for a full refund back to your original payment mode.", icon: <Ticket size={14} /> },
    { question: "Where can I view my rented digital streams?", answer: "Once your purchase goes through, click your user profile picture at the top right and click 'Streaming Library'.", icon: <Tv size={14} /> }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl ${
        isDarkMode ? "bg-slate-900/40 border-white/[0.05] text-white" : "bg-stone-50 border-stone-200 text-slate-900"
      }`}>
        <h1 className="text-3xl font-black tracking-tight">Support Desk</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">Get immediate answers for bookings, ticket payments, and digital stream playback links.</p>
      </div>

      <div className="space-y-4">
        <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? "text-white" : "text-stone-900"}`}>Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border rounded-xl overflow-hidden transition-colors ${
                isDarkMode ? "border-white/[0.05] bg-white/[0.01]" : "border-slate-200 bg-white"
              }`}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-xs font-bold text-left cursor-pointer border-none bg-transparent"
              >
                <span className="flex items-center gap-2 text-amber-500">{faq.icon} <span className={isDarkMode ? "text-slate-200" : "text-stone-800"}>{faq.question}</span></span>
                <ChevronDown size={14} className={`transform transition-transform ${openFaq === idx ? "rotate-180" : ""} ${isDarkMode ? "text-white" : "text-slate-600"}`} />
              </button>
              {openFaq === idx && (
                <div className={`px-4 pb-4 pt-1 text-[11px] leading-relaxed text-slate-400 font-medium border-t ${isDarkMode ? "border-white/[0.04]" : "border-slate-100"}`}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}