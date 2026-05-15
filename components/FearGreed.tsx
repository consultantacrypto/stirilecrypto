'use client';

import { useEffect, useState } from 'react';
import { Activity, Zap } from 'lucide-react';

export default function FearGreed() {
  const [data, setData] = useState<{ value: string; value_classification: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://api.alternative.me/fng/');
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setData(json.data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse h-32 w-full bg-white/5 rounded-2xl" />;
  if (!data) return null;

  const score = parseInt(data.value);
  
  // Logică de culori High-Tech (Gradient Neon)
  // 0-25: Red (Fear), 26-50: Orange, 51-75: Green, 76+: Cyan (Greed)
  let colorClass = "from-orange-500 to-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]";
  let textGlow = "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]";
  
  if (score > 25) { colorClass = "from-yellow-500 to-orange-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]"; textGlow = "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"; }
  if (score > 50) { colorClass = "from-emerald-500 to-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]"; textGlow = "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]"; }
  if (score > 75) { colorClass = "from-cyan-400 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]"; textGlow = "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"; }

  // Calculăm circumferința pentru cercul SVG
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative group">
      {/* Container High Tech - Glassmorphism Închis */}
      <div className="bg-[#0b1221] border border-blue-500/20 rounded-2xl p-5 flex items-center gap-6 relative overflow-hidden">
        
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none"></div>

        {/* 1. REACTORUL (Indicatorul Circular) */}
        <div className="relative w-24 h-24 flex-shrink-0">
            {/* Cercul Fundal */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                    cx="50" cy="50" r={radius}
                    stroke="currentColor" strokeWidth="8" fill="transparent"
                    className="text-gray-800"
                />
                {/* Cercul Valoare (Progres) */}
                <circle
                    cx="50" cy="50" r={radius}
                    stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${score > 50 ? 'text-green-500' : 'text-red-500'}`}
                />
            </svg>
            
            {/* Scorul în mijloc */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black font-mono tracking-tighter ${textGlow}`}>
                    {score}
                </span>
            </div>
            
            {/* Glow pulsatoriu sub cerc */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-20 bg-current ${score > 50 ? 'text-green-500' : 'text-red-500'}`}></div>
        </div>

        {/* 2. DATELE (Textul) */}
        <div className="flex flex-col z-10">
            <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">Live Sentinel</span>
            </div>

            <h3 className="text-white font-bold text-xl tracking-wide uppercase mb-1">
                {data.value_classification}
            </h3>

            <p className="text-xs text-blue-200/70 font-mono leading-relaxed max-w-[160px]">
                Sentimentul actual al pieței crypto analizat în timp real.
            </p>
            
            <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 font-mono border-t border-white/5 pt-2">
                <Activity size={12} className="text-blue-500"/> 
                <span>Updated: Just now</span>
            </div>
        </div>
      </div>
    </div>
  );
}