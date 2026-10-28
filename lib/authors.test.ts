import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  authorKeyForArticle,
  authorKeyFromName,
  personAuthorJsonLd,
  unsignedAuthorKey,
} from './authors';
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
  authorKey: 'cristian-vasile',
} satisfies ArticlePageData;

describe('author byline', () => {
  it('maps stored names to the three people, including Mihai Daniel', () => {
    assert.equal(authorKeyFromName('Daniel Mihai'), 'daniel-mihai');
    assert.equal(authorKeyFromName('Mihai Daniel'), 'daniel-mihai');
    assert.equal(authorKeyFromName('Cristian Vasile'), 'cristian-vasile');
    assert.equal(authorKeyFromName('Emilian Constantin'), 'emilian-constantin');
  });

  it('keeps an explicit non-person byline on the desk', () => {
    assert.equal(
      authorKeyForArticle({ authorName: 'Redacția Știrile Crypto', slug: 'orice-slug' }),
      'desk',
    );
  });

  it('rotates unsigned stories by slug and keeps the assignment stable', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 60; i += 1) {
      seen.add(unsignedAuthorKey(`stire-${i}`));
    }
    assert.deepEqual([...seen].sort(), ['cristian-vasile', 'daniel-mihai', 'emilian-constantin']);
    assert.equal(unsignedAuthorKey('stire-4'), unsignedAuthorKey('stire-4'));
    assert.equal(authorKeyForArticle({ authorName: null, slug: 'stire-4' }), unsignedAuthorKey('stire-4'));
    assert.equal(authorKeyForArticle({ authorName: '   ', slug: 'stire-4' }), unsignedAuthorKey('stire-4'));
    assert.equal(
      authorKeyForArticle({ authorName: 'Mihai Daniel', slug: 'stire-4' }),
      'daniel-mihai',
    );
  });
});

describe('news schema', () => {
  it('uses a Person author and a NewsMediaOrganization publisher', () => {
    const jsonLd = buildNewsArticleJsonLd(article, article.slug, {
      author: personAuthorJsonLd('cristian-vasile'),
    });
    const author = jsonLd.author as { '@type': string; name: string; url: string; image?: string; sameAs?: string[] };
    const publisher = jsonLd.publisher as { '@type': string; logo: { url: string; width: number } };

    assert.equal(author['@type'], 'Person');
    assert.equal(author.name, 'Cristian Vasile');
    assert.match(author.url, /\/autori\/cristian-vasile$/);
    assert.equal(author.image, undefined);
    assert.equal(author.sameAs, undefined);
    assert.equal(publisher['@type'], 'NewsMediaOrganization');
    assert.match(publisher.logo.url, /\/icon\.jpg$/);
    assert.ok(publisher.logo.width >= 112);
  });

  it('keeps Daniel Mihai photo and profiles on his Person node', () => {
    const author = personAuthorJsonLd('daniel-mihai');
    assert.equal(author.name, 'Daniel Mihai');
    assert.match(author.image ?? '', /mihai-daniel-consultanta\.jpg$/);
    assert.ok((author.sameAs ?? []).some((url) => url.includes('youtube.com')));
    assert.equal(personAuthorJsonLd('emilian-constantin').image, undefined);
  });

  it('types the homepage publisher as NewsMediaOrganization', () => {
    const organization = buildOrganizationJsonLd() as { '@type': string };
    assert.equal(organization['@type'], 'NewsMediaOrganization');
  });
});
