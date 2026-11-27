import type { ReactNode } from 'react';
import Link from 'next/link';
import HomeYoutube from '@/components/HomeYoutube';
import { loadHomeTerminal } from '@/lib/home-terminal-data';
import {
  quoteFor,
  rangePosition,
  type TerminalQuote,
  type TerminalRange,
} from '@/lib/home-terminal';
import { formatHeatmapChange, formatScreenerFetchedAt, formatScreenerPrice } from '@/lib/screener-data';

function ChangeText({ value }: { value: number }) {
  const up = value >= 0;
  return <span className={up ? 'text-emerald-400' : 'text-red-400'}>{formatHeatmapChange(value)}</span>;
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = 120;
  const height = 36;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const up = values[values.length - 1] >= values[0];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-9 w-28 shrink-0" aria-hidden>
      <polyline
        fill="none"
        stroke={up ? '#34d399' : '#f87171'}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

function Cell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Unavailable() {
  return <p className="text-sm text-slate-500">Indisponibil</p>;
}

function QuoteLine({ quote }: { quote: TerminalQuote }) {
  return (
    <span className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-[var(--font-space)] text-lg font-bold tabular-nums text-white">
        {formatScreenerPrice(quote.price)}
      </span>
      <ChangeText value={quote.change24h} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">24h</span>
    </span>
  );
}

function RangeCell({ range }: { range: TerminalRange | null }) {
  if (!range) return <Unavailable />;
  const position = rangePosition(range.last, range.low, range.high);
  return (
    <div>
      <p className="text-sm text-slate-300">
        Față de închiderea de ieri <ChangeText value={range.dayChange} />
      </p>
      <div className="relative mt-3 h-1.5 rounded-full bg-white/10" aria-hidden>
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-amber-300"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
      <dl className="mt-3 flex items-center justify-between gap-3 text-sm">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Minim</dt>
          <dd className="font-semibold tabular-nums text-white">{formatScreenerPrice(range.low)}</dd>
        </div>
        <div className="text-right">
          <dt className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Maxim</dt>
          <dd className="font-semibold tabular-nums text-white">{formatScreenerPrice(range.high)}</dd>
        </div>
      </dl>
    </div>
  );
}

export default async function HomeMarketTerminal() {
  const terminal = await loadHomeTerminal();
  const btc = quoteFor(terminal.quotes, 'BTC');
  const eth = quoteFor(terminal.quotes, 'ETH');
  const sol = quoteFor(terminal.quotes, 'SOL');
  const price = btc?.price ?? terminal.range?.last ?? null;
  const updated = formatScreenerFetchedAt(terminal.fetchedAt);
  const hasMarket = terminal.quotes.length > 0 || terminal.range !== null || terminal.fearGreed !== null;

  return (
    <>
      <section aria-label="Terminal de piață" className="mt-10 mb-2">
        <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-zinc-950 px-4 py-5 sm:px-8 sm:py-7">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/[0.05] via-transparent to-transparent"
          />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Terminal de piață
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date automate</span>
              {updated ? (
                <time dateTime={terminal.fetchedAt ?? undefined} className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80">
                  Actualizat {updated}
                </time>
              ) : null}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Bitcoin
                </h2>
                {price !== null ? (
                  <p className="mt-1 font-[var(--font-space)] text-3xl font-bold tabular-nums tracking-tight text-white sm:text-4xl">
                    {formatScreenerPrice(price)}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Prețul nu este disponibil acum.</p>
                )}
                {btc ? (
                  <p className="mt-1 text-sm text-slate-300">
                    <ChangeText value={btc.change24h} /> <span className="text-slate-500">în 24h, CoinGecko</span>
                  </p>
                ) : terminal.range ? (
                  <p className="mt-1 text-sm text-slate-300">
                    <ChangeText value={terminal.range.dayChange} />{' '}
                    <span className="text-slate-500">față de închiderea de ieri, Binance</span>
                  </p>
                ) : null}
              </div>
              {terminal.range ? <Sparkline values={terminal.range.spark} /> : null}
            </div>

            {!hasMarket ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                Sursele de date nu răspund acum. Poți deschide Piața azi sau arhiva Pulsul Bitcoin.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <Cell title="Frică și lăcomie">
                  {terminal.fearGreed ? (
                    <p className="font-[var(--font-space)] text-lg font-bold text-white">
                      {terminal.fearGreed.value}{' '}
                      <span className="text-base font-semibold text-slate-200">{terminal.fearGreed.label}</span>
                    </p>
                  ) : (
                    <Unavailable />
                  )}
                </Cell>
                <Cell title={terminal.range ? `Interval ${terminal.range.days} zile, Binance` : 'Interval zilnic, Binance'}>
                  <RangeCell range={terminal.range} />
                </Cell>
                <Cell title="Ethereum și Solana">
                  {eth || sol ? (
                    <div className="space-y-3">
                      {eth ? (
                        <div>
                          <p className="text-sm font-semibold text-white">ETH</p>
                          <QuoteLine quote={eth} />
                        </div>
                      ) : null}
                      {sol ? (
                        <div>
                          <p className="text-sm font-semibold text-white">SOL</p>
                          <QuoteLine quote={sol} />
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Unavailable />
                  )}
                </Cell>
              </div>
            )}

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Prețurile vin de la CoinGecko, lumânările zilnice Bitcoin de la Binance, iar sentimentul de la
              Alternative.me. Minimul și maximul sunt din acele lumânări, nu niveluri alese de redacție. Nu
              este Pulsul Bitcoin și nu este sfat de tranzacționare.
            </p>

            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/market"
                className="inline-flex min-h-11 items-center text-sm font-bold text-amber-400 hover:text-amber-300"
              >
                Deschide Piața azi
              </Link>
              <Link
                href="/market-pulse"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-400 hover:text-white"
              >
                Arhiva Pulsul Bitcoin
              </Link>
            </div>
          </div>
        </div>
      </section>
      <HomeYoutube />
    </>
  );
}
