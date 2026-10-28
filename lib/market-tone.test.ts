import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  btcChangeFromScreener,
  MARKET_TONE_DISCLAIMER,
  marketToneFromChange,
  marketToneLabel,
  NAV_ACCENT,
} from './market-tone';

describe('BTC day tone for Piața azi', () => {
  it('paints a non-negative day as creștere', () => {
    assert.equal(marketToneFromChange(0), 'bullish');
    assert.equal(marketToneFromChange(3.4), 'bullish');
    assert.equal(marketToneLabel('bullish'), 'creștere');
  });

  it('paints a negative day as scădere', () => {
    assert.equal(marketToneFromChange(-0.01), 'bearish');
    assert.equal(marketToneLabel('bearish'), 'scădere');
  });

  it('reads BTC only from a live or last-good screener', () => {
    const coins = [{ id: 'bitcoin', symbol: 'btc', change24h: -1.5, name: 'Bitcoin', image: '', price: 1, volume24h: 1, marketCap: 1 }];
    assert.equal(btcChangeFromScreener({ source: 'coingecko', coins }), -1.5);
    assert.equal(btcChangeFromScreener({ source: 'stale', coins }), -1.5);
    assert.equal(btcChangeFromScreener({ source: 'unavailable', coins }), null);
    assert.equal(btcChangeFromScreener({ source: 'coingecko', coins: [] }), null);
  });

  it('keeps the specified fills and dark text that passes on them', () => {
    assert.equal(NAV_ACCENT.wallet.background, '#0D9488');
    assert.equal(NAV_ACCENT.pulse.background, '#F7931A');
    assert.equal(NAV_ACCENT.bullish.background, '#22C55E');
    assert.equal(NAV_ACCENT.bearish.background, '#EF4444');
    for (const accent of Object.values(NAV_ACCENT)) {
      assert.equal(accent.foreground, '#020617');
    }
    assert.match(MARKET_TONE_DISCLAIMER, /Nu este sfat de tranzacționare/);
  });
});
