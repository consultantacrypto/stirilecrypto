import Link from 'next/link';
import { productCatalog } from '@/lib/products/config';

export default function PremiumTaSection() {
  const catalog = productCatalog();

  return (
    <section id="premium-ta" aria-label="Analiză la comandă" className="mb-12">
      <h2 className="mb-4 font-[var(--font-space)] text-xl font-bold text-white">La comandă</h2>
      <article className="rounded-3xl border border-white/5 bg-[#1c1c1e] p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          de la {catalog.ta.majorPriceRon} lei
        </p>
        <h3 className="mt-2 font-[var(--font-space)] text-lg font-bold text-white">{catalog.ta.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Un activ, șapte grafice (1h, 4h, 12h, 1D, 3D, 1W, 1M) și secțiunea Risc token. {catalog.ta.majorPriceRon}{' '}
          lei pentru o monedă mare, {catalog.ta.altcoinPriceRon} lei pentru un altcoin. Material educațional, fără
          apel de tranzacționare.
        </p>
        <Link
          href="/analiza-tehnica?src=dashboard"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100"
        >
          Comandă analiza
        </Link>
      </article>
    </section>
  );
}
