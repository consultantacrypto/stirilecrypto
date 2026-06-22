import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import ArticleContent from '@/components/ArticleContent';
import ArticleCoverImage from '@/components/ArticleCoverImage';
import ViewTracker from '@/components/ViewTracker';
import { splitArticleContent } from '@/lib/split-article-content';
import {
  getMarketPulseForPage,
  getMarketPulseSlugs,
  type ArticlePageData,
} from '@/lib/articles-db';
import { normalizeImageUrl } from '@/lib/image-url';
import { buildFinancialArticleJsonLd, SITE_URL, toAbsoluteUrl } from '@/lib/json-ld';
import { Activity, ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateStaticParams() {
  return getMarketPulseSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getMarketPulseForPage(slug);

  if (!article) return { title: 'Market Pulse Inexistent' };

  const seoTitle = article.meta_title?.trim() || article.title;
  const seoDescription = article.meta_description?.trim() || article.excerpt;
  const canonicalUrl = `${SITE_URL}/market-pulse/${slug}`;
  const encodedTitle = encodeURIComponent(seoTitle);
  const dynamicOgImage = `${SITE_URL}/api/og?title=${encodedTitle}&category=${encodeURIComponent('Market Pulse')}`;
  const coverImage = toAbsoluteUrl(article.image_url);
  const ogImageUrl = coverImage ?? dynamicOgImage;

  return {
    title: { absolute: `${seoTitle} | Market Pulse — Știrile Crypto` },
    description: seoDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Știrile Crypto',
      locale: 'ro_RO',
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at ?? article.published_at ?? undefined,
      authors: ['Stirile Crypto'],
      section: 'Market Pulse',
      tags: ['Market Pulse', 'analiză tehnică', 'crypto'],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: seoTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@MIhaiDanielWeb3',
      creator: '@MIhaiDanielWeb3',
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function MarketPulsePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getMarketPulseForPage(slug);

  if (!article) {
    notFound();
  }

  return <MarketPulsePageContent article={article} slug={slug} />;
}

function MarketPulsePageContent({
  article,
  slug,
}: {
  article: ArticlePageData;
  slug: string;
}) {
  const { main, conclusion } = splitArticleContent(article.content);
  const coverSrc = normalizeImageUrl(article.image_url);
  const jsonLd = buildFinancialArticleJsonLd(article, slug, {
    path: `/market-pulse/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-amber-500/30">
        <Navbar />
        <ViewTracker slug={article.slug} />

        <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]"
            >
              <ArrowLeft size={16} /> Înapoi acasă
            </Link>
          </div>

          <header className="mb-10 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest mb-4 justify-center md:justify-start font-[var(--font-space)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                Market Pulse
              </span>
              <span className="text-amber-500/70">Analiză Tehnică Zilnică</span>
              <span className="flex items-center gap-1 text-gray-400 font-[var(--font-inter)]">
                <Calendar size={12} /> {article.dateLabel}
              </span>
              <span className="flex items-center gap-1 text-gray-400 font-[var(--font-inter)]">
                <Clock size={12} /> {article.readTime} citire
              </span>
              <span className="flex items-center gap-1 text-gray-400 font-[var(--font-inter)]">
                <Eye size={12} /> {article.views || 0} vizualizări
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start text-amber-400/80">
              <Activity size={16} aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Daily Technical Analysis
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-6 text-white font-[var(--font-space)]">
              {article.title}
            </h1>
          </header>

          <ArticleCoverImage
            src={coverSrc}
            alt={article.title}
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            aspectRatio="video"
            className="mb-8 rounded-2xl border border-amber-500/20 shadow-2xl"
            imageClassName="group-hover:scale-[1.02] transition-transform duration-700"
            overlay={
              <div
                className="absolute inset-0 z-[2] bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent pointer-events-none"
                aria-hidden
              />
            }
          />

          <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-amber-500/50 pl-6 italic font-[var(--font-inter)] mb-12">
            {article.excerpt}
          </p>

          {main ? <ArticleContent content={main} /> : null}

          {conclusion ? (
            <aside
              className="bg-slate-900/40 border-l-4 border-amber-500/40 p-6 rounded-r-2xl my-8 text-gray-200 [&_p]:italic [&_li]:text-gray-200"
              aria-label="Concluzie"
            >
              <ArticleContent content={conclusion} />
            </aside>
          ) : null}

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
              Autor: <span className="text-white font-bold">Știrile Crypto</span> • Market Pulse
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold font-[var(--font-space)]">
                Distribuie analiza:
              </span>
              <ShareButtons
                title={article.title}
                slug={article.slug}
                sharePath={`/market-pulse/${article.slug}`}
              />
            </div>
          </div>
        </article>

        <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
          <div className="container mx-auto px-6">
            © 2026 Știrile Crypto. Toate drepturile rezervate.
          </div>
        </footer>
      </main>
    </>
  );
}
