import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CryptoHeatmap from '@/components/market/CryptoHeatmap';
import AffiliateCta from '@/components/market/AffiliateCta';
import { LayoutGrid } from 'lucide-react';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Harta pieței crypto | Variații 24h',
  description:
    'Harta pieței crypto: variația pe 24 de ore a principalelor active după capitalizare. Nu este un flux de lichidări live.',
  alternates: {
    canonical: `${SITE_URL}/lichidari`,
  },
};

export const revalidate = 60;

export default function LiquidationsPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Navbar />

      <div className="container mx-auto flex-grow px-4 py-10 md:py-12 max-w-7xl">
        <header className="mb-8 md:mb-10 text-center md:text-left">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-300">
            <LayoutGrid size={14} />
            Harta pieței
          </span>
          <h1 className="mb-3 text-3xl font-black tracking-tight md:text-5xl font-[var(--font-space)]">
            Harta <span className="text-violet-400">pieței</span>
          </h1>
          <p className="max-w-2xl text-sm text-slate-400 md:text-base font-[var(--font-inter)] mx-auto md:mx-0">
            Dimensiunea fiecărui bloc reflectă capitalizarea de piață. Culoarea arată variația
            pe 24 de ore — verde pentru creșteri, roșu pentru scăderi.
          </p>
        </header>

        <CryptoHeatmap />

        <div className="mt-12 mb-8">
          <AffiliateCta />
        </div>
      </div>

      <Footer />
    </main>
  );
}
