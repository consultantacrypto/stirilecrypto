import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import Newsletter from '@/components/Newsletter';
import BybitPromo from '@/components/BybitPromo';
import RelatedArticles from '@/components/RelatedArticles';
import ReadingProgress from '@/components/ReadingProgress';
import CryptoTicker from '@/components/CryptoTicker';
import { enhanceContent } from '@/lib/dictionary';
import { getArticleBySlug, getPublishedSlugs, formatArticleDate } from '@/lib/articles-db';

import {
  Calendar,
  Clock,
  ArrowLeft,
  BrainCircuit,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

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
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const contentWithTooltips = enhanceContent(article.content);
  const displayDate = formatArticleDate(article.published_at);

  const theme = {
    color: 'blue',
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

  const ThemeIcon = theme.icon;
  const CtaIcon = theme.ctaIcon;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.image_url ? [article.image_url] : [],
    datePublished: article.published_at ?? undefined,
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

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <Link
            href="/stiri"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]"
          >
            <ArrowLeft size={16} /> Înapoi la Știri
          </Link>
        </div>

        <header className="mb-10 text-center md:text-left">
          <div className={`flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest ${theme.accent} mb-4 justify-center md:justify-start font-[var(--font-space)]`}>
            <span
              className={`bg-white/5 px-3 py-1 rounded-full border ${theme.border} flex items-center gap-2`}
            >
              <ThemeIcon size={12} /> {article.category}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar size={12} /> {displayDate}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Clock size={12} /> 5 min citire
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
            {article.title}
          </h1>

          <p
            className={`text-xl text-gray-300 leading-relaxed border-l-4 ${theme.border.replace('/30', '/60')} pl-6 italic font-[var(--font-inter)]`}
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

        <div className="prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: contentWithTooltips }} />
        </div>

        <div className={`mt-16 relative overflow-hidden rounded-3xl border ${theme.border} p-1`}>
          <div className={`absolute inset-0 ${theme.bg} backdrop-blur-xl`} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/60" />

          <div className="relative z-10 p-8 md:p-12 text-center">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border ${theme.border} text-xs font-bold uppercase tracking-widest ${theme.accent} mb-6`}
            >
              <CheckCircle2 size={12} /> Redacție Știrile Crypto
            </div>

            <h3 className="text-3xl font-black text-white mb-4 font-[var(--font-space)]">
              {theme.ctaTitle}
            </h3>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              {theme.ctaText}
            </p>

            <Link
              href="/contact"
              className={`group inline-flex items-center gap-3 bg-white hover:bg-gray-100 ${theme.btnText} font-black text-lg px-10 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1`}
            >
              <CtaIcon size={20} className="group-hover:scale-110 transition-transform" />
              Contactează Redacția
            </Link>
            <p className="text-xs text-gray-500 mt-4">Contact editorial • Răspuns în 24-48h</p>
          </div>
        </div>

        <BybitPromo />
        <RelatedArticles currentSlug={article.slug} />
        <Newsletter />

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
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

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
        <div className="container mx-auto px-6">
          © 2026 Știrile Crypto. Toate drepturile rezervate.
        </div>
      </footer>
    </main>
  );
}
