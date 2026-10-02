import Link from 'next/link';
import { Activity, ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PulseTerminalSnapshot, PulseTrend } from '@/lib/types/dashboard';
import {
  formatPulseTimestamp,
  getPulseFreshnessStatus,
  type PulseFreshnessStatus,
} from '@/lib/market-pulse-freshness';
import { cn } from '@/lib/utils';

const TREND_CONFIG: Record<
  PulseTrend,
  { label: string; icon: typeof TrendingUp; className: string }
> = {
  bullish: { label: 'Bullish', icon: TrendingUp, className: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  bearish: { label: 'Bearish', icon: TrendingDown, className: 'text-red-400 border-red-500/30 bg-red-500/10' },
  neutral: { label: 'Neutral', icon: Minus, className: 'text-slate-300 border-white/10 bg-white/5' },
  range: { label: 'Range', icon: Activity, className: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
};

function formatPrice(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function LevelList({
  title,
  levels,
  tone,
}: {
  title: string;
  levels: { price: number; label?: string }[];
  tone: 'support' | 'resistance';
}) {
  const toneClass =
    tone === 'support'
      ? 'border-emerald-500/20 bg-emerald-500/5'
      : 'border-red-500/20 bg-red-500/5';

  return (
    <div className={cn('rounded-xl border p-4', toneClass)}>
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-[var(--font-space)]">
        {title}
      </h3>
      {levels.length === 0 ? (
        <p className="text-sm text-slate-500">—</p>
      ) : (
        <ul className="space-y-2">
          {levels.map((level, index) => (
            <li
              key={`${level.label ?? title}-${level.price}-${index}`}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-slate-400 font-medium">{level.label ?? `${title} ${index + 1}`}</span>
              <span className="font-bold tabular-nums text-white">${formatPrice(level.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SnapshotStatusBadge({ status }: { status: PulseFreshnessStatus }) {
  if (status === 'fresh') {
    return (
      <Badge variant="outline" className="text-amber-200/80 border-amber-500/20">
        Snapshot
      </Badge>
    );
  }
  if (status === 'archived') {
    return (
      <Badge variant="outline" className="text-slate-300 border-white/15">
        Analiză arhivată
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-slate-400 border-white/10">
      Actualitate necunoscută
    </Badge>
  );
}

export default function MarketPulseTerminal({
  snapshot,
  linkedArticlePublishedAt = null,
}: {
  snapshot: PulseTerminalSnapshot | null;
  linkedArticlePublishedAt?: string | null;
}) {
  if (!snapshot) {
    return (
      <Card className="border-amber-500/20 bg-zinc-950/80">
        <CardHeader>
          <CardTitle className="font-[var(--font-space)]">Market Pulse Terminal</CardTitle>
          <CardDescription>
            Niciun snapshot publicat încă. Publică un terminal BTC din admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Link
            href="/market-pulse"
            className="text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            Arhivă analize →
          </Link>
        </CardContent>
      </Card>
    );
  }

  const freshness = getPulseFreshnessStatus(snapshot.published_at);
  const isCurrentSignal = freshness === 'fresh';
  const snapshotTime = formatPulseTimestamp(snapshot.published_at);
  const articleTime = formatPulseTimestamp(linkedArticlePublishedAt);
  const trend = TREND_CONFIG[snapshot.trend];
  const TrendIcon = trend.icon;

  return (
    <section aria-label="Market Pulse Terminal" className="mb-12">
      <Card className="relative overflow-hidden border-amber-500/25 bg-zinc-950/90 shadow-[0_0_40px_rgba(245,158,11,0.06)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] via-transparent to-transparent"
        />
        <CardHeader className="relative border-b border-white/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                  Market Pulse Terminal
                </span>
                <Badge variant="outline" className="text-amber-200/80 border-amber-500/20">
                  {snapshot.asset_symbol}
                </Badge>
                <SnapshotStatusBadge status={freshness} />
              </div>
              <CardTitle className="text-2xl md:text-3xl font-[var(--font-space)]">
                {snapshot.asset_label}
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-sm leading-relaxed">
                {isCurrentSignal
                  ? snapshot.summary ?? 'Niveluri de suport și rezistență din snapshot-ul publicat.'
                  : 'Acest snapshot nu este prezentat ca semnal actual. Articolul editorial și nivelurile din terminal sunt surse separate.'}
              </CardDescription>
              <dl className="mt-4 space-y-1 text-xs text-slate-500 font-[var(--font-inter)]">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold text-slate-400">Data snapshot:</dt>
                  <dd>
                    {snapshotTime.dateTime ? (
                      <time dateTime={snapshotTime.dateTime}>{snapshotTime.display}</time>
                    ) : (
                      snapshotTime.display
                    )}
                  </dd>
                </div>
                {snapshot.linked_article_slug ? (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-slate-400">Data articol editorial:</dt>
                    <dd>
                      {articleTime.dateTime ? (
                        <time dateTime={articleTime.dateTime}>{articleTime.display}</time>
                      ) : (
                        articleTime.display
                      )}
                    </dd>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-slate-400">Articol editorial:</dt>
                    <dd>neconectat de acest snapshot</dd>
                  </div>
                )}
              </dl>
            </div>
            {isCurrentSignal ? (
              <Badge className={cn('self-start gap-1.5 px-3 py-1.5', trend.className)}>
                <TrendIcon size={14} aria-hidden />
                {trend.label}
              </Badge>
            ) : (
              <Badge className="self-start gap-1.5 px-3 py-1.5 text-slate-300 border-white/10 bg-white/5">
                {freshness === 'archived' ? 'Arhivă' : 'Necunoscut'}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative grid gap-4 p-6 md:grid-cols-2">
          <LevelList title="Support" levels={snapshot.support_levels} tone="support" />
          <LevelList title="Resistance" levels={snapshot.resistance_levels} tone="resistance" />
        </CardContent>

        <div className="relative flex flex-col gap-4 border-t border-white/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {snapshot.linked_article_slug ? (
              <Link
                href={`/market-pulse/${snapshot.linked_article_slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Editorial Market Pulse
                <ArrowRight size={14} />
              </Link>
            ) : null}
            <Link
              href="/market-pulse"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Arhivă analize
              <ArrowRight size={14} />
            </Link>
          </div>
          {isCurrentSignal ? (
            <a
              href={snapshot.affiliate_url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f7a600]/30 bg-[#f7a600]/10 px-5 py-3 text-sm font-bold text-white transition-all hover:border-[#f7a600]/50 hover:bg-[#f7a600]/20 hover:shadow-[0_0_24px_rgba(247,166,0,0.2)]"
            >
              Execută pe {snapshot.affiliate_partner === 'binance' ? 'Binance' : 'Bybit'}
              <ArrowRight size={16} className="text-[#f7a600]" />
            </a>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
