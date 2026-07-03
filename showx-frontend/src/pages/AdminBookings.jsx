// src/pages/AdminBookings.jsx
import React from 'react';
import { Ticket } from 'lucide-react';

export default function AdminBookings() {
  const dataset = [
    { id: 'SHX-849204', name: 'Aman Sharma', seats: 'C-5, C-6, C-7', price: '₹630.00', status: 'SETTLED' },
    { id: 'SHX-129482', name: 'Riya Malhotra', seats: 'A-1, A-2', price: '₹430.00', status: 'SETTLED' },
    { id: 'SHX-948203', name: 'Vikram Singh', seats: 'J-10, J-11, J-12', price: '₹630.00', status: 'SETTLED' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-white/[0.04] pb-6">
        <h1 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2">
          <Ticket size={20} className="text-amber-500" /> Ticket Settlement Ledger
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time auditing track of processed customer transactional orders.</p>
      </div>

      <div className="border border-white/[0.05] rounded-2xl overflow-hidden bg-white/[0.01] shadow-2xl">
        <table className="w-full text-left text-xs font-medium border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-white/[0.04] text-slate-400 uppercase font-black font-mono tracking-wider text-[10px]">
              <th className="p-4">Invoice Reference</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Allocated Nodes</th>
              <th className="p-4">Gross Settled</th>
              <th className="p-4">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] text-slate-300">
            {dataset.map((row, index) => (
              <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-mono font-bold text-amber-500">{row.id}</td>
                <td className="p-4 font-semibold text-white">{row.name}</td>
                <td className="p-4 font-mono text-slate-400">{row.seats}</td>
                <td className="p-4 font-mono font-bold text-white">{row.price}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 text-[9px] font-black font-mono tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}