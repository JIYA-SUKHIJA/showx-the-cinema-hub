// src/components/Admin/UsersTable.jsx
import React from 'react';
import { User, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function UsersTable({ users, onRoleChange }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
      isDarkMode ? "bg-[#111114]/30 border-white/[0.04]" : "bg-white border-stone-200/80 shadow-stone-900/5"
    }`}>
      <div className={`px-6 py-4 border-b ${isDarkMode ? "border-white/[0.04] bg-white/[0.01]" : "border-stone-200/60 bg-stone-50/40"}`}>
        <h3 className={`text-[10px] font-black uppercase tracking-widest font-mono ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>User Access Authority Index</h3>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse select-none">
          <thead>
            <tr className={`border-b ${isDarkMode ? "border-white/[0.02] bg-white/[0.005]" : "border-stone-200/40 bg-stone-50/20"}`}>
              {["User Node", "Email Vector", "Account ID", "Authority Tier", "Alter Permissions"].map((col, idx) => (
                <th key={idx} className={`px-6 py-3.5 text-[10px] font-black uppercase tracking-widest font-mono ${isDarkMode ? "text-slate-500" : "text-stone-400"}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y text-[11px] font-mono transition-all duration-300 ${
            isDarkMode ? "divide-white/[0.02] text-slate-300" : "divide-stone-200/40 text-slate-600"
          }`}>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-bold">No accounts mapped to cluster.</td>
              </tr>
            ) : (
              users.map((u) => {
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u._id} className={`transition-colors duration-150 ${isDarkMode ? "hover:bg-white/[0.01]" : "hover:bg-stone-50/40"}`}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* Perfect soft contrast circles for light and dark theme backgrounds */}
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                          isAdmin 
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-500" 
                            : isDarkMode 
                              ? "bg-slate-800/40 border-slate-700/30 text-slate-400" 
                              : "bg-stone-100 border-stone-200/60 text-stone-500"
                        }`}>
                          {isAdmin ? <Shield size={13} /> : <User size={13} />}
                        </div>
                        <span className={`font-sans font-bold transition-colors ${isDarkMode ? "text-slate-200" : "text-stone-800"}`}>{u.name}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-3.5 font-sans font-medium transition-colors ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>{u.email}</td>
                    <td className="px-6 py-3.5 text-slate-500">#{u._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-3.5">
                      {/* Premium translucent authority pill badges instead of deep gray blocks */}
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border transition-all ${
                        isAdmin 
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20" 
                          : isDarkMode 
                            ? "bg-slate-800/40 text-slate-400 border-white/[0.04]" 
                            : "bg-slate-100 text-slate-600 border-slate-200/60"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => onRoleChange(u._id, e.target.value)}
                        className={`border rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider outline-none focus:border-[#FF9F00]/50 cursor-pointer transition-colors ${
                          isDarkMode ? "bg-[#0a0a0c] border-white/[0.08] text-slate-300" : "bg-white border-stone-300 text-stone-700 shadow-sm"
                        }`}
                      >
                        <option value="user">User Node</option>
                        <option value="admin">Admin Root</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}