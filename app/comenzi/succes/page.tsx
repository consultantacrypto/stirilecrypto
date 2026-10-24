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
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-20">
        <h1 className="font-[var(--font-space)] text-3xl font-bold">Plata a fost inițiată</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Dacă Stripe a confirmat plata, un coleg pregătește analiza, Daniel Mihai o revizuiește, iar
          materialul pleacă pe email de la contact@stirilecrypto.ro, de regulă în 24 de ore în zilele
          lucrătoare. Pagina aceasta nu înlocuiește confirmarea din contul de plată și nu înseamnă că
          analiza a fost deja trimisă.
        </p>
        <Link href="/" className="mt-8 inline-block text-sm font-semibold text-white underline">
          Înapoi la știri
        </Link>
      </main>
      <Footer />
    </div>
  );
}
