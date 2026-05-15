'use client';

import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, Landmark, Scale, TrendingUp, BadgeDollarSign } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  // SCHEMA.ORG PENTRU GOOGLE DISCOVER
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'BREAKING: SUA pune capăt erei Offshore. Crypto devine activ federal.',
    'image': [
      'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-05T10:00:00+02:00',
    'dateModified': '2025-12-05T10:00:00+02:00',
    'author': [{
      '@type': 'Person',
      'name': 'Mihai Daniel',
      'url': 'https://mihaidaniel.ro',
      'sameAs': [
        'https://x.com/MIhaiDanielWeb3',
        'https://www.youtube.com/@DanielMihaiCrypto',
        'https://www.linkedin.com/in/mihaidanielmarius/',
        'https://www.tiktok.com/@mihaidanielmarius'
      ]
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-blue-500/30">
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
                <span className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 flex items-center gap-2"><TrendingUp size={12}/> Market Movers</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 05 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 5 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                BREAKING: SUA pune capăt erei "Offshore". <br/>Crypto devine oficial <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Activ Federal</span>.
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-blue-500/50 pl-6 italic font-[var(--font-inter)]">
                După 15 ani de incertitudine, CFTC a dat verdictul: Crypto vine acasă. Platformele reglementate federal iau locul celor din insule exotice.
            </p>
        </header>

        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60"></div>
            <img 
                src="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=1200&auto=format&fit=crop" 
                alt="US Capitol Crypto Regulation" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">
                <strong>4 Decembrie 2025.</strong> Notează această dată. Este ziua în care Statele Unite au decis să nu mai ignore elefantul din cameră și să construiască cea mai robustă infrastructură crypto din lume.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Landmark size={24}/></span>
                De ce este acest anunț istoric?
            </h3>
            
            <p>
                Până ieri, agențiile americane refuzau să ofere claritate. Rezultatul? Investitorii americani erau forțați să folosească platforme "offshore" (în afara jurisdicției SUA), fără protecție. Așa au apărut dezastre precum FTX, unde miliarde de dolari s-au evaporat.
            </p>
            <p>
                <strong>Acea eră s-a încheiat.</strong> Acting Chairman Caroline Pham a invocat autoritatea existentă pentru a permite tranzacționarea Spot Crypto direct pe bursele futures federale. Fără legi noi, fără blocaje în Congres. Implementare imediată.
            </p>

            <div className="bg-blue-900/10 border border-blue-500/30 p-6 rounded-xl my-8">
                <h4 className="text-blue-400 font-bold mb-2 font-[var(--font-space)]">Lansarea Bitnomial: 9 Decembrie</h4>
                <p className="text-sm">
                    Săptămâna viitoare se lansează prima platformă care integrează totul sub umbrela federală: Spot, Futures, Options și Perpetuals. Un singur loc, supraveghere completă.
                </p>
            </div>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-green-500/20 rounded-lg text-green-400"><BadgeDollarSign size={24}/></span>
                Efectul "Tsunami" asupra Capitalului
            </h3>

            <p>
                Implicațiile structurale sunt gigantice. Prin "Cross Margining" (marja încrucișată), instituțiile își pot reduce necesarul de capital cu 30-50%. 
                <br/><br/>
                Mai simplu: <strong>Băncile și fondurile de investiții pot cumpăra mai mult crypto cu aceiași bani.</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Fondurile de Pensii au acum o cale legală de acces ("Gold Standard").</li>
                <li>Băncile pot oferi clienților crypto fără riscuri legale.</li>
                <li>Fondurile Suverane au undă verde pentru alocări masive.</li>
            </ul>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Scale size={24}/></span>
                Ce urmează?
            </h3>

            <p>
                Nu mai este vorba de retorică. Este infrastructură pură. SEC și CFTC lucrează împreună. Urmează colateralizarea tokenizată (stablecoins) și cadre noi de decontare blockchain.
            </p>
            <p className="text-white font-bold text-lg mt-4">
                Întrebarea nu mai este "Dacă America va conduce piața". Întrebarea este "Cât de repede se va muta capitalul global aici?".
            </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Analist Crypto
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie știrea:</span>
                <ShareButtons 
                    title="BREAKING: SUA pune capăt erei Offshore. Crypto devine activ federal." 
                    slug="sua-cftc-crypto-spot-reglementat" 
                />
            </div>
        </div>

        {/* CTA Consultanță */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-2xl border border-blue-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Ești pregătit pentru Super-Ciclul Instituțional?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Regulile jocului s-au schimbat peste noapte. Dacă ai un portofoliu serios, trebuie să înțelegi cum te poziționezi înainte să intre "banii grei".
            </p>
            <Link href="/#consultanta" className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                <TrendingUp size={18}/> Discută Strategia ta de Investiții
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