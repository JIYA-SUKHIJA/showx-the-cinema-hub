// src/components/Admin/SystemSettings.jsx
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Server, Shield, Database, Save, RefreshCw } from 'lucide-react';
import { showxToast } from '../../utils/toastConfig';
import { useTheme } from '../../context/ThemeContext';

export default function SystemSettings() {
  const { isDarkMode } = useTheme();
  const [configs, setConfigs] = useState({
    maintenance: false,
    publicRegistration: true,
    cacheBuffer: true,
    webhookStream: false
  });
  const [processing, setProcessing] = useState(false);

  const toggleSwitch = (key) => {
    setConfigs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveConfig = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      showxToast.adminSuccess("System configuration block synchronized safely");
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 select-none">
      <div className="md:col-span-2 space-y-4">
        {[
          { key: "maintenance", label: "Global Maintenance Flag", desc: "Locks public ingress pipelines returning an HTTP 503 cluster block.", icon: Server },
          { key: "publicRegistration", label: "Open Registrations Array", desc: "Permits creation of secondary access tokens inside the user database matrix.", icon: Shield },
          { key: "cacheBuffer", label: "Auto Cache Buffering Layer", desc: "Forces edge gateways to compile localized page traces dynamically.", icon: Database }
        ].map((node) => {
          const Icon = node.icon;
          const isEnabled = configs[node.key];
          return (
            <div 
              key={node.key} 
              className={`p-4 rounded-xl border flex items-center justify-between gap-6 transition-all duration-300 ${
                isDarkMode 
                  ? "bg-[#111114]/20 border-white/[0.04] hover:border-white/[0.08]" 
                  : "bg-white border-stone-200/80 hover:border-stone-300 shadow-sm shadow-stone-900/5"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mt-0.5 ${
                  isDarkMode ? "bg-white/[0.01] border-white/[0.04] text-slate-500" : "bg-stone-50 border-stone-200 text-stone-400"
                }`}>
                  <Icon size={14} />
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{node.label}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-normal max-w-md">{node.desc}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => toggleSwitch(node.key)} 
                className="bg-transparent border-none text-slate-600 hover:text-white cursor-pointer transition-colors focus:outline-none animate-none"
              >
                {isEnabled ? <ToggleRight size={26} className="text-[#FF9F00]" /> : <ToggleLeft size={26} className={isDarkMode ? "text-slate-600" : "text-stone-300"} />}
              </button>
            </div>
          );
        })}
        <div className="flex justify-end pt-2">
          <button 
            type="button" 
            onClick={handleSaveConfig} 
            disabled={processing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF9F00] text-black text-[10px] font-black uppercase tracking-widest cursor-pointer border-none shadow-md shadow-[#FF9F00]/10 disabled:opacity-50"
          >
            {processing ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />} Commit Stack Configuration
          </button>
        </div>
      </div>
      
      <div className={`p-5 rounded-2xl border h-fit space-y-4 relative overflow-hidden transition-all duration-300 ${
        isDarkMode ? "bg-[#111114]/40 border-white/[0.04]" : "bg-white border-stone-200/80 shadow-sm shadow-stone-900/5"
      }`}>
        <h4 className={`text-[10px] font-black uppercase tracking-widest font-mono ${isDarkMode ? "text-slate-400" : "text-stone-500"}`}>Infrastructure Overview</h4>
        <div className="space-y-3 font-mono text-[9px] text-slate-500">
          <div className={`flex justify-between border-b pb-1.5 ${isDarkMode ? "border-white/[0.02]" : "border-stone-100"}`}>
            <span>Cluster Engine:</span>
            <span className={`font-bold ${isDarkMode ? "text-slate-300" : "text-stone-700"}`}>Node.js v20.x</span>
          </div>
          <div className={`flex justify-between border-b pb-1.5 ${isDarkMode ? "border-white/[0.02]" : "border-stone-100"}`}>
            <span>Database Clusters:</span>
            <span className={`font-bold ${isDarkMode ? "text-slate-300" : "text-stone-700"}`}>MongoDB Atlas v7.0</span>
          </div>
          <div className="flex justify-between">
            <span>Active Webhooks:</span>
            <span className={`font-bold ${isDarkMode ? "text-slate-300" : "text-stone-700"}`}>4 Pipeline Shards</span>
          </div>
        </div>
      </div>
    </div>
  );
}