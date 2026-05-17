import { getAllPublishedArticles } from '@/lib/articles-db';
import type { Stire } from '@/lib/types/stiri';

const BASE_URL = 'https://www.stirilecrypto.ro';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

function toRssPubDate(article: Stire): string {
  const iso = article.published_at ?? article.created_at;
  const date = iso ? new Date(iso) : new Date();
  return date.toUTCString();
}

function buildRssItem(article: Stire): string {
  const link = `${BASE_URL}/stiri/${article.slug}`;
  const safeLink = escapeXml(link);
  const pubDate = toRssPubDate(article);

  const enclosure =
    article.image_url && article.image_url.trim() !== ''
      ? `\n      <enclosure url="${escapeXml(article.image_url)}" length="0" type="image/jpeg"/>`
      : '';

  return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${safeLink}</link>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${safeLink}</guid>${enclosure}
    </item>`;
}

export async function GET() {
  let published: Stire[] = [];

  try {
    published = await getAllPublishedArticles();
  } catch (err) {
    console.error('[feed.xml] Failed to fetch published articles:', err);
  }

  const lastBuildDate = new Date().toUTCString();

  const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Știrile Crypto</title>
    <link>${BASE_URL}</link>
    <description>Știri crypto, analize on-chain și context de piață de la Știrile Crypto.</description>
    <language>ro</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
`;

  const rssItems = published.map(buildRssItem).join('');

  const rssFooter = `
  </channel>
</rss>`;

  const xml = rssHeader + rssItems + rssFooter;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
