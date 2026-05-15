"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LineChart, RefreshCw, AlertTriangle, Layers, Clock } from 'lucide-react';

// Importăm dinamic ambele grafice
const TwoYearMAChart = dynamic(() => import('@/components/TwoYearMAChart'), { 
  ssr: false, loading: () => <div className="h-96 w-full bg-[#0b1221] rounded-2xl animate-pulse border border-white/5" />
});
const PiCycleChart = dynamic(() => import('@/components/PiCycleChart'), { 
  ssr: false, loading: () => <div className="h-96 w-full bg-[#0b1221] rounded-2xl animate-pulse border border-white/5 mt-8" />
});

export default function PeakSignalsContainer() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchData = async () => {
    try {
      // Nu punem setLoading(true) aici pentru ca refresh-ul să fie "invizibil" (fără flicker)
      const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=1000');
      if (!res.ok) throw new Error("Binance API error");
      const rawData = await res.json();
      const processedData = processData(rawData);
      setData(processedData);
      
      // Actualizăm ora
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }));
      
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Prima încărcare
    fetchData();

    // 2. Auto-Refresh la fiecare 60 secunde (1 minut)
    const interval = setInterval(() => {
        fetchData();
    }, 60000);

    // Curățăm intervalul când ieși de pe pagină
    return () => clearInterval(interval);
  }, []);

  if (error) return (
    <div className="w-full h-96 bg-[#0b1221] border border-red-500/30 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-white">Eroare date</h3>
        <button onClick={fetchData} className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2"><RefreshCw size={16} /> Retry</button>
    </div>
  );

  if (loading) return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
        <LineChart className="text-blue-500 animate-bounce" size={48} />
        <p className="text-blue-300 font-mono text-sm">Se calculează modelele matematice...</p>
    </div>
  );

  return (
    <div className="space-y-12">
        {/* INFO BAR: Ultima actualizare */}
        <div className="flex justify-end px-2">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full">
                <Clock size={10} className="animate-pulse text-green-500"/>
                Actualizat: {lastUpdate} (Auto-Refresh 60s)
            </div>
        </div>

        {/* GRAFIC 1: 2-Year MA Multiplier */}
        <TwoYearMAChart data={data} />
        
        {/* SEPARATOR */}
        <div className="flex items-center gap-4 py-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
            <span className="text-gray-500 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                <Layers size={12}/> Confirmare Secundară
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
        </div>

        {/* GRAFIC 2: Pi Cycle Top */}
        <PiCycleChart data={data} />
    </div>
  );
}

// 🧠 LOGICA MATEMATICĂ (Rămâne la fel)
function processData(rawData: any[]) {
  const prices = rawData.map((d: any) => parseFloat(d[4]));
  const dates = rawData.map((d: any) => d[0]);
  const metrics = [];

  const w2yr = 104; 
  const w111d = 16; 
  const w350d = 50; 

  for (let i = 0; i < prices.length; i++) {
    const date = new Date(dates[i]).toLocaleDateString('ro-RO', { year: '2-digit', month: 'short' });
    const price = prices[i];
    
    let ma2yr = null;
    if (i >= w2yr) {
       let sum = 0;
       for (let j = 0; j < w2yr; j++) sum += prices[i - j];
       ma2yr = sum / w2yr;
    }

    let ma111 = null;
    let ma350x2 = null;
    
    if (i >= w111d) {
        let sum = 0;
        for (let j = 0; j < w111d; j++) sum += prices[i - j];
        ma111 = sum / w111d;
    }
    
    if (i >= w350d) {
        let sum = 0;
        for (let j = 0; j < w350d; j++) sum += prices[i - j];
        ma350x2 = (sum / w350d) * 2; 
    }

    if (i > w350d) {
        metrics.push({
            date,
            price,
            ma2yr: ma2yr,
            ma2yrMultiplier: ma2yr ? ma2yr * 5 : null,
            ma111: ma111,
            ma350x2: ma350x2
        });
    }
  }
  return metrics;
}