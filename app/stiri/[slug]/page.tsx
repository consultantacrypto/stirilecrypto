import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import Newsletter from '@/components/Newsletter';
import BybitPromo from '@/components/BybitPromo';
import RelatedArticles from '@/components/RelatedArticles';
import ReadingProgress from '@/components/ReadingProgress';
import CryptoTicker from '@/components/CryptoTicker';
import { prepareArticleContent } from '@/lib/article-content';
import {
  getArticleForPage,
  getAllArticleSlugs,
  type ArticlePageData,
  type ArticleImpact,
} from '@/lib/articles-db';

import {
  Calendar,
  Clock,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Zap,
  BrainCircuit,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';

export const revalidate = 0;

const ARTICLE_BODY_CLASSES = [
  'article-body prose prose-invert prose-lg md:prose-xl max-w-none',
  'prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300',
  'prose-strong:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-300',
  'prose-headings:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3',
  '[&_a]:underline [&_a]:transition-colors [&_a]:font-medium',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400',
].join(' ');

function getTheme(impact: ArticleImpact) {
  switch (impact) {
    case 'bullish':
      return {
        accent: 'text-green-400',
        border: 'border-green-500/30',
        bg: 'bg-green-950/40',
        selection: 'selection:bg-green-500/30',
        icon: TrendingUp,
        ctaTitle: 'Pregătește-te pentru oportunitate',
        ctaText:
          'Când piața crește, trebuie să știi când să intri și când să ieși. Hai să facem strategia.',
        ctaIcon: Zap,
        btnText: 'text-green-700',
      };
    case 'bearish':
      return {
        accent: 'text-red-500',
        border: 'border-red-500/30',
        bg: 'bg-red-950/40',
        selection: 'selection:bg-red-500/30',
        icon: TrendingDown,
        ctaTitle: 'Nu pierde bani din neștiință',
        ctaText:
          'Piețele volatile sunt periculoase fără plan. Securizează-ți portofoliul acum.',
        ctaIcon: ShieldAlert,
        btnText: 'text-red-700',
      };
    default:
      return {
        accent: 'text-blue-400',
        border: 'border-blue-500/30',
        bg: 'bg-blue-950/40',
        selection: 'selection:bg-blue-500/30',
        icon: BrainCircuit,
        ctaTitle: 'Investește în educația ta',
        ctaText:
          'Emoțiile te costă bani. Ai nevoie de o strategie clară, nu de reacții la știri.',
        ctaIcon: Lightbulb,
        btnText: 'text-blue-700',
      };
  }
}

export async function generateStaticParams() {
  return getAllArticleSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleForPage(slug);

  if (!article) return { title: 'Articol Inexistent' };

  return {
    title: `${article.title} | Știrile Crypto`,
    description: article.excerpt,
    openGraph: {
      images: article.image_url ? [article.image_url] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleForPage(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePageContent article={article} />;
}

function ArticlePageContent({ article }: { article: ArticlePageData }) {
  const { html: contentWithTooltips, usePreWrap } = prepareArticleContent(article.content);
  const theme = getTheme(article.impact);
  const ThemeIcon = theme.icon;
  const CtaIcon = theme.ctaIcon as LucideIcon;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.image_url ? [article.image_url] : [],
    datePublished: article.dateLabel,
    author: [
      {
        '@type': 'Organization',
        name: 'Știrile Crypto',
        url: 'https://www.stirilecrypto.ro',
      },
    ],
  };

  return (
    <main
      className={`min-h-screen flex flex-col bg-[#020617] text-white ${theme.selection}`}
    >
      <ReadingProgress />
      <CryptoTicker />

      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <div className="flex-1 w-full">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/stiri"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} /> Înapoi la Știri
            </Link>
          </div>

          <article>
            <header className="mb-10">
              <div
                className={`flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest ${theme.accent} mb-4`}
              >
                <span
                  className={`bg-white/5 px-3 py-1 rounded-full border ${theme.border} flex items-center gap-2`}
                >
                  <ThemeIcon size={12} /> {article.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar size={12} /> {article.dateLabel}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock size={12} /> {article.readTime} citire
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                {article.title}
              </h1>

              <p
                className={`text-base md:text-lg text-gray-300 leading-relaxed border-l-4 ${theme.border.replace('/30', '/60')} pl-6`}
              >
                {article.excerpt}
              </p>
            </header>

            {article.image_url && (
              <div
                className={`relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border ${theme.border} shadow-2xl group`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60" />
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            )}

            {article.mihaiTake && (
              <div className="bg-[#0a1025] border border-white/10 rounded-xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <BrainCircuit size={80} className="text-white" />
                </div>
                <h3
                  className={`${theme.accent} font-bold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider`}
                >
                  <span className={`w-2 h-2 bg-current rounded-full animate-pulse`} />
                  Take Editorial
                </h3>
                <p className="text-sm md:text-base text-gray-300 italic leading-relaxed">
                  &quot;{article.mihaiTake}&quot;
                </p>
              </div>
            )}

            <div
              className={`${ARTICLE_BODY_CLASSES}${usePreWrap ? ' whitespace-pre-wrap' : ''}`}
              dangerouslySetInnerHTML={{ __html: contentWithTooltips }}
            />

            <div className={`mt-16 relative overflow-hidden rounded-3xl border ${theme.border} p-1`}>
              <div className={`absolute inset-0 ${theme.bg} backdrop-blur-xl`} />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />

              <div className="relative z-10 p-8 md:p-12 text-center">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border ${theme.border} text-xs font-bold uppercase tracking-widest ${theme.accent} mb-6`}
                >
                  <CheckCircle2 size={12} /> Redacție Știrile Crypto
                </div>

                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
                  {theme.ctaTitle}
                </h3>
                <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
                  {theme.ctaText}
                </p>

                <Link
                  href="/contact"
                  className={`group inline-flex items-center gap-3 bg-white hover:bg-gray-100 ${theme.btnText} font-bold text-lg px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1`}
                >
                  <CtaIcon size={20} className="group-hover:scale-110 transition-transform" />
                  Contactează Redacția
                </Link>
                <p className="text-xs text-gray-500 mt-4">Contact editorial • Răspuns în 24-48h</p>
              </div>
            </div>

            <BybitPromo />
            <RelatedArticles currentSlug={article.slug} />

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-sm text-gray-500">
                Autor: <span className="text-white font-bold">Știrile Crypto</span> • Redacție
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                  Distribuie analiza:
                </span>
                <ShareButtons title={article.title} slug={article.slug} />
              </div>
            </div>
          </article>

          <Newsletter />
        </div>
      </div>

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm mt-12">
        <div className="container mx-auto px-6">
          © 2026 Știrile Crypto. Toate drepturile rezervate.
        </div>
      </footer>
    </main>
  );
}
