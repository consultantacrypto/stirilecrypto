import { getAllPublishedArticles } from '@/lib/articles-db';
import { getPublishedInterviews } from '@/lib/interviews-db';
import type { InterviewCardItem } from '@/lib/interviews';
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

function toRssPubDateFromIso(iso: string | null | undefined): string {
  const date = iso ? new Date(iso) : new Date();
  return date.toUTCString();
}

function buildArticleRssItem(article: Stire): string {
  const link = `${BASE_URL}/stiri/${article.slug}`;
  const safeLink = escapeXml(link);
  const pubDate = toRssPubDateFromIso(article.published_at ?? article.created_at);

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
      <guid isPermaLink="true">${safeLink}</guid>
      <category><![CDATA[Știri]]></category>${enclosure}
    </item>`;
}

function buildInterviewRssItem(interview: InterviewCardItem): string {
  const link = `${BASE_URL}/interviuri/${interview.slug}`;
  const safeLink = escapeXml(link);
  const pubDate = toRssPubDateFromIso(interview.created_at);
  const description = `[Interviu] ${interview.excerpt}`;

  const enclosure =
    interview.cover_image && interview.cover_image.trim() !== ''
      ? `\n      <enclosure url="${escapeXml(interview.cover_image)}" length="0" type="image/jpeg"/>`
      : '';

  return `
    <item>
      <title><![CDATA[${interview.title}]]></title>
      <link>${safeLink}</link>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${safeLink}</guid>
      <category><![CDATA[Interviuri]]></category>${enclosure}
    </item>`;
}

type FeedEntry =
  | { kind: 'article'; pubDate: Date; xml: string }
  | { kind: 'interview'; pubDate: Date; xml: string };

export async function GET() {
  let published: Stire[] = [];
  let interviews: InterviewCardItem[] = [];

  try {
    published = await getAllPublishedArticles();
  } catch (err) {
    console.error('[feed.xml] Failed to fetch published articles:', err);
  }

  try {
    interviews = await getPublishedInterviews();
  } catch (err) {
    console.error('[feed.xml] Failed to fetch published interviews:', err);
  }

  const entries: FeedEntry[] = [
    ...published.map((article) => ({
      kind: 'article' as const,
      pubDate: new Date(article.published_at ?? article.created_at ?? Date.now()),
      xml: buildArticleRssItem(article),
    })),
    ...interviews.map((interview) => ({
      kind: 'interview' as const,
      pubDate: new Date(interview.created_at ?? Date.now()),
      xml: buildInterviewRssItem(interview),
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  const lastBuildDate = new Date().toUTCString();

  const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Știrile Crypto</title>
    <link>${BASE_URL}</link>
    <description>Știri crypto, analize on-chain, interviuri editoriale și context de piață de la Știrile Crypto.</description>
    <language>ro</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
`;

  const rssItems = entries.map((entry) => entry.xml).join('');

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
