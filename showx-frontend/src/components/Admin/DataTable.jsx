// src/components/Admin/DataTable.jsx
import React from 'react';
import { Edit2, Trash2, ShieldCheck, Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DataTable({ columns, data, onEdit, onDelete }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
      isDarkMode ? "bg-[#111114]/30 border-white/[0.04]" : "bg-white border-stone-200/80 shadow-stone-900/5"
    }`}>
      <p className={`sm:hidden text-[9px] font-mono px-4 pt-3 pb-1 ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>
        ← Swipe to see more →
      </p>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[700px] text-left border-collapse select-none">
          <thead>
            <tr className={`border-b transition-colors ${
              isDarkMode ? "border-white/[0.04] bg-white/[0.01]" : "border-stone-200/60 bg-stone-50/50"
            }`}>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest font-mono ${
                    isDarkMode ? "text-slate-500" : "text-stone-400"
                  }`}
                >
                  {col}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest font-mono text-right ${
                  isDarkMode ? "text-slate-500" : "text-stone-400"
                }`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className={`divide-y text-[11px] font-medium font-mono transition-all duration-300 ${
            isDarkMode ? "divide-white/[0.02] text-slate-300" : "divide-stone-200/40 text-slate-600"
          }`}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 font-bold font-mono">
                  No matching entry modules discovered.
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr 
                  key={row.id || rIdx} 
                  className={`transition-colors duration-150 ${
                    isDarkMode ? "hover:bg-white/[0.01]" : "hover:bg-stone-50/40"
                  }`}
                >
                  {Object.keys(row).map((key, cIdx) => {
                    if (key === 'id') {
                      return (
                        <td key={cIdx} className="px-6 py-3.5 font-bold text-slate-500 max-w-[100px] truncate">
                          #{String(row[key]).slice(-6).toUpperCase()}
                        </td>
                      );
                    }
                    
                    const cellValue = row[key];
                    const isStatus = key === 'status' || key === 'category';
                    
                    return (
                      <td key={cIdx} className="px-6 py-3.5 max-w-[220px] truncate">
                        {isStatus ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                            cellValue === 'Completed' || cellValue === 'movie'
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : cellValue === 'Cancelled' || cellValue === 'failed'
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {cellValue === 'Completed' && <ShieldCheck size={9} />}
                            {cellValue === 'movie' && <Play size={8} className="fill-current" />}
                            {cellValue}
                          </span>
                        ) : (
                          <span className={`font-sans font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{cellValue ?? '—'}</span>
                        )}
                      </td>
                    );
                  })}

                  {(onEdit || onDelete) && (
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(rIdx)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer bg-transparent outline-none ${
                              isDarkMode 
                                ? "border-white/[0.04] text-slate-400 hover:text-[#FF9F00] hover:border-[#FF9F00]/30" 
                                : "border-stone-200 text-stone-500 hover:text-[#FF9F00] hover:border-[#FF9F00]/40"
                            }`}
                          >
                            <Edit2 size={11} strokeWidth={2.5} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (window.confirm("Purge targeted record element?")) {
                                onDelete(rIdx);
                              }
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer bg-transparent outline-none ${
                              isDarkMode 
                                ? "border-white/[0.04] text-slate-500 hover:text-rose-400 hover:border-rose-500/30" 
                                : "border-stone-200 text-stone-400 hover:text-rose-500 hover:border-rose-500/40"
                            }`}
                          >
                            <Trash2 size={11} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}