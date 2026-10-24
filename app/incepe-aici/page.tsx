import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FISCAL_GUIDE_PATH } from '@/lib/fiscal-2026';
import { ALTCOIN_PRICE_RON, MAJOR_PRICE_RON } from '@/lib/products/tiers';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Începe aici';
const DESCRIPTION = 'Primii pași pe Știrile Crypto: glosar, taxe, piața de azi, newsletter, analiză și verificarea portofelului.';

const STEPS = [
  { href: '/glosar', title: 'Glosar', text: 'Cuvintele din știri, explicate scurt.' },
  { href: FISCAL_GUIDE_PATH, title: 'Taxe crypto 2026', text: 'Cât plătești și cum faci declarația unică.' },
  { href: '/taxe', title: 'Calculator de taxe', text: 'O estimare în lei, de verificat cu contabilul.' },
  { href: '/market', title: 'Piața azi', text: 'Prețuri în dolari, harta pieței și tabloul de bord.' },
  { href: '/#newsletter', title: 'Știrile de dimineață', text: 'Un email pe zi, cu ce contează în piață.' },
  {
    href: '/analiza-tehnica?src=incepe-aici',
    title: 'Analiză pe tokenul tău',
    text: `${MAJOR_PRICE_RON} lei pentru o monedă mare, ${ALTCOIN_PRICE_RON} lei pentru un altcoin.`,
  },
  {
    href: '/verificare-portofel?src=incepe-aici',
    title: 'Verificare portofel crypto',
    text: 'Înainte să trimiți bani către cineva.',
  },
] as const;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/incepe-aici` },
  ...buildWebsiteShareMetadata({ title: TITLE, description: DESCRIPTION, canonical: `${SITE_URL}/incepe-aici` }),
};

export default function IncepeAiciPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-[var(--font-space)] text-4xl font-black tracking-tight md:text-5xl">Începe aici</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-300">
          Dacă e prima dată pe site, treci prin pașii de mai jos. Nu trebuie să le faci pe toate într-o zi.
        </p>
        <ol className="mt-10 space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.href}>
              <Link href={step.href} className="block rounded-2xl border border-white/10 p-5 hover:border-white/25">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Pasul {index + 1}</span>
                <span className="mt-1 block text-xl font-bold">{step.title}</span>
                <span className="mt-2 block text-slate-400">{step.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <Footer />
    </main>
  );
}
