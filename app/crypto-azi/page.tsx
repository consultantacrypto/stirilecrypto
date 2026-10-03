import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmailCaptureBox from '@/components/EmailCaptureBox';
import MarketPulseSection from '@/components/MarketPulseSection';
import CryptoAziBriefView from '@/components/crypto-azi/CryptoAziBriefView';
import CryptoAziIndicators from '@/components/crypto-azi/CryptoAziIndicators';
import { getPublicCryptoBrief } from '@/lib/crypto-azi/db';
import { getCryptoAziIndicators } from '@/lib/market-api';
import { formatBucharestDateTime } from '@/lib/crypto-azi/format';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

export const revalidate = 60;

const TITLE = 'Crypto Azi';
const DESCRIPTION =
  'Briefing editorial zilnic: trei lucruri importante pe piața crypto, în ora României, cu surse și indicatori onești.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/crypto-azi`,
  },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}/crypto-azi`,
  }),
};

export default async function CryptoAziPage() {
  const [{ brief, isToday, isFallback }, indicators] = await Promise.all([
    getPublicCryptoBrief(),
    getCryptoAziIndicators(),
  ]);

  const nowLabel = formatBucharestDateTime(new Date().toISOString());

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sky-500/30 overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto max-w-6xl w-full px-4 sm:px-6 pt-24 pb-16">
        <p className="text-xs text-slate-500 font-[var(--font-inter)] mb-4">
          Ora României acum: {nowLabel}
        </p>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-[var(--font-space)] mb-8">
          {brief ? brief.title : 'Niciun briefing publicat încă'}
        </h1>

        <CryptoAziIndicators
          indicators={indicators}
          heading="Piața acum"
          ariaLabel="Piața acum"
        />

        <section aria-labelledby="crypto-azi-today" className="mt-12">
          <h2
            id="crypto-azi-today"
            className="text-lg font-bold text-white font-[var(--font-space)] mb-4"
          >
            Ce contează astăzi
          </h2>
          {brief ? (
            <CryptoAziBriefView
              brief={brief}
              isToday={isToday}
              isFallback={isFallback}
              showTakeawaysHeading={false}
              titleAs="h2"
              hideDocumentTitle
            />
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 px-6 py-8">
              <p className="text-slate-400 max-w-2xl font-[var(--font-inter)]">
                Redacția nu a publicat un briefing Crypto Azi. Nu afișăm date demonstrative.
                Poți urmări analiza aprofundată Market Pulse și lista de așteptare.
              </p>
            </div>
          )}
        </section>

        <section aria-labelledby="crypto-azi-deep-dive" className="mt-14">
          <h2
            id="crypto-azi-deep-dive"
            className="text-lg font-bold text-white font-[var(--font-space)] mb-2"
          >
            Analiza aprofundată
          </h2>
          <p className="mb-4 text-sm text-slate-400 font-[var(--font-inter)] max-w-2xl">
            Market Pulse este analiza tehnică detaliată — nu un al doilea briefing zilnic.
          </p>
          <MarketPulseSection />
        </section>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/market-pulse"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-3 text-sm font-bold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            Arhivă Market Pulse
          </Link>
          <Link
            href="/#newsletter"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            Lista de așteptare
          </Link>
        </div>

        <div className="mt-12">
          <EmailCaptureBox id="crypto-azi-waitlist" location="crypto_azi" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
