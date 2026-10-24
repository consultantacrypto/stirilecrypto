import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TaxCalculator from '@/components/TaxCalculator';
import TaxServicePromos from '@/components/services/TaxServicePromos';
import { FISCAL_GUIDE_D212_HREF, FISCAL_GUIDE_PATH } from '@/lib/fiscal-2026';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Taxe crypto 2026';
const DESCRIPTION =
  'Calculează orientativ impozitul de 16% și CASS pentru câștigurile din crypto în România, cu cifrele din ghidul fiscal.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/taxe` },
  ...buildWebsiteShareMetadata({ title: TITLE, description: DESCRIPTION, canonical: `${SITE_URL}/taxe` }),
};

export default function TaxePage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-[var(--font-space)] text-4xl font-black tracking-tight md:text-5xl">Taxe crypto 2026</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Pui suma câștigurilor în lei și, dacă ai, alte venituri din afara salariului. Primești impozitul și CASS-ul
          din ghidul nostru pentru 2026.
        </p>
        <p className="mt-3 text-sm font-semibold text-amber-200">Orientativ, verifică cu contabilul.</p>
        <div className="mt-8">
          <TaxCalculator />
        </div>
        <p className="mt-8 flex flex-col gap-2 text-sm">
          <Link href={FISCAL_GUIDE_PATH} className="text-blue-300 underline underline-offset-4">
            Ghidul complet: Taxe crypto 2026
          </Link>
          <Link href={FISCAL_GUIDE_D212_HREF} className="text-blue-300 underline underline-offset-4">
            Cum completezi Declarația unică (D212)
          </Link>
        </p>
        <TaxServicePromos />
      </div>
      <Footer />
    </main>
  );
}
