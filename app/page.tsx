import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import FeaturedNewsGrid from '@/components/FeaturedNewsGrid';
import { TickerTape, NewsFeed } from '@/components/lazy/home-widgets';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <TickerTape />
      <FeaturedNewsGrid />
      <NewsFeed />
      <Footer />
    </main>
  );
}
