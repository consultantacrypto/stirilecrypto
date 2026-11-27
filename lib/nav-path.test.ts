import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bitcoinNavLabel, HEADER_LINKS, isPathActive, MORE_NAV_LINKS, pathOf } from './nav-path';

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

  it('uses the briefed Bitcoin hub anchor in the menu', () => {
    assert.equal(bitcoinNavLabel('/'), 'Știri Bitcoin');
    assert.equal(bitcoinNavLabel('/market'), 'Știri Bitcoin');
    assert.equal(bitcoinNavLabel('/stiri'), 'Știri Bitcoin azi');
    assert.equal(bitcoinNavLabel('/stiri/un-articol'), 'Știri Bitcoin');
    assert.equal(bitcoinNavLabel('/hub/bitcoin'), 'Știri Bitcoin');
  });

  it('matches Airdrop Alert and strips query strings', () => {
    assert.equal(isPathActive('/airdrop-alert', '/airdrop-alert'), true);
    assert.equal(isPathActive('/verificare-portofel', '/verificare-portofel?src=nav'), true);
    assert.equal(isPathActive('/', '/stiri'), false);
  });

  it('puts Portofele crypto in the header and Airdrop Alert in Mai mult', () => {
    assert.deepEqual(
      HEADER_LINKS.map((item) => item.label),
      ['Portofele crypto', 'Piața azi', 'Pulsul Bitcoin', 'Taxe crypto 2026'],
    );
    assert.equal(HEADER_LINKS[0].href, '/portofele');
    assert.equal(
      MORE_NAV_LINKS.some((item) => item.href === '/airdrop-alert' && item.label === 'Airdrop Alert'),
      true,
    );
    assert.equal(
      MORE_NAV_LINKS.some((item) => item.href === '/verificare-portofel?src=nav'),
      true,
    );
    const headerPaths = HEADER_LINKS.map((item) => pathOf(item.href));
    const morePaths = MORE_NAV_LINKS.map((item) => pathOf(item.href));
    assert.equal(headerPaths.includes('/airdrop-alert'), false);
    assert.equal(headerPaths.includes('/verificare-portofel'), false);
    assert.equal(morePaths.includes('/portofele'), false);
    assert.equal(new Set([...headerPaths, ...morePaths]).size, headerPaths.length + morePaths.length);
  });
});
