import Link from 'next/link';
import { productCatalog } from '@/lib/products/config';

export default function PremiumTaSection() {
  const catalog = productCatalog();

  return (
    <section id="premium-ta" aria-label="Analiză la comandă" className="mb-12">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-[var(--font-space)] text-xl font-bold text-white">La comandă</h2>
        {catalog.paymentsEnabled ? null : (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Disponibil în curând
          </p>
        )}
      </div>
      <Link
        href="/analiza-tehnica"
        className="glass-card block rounded-2xl border border-white/10 p-5 transition-colors hover:border-white/20"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {catalog.ta.priceRon} RON
        </p>
        <h3 className="mt-2 font-[var(--font-space)] text-lg font-bold text-white">{catalog.ta.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Un activ, șapte grafice (1h, 4h, 12h, 1D, 3D, 1W, 1M) și secțiunea Risc token. Material
          educațional, fără apel de tranzacționare.
        </p>
      </Link>
    </section>
  );
}
