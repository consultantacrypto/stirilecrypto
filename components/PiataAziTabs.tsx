'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/market', label: 'Prețuri' },
  { href: '/lichidari', label: 'Harta' },
  { href: '/dashboard', label: 'Tablou' },
] as const;

export default function PiataAziTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Piața azi" className="mb-8">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Piața azi</p>
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${
                active ? 'bg-white text-black' : 'border border-white/15 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
