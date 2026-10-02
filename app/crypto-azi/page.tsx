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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-sky-500/30">
      <Navbar />
      <main className="container mx-auto max-w-6xl w-full px-4 sm:px-6 pt-24 pb-16">
        <p className="text-xs text-slate-500 font-[var(--font-inter)] mb-6">
          Ora României acum: {nowLabel}
        </p>

        {brief ? (
          <CryptoAziBriefView brief={brief} isToday={isToday} isFallback={isFallback} />
        ) : (
          <section className="rounded-2xl border border-white/10 bg-zinc-950 px-6 py-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-sky-400 mb-3">
              Crypto Azi
            </p>
            <h1 className="text-3xl font-black text-white font-[var(--font-space)]">
              Niciun briefing publicat încă
            </h1>
            <p className="mt-3 text-slate-400 max-w-2xl font-[var(--font-inter)]">
              Redacția nu a publicat un briefing Crypto Azi. Nu afișăm date demonstrative.
              Poți urmări Market Pulse și lista de așteptare până la următoarea actualizare.
            </p>
          </section>
        )}

        <CryptoAziIndicators indicators={indicators} />

        <div className="mt-12">
          <MarketPulseSection />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/market-pulse"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-3 text-sm font-bold text-black"
          >
            Analiză Market Pulse
          </Link>
          <Link
            href="/#newsletter"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
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
