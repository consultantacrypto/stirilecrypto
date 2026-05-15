"use client";

import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Crosshair, AlertTriangle } from 'lucide-react';

interface Props {
  data: any[];
}

export default function PiCycleChart({ data }: Props) {
  // Verificăm ultima valoare pentru status
  const last = data[data.length - 1];
  const isCrossed = last && last.ma111 > last.ma350x2; // Daca linia rapidă trece peste cea de vârf

  return (
    <div className="w-full bg-[#0b1221] border border-purple-900/30 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden group mt-8">
      
      {/* Background Effect */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 relative z-10">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Crosshair className="text-purple-500" />
            Pi Cycle Top Indicator
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Istoric, când linia <span className="text-orange-400 font-bold">Portocalie</span> trece peste cea <span className="text-purple-400 font-bold">Mov</span>, piața se prăbușește în 3 zile.
          </p>
        </div>

        {/* Status Badge */}
        <div>
            {isCrossed ? (
                <span className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse">
                    <AlertTriangle size={16}/> SELL NOW (Cross Active)
                </span>
            ) : (
                 <span className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg text-xs font-bold font-mono">
                    NO CROSS (Încă urcăm)
                </span>
            )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPricePi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={10} minTickGap={40} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={10} scale="log" domain={['auto', 'auto']} tickFormatter={(v) => `$${v.toLocaleString()}`} width={60}/>
            <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1f2937', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val:any) => [`$${Number(val).toLocaleString()}`, '']}
            />
            <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>

            {/* Price Area */}
            <Area yAxisId="right" type="monotone" dataKey="price" stroke="#ffffff" fill="url(#colorPricePi)" strokeWidth={1} name="Preț BTC" />
            
            {/* 111 DMA (Rapidă) - Portocalie */}
            <Line yAxisId="right" type="monotone" dataKey="ma111" stroke="#f97316" strokeWidth={2} dot={false} name="111 DMA (Semnal)" connectNulls />
            
            {/* 350 DMA x 2 (Vârf) - Mov */}
            <Line yAxisId="right" type="monotone" dataKey="ma350x2" stroke="#a855f7" strokeWidth={2} dot={false} name="350 DMA x2 (Vârf)" connectNulls />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}