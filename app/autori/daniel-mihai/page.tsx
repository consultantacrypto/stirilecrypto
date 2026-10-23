import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StoryThumb from '@/components/StoryThumb';
import { DANIEL_MIHAI, danielAuthorJsonLd } from '@/lib/authors';
import { getMarketPulseArchive } from '@/lib/articles-db';
import { SITE_URL, buildWebsiteShareMetadata } from '@/lib/json-ld';

const TITLE = 'Daniel Mihai, analist';
const DESCRIPTION =
  'Pagina de autor a lui Daniel Mihai, analist la Știrile Crypto. Analize de piață educative, fără recomandări de cumpărare sau vânzare.';

export const revalidate = 60;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${DANIEL_MIHAI.path}` },
  ...buildWebsiteShareMetadata({
    title: TITLE,
    description: DESCRIPTION,
    canonical: `${SITE_URL}${DANIEL_MIHAI.path}`,
  }),
};

export default async function DanielMihaiPage() {
  const analyses = (await getMarketPulseArchive()).slice(0, 8);
  const jsonLd = danielAuthorJsonLd();

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Autor</p>
        <div className="mt-6 flex items-center gap-4">
          <Image
            src={DANIEL_MIHAI.photo}
            alt={DANIEL_MIHAI.photoAlt}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
          <div>
            <h1 className="font-[var(--font-space)] text-3xl font-bold tracking-tight sm:text-4xl">
              {DANIEL_MIHAI.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{DANIEL_MIHAI.role} · Știrile Crypto</p>
          </div>
        </div>

        <p className="mt-8 text-base leading-relaxed text-slate-300">{DANIEL_MIHAI.bio}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          Știrile de flux fără semnătură individuală aparțin{' '}
          <Link href="/redactie" className="text-slate-300 underline decoration-white/20 underline-offset-2">
            redacției
          </Link>
          . Consultanța 1-la-1 este separată de publicație:{' '}
          <a
            href={DANIEL_MIHAI.consultancyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 underline decoration-white/20 underline-offset-2"
          >
            mihaidaniel.ro
          </a>
          .
        </p>

        <h2 className="mt-12 border-b border-white/10 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Analize
        </h2>
        {analyses.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Analizele publicate apar aici.</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/10">
            {analyses.map((item) => (
              <li key={item.id}>
                <StoryThumb
                  href={`/market-pulse/${item.slug}`}
                  title={item.title}
                  image={item.image_url}
                  meta={item.dateLabel || 'Market Pulse'}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
