import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductFrame({
  kicker,
  title,
  lede,
  fromRon,
  altcoinRon,
  priceConfirmed,
  deliveryLabel,
  children,
  aside,
  below,
}: {
  kicker: string;
  title: string;
  lede: string;
  fromRon: number;
  altcoinRon: number;
  priceConfirmed: boolean;
  deliveryLabel: string;
  children: ReactNode;
  aside: ReactNode;
  below?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{kicker}</p>
        <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="font-[var(--font-space)] text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">{lede}</p>
            <div className="mt-6 flex flex-wrap items-end gap-3">
              <p className="mb-1 text-sm font-semibold text-slate-400">de la</p>
              <p className="font-[var(--font-space)] text-4xl font-black tabular-nums">{fromRon}</p>
              <p className="mb-1 text-sm font-semibold text-slate-300">RON</p>
              {priceConfirmed ? null : (
                <p className="mb-1.5 rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Preț de confirmat
                </p>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400">
              Altcoin: {altcoinRon} RON. Ambele tarife includ cele șapte grafice și secțiunea Risc token. Fără livrare express.
            </p>
            <p className="mt-2 text-sm text-slate-500">Livrare orientativă: {deliveryLabel}.</p>
            {children}
          </div>
          <aside className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">{aside}</div>
          </aside>
        </div>
        {below}
      </main>
      <Footer />
    </div>
  );
}
