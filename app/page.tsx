import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import TickerTape from '@/components/TickerTape';
import FeaturedNewsGrid from '@/components/FeaturedNewsGrid';
const NewsFeed = dynamic(() => import('@/components/NewsFeed'), {
  ssr: true,
});

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
