import Link from 'next/link';
import { withSource } from '@/lib/products/placement';
import { ALTCOIN_PRICE_RON, MAJOR_PRICE_RON } from '@/lib/products/tiers';

export default function ArticleServiceCta({ asset }: { asset: string | null }) {
  const analysisHref = asset
    ? withSource(`/analiza-tehnica?asset=${encodeURIComponent(asset)}`, 'article')
    : withSource('/analiza-tehnica', 'article');

  return (
    <aside className="my-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-xl font-bold leading-snug text-white font-[var(--font-space)]">
        Vrei aceeași analiză pe tokenul tău?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Șapte grafice și secțiunea de risc. {MAJOR_PRICE_RON} lei pentru o monedă mare, {ALTCOIN_PRICE_RON} lei
        pentru un altcoin. Livrare în 24 de ore.
      </p>
      <Link
        href={analysisHref}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black hover:bg-slate-100"
      >
        {asset ? `Comandă analiza pentru ${asset}` : 'Comandă analiza'}
      </Link>
      <Link
        href={withSource('/verificare-portofel', 'article')}
        className="mt-4 block border-t border-white/10 pt-4 text-sm leading-relaxed text-slate-300 hover:text-white"
      >
        Ai de trimis sau ai primit crypto de la cineva? Verifică portofelul înainte.
      </Link>
    </aside>
  );
}
