import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AffiliateSection from '@/components/AffiliateSection'; 
import TickerTape from '@/components/TickerTape'; 
import InstitutionalTracker from '@/components/InstitutionalTracker';
import WhaleWallWidget from '@/components/WhaleWallWidget'; 
// ✅ IMPORT NOU: Altcoin Season Widget
import AltcoinSeasonWidget from '@/components/AltcoinSeasonWidget';

import { getGlobalData, getFearGreed } from '@/lib/market-api';
import { Activity, DollarSign, Layers, BarChart3, Zap, Calendar, Flame, Clock, TrendingUp, Skull, ArrowRight, BrainCircuit, LineChart } from 'lucide-react';
import Link from 'next/link';

// --- TIPURI ---
interface GlobalData {
  marketCap: number;
  volume: number;
  btcDominance: number;
  marketCapChange: number;
}

interface FearGreedData {
  value: number;
  value_classification: string;
}

// --- UTILITARE ---
const formatCurrency = (value: number | undefined | null) => {
  if (value === undefined || value === null || isNaN(value)) return "$0.00";
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (absValue >= 1e12) return `${sign}$${(absValue / 1e12).toFixed(2)} T`;
  if (absValue >= 1e9) return `${sign}$${(absValue / 1e9).toFixed(2)} B`;
  if (absValue >= 1e6) return `${sign}$${(absValue / 1e6).toFixed(2)} M`;
  return `${sign}$${absValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getFearGreedStyles = (value: number) => {
  if (value >= 70) return { color: 'text-green-400', text: 'EUFORIE' };
  if (value >= 50) return { color: 'text-emerald-500', text: 'LĂCOMIE' };
  if (value >= 30) return { color: 'text-orange-400', text: 'CALM' };
  return { color: 'text-red-500', text: 'TEAMĂ' };
};

export const revalidate = 60;

export default async function MarketPage() {
  
  // 1. DATA FETCHING
  let globalData: GlobalData | null = null;
  let fearGreedData: FearGreedData | null = null;

  try {
    const [globalRes, fgRes] = await Promise.allSettled([
      getGlobalData(),
      getFearGreed()
    ]);
    if (globalRes.status === 'fulfilled') globalData = globalRes.value;
    if (fgRes.status === 'fulfilled') fearGreedData = fgRes.value;
  } catch (error) {
    console.error("API Error:", error);
  }

  // 2. UI VARIABLES
  const marketCap = formatCurrency(globalData?.marketCap);
  const volume = formatCurrency(globalData?.volume);
  const dominance = globalData?.btcDominance ? `${globalData.btcDominance.toFixed(1)}%` : "54.2%";
  const change = globalData?.marketCapChange ? globalData.marketCapChange.toFixed(2) : "+0.00";
  
  const fgValue = fearGreedData?.value || 50;
  const { color: fgColor, text: fgText } = getFearGreedStyles(fgValue);

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                    <Activity className="text-white" size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    Market <span className="text-blue-500">Data</span>
                </h1>
            </div>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl">
                Informații instituționale, sentimentul pieței și fluxurile de bani în timp real.
            </p>
        </div>

        {/* TICKER */}
        <div className="mb-8">
            <Suspense fallback={<div className="h-10 bg-white/5 rounded animate-pulse"></div>}>
                <TickerTape />
            </Suspense>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* STANGA (MAIN CONTENT) */}
            <div className="xl:col-span-9 space-y-8">
                
                {/* 1. METRICS CARDS */}
                <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 snap-x hide-scrollbar">
                    {/* Calendar */}
                    <div className="min-w-[200px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-between h-full mr-2 md:mr-0">
                        <div className="text-indigo-300 text-xs font-bold uppercase mb-2 flex items-center gap-1">
                            <Calendar size={12}/> Calendar Economic
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Miercuri</span>
                                <span className="text-white font-bold">ADP Employment</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-1">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Joi</span>
                                <span className="text-white font-bold">Jobless Claims</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 flex items-center gap-1"><Clock size={10}/> Vineri</span>
                                <span className="text-white font-bold flex items-center gap-1">NFP & Unempl. <Flame size={10} className="text-red-500"/></span>
                            </div>
                        </div>
                    </div>
                    {/* Market Cap */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Market Cap</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{marketCap}</div>
                        <div className={`text-xs font-bold ${Number(change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(change) >= 0 ? '▲' : '▼'} {change}% (24h)
                        </div>
                    </div>
                    {/* Volume */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><BarChart3 size={12}/> Volum 24h</div>
                        <div className="text-2xl font-black text-white font-[var(--font-space)]">{volume}</div>
                        <div className="text-xs text-gray-400">Lichiditate Globală</div>
                    </div>
                    {/* Dominance */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Layers size={12}/> BTC Dominance</div>
                        <div className="text-2xl font-black text-yellow-500 font-[var(--font-space)]">{dominance}</div>
                        <div className="text-xs text-gray-400">Restul e Altseason?</div>
                    </div>
                    {/* Fear & Greed */}
                    <div className="min-w-[160px] flex-shrink-0 bg-[#0b1221] p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors snap-start flex flex-col justify-center h-full">
                        <div className="text-gray-500 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Zap size={12}/> Frică & Lăcomie</div>
                        <div className={`text-2xl font-black font-[var(--font-space)] ${fgColor}`}>{fgValue}</div>
                        <div className={`text-xs font-bold uppercase ${fgColor}`}>{fgText}</div>
                    </div>
                </div>

                {/* BANNER PEAK SIGNALS */}
                <Link href="/market/peak-signals" className="block group">
                    <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 hover:border-blue-500/50 p-6 md:p-8 rounded-2xl relative overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group-hover:-translate-y-1">
                        
                        {/* Background Elements */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <BrainCircuit size={120} className="text-blue-500" />
                        </div>
                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                    <LineChart size={12} />
                                    Analiză On-Chain
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                    INDICATORI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">TOP CICLU BITCOIN</span>
                                </h2>
                                <p className="text-gray-400 max-w-xl text-sm md:text-base leading-relaxed">
                                    Nu ghici vârful. Folosește matematica. Vezi exact unde ne aflăm între <span className="text-green-400 font-bold">Acumulare</span> și <span className="text-red-400 font-bold">Euforie</span> folosind "2-Year MA Multiplier".
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <span className="bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all flex items-center gap-2">
                                    Vezi Grafic Complet <ArrowRight size={18} />
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* 3. INSTITUTIONAL TRACKER */}
                <div className="space-y-6">
                    <div className="bg-[#0b1221] rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative z-10 md:static sticky left-0 right-0 bg-[#0a0f1e] md:bg-transparent">
                        <InstitutionalTracker />
                    </div>
                    
                    <div className="md:hidden flex items-center justify-center gap-2 text-xs text-gray-500 animate-pulse mt-2">
                        <span>↔️ Swipe stânga-dreapta pe tabel / ↕️ Scroll pagină</span>
                    </div>

                    {/* BUTON TOP 20 - MARE */}
                    <Link href="/stiri/sezonul-celor-20-investitori-titani" className="block group">
                        <div className="w-full bg-gradient-to-r from-blue-900/50 to-indigo-900/50 hover:from-blue-800 hover:to-indigo-800 border border-blue-500/30 p-6 rounded-xl flex items-center justify-between transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                                    <TrendingUp className="text-blue-400" />
                                    Cei "20 de Titani"
                                </h3>
                                <p className="text-sm text-gray-300">Vezi cine controlează de fapt piața în 2026</p>
                            </div>
                            <div className="bg-blue-600 text-white p-2 rounded-full group-hover:bg-blue-500 transition-colors">
                                <ArrowRight />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* DREAPTA: SIDEBAR WIDGETS */}
            <div className="xl:col-span-3 flex flex-col gap-6">
                
                <div className="sticky top-24 space-y-6">
                    {/* 1. LICHIDĂRI LIVE */}
                    <Link 
                        href="/lichidari" 
                        className="block w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 p-4 rounded-xl shadow-lg shadow-orange-900/20 transform hover:scale-[1.02] transition-all group border border-orange-400/20 relative overflow-hidden"
                    >
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-[10px] font-bold text-orange-100 uppercase tracking-wider">LIVE</span>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-white font-black text-lg animate-pulse">
                            <Skull className="text-white" size={24} />
                            LICHIDĂRI LIVE
                        </div>
                        <div className="text-center text-orange-100 text-xs font-bold mt-1 uppercase tracking-wider">
                            Vezi Harta Durerii &rarr;
                        </div>
                    </Link>

                    {/* ✅ 2. ALTCOIN SEASON (Widget Nou) */}
                    <AltcoinSeasonWidget />

                    {/* 3. WHALE WALL */}
                    <WhaleWallWidget />

                    {/* Link Academia */}
                    <div className="pt-2">
                        <Link href="/academie" className="block w-full text-center py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 transition-all">
                            Accesează Academia Completă &rarr;
                        </Link>
                    </div>
                </div>

            </div>

        </div>

        <div className="mt-12 md:mt-20">
            <AffiliateSection />
        </div>

      </main>
      <Footer />
    </div>
  );
}