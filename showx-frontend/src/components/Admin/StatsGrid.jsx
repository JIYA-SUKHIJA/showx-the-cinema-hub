import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function StatsGrid({ isDarkMode }) {
  const stats = [
    { title: "TOTAL REVENUE", val: "₹4.28M", spark: [40, 50, 48, 70, 65, 80], gain: "+14.2%", positive: true },
    { title: "ACTIVE SCREENS", val: "148", spark: [20, 24, 22, 35, 30, 45], gain: "+8.6%", positive: true },
    { title: "TODAY'S BOOKINGS", val: "1,240", spark: [60, 55, 62, 50, 58, 48], gain: "-2.1%", positive: false },
    { title: "AVG. OCCUPANCY", val: "84.2%", spark: [50, 55, 60, 68, 72, 84], gain: "+11.4%", positive: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((card, idx) => (
        <motion.div 
          whileHover={{ y: -5 }} 
          key={idx} 
          className="bg-[#111114] border border-white/[0.05] p-6 rounded-2xl"
        >
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{card.title}</span>
            <span className="text-2xl font-black tracking-tight">{card.val}</span>
          </div>
          
          <div className="flex items-end justify-between mt-4">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${card.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
              {card.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {card.gain}
            </span>
            <div className="w-16 h-8 opacity-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={card.spark.map((v) => ({ v }))}>
                  <Area type="monotone" dataKey="v" stroke="#FF9F00" strokeWidth={2} fill="transparent" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}