'use client';

import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
// ✅ FIX: Am adăugat 'Activity' în lista de importuri
import { Calendar, Clock, ArrowLeft, Landmark, Percent, TrendingUp, AlertTriangle, Skull, Activity } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'Alertă Maximă: Decizia FED care Poate Arunca Bitcoin în Aer. Scenarii 0.25% vs 0.50%',
    'image': [
      'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-07T12:00:00+02:00',
    'dateModified': '2025-12-07T12:00:00+02:00',
    'author': [{
      '@type': 'Person',
      'name': 'Știrile Crypto',
      'url': 'https://www.stirilecrypto.ro'
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-indigo-500/30">
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
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 flex items-center gap-2"><Landmark size={12}/> Macroeconomie</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 07 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 4 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                Alertă Maximă: Decizia FED care Poate Arunca Bitcoin în Aer. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Scenariile 0.25% vs 0.50%</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-indigo-500/50 pl-6 italic font-[var(--font-inter)]">
                Decizia privind rata dobânzii nu este doar o știre economică. Este "butonul nuclear" pentru portofoliul tău.
            </p>
        </header>

        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
            <img 
                src="https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1200&auto=format&fit=crop" 
                alt="Federal Reserve Analysis" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">
                Săptămâna viitoare, ochii întregii planete financiare vor fi ațintiți asupra unui singur om: <strong>Jerome Powell</strong>. Bitcoin nu mai este un activ izolat. A devenit un barometru al lichidității globale.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Percent size={24}/></span>
                De ce Dobânda este "Gravitația" pentru Crypto?
            </h3>
            
            <p>Gândește-te la rata dobânzii ca la costul banilor.</p>
            <ul className="space-y-3">
                <li className="flex gap-3"><span className="text-red-400 font-bold">🛑</span> <strong>Dobânzi Mari:</strong> Banii sunt scumpi. Investitorii aleg siguranța. Crypto scade.</li>
                <li className="flex gap-3"><span className="text-green-400 font-bold">🚀</span> <strong>Dobânzi Mici:</strong> Robinetul de lichiditate se deschide. Capitalul fuge spre risc. Bitcoin crește.</li>
            </ul>

            <h3 className="text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold">Cele 4 Scenarii pentru Săptămâna Viitoare</h3>

            <div className="grid md:grid-cols-2 gap-6 my-8">
                {/* Scenariul 1 */}
                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20 hover:border-red-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-red-400 font-bold font-[var(--font-space)]">SCENARIUL 1: 0% (Nicio Tăiere)</div>
                        <AlertTriangle size={20} className="text-red-500"/>
                    </div>
                    <p className="text-sm text-gray-300"><strong>Probabilitate:</strong> Scăzută</p>
                    <p className="text-sm mt-2">Duș rece. Piețele au prețuit deja tăierea. Așteaptă-te la o <strong>scădere de 5-10%</strong> pe Bitcoin în 24 de ore.</p>
                </div>

                {/* Scenariul 2 */}
                <div className="bg-green-900/10 p-6 rounded-2xl border border-green-500/20 hover:border-green-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-green-400 font-bold font-[var(--font-space)]">SCENARIUL 2: 0.25% (Ideal)</div>
                        <TrendingUp size={20} className="text-green-500"/>
                    </div>
                    <p className="text-sm text-gray-300"><strong>Probabilitate:</strong> Ridicată</p>
                    <p className="text-sm mt-2">Standardul de aur. Începutul unui ciclu de relaxare fără panică. Posibil un mic "Sell the news", apoi creștere sănătoasă.</p>
                </div>

                {/* Scenariul 3 */}
                <div className="bg-yellow-900/10 p-6 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-yellow-400 font-bold font-[var(--font-space)]">SCENARIUL 3: 0.50% (Volatil)</div>
                        {/* Aici era eroarea, acum avem Activity importat */}
                        <Activity size={20} className="text-yellow-500"/>
                    </div>
                    <p className="text-sm text-gray-300"><strong>Probabilitate:</strong> Medie</p>
                    <p className="text-sm mt-2">Sabie cu două tăișuri. Lichiditate masivă (Bullish) dar semnal de recesiune (Bearish). Raliu euforic urmat de confuzie.</p>
                </div>

                {/* Scenariul 4 */}
                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-600 hover:border-white transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-white font-bold font-[var(--font-space)]">SCENARIUL 4: 1.00% (Criză)</div>
                        <Skull size={20} className="text-white"/>
                    </div>
                    <p className="text-sm text-gray-300"><strong>Probabilitate:</strong> Extrem de mică</p>
                    <p className="text-sm mt-2">Black Swan. Semnal că ceva s-a rupt în sistemul bancar. Bitcoin crește inițial, apoi pică cu tot cu bursa. Cash is King.</p>
                </div>
            </div>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-xl font-bold">Concluzie: Nu juca la "Păcănele"</h3>
            <p>
                Macroeconomia nu este despre ghicit, este despre probabilități și poziționare. O greșeală de interpretare în ziua anunțului te poate costa mii de dolari. Ai nevoie de un plan stabilit dinainte, nu de reacții emoționale la titlurile de știri.
            </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Știrile Crypto</span> • Strateg Macro
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie analiza:</span>
                <ShareButtons 
                    title="Alertă Maximă: Scenariile FED 0.25% vs 0.50% și impactul asupra Bitcoin" 
                    slug="impact-dobanda-fed-bitcoin-scenarii" 
                />
            </div>
        </div>

        {/* CTA Consultanță - HOOK: STRATEGY & URGENCY */}
        <div className="mt-12 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-8 rounded-2xl border border-indigo-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Nu lăsa deciziile FED să te prindă nepregătit</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                În sesiunea de strategie 1-la-1, analizăm expunerea ta la riscul macro și construim planul de acțiune pentru ziua anunțului.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                <Landmark size={18}/> Rezervă Sesiunea de Strategie ($250)
            </Link>
            <p className="text-xs text-gray-500 mt-3">Locuri limitate înainte de ședința FED.</p>
        </div>

      </article>

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">
              © 2026 Știrile Crypto. Toate drepturile rezervate.
          </div>
      </footer>
    </main>
  );
}