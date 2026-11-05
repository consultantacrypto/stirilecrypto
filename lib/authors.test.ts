import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  articleAuthorMeta,
  authorKeyForArticle,
  authorKeyFromName,
  personAuthorJsonLd,
  unsignedAuthorKey,
} from './authors';
import { SITE_OPERATOR } from './operator';
import { buildNewsArticleJsonLd, buildOrganizationJsonLd, buildWebSiteJsonLd } from './json-ld';
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
  it('maps stored names to the newsroom, including Mihai Daniel and Eduard Mihai', () => {
    assert.equal(authorKeyFromName('Daniel Mihai'), 'daniel-mihai');
    assert.equal(authorKeyFromName('Mihai Daniel'), 'daniel-mihai');
    assert.equal(authorKeyFromName('Cristian Vasile'), 'cristian-vasile');
    assert.equal(authorKeyFromName('Emilian Constantin'), 'emilian-constantin');
    assert.equal(authorKeyFromName('Eduard Mihai'), 'eduard-mihai');
    assert.equal(authorKeyFromName('Eduard'), 'eduard-mihai');
    assert.equal(authorKeyForArticle({ authorName: 'Eduard Mihai', slug: 'hack-test' }), 'eduard-mihai');
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

describe('article author meta', () => {
  it('returns one signed person, not the whole desk', () => {
    assert.deepEqual(articleAuthorMeta('cristian-vasile'), {
      name: 'Cristian Vasile',
      url: 'https://www.stirilecrypto.ro/autori/cristian-vasile',
    });
    assert.equal(articleAuthorMeta('desk').name, 'Redacția Știrile Crypto');
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
    assert.equal((publisher as { '@id'?: string })['@id'], 'https://www.stirilecrypto.ro/#organization');
    assert.match(publisher.logo.url, /\/icon\.jpg$/);
    assert.ok(publisher.logo.width >= 112);
  });

  it('keeps Daniel Mihai photo and profiles on his Person node', () => {
    const author = personAuthorJsonLd('daniel-mihai');
    assert.equal(author.name, 'Daniel Mihai');
    assert.equal(author.jobTitle, 'Redactor și analist');
    assert.deepEqual(author.alternateName, ['Mihai Daniel', 'Mihai Daniel Marius']);
    assert.deepEqual(author.worksFor, { '@id': 'https://www.stirilecrypto.ro/#organization' });
    assert.match(author.image ?? '', /mihai-daniel-consultanta\.jpg$/);
    assert.ok((author.sameAs ?? []).some((url) => url.includes('youtube.com')));
    assert.ok((author.sameAs ?? []).includes('https://www.mihaidaniel.ro/'));
    assert.equal(personAuthorJsonLd('emilian-constantin').image, undefined);
    const eduard = personAuthorJsonLd('eduard-mihai');
    assert.equal(eduard.name, 'Eduard Mihai');
    assert.equal(eduard.jobTitle, 'Hack-uri');
    assert.equal(eduard['@id'], 'https://www.stirilecrypto.ro/autori/eduard-mihai#person');
  });

  it('types the homepage publisher as NewsMediaOrganization with stable ids', () => {
    const organization = buildOrganizationJsonLd() as {
      '@type': string;
      '@id': string;
      sameAs: string[];
      founder?: unknown;
      legalName?: unknown;
      taxID?: unknown;
      employee: { '@id': string }[];
    };
    const website = buildWebSiteJsonLd() as {
      '@id': string;
      publisher: { '@id': string };
    };
    assert.equal(organization['@type'], 'NewsMediaOrganization');
    assert.equal(organization['@id'], 'https://www.stirilecrypto.ro/#organization');
    assert.equal(website['@id'], 'https://www.stirilecrypto.ro/#website');
    assert.deepEqual(website.publisher, { '@id': 'https://www.stirilecrypto.ro/#organization' });
    assert.deepEqual(organization.sameAs, ['https://x.com/StirilecryptoRo']);
    assert.equal(organization.founder, undefined);
    assert.equal(organization.legalName, 'QuickExit, LLC');
    assert.equal(organization.taxID, undefined);
    assert.equal(SITE_OPERATOR.taxId, '—');
    assert.equal(SITE_OPERATOR.name, 'QuickExit, LLC (Delaware)');
    assert.deepEqual(organization.employee, [
      { '@id': 'https://www.stirilecrypto.ro/autori/daniel-mihai#person' },
    ]);
  });
});
