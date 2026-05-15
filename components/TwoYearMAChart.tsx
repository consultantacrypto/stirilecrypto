"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Legend
} from 'recharts';
import { MetricPoint } from '@/lib/metrics-api';
import { Activity, AlertTriangle, TrendingUp, Info } from 'lucide-react';

interface Props {
  data: MetricPoint[];
}

export default function TwoYearMAChart({ data }: Props) {
  // Dacă nu avem date (eroare API), afișăm un mesaj fallback
  if (!data || data.length === 0) {
      return (
          <div className="w-full h-96 bg-[#0b1221] border border-red-900/30 rounded-2xl flex flex-col items-center justify-center text-red-400 p-6">
              <AlertTriangle size={48} className="mb-4" />
              <h3 className="text-xl font-bold">Date indisponibile momentan</h3>
              <p className="text-sm text-gray-400 mt-2 text-center">Nu am putut conecta la Binance API. Încearcă un refresh.</p>
          </div>
      );
  }

  const lastPoint = data[data.length - 1];
  
  // Logica de "Zonă":
  const isDangerZone = lastPoint?.ma2yrMultiplier && lastPoint.price > lastPoint.ma2yrMultiplier;
  const isBuyZone = lastPoint?.ma2yr && lastPoint.price < lastPoint.ma2yr;

  return (
    <div className="w-full bg-[#0b1221] border border-blue-900/30 rounded-2xl p-4 md:p-6 shadow-2xl relative overflow-hidden group">
      
      {/* GLOW EFFECT BACKGROUND */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-all"></div>

      {/* HEADER GRAFIC */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 z-10 relative">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Activity className="text-blue-500" />
            Bitcoin 2-Year MA Multiplier
          </h2>
          <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
            <Info size={12}/>
            <span>Sursa: Binance (Weekly Candles) • Load Time: Instant</span>
          </div>
        </div>

        {/* STATUS INDICATOR */}
        <div className="flex items-center gap-3">
            {isDangerZone ? (
                <span className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    <AlertTriangle size={16}/> SELL ZONE (Vârf)
                </span>
            ) : isBuyZone ? (
                <span className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded-lg text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <TrendingUp size={16}/> BUY ZONE (Acumulare)
                </span>
            ) : (
                <span className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-400 rounded-lg text-sm font-bold flex items-center gap-2">
                    <Activity size={16}/> HODL ZONE (Neutru)
                </span>
            )}
        </div>
      </div>

      {/* GRAFIC RECHARTS */}
      <div className="h-[400px] md:h-[500px] w-full z-10 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            
            <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                fontSize={10} 
                tickMargin={10} 
                minTickGap={40} // Mai des, pentru că avem date săptămânale
            />
            
            <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#6b7280" 
                fontSize={10} 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                scale="log" 
                domain={['auto', 'auto']}
                width={60}
            />
            
            <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1f2937', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                formatter={(value: any) => [
                    value ? `$${Number(value).toLocaleString()}` : 'N/A', 
                    ''
                ]}
            />

            <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>

            {/* 1. Linia de Vârf (Rosie) */}
            <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ma2yrMultiplier" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={false}
                name="Vârf Ciclu (MA x5)"
                connectNulls // Conectează punctele dacă lipsesc date
            />

            {/* 2. Prețul Bitcoin (Alb + Area) */}
            <Area
                yAxisId="right"
                type="monotone"
                dataKey="price"
                stroke="#ffffff"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorPrice)"
                name="Preț BTC"
            />

            {/* 3. Linia de Bază (Verde) */}
            <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ma2yr" 
                stroke="#22c55e" 
                strokeWidth={2} 
                dot={false}
                name="Suport (MA 2yr)"
                connectNulls
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* LEGENDĂ */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs border-t border-white/5 pt-4">
         <div className="flex items-start gap-2 text-gray-400">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_red]"></div>
            <p><strong>Linia Roșie (Rezistență):</strong> Vârf de euforie. Istoric, marchează finalul ciclului Bull.</p>
         </div>
         <div className="flex items-start gap-2 text-gray-400">
            <div className="w-2 h-2 bg-white rounded-full mt-1.5 shrink-0"></div>
            <p><strong>Preț BTC:</strong> Prețul de închidere săptămânal.</p>
         </div>
         <div className="flex items-start gap-2 text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_5px_green]"></div>
            <p><strong>Linia Verde (Suport):</strong> Media mobilă pe 2 ani. Zona ideală de acumulare.</p>
         </div>
      </div>

    </div>
  );
}