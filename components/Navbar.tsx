'use client';

import { Youtube, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CENTER_LINKS = [
  { href: '/stiri', label: 'Știri' },
  { href: '/market', label: 'Market' },
  { href: '/academie', label: 'Academia' },
  { href: '/lichidari', label: 'Lichidări' },
] as const;

function isPathActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function centerNavClass(pathname: string, href: string): string {
  const active = isPathActive(pathname, href);
  const base =
    'px-4 py-2 rounded-full transition-all duration-300 text-sm hover:bg-white/10 hover:text-white';
  return active
    ? `${base} text-white font-semibold bg-white/10`
    : `${base} text-slate-400 font-medium`;
}

function mobileNavClass(pathname: string, href: string): string {
  const active = isPathActive(pathname, href);
  const base =
    'block w-full rounded-2xl px-5 py-4 text-base transition-all duration-300 hover:bg-white/10';
  return active
    ? `${base} text-white font-semibold bg-white/10`
    : `${base} text-slate-400 font-medium hover:text-white`;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="relative w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50 bg-black/70 backdrop-blur-2xl border-b border-white/10">
      {/* LEFT — Logo */}
      <Link href="/" className="shrink-0 z-10" aria-label="Știrile Crypto — Acasă">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="font-bold text-black text-sm tracking-tighter">ȘC</span>
          </div>
          <span className="font-semibold text-xl tracking-tight text-white">Știrile Crypto.</span>
        </div>
      </Link>

      {/* CENTER — Main navigation (desktop) */}
      <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5 p-1 rounded-full border border-white/5 bg-white/[0.03]">
        {CENTER_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className={centerNavClass(pathname, href)}>
            {label}
          </Link>
        ))}
      </div>

      {/* RIGHT — Conversion */}
      <div className="hidden lg:flex items-center gap-3 z-10 shrink-0">
        <Link
          href="/raport-strategic"
          className={`bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform ${
            isPathActive(pathname, '/raport-strategic') ? 'ring-2 ring-white/30' : ''
          }`}
        >
          Raport Strategic
        </Link>
        <a
          href="https://www.youtube.com/@DanielMihaiCrypto"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
          aria-label="YouTube"
        >
          <Youtube size={20} />
        </a>
      </div>

      {/* Mobile menu toggle */}
      <button
        type="button"
        className="lg:hidden z-10 text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE — Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full lg:hidden bg-black/90 backdrop-blur-3xl border-b border-white/10 px-4 py-6 flex flex-col gap-2">
          {CENTER_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavClass(pathname, href)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/raport-strategic"
            onClick={() => setMobileMenuOpen(false)}
            className={`mt-2 block w-full text-center rounded-full px-5 py-4 font-bold text-sm transition-transform active:scale-[0.98] ${
              isPathActive(pathname, '/raport-strategic')
                ? 'bg-white text-black ring-2 ring-white/30'
                : 'bg-white text-black'
            }`}
          >
            Raport Strategic
          </Link>
          <a
            href="https://www.youtube.com/@DanielMihaiCrypto"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-slate-400 font-medium hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            <Youtube size={20} />
            YouTube
          </a>
        </div>
      )}
    </nav>
  );
}
