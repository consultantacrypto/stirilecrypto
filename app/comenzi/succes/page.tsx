import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Plată înregistrată',
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main className="relative mx-auto max-w-xl px-4 py-16 sm:py-24">
        <div className="mesh-hero pointer-events-none absolute inset-x-0 top-0 h-64" aria-hidden="true" />
        <div className="relative rounded-3xl border border-white/10 bg-[#12141a]/90 p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">Comandă</p>
          <h1 className="mt-3 font-[var(--font-space)] text-3xl font-semibold tracking-tight">Plata a fost inițiată</h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">
            Dacă Stripe a confirmat plata, un coleg pregătește analiza, Daniel Mihai o revizuiește, iar
            materialul pleacă pe email de la contact@stirilecrypto.ro, de regulă în 24 de ore în zilele
            lucrătoare. Pagina aceasta nu înlocuiește confirmarea din contul de plată și nu înseamnă că
            analiza a fost deja trimisă.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Înapoi la știri
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
