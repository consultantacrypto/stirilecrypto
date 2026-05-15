import { articles } from '@/lib/articles';

// Forțăm randarea dinamică pentru a avea mereu date proaspete
export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = 'https://mihaidaniel.ro';
  
  // Funcție pentru a "traduce" caracterele interzise în XML
  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  // 1. Header-ul RSS
  const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mihai Daniel - Stiri Crypto &amp; Analize</title>
    <link>${baseUrl}</link>
    <description>Cele mai importante stiri crypto, analize on-chain si educatie financiara explicate de Mihai Daniel.</description>
    <language>ro</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
  `;

  // 2. Generăm articolele (AICI ERA PROBLEMA - am aplicat escapeXml pe link-uri)
  const rssItems = articles.map((article) => {
    const safeImage = escapeXml(article.image); // Curățăm link-ul imaginii (& -> &amp;)
    const safeLink = escapeXml(`${baseUrl}/stiri/${article.slug}`);

    return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${safeLink}</link>
      <guid isPermaLink="true">${safeLink}</guid>
      <description><![CDATA[${article.summary}]]></description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <enclosure url="${safeImage}" length="0" type="image/jpeg"/>
    </item>`;
  }).join('');

  const rssFooter = `
  </channel>
</rss>`;

  // 3. Asamblăm
  const xml = rssHeader + rssItems + rssFooter;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}