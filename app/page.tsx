import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import TickerTape from '@/components/TickerTape';
import FeaturedNewsGrid from '@/components/FeaturedNewsGrid';
import PremiumSponsorBanner from '@/components/PremiumSponsorBanner';
import HomeAiSection from '@/components/HomeAiSection';

const NewsFeed = dynamic(() => import('@/components/NewsFeed'), {
  ssr: true,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <TickerTape />
      <FeaturedNewsGrid />
      <PremiumSponsorBanner />
      <NewsFeed />
      <HomeAiSection />
      <Footer />
    </main>
  );
}
