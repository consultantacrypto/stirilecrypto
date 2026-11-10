import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SITE_URL } from './json-ld';
import { isIndexableSitemapUrl, withoutNoindexSitemapUrls } from './sitemap-indexable';

describe('sitemap indexable URLs', () => {
  it('drops /cauta and any query variant, and keeps every other route', () => {
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/cauta`), false);
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/cauta/`), false);
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/cauta?q=bitcoin`), false);
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/cauta?query=ethereum&page=2`), false);
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/cauta?`), false);

    assert.equal(isIndexableSitemapUrl(SITE_URL), true);
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/stiri`), true);
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/stiri/cum-sa-cauti-un-schimb`), true);
    assert.equal(isIndexableSitemapUrl(`${SITE_URL}/academie`), true);
    assert.equal(isIndexableSitemapUrl('not a url'), true);
  });

  it('filters entries without changing the ones that stay', () => {
    const kept = {
      url: `${SITE_URL}/stiri`,
      lastModified: new Date('2026-11-01T12:33:43+02:00'),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    };
    const search = {
      url: `${SITE_URL}/cauta?q=mica`,
      lastModified: new Date('2026-10-24T19:23:34+03:00'),
      changeFrequency: 'weekly' as const,
      priority: 0.4,
    };

    const result = withoutNoindexSitemapUrls([kept, search]);
    assert.deepEqual(result, [kept]);
  });
});
