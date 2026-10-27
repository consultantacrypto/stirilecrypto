import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { withAffiliateTags } from './affiliates';
import { isFreshEnough } from './data-freshness';
import { parseFearGreedPayload } from './fear-greed';
import { displayCoverUrl } from './image-url';
import { matchesStiriFilter } from './stiri-filters';

describe('fear and greed', () => {
  it('reads the string value alternative.me returns', () => {
    const reading = parseFearGreedPayload({
      data: [{ value: '23', value_classification: 'Extreme Fear' }],
    });
    assert.equal(reading?.value, 23);
    assert.equal(reading?.label, 'Teamă extremă');
  });

  it('hides a broken payload instead of inventing a score', () => {
    assert.equal(parseFearGreedPayload({ data: [] }), null);
    assert.equal(parseFearGreedPayload(null), null);
  });
});

describe('stiri filters', () => {
  it('puts regulation and leftover stories in a filter', () => {
    const regulation = { title: 'MiCA', summary: '', category: 'REGLEMENTARE & LEGISLAȚIE' };
    const leftover = { title: 'O știre fără temă', summary: 'nimic specific', category: 'ANALIZĂ DE PIAȚĂ' };
    assert.equal(matchesStiriFilter(regulation, 'reglementari'), true);
    assert.equal(matchesStiriFilter(regulation, 'generale'), false);
    assert.equal(matchesStiriFilter(leftover, 'generale'), true);
    assert.equal(matchesStiriFilter(leftover, 'btc'), false);
  });
});

describe('affiliate tags', () => {
  it('keeps the partner code and adds the placement', () => {
    const tagged = withAffiliateTags('https://partner.bybit.eu/b/STIRICRYPTO', 'cta-bybit');
    const url = new URL(tagged);
    assert.equal(url.pathname, '/b/STIRICRYPTO');
    assert.equal(url.searchParams.get('utm_source'), 'stirilecrypto');
    assert.equal(url.searchParams.get('utm_medium'), 'affiliate');
    assert.equal(url.searchParams.get('utm_campaign'), 'cta-bybit');
    assert.equal(url.searchParams.get('src'), 'cta-bybit');
  });
});

describe('cover images', () => {
  it('asks Supabase for a smaller cover', () => {
    const src =
      'https://ndnlhmzrflmtqchdrlbh.supabase.co/storage/v1/object/public/imagini-stiri/cover.webp';
    const next = new URL(displayCoverUrl(src, 800));
    assert.equal(next.pathname, '/storage/v1/render/image/public/imagini-stiri/cover.webp');
    assert.equal(next.searchParams.get('width'), '800');
    assert.equal(next.searchParams.get('quality'), '60');
    assert.equal(next.searchParams.get('resize'), 'contain');
  });
});

describe('stale dashboard data', () => {
  it('treats the July radar and the August ETF table as too old', () => {
    const now = new Date('2026-10-24T12:00:00Z');
    assert.equal(isFreshEnough('2026-07-02T13:36:41Z', 30, now), false);
    assert.equal(isFreshEnough('2026-08-15', 10, now), false);
    assert.equal(isFreshEnough('2026-10-23T12:00:00Z', 10, now), true);
  });
});
