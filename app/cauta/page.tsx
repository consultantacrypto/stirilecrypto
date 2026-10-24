import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { searchArticles } from '@/lib/article-search';
import { getMergedNewsListingArticles } from '@/lib/articles-db';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Caută articole',
  description: 'Caută în titlurile și rezumatele articolelor Știrile Crypto.',
  alternates: { canonical: `${SITE_URL}/cauta` },
  robots: { index: false, follow: true },
};

export const dynamic = 'force-dynamic';

function queryFrom(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return typeof raw === 'string' ? raw : '';
}

export default async function CautaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = queryFrom(params.q);
  const articles = query.trim().length >= 2 ? await getMergedNewsListingArticles() : [];
  const results = searchArticles(articles, query);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-[var(--font-space)] text-4xl font-black tracking-tight">Caută articole</h1>
        <p className="mt-3 text-slate-400">Caută în titlu și în rezumat. Scrie cel puțin două litere.</p>
        <form action="/cauta" className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="q">
            Căutare
          </label>
          <input
            id="q"
            name="q"
            defaultValue={query}
            placeholder="Bitcoin, taxe, Ethereum"
            className="min-h-12 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-blue-500"
          />
          <button type="submit" className="min-h-12 rounded-xl bg-white px-5 font-bold text-black">
            Caută
          </button>
        </form>

        {query.trim().length >= 2 ? (
          <p className="mt-8 text-sm text-slate-400">
            {results.length} {results.length === 1 ? 'articol' : 'articole'}
          </p>
        ) : null}

        <ul className="mt-4 space-y-4">
          {results.map((article) => (
            <li key={article.slug}>
              <Link href={`/stiri/${article.slug}`} className="block rounded-2xl border border-white/10 p-4 hover:border-white/25">
                <span className="font-semibold text-white">{article.title}</span>
                {article.summary ? <span className="mt-2 block text-sm text-slate-400">{article.summary}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </main>
  );
}
