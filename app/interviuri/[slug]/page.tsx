import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/ArticleContent';
import ShareButtons from '@/components/ShareButtons';
import { getBadgeStyle } from '@/lib/interviews';
import {
  getInterviewBySlug,
  getPublishedInterviewSlugs,
} from '@/lib/interviews-db';
import {
  buildInterviewArticleJsonLd,
  SITE_URL,
  toAbsoluteUrl,
} from '@/lib/json-ld';

export const revalidate = 60;

export async function generateStaticParams() {
  return getPublishedInterviewSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const interview = await getInterviewBySlug(slug);

  if (!interview) {
    return { title: { absolute: 'Interviu inexistent | Știrile Crypto' } };
  }

  const canonicalUrl = `${SITE_URL}/interviuri/${slug}`;
  const encodedTitle = encodeURIComponent(interview.title);
  const dynamicOgImage = `${SITE_URL}/api/og?title=${encodedTitle}&category=${encodeURIComponent('Interviuri')}`;
  const coverImage = toAbsoluteUrl(interview.cover_image);
  const ogImageUrl = coverImage ?? dynamicOgImage;

  return {
    title: { absolute: `${interview.title} | Interviuri — Știrile Crypto` },
    description: interview.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: interview.title,
      description: interview.excerpt,
      type: 'article',
      url: canonicalUrl,
      siteName: 'Știrile Crypto',
      locale: 'ro_RO',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: interview.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@MIhaiDanielWeb3',
      creator: '@MIhaiDanielWeb3',
      title: interview.title,
      description: interview.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const interview = await getInterviewBySlug(slug);

  if (!interview) {
    notFound();
  }

  const coverSrc = interview.cover_image?.trim();
  const interviewJsonLd = buildInterviewArticleJsonLd({
    title: interview.title,
    excerpt: interview.excerpt,
    guest_name: interview.guest_name,
    cover_image: interview.cover_image,
    created_at: interview.created_at,
    slug: interview.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(interviewJsonLd) }}
      />

      <div className="min-h-screen bg-black text-white font-sans selection:bg-violet-500/30 flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 sm:px-6 max-w-3xl w-full py-28 md:py-32">
          <Link
            href="/interviuri"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-[var(--font-inter)] mb-10"
          >
            <ArrowLeft size={16} />
            Înapoi la Interviuri
          </Link>

          <article>
            <header className="mb-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest font-[var(--font-space)] ${getBadgeStyle(interview.badge)}`}
                >
                  {interview.badge}
                </span>
                {interview.dateLabel ? (
                  <span className="flex items-center gap-1.5 text-xs text-gray-500 font-[var(--font-inter)]">
                    <Calendar size={12} />
                    <time dateTime={interview.created_at}>{interview.dateLabel}</time>
                  </span>
                ) : null}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight font-[var(--font-space)]">
                {interview.title}
              </h1>

              <p className="mt-4 flex items-center gap-2 text-violet-300/90 text-lg font-[var(--font-inter)]">
                <User size={18} className="shrink-0" aria-hidden />
                <span>
                  Cu{' '}
                  <span className="text-white font-semibold">{interview.guest_name}</span>
                </span>
              </p>

              <p className="mt-6 text-lg text-gray-400 leading-relaxed border-l-2 border-violet-500/40 pl-5 font-[var(--font-inter)]">
                {interview.excerpt}
              </p>
            </header>

            {coverSrc ? (
              <div className="relative w-full aspect-[16/10] mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"
                  aria-hidden
                />
                <Image
                  src={coverSrc}
                  alt={interview.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
              </div>
            ) : null}

            <ArticleContent content={interview.content} />

            <footer className="mt-14 pt-8 border-t border-white/10">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3 font-[var(--font-space)]">
                Distribuie interviul
              </p>
              <ShareButtons
                title={interview.title}
                slug={interview.slug}
                sharePath={`/interviuri/${interview.slug}`}
              />
            </footer>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
