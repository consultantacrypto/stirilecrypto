import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  authorByKey,
  authorKeyForArticle,
  personAuthorJsonLd,
  type PersonAuthorKey,
} from '@/lib/authors';
import { getMarketPulseArchive } from '@/lib/articles-db';
import { EDITORIAL_POLICY_LINKS } from '@/lib/json-ld';

export default async function AuthorProfile({ authorKey }: { authorKey: PersonAuthorKey }) {
  const author = authorByKey(authorKey);
  const analyses = (await getMarketPulseArchive())
    .filter((item) => authorKeyForArticle({ slug: item.slug }) === authorKey)
    .slice(0, 8);
  const jsonLd = {
    '@context': 'https://schema.org',
    ...personAuthorJsonLd(authorKey),
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Autor</p>
        <div className="mt-6 flex items-center gap-4">
          {author.photo ? (
            <Image
              src={author.photo}
              alt={author.photoAlt ?? author.name}
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          ) : null}
          <div>
            <h1 className="font-[var(--font-space)] text-3xl font-bold tracking-tight sm:text-4xl">
              {author.name}
            </h1>
            <p className="mt-1 text-sm text-slate-400">{author.role} · Știrile Crypto</p>
          </div>
        </div>

        <p className="mt-8 text-base leading-relaxed text-slate-300">{author.bio}</p>
        {author.consultancyUrl ? (
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Consultanța 1-la-1 este separată de publicație:{' '}
            <a
              href={author.consultancyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 underline decoration-white/20 underline-offset-2"
            >
              mihaidaniel.ro
            </a>
            . Principiile după care sunt scrise materialele sunt în{' '}
            <Link href="/politica-editoriala" className="text-slate-300 underline decoration-white/20 underline-offset-2">
              politica editorială
            </Link>
            .
          </p>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            Principiile după care sunt scrise materialele sunt în{' '}
            <Link href="/politica-editoriala" className="text-slate-300 underline decoration-white/20 underline-offset-2">
              politica editorială
            </Link>
            .
          </p>
        )}

        {author.sameAs && author.sameAs.length > 0 ? (
          <>
            <h2 className="mt-10 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Profiluri publice
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {author.sameAs.map((href) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 underline decoration-white/20 underline-offset-2 hover:text-white"
                  >
                    {href.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <h2 className="mt-10 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Redacție
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/redactie" className="text-slate-300 underline decoration-white/20 underline-offset-2 hover:text-white">
              Redacția Știrile Crypto
            </Link>
          </li>
          {EDITORIAL_POLICY_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-slate-300 underline decoration-white/20 underline-offset-2 hover:text-white">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 border-b border-white/10 pb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Analize
        </h2>
        {analyses.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Analizele publicate apar aici.</p>
        ) : (
          <ul className="mt-2 divide-y divide-white/10">
            {analyses.map((item) => (
              <li key={item.id}>
                <Link href={`/market-pulse/${item.slug}`} className="group block py-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    {item.dateLabel || 'Market Pulse'}
                  </span>
                  <span className="mt-1 block font-semibold text-white group-hover:text-blue-300">
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
