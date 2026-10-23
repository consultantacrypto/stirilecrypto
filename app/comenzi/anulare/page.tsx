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
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-20">
        <h1 className="font-[var(--font-space)] text-3xl font-bold">Plata nu a fost finalizată</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Nu s-a încasat nimic din această încercare. Poți reveni la produs când vrei.
        </p>
        <div className="mt-8 flex gap-4 text-sm font-semibold">
          <Link href="/analiza-tehnica" className="text-white underline">
            Analiză tehnică
          </Link>
          <Link href="/raport-risc" className="text-white underline">
            Raport de risc
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
