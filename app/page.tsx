'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
// ✅ IMPORT Componenta Nouă
import ScrollProgress from '@/components/ScrollProgress';

// Componente Dinamice
const SocialStats = dynamic(() => import('@/components/SocialStats'), { 
  ssr: true 
});

const CelebrityInterviews = dynamic(() => import('@/components/CelebrityInterviews'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-[#020617]/50 animate-pulse rounded-3xl" />
});

const Consultancy = dynamic(() => import('@/components/Consultancy'), { 
  ssr: true 
});

const AiTerminal = dynamic(() => import('@/components/AiTerminal'), { 
  ssr: false, 
  loading: () => <div className="min-h-[600px] w-full bg-[#01030c] animate-pulse" />
});

const Course = dynamic(() => import('@/components/Course'), { 
  ssr: true 
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* 1. Bara de Progres la Citire */}
      <ScrollProgress />

      {/* 2. Navigatia */}
      <Navbar />
      
      {/* 3. Zona Hero - HOOK */}
      <Hero />
      
      {/* 4. Cifrele - TRUST */}
      <SocialStats />
      
      {/* 5. Cursul - PRIMARY OFFER (Barieră mică de intrare) 
          Mutat mai sus conform strategiei de conversie */}
      <Course />
      
      {/* 6. Interviuri - AUTHORITY */}
      <CelebrityInterviews />
      
      {/* 7. AI Terminal - ENGAGEMENT */}
      <AiTerminal />

      {/* 8. Consultanta - HIGH TICKET OFFER (Pentru clienți "încălziți") */}
      <Consultancy />

      {/* 9. Footer */}
      <Footer />
      
    </main>
  );
}