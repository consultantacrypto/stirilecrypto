import Link from 'next/link';
import { withSource } from '@/lib/products/placement';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';

const pillClass =
  'inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function ArticleServiceCta({ asset }: { asset: string | null }) {
  const analysisHref = asset
    ? withSource(`/analiza-tehnica?asset=${encodeURIComponent(asset)}`, 'article')
    : withSource('/analiza-tehnica', 'article');
  return (
    <div className="my-10 flex flex-col gap-4">
      <aside className="rounded-2xl border border-[var(--sand)]/35 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sand)]">La comandă</p>
        <h2 className="mt-2 font-[var(--font-space)] text-xl font-semibold leading-snug tracking-tight text-white">
          Vrei aceeași analiză pe tokenul tău?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">
          Șapte grafice și secțiunea de risc. De la {MAJOR_PRICE_RON} lei. Livrare în 24 de ore.
        </p>
        <Link href={analysisHref} className={`mt-4 ${pillClass}`}>
          {asset ? `Comandă analiza pentru ${asset}` : 'Comandă analiza'}
        </Link>
      </aside>
    </div>
  );
}
