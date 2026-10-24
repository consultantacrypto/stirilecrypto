import Link from 'next/link';
import { MAJOR_PRICE_RON } from '@/lib/products/tiers';

export default function HomeServiceStrip() {
  return (
    <aside className="mt-10 border border-white/[0.08] bg-white/[0.02] px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9eb4f0]">Servicii</p>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm leading-relaxed text-slate-300">
          <span className="font-medium text-white">
            Analiză tehnică pe 7 timeframe-uri + risc token, de la {MAJOR_PRICE_RON} lei.
          </span>{' '}
          Livrare în 24h.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/analiza-tehnica?src=home" className="btn-primary">
            Comandă analiza
          </Link>
          <Link href="/verificare-portofel?src=home" className="btn-secondary">
            Verificare portofel crypto
          </Link>
        </div>
      </div>
    </aside>
  );
}
