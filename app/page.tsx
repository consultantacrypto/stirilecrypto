import { withRssAlternate } from '@/lib/rss-alternate';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import NewsFeed from '@/components/NewsFeed';
import HomeMarketTerminal from '@/components/HomeMarketTerminal';
import InterviewsSection from '@/components/InterviewsSection';
import HomeJsonLd from '@/components/HomeJsonLd';
import HomeMarketBar from '@/components/HomeMarketBar';
import HomeServiceStrip from '@/components/services/HomeServiceStrip';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/home-seo';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

export const revalidate = 120;

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: withRssAlternate({
    canonical: SITE_URL,
  }),
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
      <main className="flex min-h-screen flex-col overflow-x-hidden bg-black font-sans text-white selection:bg-blue-500/30">
        <ScrollProgress />
        <Navbar />
        <HomeMarketBar />
        <NewsFeed />
        <div className="container mx-auto w-full max-w-6xl px-4 sm:px-6">
          <HomeServiceStrip />
          <HomeMarketTerminal />
        </div>
        <div className="container mx-auto mt-16 w-full max-w-6xl border-t border-white/10 px-4 pt-8 sm:px-6">
          <InterviewsSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
