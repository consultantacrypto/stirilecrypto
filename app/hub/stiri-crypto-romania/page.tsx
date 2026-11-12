import { withRssAlternate } from '@/lib/rss-alternate';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LinkedText from '@/components/LinkedText';
import {
  HUB_BITCOIN,
  HUB_BITCOIN_LINKS,
  HUB_DESCRIPTION,
  HUB_ENTITY,
  HUB_ENTITY_LINKS,
  HUB_ENTRIES,
  HUB_FAQ,
  HUB_FIND,
  HUB_FIND_LINKS,
  HUB_H1,
  HUB_PATH,
  HUB_SOURCES,
  HUB_SOURCES_LINKS,
  HUB_TITLE,
  HUB_UPDATED_LABEL,
  HUB_URL,
  HUB_USEFUL,
  HUB_USEFUL_LINKS,
  HUB_WHERE_INTRO,
  HUB_WHO,
  HUB_WHO_LINKS,
  buildHubCollectionJsonLd,
  buildHubItemListJsonLd,
} from '@/lib/hub-stiri-crypto-romania';
import { AEO_DRAFT_DATE_MODIFIED, buildBreadcrumbJsonLd, buildWebsiteShareMetadata } from '@/lib/json-ld';

const HUB_PILLS = [
  { href: HUB_PATH, label: 'Știri crypto România' },
  { href: '/hub/bitcoin', label: 'Bitcoin' },
  { href: '/hub/mica', label: 'MiCA' },
  { href: '/hub/securitate', label: 'Securitate' },
] as const;

export const metadata: Metadata = {
  title: { absolute: HUB_TITLE },
  description: HUB_DESCRIPTION,
  alternates: withRssAlternate({ canonical: HUB_URL }),
  ...buildWebsiteShareMetadata({
    title: HUB_TITLE,
    description: HUB_DESCRIPTION,
    canonical: HUB_URL,
  }),
};

export default function StiriCryptoRomaniaHubPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Acasă', path: '/' },
    { name: 'Hub', path: HUB_PATH },
    { name: 'Știri crypto România', path: HUB_PATH },
  ]);

  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHubCollectionJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHubItemListJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 md:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-400">Hub</p>
        <h1 className="mb-4 text-4xl font-black leading-tight md:text-5xl">{HUB_H1}</h1>
        <p className="mb-8 text-sm text-gray-500">
          Actualizat la:{' '}
          <time dateTime={AEO_DRAFT_DATE_MODIFIED}>{HUB_UPDATED_LABEL}</time>
        </p>
        <LinkedText text={HUB_ENTITY} links={HUB_ENTITY_LINKS} className="text-lg leading-relaxed text-gray-300" />

        <nav className="mt-8 flex flex-wrap gap-3 text-sm" aria-label="Hub-uri">
          {HUB_PILLS.map((pill) => (
            <Link
              key={pill.href}
              href={pill.href}
              className={`inline-flex min-h-12 items-center rounded-full border px-4 py-2 ${
                pill.href === HUB_PATH
                  ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                  : 'border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              {pill.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 space-y-8 font-[var(--font-inter)] leading-relaxed text-gray-300 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white">
          <section>
            <h2>Ce găsești pe acest hub</h2>
            <LinkedText text={HUB_FIND} links={HUB_FIND_LINKS} className="mt-3" />
          </section>

          <section>
            <h2>Unde citești știri crypto în română pe Știrile Crypto</h2>
            <p className="mt-3">{HUB_WHERE_INTRO}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {HUB_ENTRIES.map((entry) => (
                <li key={entry.href}>
                  <Link href={entry.href} className="text-blue-400 underline hover:text-blue-300">
                    {entry.title}
                  </Link>
                  {' — '}
                  {entry.text}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Cum selectăm și verificăm sursele</h2>
            <LinkedText text={HUB_SOURCES} links={HUB_SOURCES_LINKS} className="mt-3" />
          </section>

          <section>
            <h2>Surse crypto utile pentru cititorii din România</h2>
            <LinkedText text={HUB_USEFUL} links={HUB_USEFUL_LINKS} className="mt-3" />
          </section>

          <section>
            <h2>Cum acoperim Bitcoin pentru cititorii din România</h2>
            <LinkedText text={HUB_BITCOIN} links={HUB_BITCOIN_LINKS} className="mt-3" />
          </section>

          <section>
            <h2>Cine scrie pe Știrile Crypto</h2>
            <LinkedText text={HUB_WHO} links={HUB_WHO_LINKS} className="mt-3" />
          </section>

          <section>
            <h2>Întrebări frecvente</h2>
            <div className="mt-4 space-y-4">
              {HUB_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-bold text-white">{item.question}</h3>
                  <p className="mt-1">{item.answer}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">
              <Link href="/intrebari-frecvente" className="text-blue-400 underline hover:text-blue-300">
                Toate întrebările frecvente
              </Link>
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          <Link href="/despre" className="text-blue-400 underline hover:text-blue-300">
            Despre publicație
          </Link>
          {' · Contact: '}
          <a href="mailto:contact@stirilecrypto.ro" className="text-blue-400 underline hover:text-blue-300">
            contact@stirilecrypto.ro
          </a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
