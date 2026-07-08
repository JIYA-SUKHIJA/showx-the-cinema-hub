// src/components/Admin/UsersTable.jsx
import React, { useState } from 'react';
import { ShieldCheck, User as UserIcon } from 'lucide-react';

export default function UsersTable({ users, isDarkMode, onRoleChange }) {
  const [changingId, setChangingId] = useState(null);

  const handleRoleSelect = async (userId, newRole) => {
    setChangingId(userId);
    await onRoleChange(userId, newRole);
    setChangingId(null);
  };

  if (!users || users.length === 0) {
    return (
      <div className="p-12 border border-white/[0.08] bg-slate-900/20 rounded-xl text-center">
        <p className="text-sm text-slate-500 font-medium">No users found</p>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-900 border-b border-white/[0.08]">
            <tr>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-slate-500">ID</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-slate-500">Name</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-slate-500">Email</th>
              <th className="p-4 font-bold uppercase text-[10px] tracking-widest text-slate-500">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {users.map((u, idx) => (
              <tr key={u._id} className={`hover:bg-white/[0.03] transition-all ${idx % 2 !== 0 ? "bg-white/[0.01]" : ""}`}>
                <td className="p-4 text-sm font-medium text-slate-300">{u._id}</td>
                <td className="p-4 text-sm font-medium text-slate-300">{u.name}</td>
                <td className="p-4 text-sm font-medium text-slate-300">{u.email}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {u.role === 'admin' ? (
                      <ShieldCheck size={14} className="text-[#FF9F00]" />
                    ) : (
                      <UserIcon size={14} className="text-slate-500" />
                    )}
                    <select
                      value={u.role}
                      disabled={changingId === u._id}
                      onChange={(e) => handleRoleSelect(u._id, e.target.value)}
                      className="bg-[#0a0a0c] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-[#FF9F00]/50 disabled:opacity-50"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {changingId === u._id && <span className="text-[10px] text-slate-500">Saving...</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}