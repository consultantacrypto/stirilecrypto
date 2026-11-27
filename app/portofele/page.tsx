import { withRssAlternate } from '@/lib/rss-alternate';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TangemBlackFridayBanner from '@/components/wallets/TangemBlackFridayBanner';
import WalletCatalog from '@/components/wallets/WalletCatalog';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Portofele crypto';
const DESCRIPTION =
  'Portofele hardware, cu prețuri de pornire și linkuri către magazinele oficiale. Știrile Crypto nu vinde dispozitivele.';
const CANONICAL = `${SITE_URL}/portofele`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: withRssAlternate({ canonical: CANONICAL }),
  ...buildWebsiteShareMetadata({ title: TITLE, description: DESCRIPTION, canonical: CANONICAL }),
};

export default function PortofelePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-8 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-400">Catalog</p>
        <h1 className="mt-3 max-w-3xl font-[var(--font-space)] text-4xl font-bold tracking-tight md:text-5xl">
          {TITLE}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
          Modelele de mai jos, cu prețul de la care pornește fiecare. Linkul deschide magazinul producătorului.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
          Unele linkuri sunt de afiliere. Dacă cumperi prin ele, partenerul poate plăti un comision publicației,
          fără cost în plus pentru tine. Nu vindem și nu ținem stoc. Detaliile sunt în pagina{' '}
          <Link href="/publicitate" className="text-slate-200 underline decoration-white/20 underline-offset-4">
            Publicitate și afiliere
          </Link>
          .
        </p>
        <TangemBlackFridayBanner />
        <WalletCatalog />
      </main>
      <Footer />
    </div>
  );
}
