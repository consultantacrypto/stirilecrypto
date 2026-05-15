import { dictionary, enhanceContent } from '@/lib/dictionary'; // ✅ Am importat enhanceContent
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleTracker from '@/components/ArticleTracker'; // ✅ Am importat Senzorul
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lightbulb, Zap, Clock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = dictionary.find((t) => t.slug === slug);
  return {
    title: term ? `${term.term} - Explicație Completă | Academia Crypto` : 'Termen Necunoscut',
    description: term?.definition,
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = dictionary.find((t) => t.slug === slug);

  if (!term) return null;

  // ✅ Transformăm textul simplu în text cu Link-uri Inteligente
  const processedContent = enhanceContent(term.fullContent || '');

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 flex flex-col">
      {/* ✅ Activăm Senzorul Invizibil */}
      <ArticleTracker slug={term.slug} />
      
      <Navbar />

      {/* HERO HEADER */}
      <div className="relative h-[400px] w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020617] z-10"></div>
          {term.image && (
            <Image 
                src={term.image} 
                alt={term.term} 
                fill 
                className="object-cover opacity-50"
                priority
                unoptimized={true}
            />
          )}
          <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-end pb-12">
            <Link href="/academie" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm font-bold uppercase tracking-wider w-fit">
                <ArrowLeft size={16}/> Înapoi la Academie
            </Link>
            <span className="text-cyan-400 font-mono text-sm border border-cyan-500/20 bg-cyan-900/20 px-3 py-1 rounded mb-4 w-fit">
                {term.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight shadow-black drop-shadow-lg">
                {term.term}
            </h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Clock size={16}/> 
                <span>Timp de citire: <strong>3 min</strong></span>
            </div>
          </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl flex-grow">
        
        {/* MIHAI'S TAKE - PRIMUL LUCRU PE CARE ÎL VEZI */}
        <div className="relative bg-gradient-to-r from-blue-900/20 to-black border-l-4 border-cyan-500 rounded-r-xl p-8 mb-12 shadow-2xl">
            <div className="absolute -top-3 -left-3 bg-cyan-500 text-black p-1 rounded-full"><Zap size={20}/></div>
            <h3 className="text-cyan-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Mihai's Take</h3>
            <p className="text-xl text-white font-medium italic leading-relaxed">
                "{term.mihaiTake}"
            </p>
        </div>

        {/* ANALOGIA */}
        <div className="bg-[#0b1221] border border-white/5 rounded-2xl p-6 mb-12 flex gap-4 items-start">
            <div className="bg-yellow-500/10 p-3 rounded-xl text-yellow-500 shrink-0"><Lightbulb size={24}/></div>
            <div>
                <h4 className="text-lg font-bold text-white mb-2">Explicație pe Românește</h4>
                <p className="text-gray-300 leading-relaxed">{term.analogy}</p>
            </div>
        </div>

        {/* CONTINUTUL PRINCIPAL (ARTICLE BODY) */}
        {/* ✅ Aici injectăm conținutul procesat cu link-uri */}
        <div 
            className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-strong:text-white prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {/* CTA FINAL */}
        <div className="mt-16 bg-[#0a0f1e] border border-yellow-500/20 rounded-2xl p-8 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
             <h4 className="text-2xl font-bold text-white mb-2">Vrei să treci de la teorie la profit?</h4>
             <p className="text-gray-400 mb-6 max-w-lg mx-auto">Învață cum să tranzacționezi {term.term} corect, fără să pierzi bani din greșeli de începător.</p>
             <Link href="/#curs" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 px-10 rounded-xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105">
                Accesează Cursul Complet
             </Link>
        </div>

      </div>
      <Footer />
    </main>
  );
}