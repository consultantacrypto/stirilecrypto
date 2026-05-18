import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroNewsPortal from '@/components/hero-concepts/HeroNewsPortal';
import ConsultingBanner from '@/components/ConsultingBanner';
import NewsFeed from '@/components/NewsFeed';
import TrendingArticles from '@/components/TrendingArticles';
import { TickerTape } from '@/components/lazy/home-widgets';

export const revalidate = 0;

/*
 * HERO CONCEPT GALLERY — swap the active hero for A/B testing:
 *
 * import HeroNewsPortal from '@/components/hero-concepts/HeroNewsPortal';
 * import HeroLiquid from '@/components/hero-concepts/HeroLiquid';
 * import HeroHorology from '@/components/hero-concepts/HeroHorology';
 * import HeroTicker from '@/components/hero-concepts/HeroTicker';
 * import HeroGlassWall from '@/components/hero-concepts/HeroGlassWall';
 * import HeroMonolith from '@/components/hero-concepts/HeroMonolith';
 */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <TickerTape />
      <HeroNewsPortal />
      <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-8 min-w-0">
            <NewsFeed />
          </div>
          <aside className="lg:col-span-4 lg:sticky lg:top-24 w-full">
            <TrendingArticles />
          </aside>
        </div>
      </section>
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl mt-16 mb-8 lg:mb-12">
        <ConsultingBanner />
      </div>
      <Footer />
    </main>
  );
}
