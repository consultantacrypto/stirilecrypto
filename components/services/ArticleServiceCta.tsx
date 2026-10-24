import Link from 'next/link';
import { withSource } from '@/lib/products/placement';

export default function ArticleServiceCta({ asset }: { asset: string | null }) {
  const analysisHref = asset
    ? withSource(`/analiza-tehnica?asset=${encodeURIComponent(asset)}`, 'article')
    : withSource('/analiza-tehnica', 'article');

  return (
    <aside className="my-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">La comandă</p>
      <p className="mt-2 text-base font-semibold leading-relaxed text-white">
        Analiză tehnică pe 7 timeframe-uri + risc token, de la 79 lei. Livrare în 24h.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {asset
          ? `Pentru ${asset}, pe 1h, 4h, 12h, 1D, 3D, 1W și 1M, plus secțiunea de risc.`
          : 'Un activ, șapte grafice și secțiunea de risc. Material educațional, fără apel de tranzacționare.'}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={analysisHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black hover:bg-slate-100"
        >
          {asset ? `Comandă analiza pentru ${asset}` : 'Comandă analiza'}
        </Link>
        <Link
          href={withSource('/verificare-portofel', 'article')}
          className="text-sm text-slate-300 underline underline-offset-4 hover:text-white"
        >
          Verifică portofelul înainte să trimiți bani
        </Link>
      </div>
    </aside>
  );
}
