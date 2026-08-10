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
import { SITE_URL } from '@/lib/json-ld';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

export default function Home() {
  return (
    <>
      <HomeJsonLd />
      <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <HeroNewsPortal />

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl w-full">
        <MarketPulseSection />
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
