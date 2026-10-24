'use client';

import { useMemo, useState } from 'react';
import {
  CASS_BANDS,
  CASS_RATE,
  INCOME_TAX_RATE_2026,
  INCOME_TAX_RATE_THROUGH_2025,
  MIN_WAGE_LEI_1_JAN_2026,
  SMALL_GAIN_PER_TRADE_LEI,
  SMALL_GAINS_YEAR_CAP_LEI,
  estimateCryptoTax2026,
} from '@/lib/fiscal-2026';

function parseLei(value: string): number | null {
  const cleaned = value.trim().replace(/\s/g, '').replace(',', '.');
  if (!cleaned) return 0;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return amount;
}

function lei(amount: number): string {
  return `${amount.toLocaleString('ro-RO')} lei`;
}

export default function TaxCalculator() {
  const [gains, setGains] = useState('');
  const [other, setOther] = useState('');

  const result = useMemo(() => {
    const realizedGainsLei = parseLei(gains);
    const otherNonSalaryLei = parseLei(other);
    if (realizedGainsLei == null || otherNonSalaryLei == null) return { error: true as const };
    return { error: false as const, estimate: estimateCryptoTax2026({ realizedGainsLei, otherNonSalaryLei }) };
  }, [gains, other]);

  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Suma câștigurilor din crypto, în lei
          <span className="mt-1 block text-xs text-slate-500">
            Adună doar tranzacțiile pe plus. Pierderile nu se scad, cum scrie în ghid.
          </span>
          <input
            inputMode="decimal"
            value={gains}
            onChange={(event) => setGains(event.target.value)}
            placeholder="30000"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Alte venituri din afara salariului, în lei
          <span className="mt-1 block text-xs text-slate-500">
            Dividende, chirii, dobânzi. Intră doar la CASS, nu la impozitul pe crypto. Salariul nu se trece aici.
          </span>
          <input
            inputMode="decimal"
            value={other}
            onChange={(event) => setOther(event.target.value)}
            placeholder="0"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </label>
      </div>

      {result.error ? (
        <p role="alert" className="text-sm text-red-300">
          Scrie sume în lei, zero sau mai mari.
        </p>
      ) : result.estimate ? (
        <dl className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Impozit {INCOME_TAX_RATE_2026 * 100}%</dt>
            <dd className="mt-1 text-2xl font-bold text-white">{lei(result.estimate.incomeTaxLei)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">CASS</dt>
            <dd className="mt-1 text-2xl font-bold text-white">{lei(result.estimate.cassLei)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Total orientativ</dt>
            <dd className="mt-1 text-2xl font-bold text-white">{lei(result.estimate.totalLei)}</dd>
          </div>
        </dl>
      ) : null}

      <div className="space-y-2 text-sm leading-relaxed text-slate-400">
        <p>
          Impozitul din 2026 este {INCOME_TAX_RATE_2026 * 100}% pe suma câștigurilor. Până în 2025 cota a fost{' '}
          {INCOME_TAX_RATE_THROUGH_2025 * 100}%. CASS este {CASS_RATE * 100}% dintr-o treaptă fixă, nu din tot câștigul.
          Salariul minim folosit este {lei(MIN_WAGE_LEI_1_JAN_2026)}.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>sub {lei(CASS_BANDS[0].floorLei)}: CASS 0</li>
          <li>
            de la {lei(CASS_BANDS[0].floorLei)}: {lei(CASS_BANDS[0].dueLei)}
          </li>
          <li>
            de la {lei(CASS_BANDS[1].floorLei)}: {lei(CASS_BANDS[1].dueLei)}
          </li>
          <li>
            de la {lei(CASS_BANDS[2].floorLei)}: {lei(CASS_BANDS[2].dueLei)}
          </li>
        </ul>
        <p>
          Pragul de {SMALL_GAIN_PER_TRADE_LEI} / {SMALL_GAINS_YEAR_CAP_LEI} lei este pe fiecare tranzacție. Calculatorul
          nu îl aplică, pentru că aici ai o singură sumă.
        </p>
        <p className="font-semibold text-amber-200">Orientativ, verifică cu contabilul.</p>
      </div>
    </form>
  );
}
