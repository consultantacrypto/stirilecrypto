"use client";

import { useState, useEffect } from 'react';
import { Layers, TrendingUp, Info } from 'lucide-react';

export default function AltcoinSeasonWidget() {
  const [dominance, setDominance] = useState<number>(55); // Default start
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Luăm datele globale de la CoinGecko (gratuit și stabil pt dominance)
      const res = await fetch('https://api.coingecko.com/api/v3/global');
      const data = await res.json();
      if (data && data.data && data.data.market_cap_percentage) {
        setDominance(data.data.market_cap_percentage.btc);
      }
    } catch (error) {
      console.error("Altseason Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // LOGICA VIZUALĂ:
  // BTC Dominance 60% -> E Bitcoin Season (0% Altseason)
  // BTC Dominance 35% -> E Altcoin Season (100% Altseason)
  // Mapăm dominanța (60...35) la un procent (0...100) pentru bară
  const calculateAltSeasonIndex = (dom: number) => {
    const maxDom = 60;
    const minDom = 38;
    let index = ((maxDom - dom) / (maxDom - minDom)) * 100;
    // Limităm între 0 și 100
    if (index > 100) index = 100;
    if (index < 0) index = 0;
    return index;
  };

  const altIndex = calculateAltSeasonIndex(dominance);
  
  // Determinăm statusul text
  const getStatus = (idx: number) => {
    if (idx < 25) return { text: "BITCOIN SEASON", color: "text-orange-500" };
    if (idx > 75) return { text: "ALTCOIN SEASON 🚀", color: "text-purple-400" };
    return { text: "NEUTRU / ROTATION", color: "text-gray-300" };
  };

  const status = getStatus(altIndex);

  return (
    <div className="bg-[#0b1221] rounded-2xl border border-white/10 p-5 shadow-xl relative overflow-hidden group">
      
      {/* Background Glow */}
      <div 
        className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] transition-all duration-1000 opacity-20
        ${altIndex > 50 ? 'bg-purple-600' : 'bg-orange-600'}`}
      ></div>

      {/* HEADER */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border bg-opacity-20 transition-colors
                ${altIndex > 50 ? 'bg-purple-500/20 border-purple-500/30' : 'bg-orange-500/20 border-orange-500/30'}`}>
                <Layers size={20} className={altIndex > 50 ? 'text-purple-400' : 'text-orange-400'} />
            </div>
            <div>
                <h3 className="text-base font-black text-white tracking-wide uppercase">
                    Altcoin Season <span className="text-gray-500">Index</span>
                </h3>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase mt-0.5">
                    Live Dominance Meter
                </p>
            </div>
        </div>
      </div>

      {/* THE METER */}
      <div className="relative z-10 mb-2">
        {/* Status Text */}
        <div className="flex justify-between items-end mb-2">
            <span className={`text-xl font-black ${status.color} tracking-tight animate-pulse`}>
                {status.text}
            </span>
            <span className="text-xs font-bold text-gray-500">
                {altIndex.toFixed(0)}/100
            </span>
        </div>

        {/* Gradient Bar Container */}
        <div className="h-4 bg-gray-800 rounded-full relative overflow-hidden shadow-inner border border-white/5">
            {/* Background Gradient (Orange to Purple) */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-gray-600 to-purple-600 opacity-30"></div>
            
            {/* Active Indicator (The Needle) */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_white] z-20 transition-all duration-1000 ease-out"
                style={{ left: `${altIndex}%` }}
            ></div>

            {/* Fill Effect */}
            <div 
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-orange-500 to-transparent opacity-80 transition-all duration-1000"
                style={{ width: `${altIndex}%`, display: altIndex < 50 ? 'block' : 'none' }}
            ></div>
             <div 
                className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-purple-500 to-transparent opacity-80 transition-all duration-1000"
                style={{ left: `${altIndex}%`, display: altIndex > 50 ? 'block' : 'none' }}
            ></div>
        </div>

        {/* Labels under bar */}
        <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
            <span className="text-orange-400">Bitcoin Max</span>
            <span>Neutru</span>
            <span className="text-purple-400">Altseason</span>
        </div>
      </div>

      {/* EXPLICATIE */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2 text-[10px] text-gray-400 leading-relaxed">
        <Info size={12} className="shrink-0 mt-0.5 text-blue-400"/>
        <p>
            Indicator calculat pe baza <strong className="text-white">BTC Dominance ({dominance.toFixed(1)}%)</strong>. 
            Când dominanța scade, lichiditatea se mută agresiv în Altcoins.
        </p>
      </div>

    </div>
  );
}