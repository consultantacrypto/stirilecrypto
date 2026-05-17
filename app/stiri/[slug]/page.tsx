import Navbar from '@/components/Navbar';
import ShareButtons from '@/components/ShareButtons';
import { isHtmlArticleContent } from '@/lib/article-content';
import {
  getArticleForPage,
  getAllArticleSlugs,
  type ArticlePageData,
} from '@/lib/articles-db';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const revalidate = 0;

const CONTENT_WRAPPER_CLASSES =
  'prose prose-invert prose-lg max-w-none text-gray-300 font-[var(--font-inter)] leading-relaxed prose-headings:font-[var(--font-space)] prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-strong:text-white';

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
  const isLegacyHtml = isHtmlArticleContent(article.content);

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
    <main className="min-h-screen flex flex-col bg-[#020617] text-white">
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

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 font-[var(--font-space)]">
            <span className="text-blue-400">{article.category}</span>
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {article.dateLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {article.readTime} citire
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 text-white font-[var(--font-space)]">
            {article.title}
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-blue-500/50 pl-6 italic font-[var(--font-inter)]">
            {article.excerpt}
          </p>
        </header>

        {article.image_url && (
          <div className="relative w-full aspect-video mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {isLegacyHtml ? (
          <div
            className={CONTENT_WRAPPER_CLASSES}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className={CONTENT_WRAPPER_CLASSES}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/10">
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold font-[var(--font-space)] block mb-4">
            Distribuie analiza:
          </span>
          <ShareButtons title={article.title} slug={article.slug} />
        </div>
      </article>
    </main>
  );
}
