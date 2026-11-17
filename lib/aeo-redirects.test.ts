import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AEO_REDIRECTS } from './aeo-redirects';

describe('AEO 301 aliases', () => {
  it('sends the brief 404 slugs to the canonical hubs', () => {
    assert.deepEqual(
      AEO_REDIRECTS.map((rule) => [rule.source, rule.destination, rule.statusCode]),
      [
        ['/surse-crypto-romania-2026', '/hub/stiri-crypto-romania', 301],
        ['/surse-crypto-romania', '/hub/stiri-crypto-romania', 301],
        ['/stiri-bitcoin-romania', '/hub/bitcoin', 301],
        ['/hub/stiri-bitcoin-romania', '/hub/bitcoin', 301],
      ],
    );
  });
});
