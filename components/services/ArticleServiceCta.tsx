import Link from 'next/link';
import { withSource } from '@/lib/products/placement';
import { ALTCOIN_PRICE_RON, MAJOR_PRICE_RON } from '@/lib/products/tiers';

const pillClass =
  'inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100';

export default function ArticleServiceCta({ asset }: { asset: string | null }) {
  const analysisHref = asset
    ? withSource(`/analiza-tehnica?asset=${encodeURIComponent(asset)}`, 'article')
    : withSource('/analiza-tehnica', 'article');
  return (
    <div className="my-10 flex flex-col gap-4">
      <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <h2 className="text-xl font-bold leading-snug text-white font-[var(--font-space)]">
          Vrei aceeași analiză pe tokenul tău?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Șapte grafice și secțiunea de risc. {MAJOR_PRICE_RON} lei pentru o monedă mare, {ALTCOIN_PRICE_RON} lei
          pentru un altcoin. Livrare în 24 de ore.
        </p>
        <Link href={analysisHref} className={`mt-4 ${pillClass}`}>
          {asset ? `Comandă analiza pentru ${asset}` : 'Comandă analiza'}
        </Link>
      </aside>

      <aside className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[#1c1c1e] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold leading-relaxed text-white">
          Ai de trimis sau ai primit crypto de la cineva? Verifică portofelul înainte.
        </p>
        <Link href="/verificare-portofel?src=articol" className={pillClass}>
          Verifică o adresă
        </Link>
      </aside>
    </div>
  );
}
