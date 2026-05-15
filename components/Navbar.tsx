'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Youtube, BrainCircuit, Menu, X, Newspaper, Activity, Book, BarChart3, Flame } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/5 bg-[#020617]/90 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <Link href="/" className="flex items-center gap-3 group cursor-pointer" aria-label="Știrile Crypto — Acasă">
          {/* LOGO */}
          <div className="relative w-12 h-12 flex items-center justify-center bg-[#020617] rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                <defs>
                  <linearGradient id="paint0_linear" x1="130" y1="380" x2="382" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path d="M130 380 V180 L256 300 L382 180 V260" stroke="url(#paint0_linear)" strokeWidth="50" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="382" cy="130" r="30" fill="#06b6d4" />
              </svg>
          </div>
          <div className="leading-none hidden sm:block">
              <div className="font-bold text-lg tracking-wide text-white group-hover:text-blue-200 transition-colors font-[var(--font-space)]">ȘTIRILE CRYPTO</div>
              <div className="text-[9px] text-blue-400 font-mono tracking-[0.2em] uppercase mt-1">Web3 &amp; Finanțe</div>
          </div>
      </Link>
      
      {/* DESKTOP MENU */}
      <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-300">
          
          {/* 1. MARKET DATA */}
          <Link href="/market" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 animate-pulse-slow">
            <Activity size={16} /> MARKET DATA
          </Link>

          {/* 2. LINK-URI CENTRALE (EDUCATIVE) */}
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Link href="/stiri" className="hover:text-white transition-colors flex items-center gap-2">
                <Newspaper size={16}/> Știri
            </Link>
            
            {/* RĂMÂNE "ACADEMIA" AICI */}
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
          
          <a href="https://www.youtube.com/@DanielMihaiCrypto" target="_blank" className="text-gray-400 hover:text-red-500 transition-colors ml-2" aria-label="YouTube">
              <Youtube size={20}/> 
          </a>
      </div>

      {/* MOBILE */}
      <div className="flex items-center gap-4">
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X/> : <Menu/>}
        </button>
      </div>

      {/* MOBILE MENU */}
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