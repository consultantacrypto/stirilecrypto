import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Plată anulată',
  robots: { index: false, follow: false },
};

export default function OrderCancelPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main className="relative mx-auto max-w-xl px-4 py-16 sm:py-24">
        <div className="mesh-hero pointer-events-none absolute inset-x-0 top-0 h-64" aria-hidden="true" />
        <div className="relative rounded-3xl border border-white/10 bg-[#12141a]/90 p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">Comandă</p>
          <h1 className="mt-3 font-[var(--font-space)] text-3xl font-semibold tracking-tight">Plata nu a fost finalizată</h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            Nu s-a încasat nimic din această încercare. Poți reveni la produs când vrei.
          </p>
          <Link
            href="/analiza-tehnica"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Înapoi la analiză
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
