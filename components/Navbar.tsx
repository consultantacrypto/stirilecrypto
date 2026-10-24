'use client';

import { Menu, Shield, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SOCIAL_LINKS } from '@/lib/social';

/** Main site navigation — desktop pill + mobile drawer share this list */
const CENTER_LINKS = [
  { href: '/stiri', label: 'Știri' },
  { href: '/interviuri', label: 'Interviuri' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/market', label: 'Date Piață' },
  { href: '/academie', label: 'Educație' },
  { href: '/lichidari', label: 'Harta pieței' },
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
    <div className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <nav className="relative flex w-full items-center justify-between px-6 py-4">
        <Link href="/" className="z-10 shrink-0" aria-label="Știrile Crypto — Acasă">
          <div className="group flex cursor-pointer items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105">
              <span className="text-sm font-bold tracking-tighter text-black">ȘC</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Știrile Crypto.</span>
          </div>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/5 bg-white/[0.03] p-1 lg:flex">
          {CENTER_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={centerNavClass(pathname, href)}>
              {label}
            </Link>
          ))}
        </div>

        <div className="z-10 hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href="/raport-strategic"
            className={`rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105 ${
              isPathActive(pathname, '/raport-strategic') ? 'ring-2 ring-white/30' : ''
            }`}
          >
            Dosar strategic
          </Link>
        </div>

        <button
          type="button"
          className="z-10 inline-flex min-h-12 min-w-12 items-center justify-center rounded-full p-3 text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Închide meniul' : 'Deschide meniul'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </nav>

      <div className="flex flex-wrap items-center gap-1 border-t border-white/10 px-4 py-2 sm:px-6">
        <Link
          href="/analiza-tehnica?src=nav"
          className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/10 hover:text-white ${
            isPathActive(pathname, '/analiza-tehnica') ? 'bg-white/10 text-white' : 'text-slate-200'
          }`}
        >
          Analiză tehnică
          <span className="whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[10px] font-bold tracking-wide text-black">
            de la 79 lei
          </span>
        </Link>
        <Link
          href="/verificare-portofel?src=nav"
          className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-white/10 hover:text-white ${
            isPathActive(pathname, '/verificare-portofel') ? 'bg-white/10 font-semibold text-white' : 'font-medium text-slate-300'
          }`}
        >
          <Shield size={14} aria-hidden />
          Verificare portofel crypto
        </Link>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white"
          >
            {link.shortLabel}
          </a>
        ))}
      </div>

      {mobileMenuOpen ? (
        <div className="absolute top-full left-0 z-30 flex w-full flex-col gap-2 border-b border-white/10 bg-black/95 px-4 py-6 backdrop-blur-3xl lg:hidden">
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
            href="/verificare-portofel?src=nav"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex w-full items-center gap-2 rounded-2xl px-5 py-4 text-base ${
              isPathActive(pathname, '/verificare-portofel')
                ? 'bg-white/10 font-semibold text-white'
                : 'font-medium text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Shield size={16} aria-hidden />
            Verificare portofel crypto
          </Link>
          <Link
            href="/raport-strategic"
            onClick={() => setMobileMenuOpen(false)}
            className={`mt-2 block w-full rounded-full px-5 py-4 text-center text-sm font-bold text-black transition-transform active:scale-[0.98] ${
              isPathActive(pathname, '/raport-strategic') ? 'bg-white ring-2 ring-white/30' : 'bg-white'
            }`}
          >
            Dosar strategic
          </Link>
        </div>
      ) : null}
    </div>
  );
}
