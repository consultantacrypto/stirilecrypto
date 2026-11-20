import Link from 'next/link';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';

export default function HomeServiceStrip() {
  return (
    <section aria-label="Serviciile noastre" className="py-12">
      <h2 className="font-[var(--font-space)] text-xl font-semibold tracking-tight text-white md:text-2xl">
        Serviciile noastre
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--sand)]/35 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sand)]">La comandă</p>
          <h3 className="font-[var(--font-space)] text-2xl font-semibold tracking-tight text-white">
            Analiză tehnică pe tokenul tău
          </h3>
          <p className="text-sm leading-relaxed text-zinc-300">
            7 timeframe-uri + risc token, de la {MAJOR_PRICE_RON} lei, livrare în 24h.
          </p>
          <Link
            href="/analiza-tehnica?src=home"
            className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Comandă analiza
          </Link>
        </article>

        <article className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Înainte să trimiți</p>
          <h3 className="font-[var(--font-space)] text-2xl font-semibold tracking-tight text-white">
            Verificare portofel crypto
          </h3>
          <p className="text-sm leading-relaxed text-zinc-300">
            Află înainte să trimiți bani dacă o adresă e legată de țepe, hack-uri sau fonduri furate.
          </p>
          <Link
            href="/verificare-portofel?src=home"
            className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Verifică o adresă
          </Link>
        </article>
      </div>
    </section>
  );
}
