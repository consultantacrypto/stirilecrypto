'use client';

import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { Calendar, Clock, ArrowLeft, Cpu, ShieldCheck, Zap, Lock, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export default function ArticlePage() {
  // SCHEMA.ORG PENTRU GOOGLE DISCOVER & NEWS
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': 'Calculatoarele Cuantice vs. Bitcoin: Sfârșitul Criptomonedelor?',
    'image': [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop'
    ],
    'datePublished': '2025-12-06T13:00:00+02:00',
    'dateModified': '2025-12-06T13:00:00+02:00',
    'author': [{
      '@type': 'Person',
      'name': 'Știrile Crypto',
      'url': 'https://www.stirilecrypto.ro'
    }]
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-purple-500/30">
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
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 flex items-center gap-2"><Cpu size={12}/> Future Tech</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 06 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 7 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                Calculatoarele Cuantice vs. Bitcoin: <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Sfârșitul Criptomonedelor</span> sau Doar o Nouă Provocare?
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-cyan-500/50 pl-6 italic font-[var(--font-inter)]">
                Poate un calculator cuantic să "spargă" Bitcoin? Demontăm miturile și analizăm riscurile reale pe înțelesul tuturor.
            </p>
        </header>

        {/* Imagine Principală */}
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-purple-500/20 shadow-[0_0_50px_rgba(168,85,247,0.15)] group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
            <img 
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop" 
                alt="Quantum Computer vs Bitcoin" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
        </div>

        {/* Conținut Articol */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p className="lead text-xl text-white font-medium">
                Dacă urmărești știrile din tehnologie, probabil ai auzit termenul <strong>"Quantum Computing"</strong> aruncat tot mai des în discuții. Scenariul apocaliptic este simplu: <em>"Apare calculatorul cuantic și tot Bitcoin-ul va fi furat."</em>
            </p>
            <p>
                Dar cât este adevăr și cât este scenariu de film SF? Astăzi vreau să demontăm miturile și să înțelegem riscul real pentru portofelul tău.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><BrainCircuit size={24}/></span>
                Ce este, de fapt, un Calculator Cuantic?
            </h3>
            
            <div className="bg-[#0f172a] p-6 rounded-xl border border-white/10 my-6">
                <h4 className="text-cyan-400 font-bold mb-2 font-[var(--font-space)]">Analogia Bibliotecii</h4>
                <p className="text-sm italic mb-4">Imaginează-ți că ești într-o bibliotecă imensă și cauți o singură carte care are un "X" roșu pe o pagină.</p>
                <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><span className="text-gray-500">💻</span> <strong>Calculator Clasic (Laptopul tău):</strong> Este un bibliotecar rapid care ia fiecare carte la rând. Durează ani de zile.</li>
                    <li className="flex gap-2"><span className="text-purple-400">⚛️</span> <strong>Calculator Cuantic:</strong> Este un magician care deschide toate cărțile din bibliotecă <strong>simultan</strong>. Găsește pagina instantaneu.</li>
                </ul>
            </div>

            <p>
                Secretul stă în <strong>Qubits</strong>. Dacă biții clasici sunt 0 sau 1, Qubiții pot fi 0 și 1 în același timp. Această superputere le permite calcule imposibile pentru tehnologia actuală.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-red-500/20 rounded-lg text-red-400"><Lock size={24}/></span>
                De ce se teme Bitcoin de "Quantum"?
            </h3>

            <p>
                Securitatea Bitcoin se bazează pe faptul că este extrem de ușor să generezi o adresă publică din cheia privată, dar <strong>imposibil</strong> să faci invers (să ghicești cheia privată).
            </p>
            <p>
                Riscul: Un calculator cuantic ar putea face acest calcul invers ("Shor's Algorithm") în câteva ore, semnând tranzacții în numele tău și golind portofelul.
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold border-b border-white/10 pb-4">
                <span className="p-2 bg-green-500/20 rounded-lg text-green-400"><ShieldCheck size={24}/></span>
                Ar trebui să ne panicăm? (Răspunsul scurt: NU)
            </h3>

            <p>Iată de ce nu trebuie să vinzi tot mâine:</p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="font-bold text-white mb-2 font-[var(--font-space)]">1. Tehnologia e la început</div>
                    <p className="text-sm text-gray-400">
                        Computerele cuantice actuale sunt instabile. Experții estimează că suntem la <strong>10-30 de ani</strong> distanță de "Q-Day" (ziua în care pot sparge criptografia actuală).
                    </p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="font-bold text-white mb-2 font-[var(--font-space)]">2. Bitcoin este Software</div>
                    <p className="text-sm text-gray-400">
                        Bitcoin nu e o piatră. Dezvoltatorii lucrează deja la <strong>Criptografie Post-Cuantică (PQC)</strong>. Rețeaua va primi un update (soft fork) pentru a deveni imună.
                    </p>
                </div>
            </div>

            <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 my-6">
                <h4 className="text-blue-400 font-bold mb-2 font-[var(--font-space)]">💡 Sfat Pro: Nu refolosi adresele!</h4>
                <p className="text-sm text-gray-300">
                    Dacă nu ți-ai refolosit niciodată adresa de Bitcoin (un best practice), cheia ta publică nu este vizibilă pe blockchain până când nu faci o tranzacție. Stratul de "Hashing" oferă o protecție suplimentară chiar și împotriva calculatoarelor cuantice.
                </p>
            </div>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-xl font-bold">Concluzie: O cursă contra cronometru</h3>
            <p>
                Riscul există, dar nu este iminent. Este o cursă între dezvoltarea atacului și dezvoltarea apărării. Istoria ne-a arătat că Bitcoin se adaptează. Amenințarea cuantică va fi probabil doar un alt capitol tehnic depășit prin inovație.
            </p>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Știrile Crypto</span> • Analist Tech & Crypto
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie știrea:</span>
                <ShareButtons 
                    title="Calculatoarele Cuantice vs. Bitcoin: Sfârșitul Criptomonedelor?" 
                    slug="riscuri-quantum-computing-bitcoin-explicat" 
                />
            </div>
        </div>

        {/* CTA Consultanță - HOOK PUTERNIC */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 p-8 rounded-2xl border border-purple-500/30 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 font-[var(--font-space)]">Tu cât de pregătit ești pentru viitor?</h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                În lumea digitală, "departe" devine "mâine" foarte repede. Ai nevoie de o strategie clară, nu de reacții la panică. Hai să construim un plan solid.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                <Zap size={18}/> Discută cu Știrile Crypto
            </Link>
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