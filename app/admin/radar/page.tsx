import type { Metadata } from 'next';
import {
  extractHotKeywords,
  fetchCompetitorFeeds,
  filterArticlesWithinHours,
  formatRelativeTimeRo,
  type HotKeyword,
} from '@/lib/trendRadar';

export const metadata: Metadata = {
  title: 'Alpha Trend Radar',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

function KeywordPills({ keywords }: { keywords: HotKeyword[] }) {
  if (keywords.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        Nu există suficiente titluri în ultimele 12 ore pentru analiză.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map(({ word, count }) => (
        <span
          key={word}
          className="inline-flex items-center gap-2 rounded-full backdrop-blur-md bg-red-500/20 text-red-400 px-4 py-2 text-sm font-medium border border-red-500/20"
        >
          {word}
          <span className="text-red-400/60 text-xs tabular-nums">{count}</span>
        </span>
      ))}
    </div>
  );
}

export default async function AlphaTrendRadarPage() {
  const articles = await fetchCompetitorFeeds();
  let feedArticles = filterArticlesWithinHours(articles, 24);
  const hotKeywords = extractHotKeywords(articles, 12);

  if (feedArticles.length === 0 && articles.length > 0) {
    feedArticles = articles.slice(0, 30);
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b border-white/10 pb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">
            Internal · Editorial
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Alpha Trend Radar</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Monitorizare competitori (ultimele 24h)
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Hot Keywords · ultimele 12h
          </h2>
          <KeywordPills keywords={hotKeywords} />
        </section>

        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Feed competitori
            </h2>
            <span className="text-xs text-slate-600">
              {feedArticles.length} articole
            </span>
          </div>
          <ul className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
            {feedArticles.length === 0 ? (
              <li className="px-5 py-8 text-center text-slate-500 text-sm">
                Nu s-au putut încărca articolele. Verifică conexiunea sau feed-urile RSS.
              </li>
            ) : (
              feedArticles.map((article) => (
                <li key={`${article.source}-${article.link}`}>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-5 py-4 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="tabular-nums">
                        {formatRelativeTimeRo(article.pubDate)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-400">{article.source}</span>
                    </div>
                    <p className="mt-1.5 text-[15px] font-medium leading-snug text-white/95">
                      {article.title}
                    </p>
                  </a>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </main>
  );
}
