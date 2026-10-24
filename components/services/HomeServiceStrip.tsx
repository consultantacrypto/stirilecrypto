import Link from 'next/link';

export default function HomeServiceStrip() {
  return (
    <aside className="border-y border-white/10 bg-white/[0.03]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-white">
            Analiză tehnică pe 7 timeframe-uri + risc token, 49 lei.
          </span>{' '}
          Livrare în 24h.
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/analiza-tehnica?src=home"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-4 text-sm font-bold text-black hover:bg-slate-100"
          >
            Comandă analiza
          </Link>
          <Link href="/verificare-portofel?src=home" className="text-sm font-medium text-slate-300 underline underline-offset-4 hover:text-white">
            Anti-țeapă
          </Link>
        </div>
      </div>
    </aside>
  );
}
