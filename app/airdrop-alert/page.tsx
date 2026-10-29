import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AirdropAlertBoard from '@/components/AirdropAlertBoard';
import { getPublishedAirdropAlerts } from '@/lib/airdrop-alerts-db';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Airdrop Alert';
const DESCRIPTION =
  'Programe de airdrop și puncte: stare, fereastră și sursa principală. Fără pași de claim și fără ghid de farming.';

export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/airdrop-alert` },
  robots: { index: true, follow: true },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/airdrop-alert`,
  }),
};

export default async function AirdropAlertPage() {
  const feed = await getPublishedAirdropAlerts();

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">Programe urmărite</p>
        <h1 className="mt-3 font-[var(--font-space)] text-4xl font-black tracking-tight md:text-5xl">{TITLE}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
          Programe de puncte și airdrop-uri pe care le urmărim. Vezi starea, fereastra și sursa.
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
          Nu îți spunem ce să semnezi și nu îți dăm pași de farming. Dacă prinzi tokeni, treaba fiscală o verifici cu
          un contabil — vezi{' '}
          <Link href="/taxe" className="text-blue-300 underline underline-offset-4">
            Taxe crypto 2026
          </Link>
          . Un airdrop poate fi și o momeală.
        </p>

        <div className="mt-10">
          {feed.items.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-slate-400">
              Niciun program publicat acum. Revenim când redacția pune rânduri live.
            </p>
          ) : (
            <AirdropAlertBoard items={feed.items} />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
