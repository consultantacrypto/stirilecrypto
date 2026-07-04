import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardPageHeader from '@/components/dashboard/DashboardPageHeader';
import MarketPulseTerminal from '@/components/dashboard/MarketPulseTerminal';
import MicaSafetyRadar from '@/components/dashboard/MicaSafetyRadar';
import EtfFlowsSection from '@/components/dashboard/etf/EtfFlowsSection';
import EtfFlowsSkeleton from '@/components/dashboard/etf/EtfFlowsSkeleton';
import PremiumTaSection from '@/components/dashboard/premium/PremiumTaSection';
import { getActivePulseTerminal, getMicaComplianceItems } from '@/lib/dashboard-db';
import { SITE_URL } from '@/lib/json-ld';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Instituțional | Market Pulse & MiCA Radar',
  description:
    'Market Pulse Terminal: niveluri tehnice live (suport/rezistență/trend). MiCA Safety Radar: status conformitate exchange-uri și stablecoins.',
  alternates: {
    canonical: `${SITE_URL}/dashboard`,
  },
};

export const revalidate = 60;

export default async function DashboardPage() {
  const [pulseSnapshot, exchanges, stablecoins] = await Promise.all([
    getActivePulseTerminal('BTC'),
    getMicaComplianceItems('exchange'),
    getMicaComplianceItems('stablecoin'),
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Dashboard Instituțional — Știrile Crypto',
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
          <DashboardPageHeader />
          <MarketPulseTerminal snapshot={pulseSnapshot} />
          <Suspense fallback={<EtfFlowsSkeleton />}>
            <EtfFlowsSection />
          </Suspense>
          <MicaSafetyRadar exchanges={exchanges} stablecoins={stablecoins} />
          <PremiumTaSection />
        </div>

        <Footer />
      </main>
    </>
  );
}
