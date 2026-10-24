/**
 * Figures copied from the Academie fiscal guide in lib/dictionary.ts
 * (slug legislatie-fiscalitate-crypto-romania-2026-raport-complet, section 4).
 * Do not change a number here unless the same sentence in that guide changes.
 *
 * 2026 income tax on crypto gains: 16% (10% applied through 2025).
 * CASS: 10% of a fixed band, not of the whole gain.
 * Minimum wage used for 2026 contributions: 4,050 lei (1 January), not the July rise to 4,325.
 */

export const INCOME_TAX_RATE_2026 = 0.16;
export const INCOME_TAX_RATE_THROUGH_2025 = 0.1;
export const CASS_RATE = 0.1;
export const MIN_WAGE_LEI_1_JAN_2026 = 4050;
export const SMALL_GAIN_PER_TRADE_LEI = 200;
export const SMALL_GAINS_YEAR_CAP_LEI = 600;

export const CASS_BANDS = [
  { salaries: 6, floorLei: 6 * MIN_WAGE_LEI_1_JAN_2026, dueLei: Math.round(6 * MIN_WAGE_LEI_1_JAN_2026 * CASS_RATE) },
  { salaries: 12, floorLei: 12 * MIN_WAGE_LEI_1_JAN_2026, dueLei: Math.round(12 * MIN_WAGE_LEI_1_JAN_2026 * CASS_RATE) },
  { salaries: 24, floorLei: 24 * MIN_WAGE_LEI_1_JAN_2026, dueLei: Math.round(24 * MIN_WAGE_LEI_1_JAN_2026 * CASS_RATE) },
] as const;

export const FISCAL_GUIDE_PATH =
  '/academie/legislatie-fiscalitate-crypto-romania-2026-raport-complet';
export const FISCAL_GUIDE_D212_HREF = `${FISCAL_GUIDE_PATH}#d212`;

export type TaxEstimate = {
  incomeTaxLei: number;
  cassLei: number;
  totalLei: number;
  cassBaseLei: number;
};

export function estimateCryptoTax2026(input: {
  realizedGainsLei: number;
  otherNonSalaryLei: number;
}): TaxEstimate | null {
  const gains = input.realizedGainsLei;
  const other = input.otherNonSalaryLei;
  if (!Number.isFinite(gains) || !Number.isFinite(other) || gains < 0 || other < 0) return null;

  const incomeTaxLei = Math.round(gains * INCOME_TAX_RATE_2026);
  const cassBaseLei = gains + other;
  const cassLei = cassDueLei(cassBaseLei);
  return {
    incomeTaxLei,
    cassLei,
    totalLei: incomeTaxLei + cassLei,
    cassBaseLei,
  };
}

export function cassDueLei(baseLei: number): number {
  if (baseLei < CASS_BANDS[0].floorLei) return 0;
  if (baseLei < CASS_BANDS[1].floorLei) return CASS_BANDS[0].dueLei;
  if (baseLei < CASS_BANDS[2].floorLei) return CASS_BANDS[1].dueLei;
  return CASS_BANDS[2].dueLei;
}
