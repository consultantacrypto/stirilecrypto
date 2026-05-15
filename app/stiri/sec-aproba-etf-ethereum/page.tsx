'use client';
import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white">
      <Navbar />
      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
            <Link href="/stiri" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]">
                <ArrowLeft size={16}/> Înapoi la Știri
            </Link>
        </div>
        <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-purple-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-2"><TrendingUp size={12}/> Reglementare</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 12 Dec 2025</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                SEC Aprobă ETF-ul de <span className="text-purple-500">Ethereum Spot</span>
            </h1>
        </header>
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1622630998477-20aa696fa405?q=80&w=1200&auto=format&fit=crop" alt="Ethereum ETF" className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">Decizia SEC marchează un moment istoric. Ethereum devine oficial "marfă digitală" (commodity).</p>
            <p>Instituțiile nu mai au scuze. Mă aștept la un flow de 5-10 miliarde $ în primul an.</p>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10">
            <ShareButtons title="SEC Aprobă ETF-ul de Ethereum Spot" slug="sec-aproba-etf-ethereum" />
        </div>
      </article>
      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">© 2026 Mihai Daniel.</div>
      </footer>
    </main>
  );
}