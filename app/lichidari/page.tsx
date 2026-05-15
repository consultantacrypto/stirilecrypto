import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TickerTape from '@/components/TickerTape'; // ✅ 1. IMPORTUL NOU
import LiquidationFeed from '@/components/LiquidationChart'; 
import { AlertTriangle, TrendingUp, Skull, Globe2, ShieldCheck, Zap, ExternalLink, Crown } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lichidări Crypto Global Live | Mihai Daniel',
  description: 'Vezi lichidările în timp real de pe Binance, Bybit și OKX. Analiză de piață profesională.',
};

export default function LiquidationsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Navbar />
      {/* ✅ 2. BARA CU PREȚURI (Sub Navbar, consistent cu celelalte pagini) */}
      <TickerTape />

      <div className="container mx-auto px-4 py-12 max-w-7xl flex-grow">
        
        {/* Header */}
        <div className="text-center mb-12">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 mb-4">
                <Globe2 size={14}/> Agregator Global
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-500">
                Pulsul Pieței Live
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Conectat direct la <span className="text-white font-bold">Binance, Bybit și OKX</span>. Vezi unde sunt lichidați traderii instituționali și de retail în milisecunda în care se întâmplă.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* --- COLOANA STÂNGA: INSTRUMENTE & AFILIERE (Sticky) --- */}
            {/* ✅ MODIFICARE: order-2 pe mobil (apare jos), order-1 pe desktop (apare stânga) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 order-2 lg:order-1">
                
                {/* 1. Explicația Tehnică */}
                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Skull size={80} /></div>
                    <h3 className="font-bold text-white mb-3 text-lg flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Live Feed Info
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="bg-red-900/10 border border-red-500/20 p-3 rounded-lg">
                            <strong className="text-red-400 block mb-1">Long Lichidat (Roșu)</strong>
                            <span className="text-gray-400 text-xs">A pariat pe creștere 📈. Prețul a scăzut și a pierdut tot.</span>
                        </li>
                        <li className="bg-green-900/10 border border-green-500/20 p-3 rounded-lg">
                            <strong className="text-green-400 block mb-1">Short Lichidat (Verde)</strong>
                            <span className="text-gray-400 text-xs">A pariat pe scădere 📉. Prețul a crescut și a pierdut tot.</span>
                        </li>
                    </ul>
                </div>

                {/* 2. ZONA DE CONVERSIE (Affiliates) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={16} className="text-blue-400"/>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Tranzacționează pe Platforme Sigure</span>
                    </div>

                    {/* BYBIT CARD */}
                    <a href="https://partner.bybit.eu/b/LUCKY7777" target="_blank" className="block group relative overflow-hidden rounded-xl border border-[#ffb119]/30 bg-[#17181e] p-1 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,177,25,0.2)]">
                        <div className="absolute top-0 right-0 bg-[#ffb119] text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">TOP CHOICE</div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#ffb119] rounded-lg flex items-center justify-center text-black font-black text-xs">BY</div>
                                <div>
                                    <div className="text-white font-bold text-lg leading-none">Bybit</div>
                                    <div className="text-[#ffb119] text-xs">Bonus Exclusiv</div>
                                </div>
                            </div>
                            <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-colors"/>
                        </div>
                    </a>

                    {/* BINANCE CARD */}
                    <a href="https://www.binance.com/join?ref=35329648" target="_blank" className="block group relative overflow-hidden rounded-xl border border-[#FCD535]/30 bg-[#1E2026] p-1 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(252,213,53,0.2)]">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#FCD535] rounded-lg flex items-center justify-center text-black font-black">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg"><path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.331l5.087 5.088H6.9244l5.087-5.088zM5.376 10.0798L2.6585 7.3644 10.0115.0115l7.353 7.353-2.7175 2.7164-4.6356-4.6595-4.6355 4.6595zM2.7154 9.2836L5.4318 12l-2.7164 2.7164L0 12l2.7154-2.7164z" fill="currentColor"/></svg>
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg leading-none">Binance</div>
                                    <div className="text-[#FCD535] text-xs">Lider Global</div>
                                </div>
                            </div>
                            <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-colors"/>
                        </div>
                    </a>

                    {/* OKX CARD */}
                    <a href="https://www.okx.com/join/77249876" target="_blank" className="block group relative overflow-hidden rounded-xl border border-white/20 bg-black p-1 transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-black font-black tracking-tighter">OKX</div>
                                <div>
                                    <div className="text-white font-bold text-lg leading-none">OKX</div>
                                    <div className="text-gray-400 text-xs">Tehnologie Web3</div>
                                </div>
                            </div>
                            <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-colors"/>
                        </div>
                    </a>
                </div>

                {/* 3. CONSULTANȚĂ (High Ticket) */}
                <Link href="/#consultanta" className="block mt-8 group">
                    <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-900/20 border border-yellow-500/30 p-6 rounded-2xl text-center relative overflow-hidden hover:border-yellow-500 transition-all">
                        <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
                        <Crown size={32} className="text-yellow-500 mx-auto mb-3" />
                        <h4 className="text-xl font-black text-white mb-2">Nu mai pierde bani!</h4>
                        <p className="text-sm text-gray-300 mb-4">
                            Vezi lista din dreapta? 90% nu au avut un plan. Hai să construim strategia ta.
                        </p>
                        <span className="inline-block bg-yellow-500 text-black font-bold px-6 py-2 rounded-full text-sm group-hover:scale-105 transition-transform">
                            Rezervă Consultanță
                        </span>
                    </div>
                </Link>

            </div>

            {/* --- COLOANA DREAPTA: FEED-UL LIVE (Mai lată) --- */}
            {/* ✅ MODIFICARE: order-1 pe mobil (apare primul), order-2 pe desktop (apare dreapta) */}
            <div className="lg:col-span-8 order-1 lg:order-2">
                <LiquidationFeed />
                
                <div className="mt-6 flex flex-col md:flex-row gap-4">
                    <div className="bg-yellow-900/10 border border-yellow-500/20 p-4 rounded-xl flex-1 flex items-start gap-3">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={20} />
                        <div>
                            <strong className="text-yellow-500 text-sm block mb-1">Semnal de "Whale":</strong>
                            <p className="text-gray-400 text-xs">
                                Dacă vezi o lichidare singură de peste <strong>$100,000</strong> marcată cu ⚡, înseamnă că o "balenă" a fost prinsă pe picior greșit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    
      </div>
      <Footer />
    </main>
  );
}