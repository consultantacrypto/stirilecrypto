import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import NewsFeed from '@/components/NewsFeed';
import MarketPulseSection from '@/components/MarketPulseSection';
import InterviewsSection from '@/components/InterviewsSection';
import HomeJsonLd from '@/components/HomeJsonLd';
import MorningNewsletter from '@/components/MorningNewsletter';
import HomeMarketBar from '@/components/HomeMarketBar';
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
      <main className="flex min-h-screen flex-col bg-[#07080b] text-white selection:bg-[#3e6ae1]/30">
        <ScrollProgress />
        <Navbar />
        <HomeMarketBar />
        <NewsFeed />
        <MorningNewsletter id="newsletter" location="homepage" variant="band" />
        <div className="site-wrap">
          <HomeServiceStrip />
          <MarketPulseSection />
        </div>
        <div className="site-wrap mb-16 mt-14 border-t border-white/[0.08] pt-10">
          <InterviewsSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
