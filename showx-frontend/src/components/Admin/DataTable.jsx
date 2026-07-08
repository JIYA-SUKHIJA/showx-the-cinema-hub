// src/components/Admin/DataTable.jsx
import React, { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';

export default function DataTable({ columns, data, isDarkMode, onDelete, onEdit }) {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (idx) => {
    setSelectedRows(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const renderCell = (value) => {
    if (['Active', 'Pending', 'Completed', 'Cancelled'].includes(value)) {
      const colors = {
        Active: "bg-emerald-500/10 text-emerald-500",
        Pending: "bg-amber-500/10 text-amber-500",
        Completed: "bg-blue-500/10 text-blue-500",
        Cancelled: "bg-rose-500/10 text-rose-500"
      };
      return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${colors[value]}`}>{value}</span>;
    }
    return value;
  };

  if (!data || data.length === 0) {
    return (
      <div className={`p-12 border rounded-xl text-center ${isDarkMode ? "border-white/[0.08] bg-slate-900/20" : "border-slate-200 bg-slate-50/50"}`}>
        <p className="text-sm text-slate-500 font-medium">No records found</p>
      </div>
    );
  }

  const hasActions = Boolean(onDelete || onEdit);

  return (
    <div className={`border rounded-xl overflow-hidden shadow-sm ${isDarkMode ? "border-white/[0.08]" : "border-slate-200"}`}>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className={`sticky top-0 z-10 ${isDarkMode ? "bg-slate-900 border-b border-white/[0.08]" : "bg-slate-50 border-b border-slate-200"}`}>
            <tr>
              <th className="p-4 w-10"><input type="checkbox" className="rounded border-slate-300" /></th>
              {columns.map((col, i) => (
                <th key={i} className="p-4 font-bold uppercase text-[10px] tracking-widest text-slate-500">
                  {col}
                </th>
              ))}
              {hasActions && <th className="p-4 text-right font-bold uppercase text-[10px] tracking-widest text-slate-500">Actions</th>}
            </tr>
          </thead>

          <tbody className={`divide-y ${isDarkMode ? "divide-white/[0.04]" : "divide-slate-100"}`}>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-all duration-200 ${isDarkMode ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"} ${idx % 2 === 0 ? "" : isDarkMode ? "bg-white/[0.01]" : "bg-slate-50/30"}`}
              >
                <td className="p-4"><input type="checkbox" checked={selectedRows.includes(idx)} onChange={() => toggleRow(idx)} className="rounded border-slate-300" /></td>
                {Object.keys(row).map((key, i) => (
                  <td key={i} className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {renderCell(row[key])}
                  </td>
                ))}
                {hasActions && (
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(idx)}
                          className="p-2 rounded-lg text-slate-400 hover:text-[#FF9F00] hover:bg-[#FF9F00]/10 transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(idx)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}