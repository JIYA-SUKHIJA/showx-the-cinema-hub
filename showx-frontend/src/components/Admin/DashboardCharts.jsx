import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardCharts({ isDarkMode, data }) {
  const chartData = data && data.length > 0 ? data : [];

  return (
    <div className="bg-[#111114] border border-white/[0.05] p-8 rounded-2xl">
      <h3 className="text-xs font-black uppercase text-white mb-8">Weekly Bookings Overview</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9F00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF9F00" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
            <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#060608', border: '1px solid #ffffff05', borderRadius: '12px' }}
              itemStyle={{ color: '#FF9F00', fontSize: '12px', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="traffic" name="Bookings" stroke="#FF9F00" fillOpacity={1} fill="url(#colorTraffic)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}