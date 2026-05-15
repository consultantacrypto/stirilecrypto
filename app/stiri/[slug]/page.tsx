import { articles } from '@/lib/articles';
import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import Newsletter from '@/components/Newsletter';
import BybitPromo from '@/components/BybitPromo'; 
import RelatedArticles from '@/components/RelatedArticles'; 
import ReadingProgress from '@/components/ReadingProgress'; 
import CryptoTicker from '@/components/CryptoTicker'; 
// ✅ Am scos AudioPlayer, am păstrat doar Dicționarul
import { enhanceContent } from '@/lib/dictionary';

import { 
  Calendar, Clock, ArrowLeft, 
  TrendingUp, TrendingDown, 
  ShieldAlert, Zap, 
  BrainCircuit, Lightbulb, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. Generăm rutele statice
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// 2. Metadata SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  
  if (!article) return { title: 'Articol Inexistent' };

  return {
    title: `${article.title} | Mihai Daniel`,
    description: article.summary,
    openGraph: {
      images: [article.image],
    },
  };
}

// 3. Pagina Articolului
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // ✅ Păstrăm Dicționarul Interactiv (Tooltips)
  const contentWithTooltips = enhanceContent(article.content);

  // --- Design Dinamic ---
  const getTheme = () => {
    switch (article.impact) {
      case 'bullish':
        return { 
          color: 'green', 
          accent: 'text-green-400', 
          border: 'border-green-500/30', 
          bg: 'bg-green-950/40', 
          selection: 'selection:bg-green-500/30',
          icon: TrendingUp,
          ctaTitle: 'Pregătește-te pentru oportunitate',
          ctaText: 'Când piața crește, trebuie să știi când să intri și când să ieși. Hai să facem strategia.',
          ctaIcon: Zap,
          btnText: 'text-green-700'
        };
      case 'bearish':
        return { 
          color: 'red', 
          accent: 'text-red-500', 
          border: 'border-red-500/30', 
          bg: 'bg-red-950/40',
          selection: 'selection:bg-red-500/30',
          icon: TrendingDown,
          ctaTitle: 'Nu pierde bani din neștiință',
          ctaText: 'Piețele volatile sunt periculoase fără plan. Securizează-ți portofoliul acum.',
          ctaIcon: ShieldAlert,
          btnText: 'text-red-700'
        };
      default: 
        return { 
          color: 'blue', 
          accent: 'text-blue-400', 
          border: 'border-blue-500/30', 
          bg: 'bg-blue-950/40',
          selection: 'selection:bg-blue-500/30',
          icon: BrainCircuit,
          ctaTitle: 'Investește în educația ta',
          ctaText: 'Emoțiile te costă bani. Ai nevoie de o strategie clară, nu de reacții la știri.',
          ctaIcon: Lightbulb,
          btnText: 'text-blue-700'
        };
    }
  };

  const theme = getTheme();
  const ThemeIcon = theme.icon;
  const CtaIcon = theme.ctaIcon;

  // Schema JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'image': [article.image],
    'datePublished': new Date(article.date).toISOString(),
    'author': [{ '@type': 'Person', 'name': 'Mihai Daniel', 'url': 'https://mihaidaniel.ro' }]
  };

  return (
    <main className={`min-h-screen flex flex-col bg-[#020617] text-white ${theme.selection}`}>
      
      {/* 1. BARA DE PROGRES */}
      <ReadingProgress />

      {/* 2. BANDA CU PREȚURI */}
      <CryptoTicker />

      <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
            <Link href="/stiri" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]">
                <ArrowLeft size={16}/> Înapoi la Știri
            </Link>
        </div>

        {/* HEADER */}
        <header className="mb-10 text-center md:text-left">
            <div className={`flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest ${theme.accent} mb-4 justify-center md:justify-start font-[var(--font-space)]`}>
                <span className={`bg-white/5 px-3 py-1 rounded-full border ${theme.border} flex items-center gap-2`}>
                    <ThemeIcon size={12}/> {article.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400"><Calendar size={12}/> {article.date}</span>
                <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> 5 min citire</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
                {article.title}
            </h1>

            <p className={`text-xl text-gray-300 leading-relaxed border-l-4 ${theme.border.replace('/30', '/60')} pl-6 italic font-[var(--font-inter)]`}>
                {article.summary}
            </p>
        </header>

        {/* IMAGINE */}
        <div className={`relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border ${theme.border} shadow-2xl group`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60"></div>
            <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            />
        </div>

        {/* CONTINUT */}
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
            {article.mihaiTake && (
                <div className="bg-[#0a1025] border border-gray-800 p-6 rounded-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={100} className="text-white"/></div>
                    <h3 className={`${theme.accent} font-bold mb-2 font-[var(--font-space)] flex items-center gap-2`}>
                        <span className={`w-2 h-2 bg-current rounded-full animate-pulse`}></span> Mihai's Take:
                    </h3>
                    <p className="text-sm italic text-gray-300 relative z-10">"{article.mihaiTake}"</p>
                </div>
            )}
            
            {/* Afișăm conținutul cu tooltips, FĂRĂ Audio */}
            <div dangerouslySetInnerHTML={{ __html: contentWithTooltips }} />
        </div>

        {/* --- 1. CTA CONSULTANȚĂ --- */}
        <div className={`mt-16 relative overflow-hidden rounded-3xl border ${theme.border} p-1`}>
            <div className={`absolute inset-0 ${theme.bg} backdrop-blur-xl`}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60"></div>
            
            <div className="relative z-10 p-8 md:p-12 text-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border ${theme.border} text-xs font-bold uppercase tracking-widest ${theme.accent} mb-6`}>
                    <CheckCircle2 size={12} /> Locuri Limitate Ianuarie 2026
                </div>
                
                <h3 className="text-3xl font-black text-white mb-4 font-[var(--font-space)]">
                    {theme.ctaTitle}
                </h3>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
                    {theme.ctaText}
                </p>
                
                <Link href="/#consultanta" className={`group inline-flex items-center gap-3 bg-white hover:bg-gray-100 ${theme.btnText} font-black text-lg px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1`}>
                    <CtaIcon size={20} className="group-hover:scale-110 transition-transform"/> 
                    Rezervă Sesiunea ($250)
                </Link>
                <p className="text-xs text-gray-500 mt-4">Sesiune 1-la-1 • Strategie Personalizată</p>
            </div>
        </div>

        {/* --- 2. BYBIT PROMO --- */}
        <BybitPromo />

        {/* 3. RELATED ARTICLES */}
        <RelatedArticles currentSlug={article.slug} />

        {/* 4. NEWSLETTER */}
        <Newsletter />

        {/* FOOTER ARTICOL */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Mihai Daniel</span> • Analist
            </div>
            
            <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Distribuie analiza:</span>
                <ShareButtons title={article.title} slug={article.slug} />
            </div>
        </div>

      </article>

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">© 2026 Mihai Daniel. Toate drepturile rezervate.</div>
      </footer>
    </main>
  );
}