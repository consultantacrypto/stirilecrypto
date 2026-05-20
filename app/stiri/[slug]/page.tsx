import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import ArticleContent from '@/components/ArticleContent';
import AffiliatePartnerBox from '@/components/AffiliatePartnerBox';
import EmailCaptureBox from '@/components/EmailCaptureBox';
import ViewTracker from '@/components/ViewTracker';
import RelatedArticles from '@/components/RelatedArticles';
import { splitArticleContent } from '@/lib/split-article-content';
import {
  getArticleForPage,
  getAllArticleSlugs,
  type ArticlePageData,
} from '@/lib/articles-db';
import { buildNewsArticleJsonLd, SITE_URL, toAbsoluteUrl } from '@/lib/json-ld';
import { Calendar, Clock, ArrowLeft, User, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 60;

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

  const seoTitle = article.meta_title?.trim() || article.title;
  const seoDescription = article.meta_description?.trim() || article.excerpt;
  const canonicalUrl = `${SITE_URL}/stiri/${slug}`;
  const encodedTitle = encodeURIComponent(seoTitle);
  const encodedCategory = encodeURIComponent(article.category);
  const dynamicOgImage = `${SITE_URL}/api/og?title=${encodedTitle}&category=${encodedCategory}`;
  const coverImage = toAbsoluteUrl(article.image_url);
  const ogImageUrl = coverImage ?? dynamicOgImage;

  return {
    title: `${seoTitle} | Știrile Crypto`,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
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
      section: article.category,
      tags: [article.category, 'crypto', 'știri'],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
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

  return <ArticlePageContent article={article} slug={slug} />;
}

function ArticlePageContent({
  article,
  slug,
}: {
  article: ArticlePageData;
  slug: string;
}) {
  const { main, conclusion } = splitArticleContent(article.content);
  const newsArticleJsonLd = buildNewsArticleJsonLd(article, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />

      <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-blue-500/30">
        <Navbar />

        <ViewTracker slug={article.slug} />

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
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 justify-center md:justify-start font-[var(--font-space)]">
              <span className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 flex items-center gap-2">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-gray-400 font-[var(--font-inter)]">
                <Calendar size={12} /> {article.dateLabel}
              </span>
              <span className="flex items-center gap-1 text-gray-400 font-[var(--font-inter)]">
                <Clock size={12} /> {article.readTime} citire
              </span>
              <span className="flex items-center gap-1 text-gray-400 font-[var(--font-inter)]">
                <Eye size={12} /> {article.views || 0} vizualizări
              </span>
              <span className="flex items-center gap-1 text-gray-400 font-[var(--font-inter)] normal-case">
                <User size={12} /> Știrile Crypto • Redacție
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-6 text-white font-[var(--font-space)]">
              {article.title}
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-blue-500/50 pl-6 italic font-[var(--font-inter)]">
              {article.excerpt}
            </p>
          </header>

          {article.image_url && (
            <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-60" />
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          )}

          {main ? <ArticleContent content={main} /> : null}

          <AffiliatePartnerBox />

          <EmailCaptureBox />

          {conclusion ? (
            <aside
              className="bg-slate-900/40 border-l-4 border-emerald-500/40 p-6 rounded-r-2xl my-8 text-gray-200 [&_p]:italic [&_li]:text-gray-200"
              aria-label="Concluzie"
            >
              <ArticleContent content={conclusion} />
            </aside>
          ) : null}

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-[var(--font-inter)]">
            <div className="text-sm text-gray-500">
              Autor: <span className="text-white font-bold">Știrile Crypto</span> • Redacție
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <span className="text-xs text-gray-500 uppercase tracking-widest font-bold font-[var(--font-space)]">
                Distribuie analiza:
              </span>
              <ShareButtons title={article.title} slug={article.slug} />
            </div>
          </div>

          <RelatedArticles currentSlug={article.slug} />
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
