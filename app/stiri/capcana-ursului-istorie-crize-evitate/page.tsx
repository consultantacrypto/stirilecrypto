'use client';

import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, BrainCircuit, History, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'Capcana Ursului: De ce Toți Indicatorii de Criză Pot Fi Greșiți',
    'image': [
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-07T16:00:00+02:00',
    'dateModified': '2025-12-07T16:00:00+02:00',
    'author': [{
      '@type': 'Person',
      'name': 'Mihai Daniel',
      'url': 'https://mihaidaniel.ro'
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-orange-500/30">
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
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-orange-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-2"><BrainCircuit size={12}/> Psihologia Pieței</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 07 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 5 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                &quot;Capcana Ursului&quot;: De ce Toți Indicatorii de Criză Pot Fi Greșiți. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Lecțiile Istoriei</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-orange-500/50 pl-6 italic font-[var(--font-inter)]">
                Când toată lumea strigă &quot;Recesiune&quot;, istoria ne arată că piața face exact opusul. Iată 3 momente când &quot;sfârșitul lumii&quot; a fost începutul unui Bull Market.
            </p>
        </header>

        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-orange-500/20 shadow-[0_0_50px_rgba(249,115,22,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
            <img 
                src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop" 
                alt="Market Psychology Bull vs Bear" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">
                Deschizi știrile și vezi doar roșu: curba randamentelor inversată, inflație persistentă și conflicte. Consensul general? <strong>&quot;Vine un Bear Market crunt.&quot;</strong>
            </p>
            <p>
                Dar istoria piețelor financiare ne învață o lecție prețioasă: <strong>Atunci când toată lumea se așteaptă la o criză, aceasta tinde să nu mai apară.</strong> Piețele nu se mișcă pe baza știrilor de azi, ci pe baza așteptărilor pentru mâine.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><History size={24}/></span>
                Cazul 1: &quot;Aterizarea Lină&quot; din 1994 (Planul Perfect)
            </h3>
            <p>
                <strong>Situația:</strong> Foarte similară cu 2024-2025. FED a crescut dobânzile agresiv (3% &rarr; 6%). Wall Street-ul era convins că urmează o recesiune în 1995.
            </p>
            <p>
                <strong>Răsturnarea:</strong> Alan Greenspan a oprit creșterile la timp. Rezultatul? Nu doar că recesiunea a fost evitată, dar a urmat <strong>Boom-ul dot-com</strong>. S&P 500 a crescut cu +34% în anul următor!
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-red-500/20 rounded-lg text-red-400"><AlertTriangle size={24}/></span>
                Cazul 2: Crăciunul Negru din 2018 (Pivotarea Powell)
            </h3>
            <p>
                <strong>Situația:</strong> În Q4 2018, Jerome Powell părea de neoprit cu creșterea dobânzilor. Piețele au intrat în panică, scăzând cu 20% până de Crăciun. Titlurile ziarelor anunțau apocalipsa.
            </p>
            <div className="bg-orange-900/10 p-6 rounded-xl border border-orange-500/20 my-6">
                <h4 className="text-orange-400 font-bold mb-2 font-[var(--font-space)]">Momentul Adevărului</h4>
                <p className="text-sm">
                    În ianuarie 2019, Powell a ieșit și a spus simplu: <em>&quot;Vom fi răbdători&quot;</em>. Asta a fost tot. Piețele au explodat, recuperând toate pierderile în câteva luni. Cei care au vândut de frică au pierdut tot raliul.
                </p>
            </div>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-green-500/20 rounded-lg text-green-400"><TrendingUp size={24}/></span>
                Cazul 3: Șocul COVID din 2020
            </h3>
            <p>
                <strong>Situația:</strong> Martie 2020. Lumea s-a închis. Economia globală s-a oprit. Logic, trebuia să urmeze o depresie.
                <br/><strong>Realitatea:</strong> Intervenția monetară a fost fără precedent. Piețele au atins noi maxime istorice în doar 6 luni. Lecția? <strong>Nu paria împotriva tiparniței de bani.</strong>
            </p>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-xl font-bold">De ce Optimismul este o Strategie</h3>
            <p>
                Sir John Templeton spunea:
            </p>
            {/* ✅ FIX: Am schimbat 'class' în 'className' */}
            <blockquote className="border-l-4 border-orange-500 pl-4 italic text-gray-400 my-4">
                &quot;Bull market-urile se nasc din pesimism, cresc pe scepticism, se maturizează pe optimism și mor pe euforie.&quot;
            </blockquote>
            <p>
                Astăzi suntem în faza de pesimism. Faptul că toată lumea este precaută este, paradoxal, cel mai bullish semnal posibil. Când nimeni nu mai are curaj să cumpere, Smart Money intră în scenă.
            </p>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-xl font-bold">Concluzie: Nu paria împotriva adaptării umane</h3>
            <p>
                Istoria ne arată că sistemul financiar este incredibil de rezilient. Fie că e vorba de inovație tehnologică (AI astăzi, Internetul în &#39;95) sau de intervenția băncilor centrale, scenariul apocaliptic este cel mai puțin probabil să se întâmple.
            </p>
            <p>
                Păstrează-ți calmul, gestionează-ți riscul, dar nu lăsa frica să te scoată din joc exact înainte de revenire.
            </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Psihologia Pieței
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie analiza:</span>
                <ShareButtons 
                    title="Capcana Ursului: De ce Toți Indicatorii de Criză Pot Fi Greșiți" 
                    slug="capcana-ursului-istorie-crize-evitate" 
                />
            </div>
        </div>

        {/* CTA Consultanță - HOOK: MINDSET & STRATEGY */}
        <div className="mt-12 bg-gradient-to-r from-orange-900/20 to-yellow-900/20 p-8 rounded-2xl border border-orange-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Emoțiile te costă bani. Ai nevoie de un plan.</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Dacă te simți panicat de știri, înseamnă că nu ai o strategie clară. În consultanța 1-la-1, eliminăm zgomotul și construim un plan bazat pe date istorice și macroeconomice, nu pe frică.
            </p>
            <Link href="/#consultanta" className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                <Lightbulb size={18}/> Vreau Claritate și Strategie
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