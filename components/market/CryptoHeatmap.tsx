import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  fetchScreenerData,
  formatHeatmapChange,
  getHeatmapColor,
  type ScreenerCoin,
} from '@/lib/screener-data';
import { cn } from '@/lib/utils';

const HEATMAP_SIZE = 40;

/** Tile footprint scales with market-cap weight (treemap-inspired, pure CSS). */
function getTileLayout(index: number, marketCap: number, maxCap: number): string {
  const ratio = maxCap > 0 ? marketCap / maxCap : 0;

  if (index === 0 || ratio >= 0.35) {
    return 'min-h-[100px] sm:min-h-[128px] basis-full sm:basis-[calc(50%-4px)] lg:basis-[calc(33.333%-6px)] grow-[4]';
  }
  if (index < 3 || ratio >= 0.12) {
    return 'min-h-[88px] sm:min-h-[104px] basis-[calc(50%-4px)] sm:basis-[calc(33.333%-6px)] lg:basis-[calc(25%-6px)] grow-[3]';
  }
  if (index < 10 || ratio >= 0.03) {
    return 'min-h-[76px] sm:min-h-[88px] basis-[calc(33.333%-6px)] sm:basis-[calc(25%-6px)] grow-[2]';
  }
  return 'min-h-[64px] sm:min-h-[72px] basis-[calc(33.333%-6px)] sm:basis-[calc(20%-6px)] grow';
}

function HeatmapTile({ coin, index, maxCap }: { coin: ScreenerCoin; index: number; maxCap: number }) {
  const changeLabel = formatHeatmapChange(coin.change24h);

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-1 rounded-md p-2 text-center',
        'font-sans transition-all duration-200',
        'hover:z-10 hover:scale-[1.03] hover:ring-2 hover:ring-white/50',
        getHeatmapColor(coin.change24h),
        getTileLayout(index, coin.marketCap, maxCap),
      )}
      title={`${coin.name} · ${changeLabel}`}
    >
      <span className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-sm">
        {coin.symbol}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-white/95 tabular-nums">
        {changeLabel}
      </span>
    </div>
  );
}

const LEGEND = [
  { label: '> +5%', className: 'bg-emerald-500/80' },
  { label: '0% → +5%', className: 'bg-emerald-800/80' },
  { label: '0% → −5%', className: 'bg-red-800/80' },
  { label: '< −5%', className: 'bg-red-500/80' },
] as const;

export default async function CryptoHeatmap() {
  const { coins, source } = await fetchScreenerData(HEATMAP_SIZE);
  const maxCap = Math.max(...coins.map((c) => c.marketCap), 1);

  return (
    <Card className="overflow-hidden border-white/[0.06] bg-[#020617]/95">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="font-[var(--font-space)] text-xl md:text-2xl tracking-tight">
              Volatility Heatmap
            </CardTitle>
            <CardDescription className="mt-1">
              Top {coins.length} assets by market cap — 24h performance at a glance.
            </CardDescription>
          </div>
          <Badge variant={source === 'coingecko' ? 'positive' : 'outline'}>
            {source === 'coingecko' ? 'Live · CoinGecko' : 'Demo data'}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {LEGEND.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300"
            >
              <span className={cn('h-3 w-3 rounded-sm', item.className)} aria-hidden />
              {item.label}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-3">
        <div className="flex flex-wrap gap-2" role="list" aria-label="Crypto market heatmap">
          {coins.map((coin, index) => (
            <HeatmapTile key={coin.id} coin={coin} index={index} maxCap={maxCap} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
