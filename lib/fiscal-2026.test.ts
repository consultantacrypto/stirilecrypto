import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { cassDueLei, estimateCryptoTax2026 } from './fiscal-2026';

describe('2026 crypto tax from the fiscal guide', () => {
  it('matches the 30,000 lei example: 4,800 tax and 2,430 CASS', () => {
    const result = estimateCryptoTax2026({ realizedGainsLei: 30000, otherNonSalaryLei: 0 });
    assert.ok(result);
    assert.equal(result.incomeTaxLei, 4800);
    assert.equal(result.cassLei, 2430);
    assert.equal(result.totalLei, 7230);
  });

  it('matches the 100,000 lei example: 16,000 tax and 9,720 CASS', () => {
    const result = estimateCryptoTax2026({ realizedGainsLei: 100000, otherNonSalaryLei: 0 });
    assert.ok(result);
    assert.equal(result.incomeTaxLei, 16000);
    assert.equal(result.cassLei, 9720);
    assert.equal(result.totalLei, 25720);
  });

  it('uses the documented CASS floors', () => {
    assert.equal(cassDueLei(24299), 0);
    assert.equal(cassDueLei(24300), 2430);
    assert.equal(cassDueLei(48599), 2430);
    assert.equal(cassDueLei(48600), 4860);
    assert.equal(cassDueLei(97200), 9720);
  });

  it('adds other non-salary income only into the CASS base', () => {
    const result = estimateCryptoTax2026({ realizedGainsLei: 10000, otherNonSalaryLei: 20000 });
    assert.ok(result);
    assert.equal(result.incomeTaxLei, 1600);
    assert.equal(result.cassBaseLei, 30000);
    assert.equal(result.cassLei, 2430);
  });
});
