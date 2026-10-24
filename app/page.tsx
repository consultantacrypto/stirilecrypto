import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroNewsPortal from '@/components/hero-concepts/HeroNewsPortal';
import NewsFeed from '@/components/NewsFeed';
import MarketPulseSection from '@/components/MarketPulseSection';
import InterviewsSection from '@/components/InterviewsSection';
import HomeJsonLd from '@/components/HomeJsonLd';
import MorningNewsletter from '@/components/MorningNewsletter';
import HomeMarketBar from '@/components/HomeMarketBar';
import HomeYoutube from '@/components/HomeYoutube';
import HomeServiceStrip from '@/components/services/HomeServiceStrip';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

export const revalidate = 60;

const HOME_TITLE = 'Informație Financiară & Date On-Chain | Știrile Crypto';
const HOME_DESCRIPTION =
  'Platformă de informații crypto și date on-chain instituționale. Știri, interviuri și analiză de piață.';

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

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <HeroNewsPortal />
      <HomeServiceStrip />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full">
        <MarketPulseSection />
        <HomeYoutube />
        <MorningNewsletter id="newsletter" location="homepage" />
        <HomeMarketBar />
        <NewsFeed />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full mt-16 pt-8 border-t border-white/10">
        <InterviewsSection />
      </div>

      <Footer />
    </main>
    </>
  );
}
