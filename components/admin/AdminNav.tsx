'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Mic2, Radar } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Articole', icon: FileText, exact: true },
  { href: '/admin/interviuri', label: 'Interviuri', icon: Mic2, exact: false },
  { href: '/admin/radar', label: 'Trend Radar', icon: Radar, exact: false },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-white/10 pb-6 mb-8"
      aria-label="Navigare admin"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors font-[var(--font-inter)] ${
              active
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            <Icon size={16} aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
