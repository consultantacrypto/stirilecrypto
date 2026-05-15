'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Youtube, BrainCircuit, Menu, X, Newspaper, Activity, Book, BarChart3, Flame } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <Link href="/" className="group cursor-pointer shrink-0" aria-label="Știrile Crypto — Acasă">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
            <rect width="40" height="40" rx="8" fill="#020617"/>
            <path d="M10 28L18 18L24 22L32 12" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M32 12V20M32 12H24" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="28" r="2" fill="#60A5FA"/>
          </svg>
          <div className="flex flex-col justify-center">
            <span className="font-bold text-lg leading-none tracking-tight text-white font-[var(--font-space)]">ȘTIRILE CRYPTO</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.1em] uppercase leading-none mt-1">Terminal</span>
          </div>
        </div>
      </Link>

      <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-300">
          <Link href="/market" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 animate-pulse-slow">
            <Activity size={16} /> MARKET DATA
          </Link>

          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Link href="/stiri" className="hover:text-white transition-colors flex items-center gap-2">
                <Newspaper size={16}/> Știri
            </Link>
            <Link href="/academie" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                <Book size={16} className="group-hover:scale-110 transition-transform"/> Academia
            </Link>
            <Link href="/lichidari" className="hover:text-orange-400 transition-colors flex items-center gap-2 group">
                <Flame size={16} className="group-hover:scale-110 transition-transform"/> Lichidări
            </Link>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <a href="/#ai" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <BrainCircuit size={16} className="group-hover:animate-pulse"/> AI
            </a>
          </div>

          <div className="w-px h-8 bg-white/10 mx-2"></div>

          <Link href="/raport-strategic" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full border border-white/10 hover:border-white/20">
            <BarChart3 size={16}/> Raport Strategic
          </Link>
          
          <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors ml-2" aria-label="YouTube">
              <Youtube size={20}/> 
          </a>
      </div>

      <div className="flex items-center gap-4">
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Meniu">
            {mobileMenuOpen ? <X/> : <Menu/>}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#020617] border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden shadow-2xl">
             <Link href="/market" onClick={() => setMobileMenuOpen(false)} className="text-green-400 py-2 border-b border-white/5 font-bold flex items-center gap-2"><Activity size={18}/> Market Data</Link>
             <Link href="/stiri" onClick={() => setMobileMenuOpen(false)} className="text-white py-2 border-b border-white/5 font-bold flex items-center gap-2"><Newspaper size={18}/> Știri</Link>
             <Link href="/academie" onClick={() => setMobileMenuOpen(false)} className="text-cyan-400 py-2 border-b border-white/5 font-bold flex items-center gap-2"><Book size={18}/> Academia</Link>
             <Link href="/lichidari" onClick={() => setMobileMenuOpen(false)} className="text-orange-400 py-2 border-b border-white/5 font-bold flex items-center gap-2"><Flame size={18}/> Lichidări</Link>
             <Link href="/raport-strategic" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 py-2 border-b border-white/5 font-bold flex items-center gap-2"><BarChart3 size={18}/> Raport Strategic</Link>
             <a href="/#ai" onClick={() => setMobileMenuOpen(false)} className="text-blue-400 py-2 font-bold flex items-center gap-2"><BrainCircuit size={18}/> AI Terminal</a>
        </div>
      )}
    </nav>
  );
}
