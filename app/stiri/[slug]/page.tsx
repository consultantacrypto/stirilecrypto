import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import ArticleContent from '@/components/ArticleContent';
import AffiliatePartnerBox from '@/components/AffiliatePartnerBox';
import EmailCaptureBox from '@/components/EmailCaptureBox';
import RelatedArticles from '@/components/RelatedArticles';
import { splitArticleContent } from '@/lib/split-article-content';
import {
  getArticleForPage,
  getAllArticleSlugs,
  type ArticlePageData,
} from '@/lib/articles-db';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 0;

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

  const encodedTitle = encodeURIComponent(article.title);
  const encodedCategory = encodeURIComponent(article.category);
  const ogImageUrl = `https://www.stirilecrypto.ro/api/og?title=${encodedTitle}&category=${encodedCategory}`;

  return {
    title: `${article.title} | Știrile Crypto`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `https://www.stirilecrypto.ro/stiri/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
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

  return <ArticlePageContent article={article} />;
}

function ArticlePageContent({ article }: { article: ArticlePageData }) {
  const { main, conclusion } = splitArticleContent(article.content);

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
    <main className="min-h-screen flex flex-col bg-[#020617] text-white selection:bg-blue-500/30">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <article className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
        {/* Top navigation */}
        <div className="mb-8">
          <Link
            href="/stiri"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)]"
          >
            <ArrowLeft size={16} /> Înapoi la Știri
          </Link>
        </div>

        {/* Meta header */}
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

        {/* Hero image */}
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

        {/* Main article body */}
        {main ? <ArticleContent content={main} /> : null}

        {/* Universal affiliate block */}
        <AffiliatePartnerBox />

        <EmailCaptureBox />

        {/* Conclusion zone */}
        {conclusion ? (
          <aside
            className="bg-slate-900/40 border-l-4 border-emerald-500/40 p-6 rounded-r-2xl my-8 text-gray-200 [&_p]:italic [&_li]:text-gray-200"
            aria-label="Concluzie"
          >
            <ArticleContent content={conclusion} />
          </aside>
        ) : null}

        {/* Share */}
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

        {/* Related feed — exactly 3 */}
        <RelatedArticles currentSlug={article.slug} />
      </article>

      <footer className="border-t border-white/5 py-12 bg-black/50 text-center text-gray-600 text-sm font-[var(--font-inter)]">
        <div className="container mx-auto px-6">
          © 2026 Știrile Crypto. Toate drepturile rezervate.
        </div>
      </footer>
    </main>
  );
}
