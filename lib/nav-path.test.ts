import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isPathActive } from './nav-path';

describe('nav path active', () => {
  it('lights Piața azi only on /market and /market/*', () => {
    assert.equal(isPathActive('/market', '/market'), true);
    assert.equal(isPathActive('/market/peak-signals', '/market'), true);
    assert.equal(isPathActive('/lichidari', '/market'), false);
    assert.equal(isPathActive('/dashboard', '/market'), false);
    assert.equal(isPathActive('/market-pulse', '/market'), false);
    assert.equal(isPathActive('/market-pulse/btc', '/market'), false);
  });

  it('keeps Harta pieței and Știri on their own paths', () => {
    assert.equal(isPathActive('/lichidari', '/lichidari'), true);
    assert.equal(isPathActive('/market', '/lichidari'), false);
    assert.equal(isPathActive('/stiri', '/stiri'), true);
    assert.equal(isPathActive('/stiri/bitcoin', '/stiri'), true);
    assert.equal(isPathActive('/airdrop-alert', '/stiri'), false);
  });

  it('matches Airdrop Alert and strips query strings', () => {
    assert.equal(isPathActive('/airdrop-alert', '/airdrop-alert'), true);
    assert.equal(isPathActive('/verificare-portofel', '/verificare-portofel?src=nav'), true);
    assert.equal(isPathActive('/', '/stiri'), false);
  });
});
