import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { flowsFromDbRow } from './format';

describe('etf snapshot columns', () => {
  it('reads inflow, outflow and aum from the live table', () => {
    const flows = flowsFromDbRow({
      inflow: 4_200_000,
      outflow: 142_100_000,
      aum: null,
    });
    assert.equal(flows.inflow_usd, 4_200_000);
    assert.equal(flows.outflow_usd, 142_100_000);
    assert.equal(flows.aum_usd, null);
  });

  it('still accepts the older usd-suffixed names', () => {
    const flows = flowsFromDbRow({
      inflow_usd: 10,
      outflow_usd: 4,
      aum_usd: 1_000_000_000,
    });
    assert.equal(flows.inflow_usd, 10);
    assert.equal(flows.outflow_usd, 4);
    assert.equal(flows.aum_usd, 1_000_000_000);
  });
});
