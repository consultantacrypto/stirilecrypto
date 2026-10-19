import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ARTICLE_CATEGORIES } from '../stiri-categories';
import { isProvenanceColumn, isUniqueSlugViolation, missingStiriColumn } from './db-error';
import { bearerTokensMatch, readBearerToken } from './token';
import {
  countWords,
  deriveExcerpt,
  isValidSlug,
  parseEditorListQuery,
  slugFromTitle,
  validateCreateBody,
  validatePatchBody,
  withSlugSuffix,
} from './validate';

const body = [
  'Bitcoin a urcat peste 70.000 de dolari după ce fondurile ETF au înregistrat intrări nete.',
  'Mișcarea vine la câteva ore după publicarea datelor de inflație din SUA.',
  'Volumele de pe bursele spot au crescut, iar lichidările de poziții short s-au accelerat.',
].join(' ');

describe('bearer token', () => {
  it('reads only a bearer credential', () => {
    assert.equal(readBearerToken('Bearer secret-token'), 'secret-token');
    assert.equal(readBearerToken('Basic secret-token'), null);
    assert.equal(readBearerToken(null), null);
  });

  it('matches equal tokens and rejects different lengths', () => {
    assert.equal(bearerTokensMatch('editor-token', 'editor-token'), true);
    assert.equal(bearerTokensMatch('editor-token', 'editor-token-2'), false);
    assert.equal(bearerTokensMatch('short', 'editor-token'), false);
    assert.equal(bearerTokensMatch('', 'editor-token'), false);
  });
});

describe('article validation', () => {
  it('accepts a news payload and derives an excerpt', () => {
    const result = validateCreateBody({
      title: 'Bitcoin trece de 70.000 de dolari',
      body,
      category: 'ȘTIRI GENERALE',
      status: 'published',
      tags: ['Bitcoin', 'bitcoin', 'ETF'],
      source_urls: ['https://www.example.com/etf'],
      cover_image_url: 'https://images.unsplash.com/photo-1',
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.value.category, 'ȘTIRI GENERALE');
    assert.equal(result.value.tags.length, 2);
    assert.equal(result.value.imageUrl, 'https://images.unsplash.com/photo-1');
    assert.ok(result.value.excerpt.length > 20);
    assert.equal(result.value.slug, null);
  });

  it('rejects unknown categories and unsafe markup', () => {
    const category = validateCreateBody({
      title: 'Știre de test suficient de lungă',
      content: body,
      category: 'Bitcoin',
      status: 'draft',
    });
    assert.equal(category.ok, false);
    if (!category.ok) {
      assert.ok(category.error.includes('ȘTIRI GENERALE'));
    }

    const unsafe = validateCreateBody({
      title: 'Știre de test suficient de lungă',
      content: `<p>Text</p><script>alert(1)</script>${body}`,
      category: ARTICLE_CATEGORIES[0],
      status: 'draft',
    });
    assert.equal(unsafe.ok, false);
  });

  it('requires at least one field on update', () => {
    const empty = validatePatchBody({});
    assert.equal(empty.ok, false);

    const status = validatePatchBody({ status: 'published' });
    assert.equal(status.ok, true);
    if (status.ok) assert.equal(status.value.status, 'published');
  });

  it('parses list queries', () => {
    const parsed = parseEditorListQuery(new URLSearchParams('limit=10&status=draft&source=editor_api'));
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.deepEqual(parsed.value, { limit: 10, status: 'draft', source: 'editor_api' });

    const bad = parseEditorListQuery(new URLSearchParams('limit=99'));
    assert.equal(bad.ok, false);
  });
});

describe('slugs', () => {
  it('follows the admin slugify rules and appends a numeric suffix', () => {
    assert.equal(slugFromTitle('Știre: Bitcoin & ETF!'), 'stire-bitcoin-etf');
    assert.equal(isValidSlug('stire-bitcoin-etf'), true);
    assert.equal(isValidSlug('Stire Bitcoin'), false);
    assert.equal(withSlugSuffix('stire-bitcoin-etf', 2), 'stire-bitcoin-etf-2');
    const long = 'a'.repeat(120);
    assert.equal(withSlugSuffix(long, 12).length <= 120, true);
    assert.equal(isValidSlug(withSlugSuffix(long, 12)), true);
  });
});

describe('prose helpers', () => {
  it('counts words and shortens the excerpt', () => {
    assert.equal(countWords('Unu doi trei.'), 3);
    const excerpt = deriveExcerpt(`${body} ${body} ${body}`, 80);
    assert.ok(excerpt.length <= 81);
    assert.ok(excerpt.endsWith('…'));
  });
});

describe('database errors', () => {
  it('detects missing provenance columns and slug conflicts', () => {
    assert.equal(
      missingStiriColumn({ message: "Could not find the 'source' column of 'stiri' in the schema cache" }),
      'source',
    );
    assert.equal(isProvenanceColumn('tags'), true);
    assert.equal(isProvenanceColumn('title'), false);
    assert.equal(isUniqueSlugViolation({ code: '23505', message: 'duplicate key value violates unique constraint "stiri_slug_key"' }), true);
    assert.equal(isUniqueSlugViolation({ code: '42501', message: 'permission denied' }), false);
  });
});
