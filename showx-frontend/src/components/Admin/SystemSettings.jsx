import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell, Moon, Database, Save } from 'lucide-react';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoBackup: true,
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#111114] border border-white/[0.05] p-8 rounded-2xl">
        <h3 className="text-sm font-black text-white uppercase mb-6 flex items-center gap-2">
          <Shield size={16} className="text-[#FF9F00]" /> General Configuration
        </h3>
        
        <div className="space-y-6">
          {Object.keys(settings).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
              <button 
                onClick={() => setSettings(prev => ({...prev, [key]: !prev[key]}))}
                className={`w-12 h-6 rounded-full transition-colors ${settings[key] ? 'bg-[#FF9F00]' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings[key] ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111114] border border-white/[0.05] p-8 rounded-2xl">
        <h3 className="text-sm font-black text-white uppercase mb-6 flex items-center gap-2">
          <Database size={16} className="text-[#FF9F00]" /> Database & Sync
        </h3>
        <button className="w-full py-4 rounded-xl border border-dashed border-white/[0.1] text-xs font-black text-slate-500 hover:text-[#FF9F00] hover:border-[#FF9F00]/30 transition-all uppercase tracking-widest">
          Initiate Full System Sync
        </button>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-[#FF9F00] text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#FF9F00]/90 transition-all">
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
}