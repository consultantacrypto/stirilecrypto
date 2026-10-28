import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { authorKeyForArticle, authorKeyFromName, danielAuthorJsonLd } from './authors';
import { buildNewsArticleJsonLd, buildOrganizationJsonLd } from './json-ld';
import type { ArticlePageData } from './articles-db';

const article = {
  id: '1',
  slug: 'bitcoin-test',
  title: 'Bitcoin trece de 70.000',
  excerpt: 'Rezumat de test pentru schema.',
  content: '<p>Text</p>',
  category: 'ȘTIRI GENERALE',
  image_url: '/icon.jpg',
  dateLabel: '28 oct. 2026',
  published_at: '2026-10-28T08:00:00.000Z',
  updated_at: '2026-10-28T08:00:00.000Z',
  readTime: '4 min',
  mihaiTake: null,
  impact: 'neutral',
  views: 0,
  meta_title: null,
  meta_description: null,
  authorKey: 'daniel-mihai',
} satisfies ArticlePageData;

describe('author byline', () => {
  it('maps both name orders to Daniel Mihai', () => {
    assert.equal(authorKeyFromName('Daniel Mihai'), 'daniel-mihai');
    assert.equal(authorKeyFromName('Mihai Daniel'), 'daniel-mihai');
  });

  it('signs unsigned news as Daniel Mihai, not the newsroom', () => {
    assert.equal(authorKeyForArticle({ authorName: null }), 'daniel-mihai');
    assert.equal(authorKeyForArticle({ authorName: '   ' }), 'daniel-mihai');
  });

  it('keeps an explicit non-Daniel byline on the desk', () => {
    assert.equal(authorKeyForArticle({ authorName: 'Redacția Știrile Crypto' }), 'desk');
  });
});

describe('news schema', () => {
  it('uses a Person author and a NewsMediaOrganization publisher', () => {
    const jsonLd = buildNewsArticleJsonLd(article, article.slug, {
      author: danielAuthorJsonLd(),
    });
    const author = jsonLd.author as { '@type': string; name: string; url: string };
    const publisher = jsonLd.publisher as {
      '@type': string;
      logo: { url: string; width: number; height: number };
      publishingPrinciples: string;
      correctionsPolicy: string;
      ethicsPolicy: string;
      ownershipFundingInfo: string[];
    };

    assert.equal(author['@type'], 'Person');
    assert.equal(author.name, 'Daniel Mihai');
    assert.match(author.url, /\/autori\/daniel-mihai$/);
    assert.equal(publisher['@type'], 'NewsMediaOrganization');
    assert.match(publisher.logo.url, /\/icon\.jpg$/);
    assert.ok(publisher.logo.width >= 112);
    assert.ok(publisher.logo.height >= 112);
    assert.match(publisher.publishingPrinciples, /\/politica-editoriala$/);
    assert.match(publisher.correctionsPolicy, /\/corecturi$/);
    assert.match(publisher.ethicsPolicy, /\/politica-editoriala$/);
    assert.ok(publisher.ownershipFundingInfo.some((url) => url.endsWith('/despre')));
    assert.ok(publisher.ownershipFundingInfo.some((url) => url.endsWith('/publicitate')));
  });

  it('types the homepage publisher as NewsMediaOrganization', () => {
    const organization = buildOrganizationJsonLd() as { '@type': string; logo: { url: string } };
    assert.equal(organization['@type'], 'NewsMediaOrganization');
    assert.match(organization.logo.url, /\/icon\.jpg$/);
  });
});
