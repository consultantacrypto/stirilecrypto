import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { getMergedNewsListingArticles } from '@/lib/articles-db';
import { buildBreadcrumbJsonLd, SITE_URL } from '@/lib/json-ld';

type HubConfig = {
  title: string;
  description: string;
  keywords: string[];
};

const HUBS: Record<string, HubConfig> = {
  mica: {
    title: 'Hub MiCA — Reglementare Crypto UE',
    description:
      'Toate articolele Știrile Crypto despre MiCA, compliance, exchange-uri licențiate și impactul reglementării europene.',
    keywords: ['mica', 'reglement', 'compliance', 'ue', 'european', 'licenț', 'anaf', 'fiscal'],
  },
  bitcoin: {
    title: 'Hub Bitcoin — Analize & Știri',
    description:
      'Articole și analize despre Bitcoin: preț, on-chain, ETF-uri, macro și context pentru investitori.',
    keywords: ['bitcoin', 'btc', 'satoshi', 'etf', 'on-chain', 'halving'],
  },
  securitate: {
    title: 'Hub Securitate Crypto',
    description:
      'Ghiduri și alerte despre securitatea portofelelor, hack-uri, phishing și bune practici.',
    keywords: ['securitate', 'hack', 'phishing', 'wallet', 'portofel', 'scam', 'fraud'],
  },
};

export function generateStaticParams() {
  return Object.keys(HUBS).map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const hub = HUBS[topic];
  if (!hub) return { title: 'Hub inexistent' };

  return {
    title: hub.title,
    description: hub.description,
    alternates: {
      canonical: `${SITE_URL}/hub/${topic}`,
    },
  };
}

export default async function HubPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const hub = HUBS[topic];
  if (!hub) notFound();

  const all = await getMergedNewsListingArticles();
  const needles = hub.keywords.map((k) => k.toLowerCase());
  const articles = all.filter((item) => {
    const haystack = `${item.title} ${item.category} ${item.summary ?? ''}`.toLowerCase();
    return needles.some((k) => haystack.includes(k));
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Acasă', path: '/' },
    { name: hub.title, path: `/hub/${topic}` },
  ]);

  return (
    <>
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
            {hub.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mb-10">{hub.description}</p>

          <div className="flex flex-wrap gap-3 mb-12 text-sm">
            {Object.entries(HUBS).map(([slug, config]) => (
              <Link
                key={slug}
                href={`/hub/${slug}`}
                className={`px-4 py-2 rounded-full border min-h-12 inline-flex items-center ${
                  slug === topic
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {config.title.split('—')[0].replace('Hub ', '').trim()}
              </Link>
            ))}
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
