'use client';

import { Youtube, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const linkClass =
  'text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-black/70 backdrop-blur-2xl border-b border-white/10">
      <Link href="/" className="shrink-0" aria-label="Știrile Crypto — Acasă">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="font-bold text-black text-sm tracking-tighter">ȘC</span>
          </div>
          <span className="font-semibold text-xl tracking-tight text-white">Știrile Crypto.</span>
        </div>
      </Link>

      <div className="hidden lg:flex items-center gap-8">
        <Link href="/market" className={linkClass}>
          Market
        </Link>
        <Link href="/stiri" className={linkClass}>
          Știri
        </Link>
        <Link href="/academie" className={linkClass}>
          Academia
        </Link>
        <Link href="/lichidari" className={linkClass}>
          Lichidări
        </Link>
        <Link href="/raport-strategic" className={linkClass}>
          Raport
        </Link>
        <a
          href="https://www.youtube.com/@DanielMihaiCrypto"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          aria-label="YouTube"
        >
          <Youtube size={20} />
        </a>
      </div>

      <button
        type="button"
        className="lg:hidden text-white p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Meniu"
      >
        {mobileMenuOpen ? <X /> : <Menu />}
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden">
          <Link
            href="/market"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 py-2 font-medium"
          >
            Market
          </Link>
          <Link
            href="/stiri"
            onClick={() => setMobileMenuOpen(false)}
            className="text-white py-2 font-medium"
          >
            Știri
          </Link>
          <Link
            href="/academie"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 py-2 font-medium"
          >
            Academia
          </Link>
          <Link
            href="/lichidari"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 py-2 font-medium"
          >
            Lichidări
          </Link>
          <Link
            href="/raport-strategic"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 py-2 font-medium"
          >
            Raport Strategic
          </Link>
        </div>
      )}
    </nav>
  );
}
