'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ArrowDown, ArrowUp, Zap, Activity, Waves, ShieldAlert } from 'lucide-react';

interface Trade {
  p: string; // Preț
  q: string; // Cantitate
  m: boolean; // Este Buyer Maker? (true = Sell, false = Buy)
  time: number;
}

export default function WhaleWallWidget() {
  const [depth, setDepth] = useState<{ bidVol: number; askVol: number; ratio: number } | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [price, setPrice] = useState<string>("0");
  const [lastTradeType, setLastTradeType] = useState<'buy' | 'sell'>('buy');
  
  useEffect(() => {
    // 1. FETCH INITIAL PENTRU ORDERBOOK (ZIDURILE)
    const fetchDepth = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=100');
        const data = await res.json();
        
        const totalBids = data.bids.reduce((acc: number, curr: string[]) => acc + parseFloat(curr[1]), 0);
        const totalAsks = data.asks.reduce((acc: number, curr: string[]) => acc + parseFloat(curr[1]), 0);
        const ratio = (totalBids / (totalBids + totalAsks)) * 100;

        setDepth({ bidVol: totalBids, askVol: totalAsks, ratio });
      } catch (e) { console.error(e); }
    };

    // 2. FETCH LIVE TRADES (BANDA DE ORDINE)
    const fetchTrades = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/trades?symbol=BTCUSDT&limit=10');
        const data = await res.json();
        
        if (data && data.length > 0) {
            const lastTrade = data[data.length - 1];
            setPrice(parseFloat(lastTrade.price).toLocaleString('en-US', { maximumFractionDigits: 0 }));
            
            // Mapăm datele de la API-ul public la formatul nostru intern
            const newTrades = data.reverse().slice(0, 5).map((t: any) => ({
                 p: t.price,
                 q: t.qty,
                 m: t.isBuyerMaker, // true = Sell, false = Buy
                 time: t.time
            }));
    
            setTrades(newTrades);
            
            // Setăm direcția ultimei tranzacții pentru efecte vizuale
            if (newTrades.length > 0) {
                setLastTradeType(newTrades[0].m ? 'sell' : 'buy');
            }
        }

      } catch (e) { console.error(e); }
    };

    fetchDepth();
    fetchTrades();

    const intervalDepth = setInterval(fetchDepth, 5000); // Zidurile la 5 sec
    const intervalTrades = setInterval(fetchTrades, 2000); // Tranzacțiile la 2 sec

    return () => {
        clearInterval(intervalDepth);
        clearInterval(intervalTrades);
    };
  }, []);

  if (!depth) return (
    <div className="bg-[#0a0f1e] p-6 rounded-2xl border border-gray-800 animate-pulse h-[350px] flex flex-col items-center justify-center gap-4 text-gray-500 text-xs">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div>Se încarcă Quantum Radar...</div>
    </div>
  );

  const isBullish = depth.ratio > 50;

  return (
    <div className="bg-[#0a0f1e] border border-gray-800 rounded-2xl p-0 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl flex flex-col">
      
      {/* --- SECTION 1: HUD HEADER (Vitezometru) --- */}
      <div className="p-5 border-b border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-transparent relative">
         <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-xs font-black text-blue-400 flex items-center gap-2 tracking-widest font-[var(--font-space)]">
                    <Waves className="w-4 h-4 animate-pulse" /> QUANTUM RADAR
                </h3>
                <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-[10px] text-gray-400 font-mono">LIVE FEED</span>
                </div>
            </div>
            <div className="text-right">
                <div className={`text-xl font-black font-[var(--font-space)] tracking-tight ${lastTradeType === 'buy' ? 'text-green-400' : 'text-red-400'} transition-colors duration-300`}>
                    ${price}
                </div>
            </div>
         </div>

         {/* IMBALANCE METER (Bara de putere) */}
         <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden mt-2 border border-white/5">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white z-10 h-full"></div> {/* Center Line */}
            <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-300 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                style={{ width: `${depth.ratio}%` }}
            ></div>
         </div>
         <div className="flex justify-between text-[9px] font-bold text-gray-500 mt-1 uppercase">
            <span className={isBullish ? "text-green-400" : ""}>BUY PRESSURE</span>
            <span className={!isBullish ? "text-red-400" : ""}>SELL PRESSURE</span>
         </div>
      </div>

      {/* --- SECTION 2: THE TAPE (Live Transactions) --- */}
      <div className="p-4 bg-[#050912]">
        <div className="text-[9px] font-bold text-gray-500 uppercase mb-3 flex justify-between items-center tracking-wider">
            <span>BANDA LIVE (ULTIMELE TRANZACȚII)</span>
            <Activity size={10} className="text-blue-500"/>
        </div>
        
        <div className="space-y-2 min-h-[150px]">
            {trades.map((t, i) => {
                // Determine trade type
                const type = t.m ? 'sell' : 'buy'; 
                // Highlight whales (> 0.1 BTC visually)
                const isWhale = parseFloat(t.q) > 0.1; 

                return (
                    <div key={t.time + i} className={`flex justify-between items-center text-xs p-2 rounded border ${isWhale ? 'bg-white/5 border-white/10' : 'border-transparent'} animate-in slide-in-from-right duration-300`}>
                        
                        {/* Preț & Direcție */}
                        <div className="flex items-center gap-2 w-1/3">
                            {type === 'buy' ? 
                                <span className="text-[9px] bg-green-900/30 text-green-400 px-1 rounded font-bold">CUMPĂRĂ</span> : 
                                <span className="text-[9px] bg-red-900/30 text-red-400 px-1 rounded font-bold">VINDE</span>
                            }
                            <span className={`font-mono font-bold ${type === 'buy' ? 'text-green-300' : 'text-red-300'}`}>
                                ${parseFloat(t.p).toLocaleString()}
                            </span>
                        </div>

                        {/* Cantitate & Bitcoin Glow */}
                        <div className="flex items-center justify-end gap-1.5">
                            <span className={`font-mono font-bold text-sm ${isWhale ? 'text-white' : 'text-gray-400'}`}>
                                {parseFloat(t.q).toFixed(4)}
                            </span>
                            <span className="text-orange-500 font-bold text-sm drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                                ₿
                            </span>
                             {type === 'buy' ? <ArrowUp size={12} className="text-green-500"/> : <ArrowDown size={12} className="text-red-500"/>}
                        </div>
                    </div>
                )
            })}
        </div>
      </div>

      {/* --- SECTION 3: WHALE WALLS SUMMARY --- */}
      <div className="p-3 bg-gray-900/50 border-t border-gray-800 flex justify-between items-center text-[10px]">
         <div className="text-gray-400">
            Ziduri Identificate (Adâncime):
         </div>
         <div className="flex gap-3">
             <span className="text-green-400 font-bold flex items-center gap-1">
                <ShieldAlert size={10}/> {depth.bidVol.toFixed(0)} BTC
             </span>
             <span className="text-red-400 font-bold flex items-center gap-1">
                <ShieldAlert size={10}/> {depth.askVol.toFixed(0)} BTC
             </span>
         </div>
      </div>

      {/* Background Pulse Effect */}
      <div className={`absolute top-0 right-0 w-full h-full pointer-events-none opacity-5 mix-blend-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${lastTradeType === 'buy' ? 'from-green-500 via-transparent to-transparent' : 'from-red-500 via-transparent to-transparent'} transition-colors duration-500`}></div>

    </div>
  );
}