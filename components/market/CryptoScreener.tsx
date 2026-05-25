import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatScreenerCompactUsd,
  formatScreenerPrice,
  fetchScreenerData,
} from '@/lib/screener-data';
import { cn } from '@/lib/utils';

function ChangeCell({ change }: { change: number }) {
  const isPositive = change >= 0;
  const formatted = `${isPositive ? '+' : ''}${change.toFixed(2)}%`;

  return (
    <span
      className={cn(
        'text-sm font-semibold tabular-nums',
        isPositive ? 'text-emerald-400' : 'text-red-400',
      )}
    >
      {formatted}
    </span>
  );
}

export default async function CryptoScreener() {
  const { coins, source } = await fetchScreenerData(50);

  return (
    <Card className="mb-8 overflow-hidden border-white/[0.06] bg-[#020617]/95 backdrop-blur-sm">
      <CardHeader className="border-b border-white/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-[var(--font-space)] text-xl tracking-tight">
              Crypto Screener
            </CardTitle>
            <CardDescription>
              Top {coins.length} assets by market cap — refreshed every minute.
            </CardDescription>
          </div>
          <Badge variant={source === 'coingecko' ? 'positive' : 'outline'}>
            {source === 'coingecko' ? 'Live · CoinGecko' : 'Demo data'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="sticky top-0 z-10 bg-[#0f172a] pl-6">Asset</TableHead>
              <TableHead className="sticky top-0 z-10 bg-[#0f172a] text-right">
                Price
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-[#0f172a] text-right">
                24h Change
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-[#0f172a] text-right hidden md:table-cell">
                24h Volume
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-[#0f172a] text-right pr-6 hidden md:table-cell">
                Market Cap
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins.map((coin, index) => (
              <TableRow key={coin.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-xs font-mono text-slate-600 tabular-nums shrink-0">
                      {index + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coin.image}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-full bg-white/5"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{coin.symbol}</p>
                      <p className="text-xs text-slate-500 truncate">{coin.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-white tabular-nums">
                  {formatScreenerPrice(coin.price)}
                </TableCell>
                <TableCell className="text-right">
                  <ChangeCell change={coin.change24h} />
                </TableCell>
                <TableCell className="text-right text-slate-300 tabular-nums hidden md:table-cell">
                  {formatScreenerCompactUsd(coin.volume24h)}
                </TableCell>
                <TableCell className="text-right text-slate-300 tabular-nums pr-6 hidden md:table-cell">
                  {formatScreenerCompactUsd(coin.marketCap)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
