'use client';

import Navbar from '@/components/Navbar';
import { Calendar, Clock, ArrowLeft, Share2, AlertTriangle, ShieldAlert, Lock, Smartphone } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  // ✅ SECRETUL PENTRU GOOGLE DISCOVER: Schema.org
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'ALERTA: Cum să pierzi 27.000.000$ într-o secundă. Pericolul invizibil din buzunarul tău.',
    'image': [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-05T08:00:00+02:00',
    'dateModified': '2025-12-05T09:20:00+02:00',
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
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-red-500/30">
      {/* Injectăm Schema pentru Google */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
            <Link href="/stiri" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]">
                <ArrowLeft size={16}/> Înapoi la Știri
            </Link>
        </div>

        {/* Header Articol */}
        <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-red-500 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 flex items-center gap-2"><AlertTriangle size={12}/> Alertă Securitate</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 05 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 6 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                ALERTA: Cum să pierzi <span className="text-red-500">27.000.000$</span> într-o secundă. <br/>Pericolul invizibil din buzunarul tău.
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-red-500/50 pl-6 italic font-[var(--font-inter)]">
                Nu a fost un hack complex. Nu i-a fost spartă parola. A fost o simplă greșeală umană pe care o poate face oricine. Află povestea completă și cum să te protejezi.
            </p>
        </header>

        {/* Imagine Principală */}
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-red-500/20 shadow-[0_0_50px_rgba(220,38,38,0.1)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
            <img 
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop" 
                alt="Hacker Security Alert" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
            />
            <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-2 w-fit">STUDIU DE CAZ</div>
                <div className="text-gray-300 text-sm font-mono">Incident: Zero-Click Exploit / Social Engineering</div>
            </div>
        </div>

        {/* Conținut Articol */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">
                Astăzi analizăm un caz de groază care a zguduit comunitatea crypto. Un investitor "balenă" (whale) tocmai a fost golit de <strong>27.000.000 USD</strong>.
            </p>
            <p>
                Partea cea mai înfricoșătoare? Nu a fost un atac sofisticat asupra unui bridge DeFi. Nu i-a fost compromis seed phrase-ul prin brute force. Nu a descărcat un software dubios.
                <br/><br/>
                <strong>A dat un singur click.</strong> Pe un link care părea legitim.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><ShieldAlert size={24}/></span>
                1. Anatomia Atacului: Inginerie Socială Pură
            </h3>
            
            <p>
                Totul a început banal. Victima a fost abordată de un necunoscut care pretindea că deține informații compromițătoare (șantaj). 
                Reacția normală ar fi fost <strong>BLOCK</strong>. Dar victima a făcut greșeala fatală: <strong>a devenit curioasă.</strong>
            </p>
            
            <div className="bg-[#0a1025] p-6 rounded-xl border border-blue-500/20 my-6">
                <h4 className="text-blue-400 font-bold mb-2 font-[var(--font-space)]">Capcana Psihologică</h4>
                <p className="text-sm">
                    Atacatorul nu a cerut bani imediat. Timp de câteva zile, a construit o relație. I-a trimis victimei informații reale, link-uri sigure și date OSINT (Open Source Intelligence) veridice.
                    <br/><br/>
                    Victima a început să gândească: <em>"Tipul ăsta chiar se pricepe. E inofensiv. Eu sunt expert, știu să mă feresc."</em>
                    <br/>
                    <strong>Acea aroganță l-a costat 27 de milioane de dolari.</strong>
                </p>
            </div>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-red-500/20 rounded-lg text-red-400"><Smartphone size={24}/></span>
                2. Secunda Fatală: "Zero-Click" Exploit
            </h3>

            <p>
                Într-o zi obișnuită, atacatorul a trimis un link. Arăta exact ca un link de <strong>Etherscan</strong> (exploratorul oficial de blocuri Ethereum). 
                Victima, relaxată, l-a deschis de pe telefon.
            </p>
            <p>
                Ce s-a întâmplat în spate este coșmarul oricărui expert de securitate:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300 marker:text-red-500">
                <li>Site-ul a executat instantaneu un cod malițios.</li>
                <li><strong>Nu a apărut niciun pop-up.</strong></li>
                <li><strong>Nu a cerut nicio permisiune ("Allow").</strong></li>
                <li><strong>Nu a cerut semnarea vreunei tranzacții.</strong></li>
            </ul>
            <p>
                Telefonul respectiv era folosit ca dispozitiv de semnare ("Signer") pentru un portofel Multisig. Atacatorul a extras metadatele sesiunii de Telegram și accesul la fișierele temporare, reușind să cloneze sesiunea și să inițieze transferul.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-green-500/20 rounded-lg text-green-400"><Lock size={24}/></span>
                3. Lecțiile Cruciale: Cum să NU fii tu următoarea victimă
            </h3>

            <p>
                Acest caz ne învață că niciun antivirus nu te poate proteja de propria ta curiozitate. Iată regulile de aur pe care trebuie să le aplici AZI:
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/20">
                    <div className="font-bold text-red-400 mb-2 font-[var(--font-space)]">REGULA #1: PARANOIA</div>
                    <p className="text-sm text-gray-300">
                        Nu pierzi bani când ești paranoic și verifici totul de 10 ori. Pierzi bani când te simți "sigur". 
                        Dacă primești un link nesolicitat, consideră-l nuclear. Nu da click.
                    </p>
                </div>
                <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                    <div className="font-bold text-blue-400 mb-2 font-[var(--font-space)]">REGULA #2: IZOLAREA</div>
                    <p className="text-sm text-gray-300">
                        Telefonul pe care ai aplicația de bancă sau wallet-ul crypto <strong>NU</strong> trebuie folosit pentru Telegram, Discord sau chat cu străini. 
                        Cumpără un telefon separat pentru 2FA și tranzacții.
                    </p>
                </div>
            </div>

            <p>
                <strong>Concluzie:</strong> În lumea crypto, ești propria ta bancă. Asta înseamnă libertate totală, dar și responsabilitate totală. 
                Nu există un departament de fraudă la care să suni dacă greșești. Un click greșit este ireversibil.
            </p>
            <p className="text-center font-bold text-white mt-8 p-4 border border-white/20 rounded-lg">
                Rămâi vigilent. Rămâi paranoic. Rămâi bogat.
            </p>
        </div>

        {/* Footer Articol */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Analist Crypto
            </div>
            <div className="flex gap-4">
                <a href="https://x.com/MIhaiDanielWeb3" target="_blank" className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-white transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                    <Share2 size={16}/> Urmărește pe X
                </a>
            </div>
        </div>

        {/* CTA Consultanță */}
        <div className="mt-12 bg-gradient-to-r from-yellow-900/20 to-yellow-600/10 p-8 rounded-2xl border border-yellow-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Ți-e teamă pentru portofoliul tău?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Securitatea nu este un produs, este un proces. Dacă ai sume semnificative în crypto și nu ai o strategie clară de Cold Storage, ești expus.
            </p>
            <Link href="/#consultanta" className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <Lock size={18}/> Rezervă o Ședință de Securitate
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