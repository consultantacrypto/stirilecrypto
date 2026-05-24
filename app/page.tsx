import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroNewsPortal from '@/components/hero-concepts/HeroNewsPortal';
import ConsultingBanner from '@/components/ConsultingBanner';
import NewsFeed from '@/components/NewsFeed';
import InterviewsSection from '@/components/InterviewsSection';
import HomeJsonLd from '@/components/HomeJsonLd';
import { TickerTape } from '@/components/lazy/home-widgets';

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <TickerTape />
      <HeroNewsPortal />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full">
        <NewsFeed />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full mt-16 pt-8 border-t border-white/10">
        <InterviewsSection />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-16 mb-8 lg:mb-12">
        <ConsultingBanner />
      </div>
      <Footer />
    </main>
    </>
  );
}
