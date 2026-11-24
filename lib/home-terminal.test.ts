import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  assembleTerminal,
  formatSnapshotDay,
  latestFlowByAsset,
  parseBinanceKlines,
  parseCoinGeckoQuotes,
  rangeFromDailyCandles,
  rangePosition,
} from './home-terminal';

const candle = (time: number, high: number, low: number, close: number) => [
  time,
  '1',
  String(high),
  String(low),
  String(close),
  '10',
];

describe('home terminal parsers', () => {
  it('reads CoinGecko quotes and ignores a broken payload', () => {
    const quotes = parseCoinGeckoQuotes([
      { id: 'bitcoin', current_price: 100000, price_change_percentage_24h: 1.5 },
      { id: 'ethereum', current_price: 3000, price_change_percentage_24h: -2 },
      { id: 'solana', current_price: 0, price_change_percentage_24h: 4 },
    ]);
    assert.deepEqual(
      quotes.map((quote) => quote.symbol),
      ['BTC', 'ETH'],
    );
    assert.equal(parseCoinGeckoQuotes({ status: { error_code: 429 } }).length, 0);
  });

  it('builds a 14-day range from Binance klines and drops broken rows', () => {
    const candles = parseBinanceKlines([
      candle(1, 110, 90, 100),
      candle(2, 130, 95, 120),
      ['nope'],
      candle(3, 125, 80, 90),
    ]);
    const range = rangeFromDailyCandles(candles);
    assert.ok(range);
    assert.equal(range.days, 3);
    assert.equal(range.low, 80);
    assert.equal(range.high, 130);
    assert.equal(range.last, 90);
    assert.equal(range.dayChange, ((90 - 120) / 120) * 100);
    assert.equal(rangePosition(range.last, range.low, range.high), 20);
    assert.equal(rangeFromDailyCandles(candles.slice(0, 1)), null);
    assert.equal(parseBinanceKlines({}).length, 0);
  });

  it('keeps the latest ETF snapshot per asset and formats the calendar day', () => {
    const flows = latestFlowByAsset([
      { asset: 'BTC', snapshot_date: '2026-11-20', net_flow_usd: 10 },
      { asset: 'BTC', snapshot_date: '2026-11-22', net_flow_usd: -5 },
      { asset: 'ETH', snapshot_date: '2026-11-21', net_flow_usd: 2 },
      { asset: 'ETH', snapshot_date: 'not-a-date', net_flow_usd: 9 },
    ]);
    assert.deepEqual(flows, [
      { asset: 'BTC', date: '2026-11-22', netFlowUsd: -5 },
      { asset: 'ETH', date: '2026-11-21', netFlowUsd: 2 },
    ]);
    assert.equal(formatSnapshotDay('2026-11-22'), '22.11.2026');
  });

  it('assembles a snapshot with fallbacks and omits the clock when nothing arrived', () => {
    const empty = assembleTerminal({
      quotes: [],
      candles: [],
      fearGreed: null,
      etf: [],
      now: '2026-11-24T08:00:00.000Z',
    });
    assert.equal(empty.fetchedAt, null);
    assert.equal(empty.range, null);

    const partial = assembleTerminal({
      quotes: [],
      candles: [],
      fearGreed: { value: 24, label: 'Teamă extremă' },
      etf: [],
      now: '2026-11-24T08:00:00.000Z',
    });
    assert.equal(partial.fetchedAt, '2026-11-24T08:00:00.000Z');
    assert.equal(partial.fearGreed?.label, 'Teamă extremă');
    assert.equal(partial.quotes.length, 0);
  });
});
