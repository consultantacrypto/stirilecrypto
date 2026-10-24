import Navbar from '@/components/Navbar';
import PiataAziTabs from '@/components/PiataAziTabs';
import Footer from '@/components/Footer';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import MarketPulseTerminal from '@/components/dashboard/MarketPulseTerminal';
import MicaSafetyRadar from '@/components/dashboard/MicaSafetyRadar';
import EtfSection from '@/components/dashboard/etf/EtfSection';
// Legacy (server) ETF section kept for rollback — do not remount without review:
// import EtfFlowsSection from '@/components/dashboard/etf/EtfFlowsSection';
// import EtfFlowsSkeleton from '@/components/dashboard/etf/EtfFlowsSkeleton';
import PremiumTaSection from '@/components/dashboard/premium/PremiumTaSection';
import { getActivePulseTerminal, getMicaComplianceItems } from '@/lib/dashboard-db';
import { ETF_MAX_AGE_DAYS, isFreshEnough, MICA_MAX_AGE_DAYS } from '@/lib/data-freshness';
import { fetchEtfSnapshots } from '@/lib/etf/fetchEtfData';
import { getLatestEtfSnapshotDate } from '@/lib/etf-snapshots-db';
import type { EtfAssetSymbol, EtfSnapshot } from '@/lib/etf/types';
import { getPulseFreshnessStatus } from '@/lib/market-pulse-freshness';
import { getMarketPulseBySlug } from '@/lib/articles-db';
import { SITE_URL } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tablou de bord | Știrile Crypto',
  description:
    'Analiza la comandă și datele care sunt încă de actualitate. Snapshot-urile vechi de suport, ETF și conformitate nu sunt afișate.',
  alternates: {
    canonical: `${SITE_URL}/dashboard`,
  },
};

export const revalidate = 60;

async function loadEtfSeries(asset: EtfAssetSymbol): Promise<EtfSnapshot[]> {
  try {
    return await fetchEtfSnapshots(asset, '5d');
  } catch (error) {
    console.error('[dashboard etf]', asset, error);
    return [];
  }
}

export default async function DashboardPage() {
  const [pulseSnapshot, exchanges, stablecoins, latestEtfDate, btcFlows, ethFlows] = await Promise.all([
    getActivePulseTerminal('BTC'),
    getMicaComplianceItems('exchange'),
    getMicaComplianceItems('stablecoin'),
    getLatestEtfSnapshotDate(),
    loadEtfSeries('BTC'),
    loadEtfSeries('ETH'),
  ]);
  const showPulse = getPulseFreshnessStatus(pulseSnapshot?.published_at) === 'fresh';
  const micaUpdatedAt = [...exchanges, ...stablecoins].reduce<string | null>((latest, item) => {
    if (!item.updated_at) return latest;
    if (!latest || item.updated_at > latest) return item.updated_at;
    return latest;
  }, null);
  const showMica = isFreshEnough(micaUpdatedAt, MICA_MAX_AGE_DAYS);
  const showEtf = isFreshEnough(latestEtfDate, ETF_MAX_AGE_DAYS);

  const linkedArticle = pulseSnapshot?.linked_article_slug
    ? await getMarketPulseBySlug(pulseSnapshot.linked_article_slug)
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Tablou de bord — Știrile Crypto',
    url: `${SITE_URL}/dashboard`,
    description: metadata.description,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Știrile Crypto',
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#020617] text-white flex flex-col">
        <Navbar />

        <div className="container mx-auto flex-grow px-4 py-10 md:py-12 max-w-7xl">
          <PiataAziTabs />
          <DashboardPageHeader />
          {showPulse && pulseSnapshot ? (
            <MarketPulseTerminal
              snapshot={pulseSnapshot}
              linkedArticlePublishedAt={linkedArticle?.published_at ?? null}
            />
          ) : null}
          {showEtf ? (
            <EtfSection initial={{ period: '5d', btc: btcFlows, eth: ethFlows }} />
          ) : null}
          {showMica ? <MicaSafetyRadar exchanges={exchanges} stablecoins={stablecoins} /> : null}
          <PremiumTaSection />
        </div>

        <Footer />
      </main>
    </>
  );
}
