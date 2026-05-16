import Parser from 'rss-parser';

export type RadarArticle = {
  title: string;
  link: string;
  pubDate: Date;
  source: string;
};

export type HotKeyword = {
  word: string;
  count: number;
};

const FEEDS = [
  { url: 'https://cointelegraph.com/rss', source: 'Cointelegraph' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://beincrypto.com/feed/', source: 'BeInCrypto' },
  { url: 'https://u.today/rss', source: 'U.Today' },
] as const;

const parser = new Parser({
  timeout: 15_000,
  headers: {
    'User-Agent': 'StirileCrypto-AlphaRadar/1.0 (+https://www.stirilecrypto.ro)',
  },
});

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'has', 'have',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'can', 'it', 'its', 'this', 'that', 'these', 'those', 'he', 'she', 'we', 'they', 'you',
  'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now', 'new', 'says', 'say',
  'said', 'after', 'over', 'into', 'about', 'up', 'out', 'off', 'down', 'via', 'amid',
  'also', 'been', 'being', 'here', 'there', 'then', 'than', 'them', 'their', 'they',
  'your', 'our', 'his', 'her', 'its', 'my', 'me', 'him', 'us', 'get', 'gets', 'got',
  'amid', 'among', 'while', 'during', 'before', 'between', 'under', 'above', 'across',
  'against', 'along', 'around', 'because', 'until', 'since', 'without', 'within',
  'through', 'despite', 'per', 'yet', 'still', 'even', 'back', 'first', 'last', 'next',
  'may', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'top', 'latest', 'breaking', 'report', 'reports', 'update', 'updates', 'news',
]);

function tokenizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        !STOP_WORDS.has(word) &&
        !/^\d+$/.test(word) &&
        !/^https?/.test(word),
    );
}

export async function fetchCompetitorFeeds(): Promise<RadarArticle[]> {
  const settled = await Promise.allSettled(
    FEEDS.map(async ({ url, source }) => {
      const feed = await parser.parseURL(url);
      return (feed.items ?? []).map((item) => ({
        title: item.title?.trim() || 'Untitled',
        link: item.link ?? item.guid ?? '',
        pubDate: new Date(item.isoDate ?? item.pubDate ?? Date.now()),
        source,
      }));
    }),
  );

  const articles: RadarArticle[] = [];
  for (const result of settled) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    } else {
      console.error('[trendRadar] Feed fetch failed:', result.reason);
    }
  }

  return articles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export function filterArticlesWithinHours(
  articles: RadarArticle[],
  hours: number,
): RadarArticle[] {
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return articles.filter((a) => a.pubDate.getTime() >= cutoff);
}

/** Frequency analysis on titles from the last N hours (default 12). */
export function extractHotKeywords(
  articles: RadarArticle[],
  hours = 12,
  limit = 20,
): HotKeyword[] {
  const recent = filterArticlesWithinHours(articles, hours);
  const frequency = new Map<string, number>();

  for (const article of recent) {
    for (const word of tokenizeTitle(article.title)) {
      frequency.set(word, (frequency.get(word) ?? 0) + 1);
    }
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function formatRelativeTimeRo(date: Date): string {
  const diffMs = Math.max(0, Date.now() - date.getTime());
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'Acum';
  if (diffMin < 60) return `Acum ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? 'Acum 1 oră' : `Acum ${diffHours} ore`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ieri';
  return `Acum ${diffDays} zile`;
}
