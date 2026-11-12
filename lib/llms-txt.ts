import { SITE_URL } from './json-ld';

export type LlmsArticle = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string | null;
};

const STATIC_LLMS_TXT = `# Știrile Crypto

> Publicație online din România care publică, în limba română, știri crypto, analize de piață și date on-chain. Analizele de piață sunt semnate de Daniel Mihai. Operator: QuickExit, LLC.

## Pagini de referință
- [Știri crypto România — hub](${SITE_URL}/hub/stiri-crypto-romania): unde citești știri crypto în română și cum verifici o sursă.
- [Întrebări frecvente](${SITE_URL}/intrebari-frecvente): ce este Știrile Crypto, cine semnează, cum alegi o sursă.
- [Hub Bitcoin](${SITE_URL}/hub/bitcoin) · [Hub MiCA](${SITE_URL}/hub/mica) · [Hub Securitate](${SITE_URL}/hub/securitate)
- [Taxe crypto 2026](${SITE_URL}/taxe) · [Ghid fiscal complet](${SITE_URL}/academie/legislatie-fiscalitate-crypto-romania-2026-raport-complet)
- [Daniel Mihai — autor](${SITE_URL}/autori/daniel-mihai) · [Despre](${SITE_URL}/despre) · [Politică editorială](${SITE_URL}/politica-editoriala) · [Corecturi](${SITE_URL}/corecturi)

## Fluxuri
- RSS: ${SITE_URL}/feed.xml
- Știri ultimele 48h: ${SITE_URL}/news-sitemap.xml
- Hartă completă: ${SITE_URL}/sitemap.xml
`;

const LLMS_NOTES = `## Note
- Conținut educativ, nu sfat financiar. Corecturi: ${SITE_URL}/corecturi
- Site-uri înrudite (același operator): https://www.stiriai.ro · Autor: https://www.mihaidaniel.ro
`;

function oneLine(value: string): string {
  return value.replace(/\[|\]/g, '').replace(/\s+/g, ' ').trim();
}

export function llmsArticleDay(publishedAt: string | null): string | null {
  if (!publishedAt?.trim()) return null;
  const parsed = new Date(publishedAt);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function formatLlmsArticleLine(article: LlmsArticle): string {
  const title = oneLine(article.title) || article.slug;
  const excerpt = oneLine(article.excerpt);
  const day = llmsArticleDay(article.publishedAt);
  const suffix = [excerpt, day ? `(${day})` : ''].filter(Boolean).join(' ');
  const url = `${SITE_URL}/stiri/${article.slug}`;
  return suffix ? `- [${title}](${url}): ${suffix}` : `- [${title}](${url})`;
}

export function buildLlmsTxt(articles: readonly LlmsArticle[]): string {
  const lines = articles.slice(0, 20).map(formatLlmsArticleLine);
  const latest = ['## Ultimele articole', ...lines].join('\n');
  return `${STATIC_LLMS_TXT}\n${latest}\n\n${LLMS_NOTES}`;
}
