'use client';

import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, Activity, BarChart3, TrendingUp, LineChart } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'Semnal On-Chain: Vânzătorii au obosit. Bitcoin pregătește Raliul de Decembrie?',
    'image': [
      // ✅ LINK NOU STABIL
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-06T15:00:00+02:00',
    'dateModified': '2025-12-06T15:00:00+02:00',
    'author': [{
      '@type': 'Person',
      'name': 'Mihai Daniel',
      'url': 'https://mihaidaniel.ro'
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-green-500/30">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
            <Link href="/stiri" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]">
                <ArrowLeft size={16}/> Înapoi la Știri
            </Link>
        </div>

        <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-green-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-2"><Activity size={12}/> On-Chain Data</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 06 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 3 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                Semnal On-Chain: Vânzătorii au obosit. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Bitcoin pregătește Raliul?</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-green-500/50 pl-6 italic font-[var(--font-inter)]">
                Datele din spatele cortinei spun o altă poveste decât prețul. Indicatorul SOPR arată o "resetare" completă a pieței.
            </p>
        </header>

        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-green-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
            <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" 
                alt="Bitcoin On-Chain Analysis" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">
                În ultimele 24 de ore, Bitcoin a suferit o corecție, testând zona de <strong>$89,000</strong>. Pentru investitorul de retail, asta arată a panică. Dar pentru analiștii on-chain, arată a oportunitate.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-green-500/20 rounded-lg text-green-400"><LineChart size={24}/></span>
                Indicatorul SOPR: Epuizarea Vânzătorilor
            </h3>
            
            <p>
                Conform datelor monitorizate de <em>Lookonchain</em> și <em>CryptoOnchain</em>, indicatorul <strong>Bitcoin SOPR Ratio</strong> a scăzut la valoarea de <strong>1.35</strong>. Acesta este cel mai jos nivel de la începutul anului 2024.
            </p>
            
            <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10 my-6">
                <h4 className="text-green-400 font-bold mb-2 font-[var(--font-space)]">Dicționar Crypto: SOPR</h4>
                <p className="text-sm">
                    <strong>SOPR (Spent Output Profit Ratio)</strong> ne spune dacă monedele mutate pe blockchain sunt vândute în profit sau în pierdere.
                    <br/><br/>
                    O scădere bruscă la 1.35 înseamnă că valul de investitori care își marcau profiturile s-a oprit. <strong>Vânzătorii s-au epuizat.</strong> Istoric, acest "reset" este fundația pentru următoarea creștere.
                </p>
            </div>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><BarChart3 size={24}/></span>
                Coinbase Instituțional: "Lichiditatea Revine"
            </h3>

            <p>
                În paralel, brațul instituțional al Coinbase a emis o notă către clienți anticipând un <strong>"Raliu de Revenire" în Decembrie</strong>. Argumentele lor sunt macro-economice:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Probabilitatea unei tăieri de dobândă FED a crescut la <strong>92%</strong>.</li>
                <li>Lichiditatea globală (M2 Money Supply) este în creștere.</li>
                <li>Dolarul american (DXY) arată semne de slăbiciune.</li>
            </ul>

            <p className="mt-6 font-bold text-white">
                Concluzie: Piața s-a răcit ("reset"), vânzătorii s-au retras, iar banii ieftini (lichiditatea) se pregătesc să intre.
            </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Analist On-Chain
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie analiza:</span>
                <ShareButtons 
                    title="Semnal On-Chain: Bitcoin SOPR Resetat. Urmează Raliul?" 
                    slug="semnal-on-chain-bitcoin-sopr-rally" 
                />
            </div>
        </div>

        {/* CTA Consultanță - HOOK: DATA DRIVEN */}
        <div className="mt-12 bg-gradient-to-r from-green-900/20 to-emerald-900/20 p-8 rounded-2xl border border-green-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Vrei să înveți să citești datele, nu știrile?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                În Crypto, informația înseamnă profit. Învață cum să folosești instrumente on-chain pentru a intra în piață alături de "Balene", nu după ele.
            </p>
            <Link href="/#consultanta" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                <TrendingUp size={18}/> Învață Strategia On-Chain
            </Link>
        </div>

      </article>

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">
              © 2026 Mihai Daniel. Toate drepturile rezervate.
          </div>
      </footer>
    </main>
  );
}