import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckerFrame } from '../verifica-adresa/frame';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';
import { checkerFormEmbedSrc } from '@/lib/products/placement';

const TITLE = 'Verifică portofelul înainte să trimiți bani';
const DESCRIPTION = 'Afli dacă adresa crypto e legată de țepe, hackuri sau fonduri furate.';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/verificare-portofel` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/verificare-portofel`,
  }),
};

export default function VerificarePortofelPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <div className="py-8 sm:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-400">Verificare portofel</p>
          <h1 className="mt-4 max-w-3xl font-[var(--font-space)] text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{DESCRIPTION}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Adresa crypto este codul public al portofelului, nu o adresă poștală. Raportul nu mută banii și nu
            cere cheia sau cele 12 cuvinte. Plata se face la QuickExit LLC, nu pe Știrile Crypto.
          </p>
        </div>
        <CheckerFrame title={TITLE} src={checkerFormEmbedSrc()} />
      </main>
      <Footer />
    </div>
  );
}
