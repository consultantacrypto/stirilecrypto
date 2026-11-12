import type { AcademyItem } from './dictionary';
import {
  AEO_DRAFT_DATE_MODIFIED,
  ORGANIZATION_ID,
  SITE_URL,
  WEBSITE_ID,
  buildBreadcrumbJsonLd,
  toAbsoluteUrl,
} from './json-ld';

export function academyPageTitle(term: Pick<AcademyItem, 'term' | 'seoTitle'> | undefined): string {
  return term ? (term.seoTitle ?? term.term) : 'Termen necunoscut';
}

/**
 * Article JSON-LD for an academy guide. Guides have no dedicated visible Q&A
 * block, so this does not emit FAQPage.
 */
export function buildAcademyArticleJsonLd(term: AcademyItem, slug: string) {
  const pageUrl = `${SITE_URL}/academie/${slug}`;
  const image = term.image ? toAbsoluteUrl(term.image) : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: term.term,
    description: term.definition,
    inLanguage: 'ro-RO',
    image: image ? [image] : undefined,
    author: { '@id': `${SITE_URL}/autori/daniel-mihai#person` },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: pageUrl,
    dateModified: term.updatedAt ?? AEO_DRAFT_DATE_MODIFIED,
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function buildAcademyBreadcrumbJsonLd(term: AcademyItem, slug: string) {
  return buildBreadcrumbJsonLd([
    { name: 'Acasă', path: '/' },
    { name: 'Academie', path: '/academie' },
    { name: term.term, path: `/academie/${slug}` },
  ]);
}
