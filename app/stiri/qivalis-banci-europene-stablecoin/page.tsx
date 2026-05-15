'use client';
import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, Landmark, Euro, Globe, Wallet } from 'lucide-react';
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
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-2"><Landmark size={12}/> Adopție Instituțională</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 03 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 4 min citire</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                BREAKING: 9 Bănci Gigant lansează <span className="text-blue-500">Qivalis</span> - Euro Stablecoin
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-blue-500/50 pl-6 italic font-[var(--font-inter)]">
                ING, UniCredit și alte bănci de top își unesc forțele. Euro digital devine realitate, reglementat și gata de utilizare în masă.
            </p>
        </header>
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=1200&auto=format&fit=crop" alt="Euro Digital Qivalis" className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">Peisajul financiar european se schimbă sub ochii noștri. Nouă dintre cele mai importante bănci au creat entitatea <strong>Qivalis</strong>.</p>
            <h3 className="text-white mt-8 mb-4 font-[var(--font-space)] text-2xl font-bold">Ce înseamnă asta?</h3>
            <p>1 Qivalis = 1 Euro. Întotdeauna. Este bani digitali pe blockchain, reglementați MiCA.</p>
            <h3 className="text-white mt-8 mb-4 font-[var(--font-space)] text-2xl font-bold">Cine sunt Giganții?</h3>
            <ul className="list-disc pl-6 space-y-2"><li>ING Group</li><li>UniCredit</li><li>Raiffeisen Bank</li><li>KBC, Danske Bank, și alții.</li></ul>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10">
            <ShareButtons title="BREAKING: 9 Bănci Gigant lansează Qivalis" slug="qivalis-banci-europene-stablecoin" />
        </div>
      </article>
      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">© 2026 Mihai Daniel.</div>
      </footer>
    </main>
  );
}