import { getPublishedNewsForSitemap } from '@/lib/articles-db';
import { SITE_NAME, SITE_URL, toIsoDateTime } from '@/lib/json-ld';
import { stripBrandSuffix } from '@/lib/seo-title';
import { escapeXml } from '@/lib/xml';

export const dynamic = 'force-dynamic';

function toNewsPublicationDate(iso: string | null | undefined): string | null {
  return toIsoDateTime(iso) ?? null;
}

export async function GET() {
  let articles;

  try {
    articles = await getPublishedNewsForSitemap();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'News sitemap unavailable.';
    console.error('[news-sitemap]', message);
    return new Response('News sitemap unavailable.', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  const items = articles
    .filter((article) => article.slug && article.title && article.published_at)
    .slice(0, 1000)
    .map((article) => {
      const loc = `${SITE_URL}/stiri/${article.slug}`;
      const publicationDate = toNewsPublicationDate(article.published_at);
      if (!publicationDate) return '';
      const title = stripBrandSuffix(article.title);
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>ro</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(publicationDate)}</news:publication_date>
      <news:title>${escapeXml(title)}</news:title>
    </news:news>
  </url>`;
    })
    .filter(Boolean)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
