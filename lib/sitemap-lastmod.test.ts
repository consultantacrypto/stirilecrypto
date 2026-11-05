import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { articlePublicationIso } from './published-time';
import {
  OPERATOR_COPY_LASTMOD,
  SITEMAP_LASTMOD,
  contentLastModified,
  latestContentDate,
} from './sitemap-lastmod';

describe('article publication time', () => {
  it('uses published_at, then created_at, and never invents a clock time', () => {
    assert.equal(
      articlePublicationIso('2026-08-01T00:00:00.000Z', '2026-05-17T14:36:31.530Z'),
      '2026-08-01T00:00:00.000Z',
    );
    assert.equal(articlePublicationIso(null, '2026-05-17T14:36:31.530Z'), '2026-05-17T14:36:31.530Z');
    assert.equal(articlePublicationIso('  ', null), null);
  });
});

describe('sitemap lastmod', () => {
  it('keeps static dates as constants', () => {
    for (const iso of Object.values(SITEMAP_LASTMOD)) {
      assert.equal(Number.isNaN(new Date(iso).getTime()), false);
    }
    assert.equal(SITEMAP_LASTMOD.despre, OPERATOR_COPY_LASTMOD);
    assert.notEqual(SITEMAP_LASTMOD.home, new Date().toISOString());
  });

  it('picks a real content timestamp and drops a missing one', () => {
    const older = latestContentDate('2026-10-01T00:00:00.000Z', [
      '2026-05-17T14:36:31.530Z',
      null,
    ]);
    assert.equal(older.toISOString(), '2026-10-01T00:00:00.000Z');

    const newer = latestContentDate('2026-10-01T00:00:00.000Z', ['2026-11-02T10:00:00.000Z']);
    assert.equal(newer.toISOString(), '2026-11-02T10:00:00.000Z');
    assert.equal(contentLastModified(null), undefined);
    assert.equal(contentLastModified('not-a-date'), undefined);
  });
});
