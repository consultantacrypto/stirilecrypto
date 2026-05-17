import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import HeroLiquid from '@/components/hero-concepts/HeroLiquid';
import { TickerTape, NewsFeed } from '@/components/lazy/home-widgets';

/*
 * HERO CONCEPT GALLERY — swap the active hero for A/B testing:
 *
 * import HeroLiquid from '@/components/hero-concepts/HeroLiquid';
 * import HeroHorology from '@/components/hero-concepts/HeroHorology';
 * import HeroTicker from '@/components/hero-concepts/HeroTicker';
 * import HeroGlassWall from '@/components/hero-concepts/HeroGlassWall';
 * import HeroMonolith from '@/components/hero-concepts/HeroMonolith';
 *
 * Then replace <HeroLiquid /> with <HeroHorology /> | <HeroTicker /> | <HeroGlassWall /> | <HeroMonolith />
 */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <TickerTape />
      <HeroLiquid />
      <NewsFeed />
      <Footer />
    </main>
  );
}
