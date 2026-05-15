'use client';

import { ArrowRight } from 'lucide-react';

export default function AffiliateSection() {
  return (
    <div className="w-full bg-[#0a0f1e] border border-white/5 rounded-3xl p-8 my-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/5 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Tranzacționează Profesionist</h3>
        <p className="text-gray-400 text-sm">Folosește link-urile mele pentru reduceri la taxe și acces în grupurile exclusive.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* BYBIT (Link extras: LUCKY7777) */}
        <a href="https://partner.bybit.eu/b/LUCKY7777" target="_blank" className="group bg-[#17181e] border border-white/10 hover:border-[#f7a600] p-6 rounded-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black text-white">BYBIT</span>
                <span className="bg-[#f7a600]/20 text-[#f7a600] text-[10px] font-bold px-2 py-1 rounded">PREFERAT</span>
            </div>
            <p className="text-gray-400 text-xs mb-4 h-10">Platforma #1 pentru Futures și Copy Trading. Lichiditate masivă.</p>
            <div className="flex items-center text-[#f7a600] text-sm font-bold">
                Deschide Cont <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
            </div>
        </a>

        {/* BINANCE (Link extras: 35329648) */}
        <a href="https://www.binance.com/join?ref=35329648" target="_blank" className="group bg-[#17181e] border border-white/10 hover:border-[#FCD535] p-6 rounded-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black text-white">BINANCE</span>
                <span className="bg-[#FCD535]/20 text-[#FCD535] text-[10px] font-bold px-2 py-1 rounded">CEL MAI MARE</span>
            </div>
            <p className="text-gray-400 text-xs mb-4 h-10">Lider mondial. Cel mai mare volum și cele mai multe monede listate.</p>
            <div className="flex items-center text-[#FCD535] text-sm font-bold">
                Deschide Cont <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
            </div>
        </a>

        {/* OKX (Link extras: 77249876) */}
        <a href="https://www.okx.com/join/77249876" target="_blank" className="group bg-[#17181e] border border-white/10 hover:border-white p-6 rounded-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black text-white">OKX</span>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded">WEB3</span>
            </div>
            <p className="text-gray-400 text-xs mb-4 h-10">Cel mai bun wallet Web3 și interfață curată pentru trading avansat.</p>
            <div className="flex items-center text-white text-sm font-bold">
                Deschide Cont <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
            </div>
        </a>

      </div>
    </div>
  );
}