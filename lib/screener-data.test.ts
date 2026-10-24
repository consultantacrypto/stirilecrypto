import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isNonCryptoMarketCoin } from './screener-data';

const tokenized = new Set([
  'figure-heloc',
  'hashnote-usyc',
  'tether-gold',
  'pax-gold',
  'blackrock-usd-institutional-digital-liquidity-fund',
]);

describe('market top list', () => {
  it('drops tokenized funds and FIGR_HELOC', () => {
    assert.equal(isNonCryptoMarketCoin({ id: 'figure-heloc', symbol: 'FIGR_HELOC', name: 'Figure Heloc' }, tokenized), true);
    assert.equal(
      isNonCryptoMarketCoin(
        { id: 'blackrock-usd-institutional-digital-liquidity-fund', symbol: 'BUIDL', name: 'BlackRock USD Institutional Digital Liquidity Fund' },
        tokenized,
      ),
      true,
    );
    assert.equal(isNonCryptoMarketCoin({ id: 'hashnote-usyc', symbol: 'USYC', name: 'Circle USYC' }, tokenized), true);
  });

  it('keeps coins and the gold tokens readers already know', () => {
    assert.equal(isNonCryptoMarketCoin({ id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' }, tokenized), false);
    assert.equal(isNonCryptoMarketCoin({ id: 'chainlink', symbol: 'LINK', name: 'Chainlink' }, tokenized), false);
    assert.equal(isNonCryptoMarketCoin({ id: 'tether-gold', symbol: 'XAUT', name: 'Tether Gold' }, tokenized), false);
    assert.equal(isNonCryptoMarketCoin({ id: 'pax-gold', symbol: 'PAXG', name: 'PAX Gold' }, tokenized), false);
  });

  it('still drops FIGR_HELOC when the category list is missing', () => {
    assert.equal(isNonCryptoMarketCoin({ id: 'figure-heloc', symbol: 'FIGR_HELOC', name: 'Figure Heloc' }), true);
  });
});
