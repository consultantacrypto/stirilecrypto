'use client';

import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';

type NavItem = { href: string; label: string };

const WALLET_LINK: NavItem = { href: '/verificare-portofel?src=nav', label: 'Verificare portofel' };

const MAIN_LINKS: NavItem[] = [
  { href: '/stiri', label: 'Știri' },
  { href: '/market', label: 'Piața azi' },
  { href: '/market-pulse', label: 'Pulsul Bitcoin' },
  WALLET_LINK,
  { href: '/taxe', label: 'Taxe crypto 2026' },
];

const MORE_LINKS: NavItem[] = [
  { href: '/raport-strategic', label: 'Ce cumpără balenele' },
  { href: '/incepe-aici', label: 'Începe aici' },
  { href: '/interviuri', label: 'Interviuri' },
  { href: '/lichidari', label: 'Harta pieței' },
  { href: '/glosar', label: 'Glosar' },
  { href: '/academie', label: 'Educație' },
];

const ANALYSIS_HREF = '/analiza-tehnica?src=nav';

function pathOf(href: string): string {
  return href.split('?')[0];
}

function isPathActive(pathname: string, href: string): boolean {
  const path = pathOf(href);
  if (path === '/') return pathname === '/';
  if (path === '/market') {
    return pathname === '/market' || pathname.startsWith('/market/') || pathname === '/lichidari' || pathname === '/dashboard';
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreId = useId();
  const moreActive = MORE_LINKS.some((item) => isPathActive(pathname, item.href));

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    function onPointer(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMoreOpen(false);
    }
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [moreOpen]);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-[#020617]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Știrile Crypto — Acasă">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold tracking-tighter text-black">
            ȘC
          </span>
          <span className="hidden text-base font-semibold tracking-tight text-white sm:inline">Știrile Crypto</span>
        </Link>

        <nav aria-label="Principal" className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
          {MAIN_LINKS.map((item) => {
            const active = isPathActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] transition-colors hover:bg-white/10 hover:text-white ${
                  active ? 'bg-white/10 font-semibold text-white' : 'font-medium text-slate-300'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13px] hover:bg-white/10 hover:text-white ${
                moreActive || moreOpen ? 'bg-white/10 font-semibold text-white' : 'font-medium text-slate-300'
              }`}
              aria-expanded={moreOpen}
              aria-controls={moreId}
              onClick={() => setMoreOpen((open) => !open)}
            >
              Mai mult
              <ChevronDown size={14} aria-hidden className={moreOpen ? 'rotate-180' : ''} />
            </button>
            {moreOpen ? (
              <div
                id={moreId}
                className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-64 rounded-2xl border border-white/10 bg-[#0b1220] p-2 shadow-2xl"
              >
                {MORE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-3 py-2.5 text-sm hover:bg-white/10 hover:text-white ${
                      isPathActive(pathname, item.href) ? 'bg-white/10 font-semibold text-white' : 'text-slate-200'
                    }`}
                    onClick={() => setMoreOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/cauta"
            aria-label="Caută articole"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 ${
              isPathActive(pathname, '/cauta') ? 'bg-white/10 text-white' : 'text-slate-200'
            }`}
          >
            <Search size={18} aria-hidden />
          </Link>
          <Link
            href={ANALYSIS_HREF}
            className="hidden h-10 items-center whitespace-nowrap rounded-full bg-white px-4 text-sm font-bold text-black hover:bg-slate-100 xl:inline-flex"
          >
            Analiză tehnică – de la {MAJOR_PRICE_RON} lei
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 xl:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Închide meniul' : 'Deschide meniul'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="absolute left-0 top-16 z-40 max-h-[calc(100vh-4rem)] w-full overflow-y-auto border-b border-white/10 bg-[#020617] px-4 py-4 xl:hidden">
          <Link
            href={ANALYSIS_HREF}
            onClick={() => setMobileOpen(false)}
            className="mb-3 flex h-12 items-center justify-center rounded-full bg-white text-sm font-bold text-black"
          >
            Analiză tehnică – de la {MAJOR_PRICE_RON} lei
          </Link>
          <Link
            href={WALLET_LINK.href}
            onClick={() => setMobileOpen(false)}
            className={`mb-2 rounded-xl px-3 py-3 text-base hover:bg-white/10 ${
              isPathActive(pathname, WALLET_LINK.href) ? 'bg-white/10 font-semibold text-white' : 'text-slate-200'
            }`}
          >
            {WALLET_LINK.label}
          </Link>
          <div className="flex flex-col gap-1">
            {[...MAIN_LINKS.filter((item) => item.href !== WALLET_LINK.href), ...MORE_LINKS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3 py-3 text-base hover:bg-white/10 ${
                  isPathActive(pathname, item.href) ? 'bg-white/10 font-semibold text-white' : 'text-slate-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
    <div className="h-16" aria-hidden="true" />
    </>
  );
}
