'use client';

import Navbar from '@/components/Navbar';
import { Calendar, Clock, ArrowLeft, Share2, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-blue-500/30">
      <Navbar />

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
            <Link href="/stiri" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                <ArrowLeft size={16}/> Înapoi la Știri
            </Link>
        </div>

        {/* Header Articol */}
        <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
                <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Știri Crypto</span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> 05 Dec 2025</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 4 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 font-[var(--font-space)]">
                Marea Convergență: Cum SUA transformă Crypto într-un activ "Gold Standard"
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed border-l-4 border-blue-500/50 pl-6 italic font-[var(--font-inter)]">
                Lumea financiară tocmai s-a schimbat. Vanguard și CFTC validează criptomonedele nu doar ca active speculative, ci ca parte integrală a economiei globale.
            </p>
        </header>

        {/* Imagine Principală - URL REPARAT */}
        <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60"></div>
            {/* ✅ IMAGINEA CORECTĂ (Cea care merge și în listă) */}
            <img 
                src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop" 
                alt="Wall Street Bull Crypto" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
        </div>

        {/* Conținut Articol - FONT SCHIMBAT (Inter) */}
        {/* ✅ Aici aplicăm font-[var(--font-inter)] pentru lizibilitate maximă */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            <p>
                Dacă până acum întrebarea era <strong>"Va supraviețui crypto?"</strong>, noile evenimente schimbă întrebarea în <strong>"Cât de mare va ajunge?"</strong>. 
                În ultimele zile, am asistat la două evenimente monumentale în Statele Unite care semnalează sfârșitul fazei de "Vest Sălbatic".
            </p>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold">
                <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><TrendingUp size={24}/></span>
                1. Uriașul s-a trezit: Vanguard îmbrățișează Crypto
            </h3>
            
            <p>
                <strong>Vestea:</strong> Vanguard, a doua cea mai mare firmă de gestionare a activelor din lume (trilioane de dolari), a decis să permită listarea ETF-urilor și fondurilor mutuale crypto. Vorbim despre Bitcoin, Ethereum, Solana și XRP.
            </p>
            <p>
                <strong>De ce este șocant?</strong> Vanguard a fost, istoric vorbind, cel mai mare critic al criptomonedelor. Faptul că ei au făcut o întoarcere la 180 de grade este semnalul suprem.
            </p>
            <ul className="bg-white/5 p-6 rounded-xl border border-white/10 list-none space-y-3 my-6">
                <li className="flex gap-3"><span className="text-green-400 font-bold">✓</span> <strong>Validare Instituțională:</strong> Stigma de "bani magici" dispare.</li>
                <li className="flex gap-3"><span className="text-green-400 font-bold">✓</span> <strong>Capital Masiv:</strong> Se deschide accesul pentru fondurile de pensii.</li>
                <li className="flex gap-3"><span className="text-green-400 font-bold">✓</span> <strong>Efectul de Domino:</strong> Unde merge Vanguard, piața urmează.</li>
            </ul>

            <h3 className="flex items-center gap-3 text-white mt-12 mb-6 font-[var(--font-space)] text-2xl font-bold">
                <span className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><ShieldCheck size={24}/></span>
                2. "Gold Standard-ul" Reglementării: CFTC și Piețele Federale
            </h3>

            <p>
                <strong>Vestea:</strong> CFTC (Commodity Futures Trading Commission) a anunțat că produsele crypto "spot" vor începe să fie tranzacționate pe burse futures reglementate federal.
            </p>
            <p>
                Acesta este "Gold Standard-ul" pentru siguranță. Spre deosebire de bursele offshore, acum crypto se va tranzacționa pe platforme verificate, sigure, care respectă standardele federale de aproape 100 de ani.
            </p>

            <div className="bg-blue-600/10 border-l-4 border-blue-500 p-6 my-8 italic text-blue-200">
                "America își propune să devină liderul acestui sector, oferind investitorilor siguranța pe care o așteptau de ani de zile."
            </div>

            <h3 className="text-white mt-12 font-[var(--font-space)] text-2xl font-bold">Concluzie: Ce înseamnă asta pentru noi?</h3>
            <p>
                Mesajul este clar: <strong>Vanguard aduce capitalul</strong>, iar <strong>CFTC aduce siguranța</strong>.
                Este momentul în care crypto iese din "garaj" și intră pe ușa din față a Wall Street-ului.
            </p>
        </div>

        {/* Footer Articol */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel AI</span>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-white transition-colors">
                <Share2 size={16}/> Distribuie
            </button>
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