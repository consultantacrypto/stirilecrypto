'use client';

import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, TrendingDown, AlertTriangle, Eye, Activity, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'Bitcoin: Manipulare Instituțională sau Corecție Brutală?',
    'image': [
      'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-07T09:00:00+02:00',
    'dateModified': '2025-12-07T09:00:00+02:00',
    'author': [{
      '@type': 'Person',
      'name': 'Mihai Daniel',
      'url': 'https://mihaidaniel.ro'
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-red-500/30">
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
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-red-500 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-2"><Activity size={12}/> Analiză de Piață</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 07 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 6 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                Bitcoin: Manipulare Instituțională sau Corecție Brutală? <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Anatomia unei Prăbușiri de 19 Miliarde $</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-red-500/50 pl-6 italic font-[var(--font-inter)]">
                Scenariul de coșmar: Bitcoin scade de la $126k la $80k în timp ce bursa atinge maxime istorice. Analizăm mecanismele din spatele dezastrului.
            </p>
        </header>

        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
            <img 
                src="https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1200&auto=format&fit=crop" 
                alt="Bitcoin Market Crash Analysis" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
            />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">
                Piața crypto traversează un moment de confuzie extremă. În timp ce indicii bursieri americani (S&P 500, Nasdaq) ating noi maxime istorice, Bitcoin s-a decuplat violent, suferind o prăbușire dramatică de la <strong>$126,000</strong> la <strong>$80,000</strong>.
            </p>
            <p>
                Un "flash crash" pe 10 Octombrie a șters 19 miliarde de dolari din piață. Dar este aceasta o corecție naturală sau asistăm la o manipulare coordonată a "Balenelor"?
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><TrendingDown size={24}/></span>
                1. Divergența Masivă: De ce Bursa Crește, iar Crypto Sângerează?
            </h3>
            
            <p>
                Investitorii de retail sunt frustrați de "decuplare". Datele recente arată o anomalie clară:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><strong>US Stocks:</strong> Au crescut cu +8%, recuperând toate pierderile.</li>
                <li><strong>Bitcoin:</strong> Rămâne la -29% și este respins la fiecare încercare de revenire.</li>
            </ul>
            <p>
                <strong>Ce ne spune asta?</strong> Sugerează o <em>lichidare forțată</em> a unor fonduri mari. Când un fond crypto intră în insolvență, este obligat să vândă BTC la orice preț pentru a acoperi pierderile. Este un semnal clasic de "Capitulare Instituțională".
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-red-500/20 rounded-lg text-red-400"><AlertTriangle size={24}/></span>
                2. Mecanismul "Cascadei de Lichidări"
            </h3>

            <p>
                De ce a căzut prețul fără oprire? Răspunsul este <strong>Leverage-ul</strong> (Efectul de Levier). Mulți traderi împrumută bani pentru a amplifica câștigurile, dar asta funcționează ca o armă cu două tăișuri.
            </p>
            <div className="bg-red-900/10 p-6 rounded-xl border border-red-500/20 my-6">
                <h4 className="text-red-400 font-bold mb-2 font-[var(--font-space)]">Efectul de Domino</h4>
                <p className="text-sm">
                    Când prețul scade brusc, pozițiile Long sunt lichidate. Exchange-ul vinde automat Bitcoin-ul traderului în piață. Această vânzare automată împinge prețul și mai jos, declanșând lichidarea următorului grup. Așa dispar 19 miliarde într-o clipă.
                </p>
            </div>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Eye size={24}/></span>
                3. Manipulare sau "Stop Hunting"?
            </h3>

            <p>
                În trading, acest fenomen este cunoscut ca <strong>Liquidity Grab</strong>. Marile instituții văd unde sunt ordinele de "Stop Loss" ale micilor investitori.
            </p>
            <p>
                Strategia lor este să împingă prețul agresiv în jos pentru a atinge aceste stop-loss-uri. Rezultatul? O vânzare panicată care le permite instituțiilor să cumpere Bitcoin în cantități masive la prețuri de discount ($80k), chiar de la cei pe care i-au forțat să vândă.
            </p>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-xl font-bold">Concluzie: Ce faci acum?</h3>
            <p>
                Suntem într-o zonă de manipulare menită să scuture "mâinile slabe" înainte de următorul ciclu. 
                <br/>
                1. <strong>Evită Levierul:</strong> Este calea sigură spre faliment acum.
                <br/>
                2. <strong>Răbdare:</strong> După fiecare "flash crash" urmează o perioadă de acumulare plictisitoare, apoi explozia.
            </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Analist Financiar
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie analiza:</span>
                <ShareButtons 
                    title="Bitcoin: Manipulare Instituțională sau Corecție Brutală?" 
                    slug="bitcoin-manipulare-sau-corectie-brutala" 
                />
            </div>
        </div>

        {/* CTA Consultanță - HOOK: FEAR & STRATEGY */}
        <div className="mt-12 bg-gradient-to-r from-red-900/20 to-orange-900/20 p-8 rounded-2xl border border-red-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Ai pierdut bani în această scădere?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Dacă portofoliul tău sângerează, înseamnă că nu ai avut o strategie de hedging. Nu mai naviga orb în timp ce instituțiile te vânează.
            </p>
            <Link href="/#consultanta" className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                <ShieldAlert size={18}/> Audit Portofoliu Urgent
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