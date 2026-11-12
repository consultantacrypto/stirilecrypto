import { withRssAlternate } from '@/lib/rss-alternate';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { getMergedNewsListingArticles } from '@/lib/articles-db';
import { buildArticleItemListJsonLd, buildCollectionPageJsonLd } from '@/lib/collection-json-ld';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/json-ld';
import { TOPIC_HUBS } from '@/lib/topic-hubs';

export function generateStaticParams() {
  return Object.keys(TOPIC_HUBS).map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const hub = TOPIC_HUBS[topic];
  if (!hub) return { title: 'Hub inexistent' };

  return {
    title: hub.title,
    description: hub.description,
    alternates: withRssAlternate({
      canonical: `${SITE_URL}/hub/${topic}`,
    }),
  };
}

export default async function HubPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const hub = TOPIC_HUBS[topic];
  if (!hub) notFound();

  const all = await getMergedNewsListingArticles();
  const needles = hub.keywords.map((k) => k.toLowerCase());
  const articles = all.filter((item) => {
    const haystack = `${item.title} ${item.category} ${item.summary ?? ''}`.toLowerCase();
    return needles.some((k) => haystack.includes(k));
  });

  const hubUrl = `${SITE_URL}/hub/${topic}`;
  const listed = articles.slice(0, 20);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Acasă', path: '/' },
    { name: hub.h1, path: `/hub/${topic}` },
  ]);
  const collectionJsonLd = buildCollectionPageJsonLd({
    url: hubUrl,
    name: hub.h1,
    description: hub.description,
    aboutName: hub.about,
  });
  const itemListJsonLd = buildArticleItemListJsonLd(
    listed.map((item) => ({
      name: item.title,
      url: `${SITE_URL}/stiri/${item.slug}`,
    })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-6 py-16 max-w-6xl flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
            Hub tematic
          </p>
          <h1 className="text-3xl md:text-5xl font-black mb-4 font-[var(--font-space)]">
            {hub.h1}
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mb-10">{hub.description}</p>

          <div className="flex flex-wrap gap-3 mb-12 text-sm">
            {Object.entries(TOPIC_HUBS).map(([slug, config]) => (
              <Link
                key={slug}
                href={`/hub/${slug}`}
                className={`px-4 py-2 rounded-full border min-h-12 inline-flex items-center ${
                  slug === topic
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {config.label}
              </Link>
            ))}
            <Link
              href="/hub/stiri-crypto-romania"
              className="px-4 py-2 rounded-full border min-h-12 inline-flex items-center border-white/10 text-gray-400 hover:border-white/30"
            >
              Știri crypto România
            </Link>
          </div>

          {articles.length === 0 ? (
            <p className="text-gray-500">
              Nu am găsit încă articole pentru acest hub.{' '}
              <Link href="/stiri" className="text-blue-400 hover:underline">
                Vezi toate știrile
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((item) => (
                <ArticleCard
                  key={item.slug}
                  slug={item.slug}
                  title={item.title}
                  image={item.image}
                  category={item.category}
                />
              ))}
            </div>
          )}
        </div>
        <Footer />
      </main>
    </>
  );
}
