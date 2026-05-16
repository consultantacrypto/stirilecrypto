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
          className="inline-flex items-center gap-2 bg-[#1c1c1e] border border-white/10 rounded-full px-4 py-2 text-white text-sm font-medium"
        >
          {word}
          <span className="text-blue-400 text-xs tabular-nums">{count}</span>
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
        <header className="mb-8 border-b border-white/10 pb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-2">
            Internal · Editorial
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Alpha Trend Radar</h1>

          <div className="mt-6 bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 mb-8 text-slate-300 text-sm leading-relaxed">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Intelligence Logic
            </p>
            <p>
              Logica Radarului: Acest dashboard interceptează în timp real fluxurile RSS de
              la cei mai mari 4 competitori globali. Când un cuvânt cheie (ex: SEC, Ripple, ETF)
              apare în secțiunea &apos;Hot Keywords&apos; (calculat din ultimele 12 ore), înseamnă
              că există o tracțiune masivă pe acel subiect la nivel macro. Strategia ta: Scrie o
              știre sau o analiză pe acel subiect imediat pentru a captura volumul de căutări
              înainte ca trendul să se răcească.
            </p>
          </div>

          <p className="mt-6 text-slate-400 text-sm">
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
          {feedArticles.length === 0 ? (
            <p className="bg-[#1c1c1e] border border-white/5 rounded-2xl p-8 text-center text-slate-500 text-sm">
              Nu s-au putut încărca articolele. Verifică conexiunea sau feed-urile RSS.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:gap-6">
              {feedArticles.map((article) => (
                <li key={`${article.source}-${article.link}`}>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full bg-[#1c1c1e] border border-white/5 rounded-2xl p-5 transition-colors hover:border-white/10"
                  >
                    <p className="text-white font-semibold leading-snug">
                      {article.title}
                    </p>
                    <p className="text-slate-400 text-xs mt-3 flex gap-3">
                      <span>{article.source}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {formatRelativeTimeRo(article.pubDate)}
                      </span>
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
