import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroNewsPortal from '@/components/hero-concepts/HeroNewsPortal';
import ConsultingBanner from '@/components/ConsultingBanner';
import NewsFeed from '@/components/NewsFeed';
import MarketPulseSection from '@/components/MarketPulseSection';
import InterviewsSection from '@/components/InterviewsSection';
import HomeJsonLd from '@/components/HomeJsonLd';
import EmailCaptureBox from '@/components/EmailCaptureBox';
import CryptoAziHomeTeaser from '@/components/crypto-azi/CryptoAziHomeTeaser';
import { getTodaysPublishedCryptoBrief } from '@/lib/crypto-azi/db';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

export const revalidate = 60;

const HOME_TITLE = 'Informație Financiară & Date On-Chain | Știrile Crypto';
const HOME_DESCRIPTION =
  'Platformă premium de informații crypto, date on-chain instituționale și mentorat privat 1-la-1 pentru investiții inteligente.';

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  ...buildWebsiteShareMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonical: SITE_URL,
  }),
};

export default async function Home() {
  // One query: today's published brief only. Older briefs never surface on homepage.
  // Table missing / errors → null → Market Pulse branch (no crash, no empty card).
  const todayBrief = await getTodaysPublishedCryptoBrief();

  return (
    <>
      <HomeJsonLd />
      <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <ScrollProgress />
        <Navbar />
        <HeroNewsPortal />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full">
          {/* Max one editorial module between Hero and articles. */}
          {todayBrief ? (
            <CryptoAziHomeTeaser brief={todayBrief} />
          ) : (
            <MarketPulseSection />
          )}
          <NewsFeed />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full mt-16 pt-8 border-t border-white/10">
          <InterviewsSection />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-16 mb-8 lg:mb-12">
          <ConsultingBanner />
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full mb-16">
          <EmailCaptureBox id="newsletter" location="homepage" />
        </div>

        <Footer />
      </main>
    </>
  );
}
