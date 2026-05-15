'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import TickerTape from '@/components/TickerTape';

const NewsFeed = dynamic(() => import('@/components/NewsFeed'), { 
  ssr: true 
});

const AiTerminal = dynamic(() => import('@/components/AiTerminal'), { 
  ssr: false, 
  loading: () => <div className="min-h-[600px] w-full bg-[#01030c] animate-pulse" />
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <TickerTape />
      <Hero />
      <NewsFeed />
      <AiTerminal />
      <Footer />
    </main>
  );
}
