import { withRssAlternate } from '@/lib/rss-alternate';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import LinkedText from '@/components/LinkedText';
import { getMergedNewsListingArticles } from '@/lib/articles-db';
import { buildArticleItemListJsonLd, buildCollectionPageJsonLd } from '@/lib/collection-json-ld';
import {
  BITCOIN_DEFINITION,
  BITCOIN_DEFINITION_LINKS,
  BITCOIN_DESCRIPTION,
  BITCOIN_H1,
  BITCOIN_SITE_ANSWER,
  BITCOIN_SITE_H3,
  BITCOIN_SITE_LINKS,
  BITCOIN_TITLE,
  BITCOIN_WHERE_H2,
  BITCOIN_WHERE_ITEMS,
  buildBitcoinCollectionJsonLd,
  buildBitcoinItemListJsonLd,
} from '@/lib/hub-bitcoin';
import { buildBreadcrumbJsonLd, buildWebsiteShareMetadata, SITE_URL } from '@/lib/json-ld';

type HubConfig = {
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  label: string;
  absoluteTitle?: boolean;
};

const HUBS: Record<string, HubConfig> = {
  mica: {
    title: 'Hub MiCA — Reglementare Crypto UE',
    h1: 'Hub MiCA — Reglementare Crypto UE',
    description:
      'Toate articolele Știrile Crypto despre MiCA, compliance, exchange-uri licențiate și impactul reglementării europene.',
    keywords: ['mica', 'reglement', 'compliance', 'ue', 'european', 'licenț', 'anaf', 'fiscal'],
    label: 'MiCA',
  },
  bitcoin: {
    title: BITCOIN_TITLE,
    h1: BITCOIN_H1,
    description: BITCOIN_DESCRIPTION,
    keywords: ['bitcoin', 'btc', 'satoshi', 'etf', 'on-chain', 'halving'],
    label: 'Bitcoin',
    absoluteTitle: true,
  },
  securitate: {
    title: 'Hub Securitate Crypto',
    h1: 'Hub Securitate Crypto',
    description:
      'Ghiduri și alerte despre securitatea portofelelor, hack-uri, phishing și bune practici.',
    keywords: ['securitate', 'hack', 'phishing', 'wallet', 'portofel', 'scam', 'fraud'],
    label: 'Securitate Crypto',
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

  const canonical = `${SITE_URL}/hub/${topic}`;
  const alternates = withRssAlternate({ canonical });
  if (hub.absoluteTitle) {
    return {
      title: { absolute: hub.title },
      description: hub.description,
      alternates,
      ...buildWebsiteShareMetadata({
        title: hub.title,
        description: hub.description,
        canonical,
      }),
    };
  }

  return {
    title: hub.title,
    description: hub.description,
    alternates,
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

  const hubUrl = `${SITE_URL}/hub/${topic}`;
  // Bitcoin already publishes CollectionPage + ItemList from lib/hub-bitcoin.
  const isBitcoin = topic === 'bitcoin';
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Acasă', path: '/' },
    { name: hub.h1, path: `/hub/${topic}` },
  ]);
  const collectionJsonLd = isBitcoin
    ? null
    : buildCollectionPageJsonLd({
        url: hubUrl,
        name: hub.h1,
        description: hub.description,
        aboutName: hub.label,
      });
  const itemListJsonLd = isBitcoin
    ? null
    : buildArticleItemListJsonLd(
        articles.slice(0, 20).map((item) => ({
          name: item.title,
          url: `${SITE_URL}/stiri/${item.slug}`,
        })),
      );

  return (
    <>
      {isBitcoin ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBitcoinCollectionJsonLd()) }}
        />
      ) : null}
      {isBitcoin ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBitcoinItemListJsonLd()) }}
        />
      ) : null}
      {collectionJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
        />
      ) : null}
      {itemListJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      ) : null}
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
          {isBitcoin ? (
            <div className="max-w-3xl mb-10 space-y-8 text-gray-300 leading-relaxed">
              <LinkedText
                text={BITCOIN_DEFINITION}
                links={BITCOIN_DEFINITION_LINKS}
                className="text-lg text-gray-300"
              />
              <section>
                <h2 className="text-2xl font-bold text-white">{BITCOIN_WHERE_H2}</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {BITCOIN_WHERE_ITEMS.map((item) => (
                    <li key={item.text}>
                      <LinkedText text={item.text} links={item.links} />
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-bold text-white">{BITCOIN_SITE_H3}</h3>
                <LinkedText text={BITCOIN_SITE_ANSWER} links={BITCOIN_SITE_LINKS} className="mt-2" />
              </section>
            </div>
          ) : (
            <p className="text-gray-400 text-lg max-w-3xl mb-10">{hub.description}</p>
          )}

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
