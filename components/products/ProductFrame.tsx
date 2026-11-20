import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileOrderBar from '@/components/products/MobileOrderBar';

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
    <div className="min-h-screen bg-[var(--background)] pb-24 text-white lg:pb-0">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-white/[0.08]">
          <div className="mesh-hero pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">{kicker}</p>
            <div className="mt-5 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <h1 className="max-w-4xl font-[var(--font-space)] text-[2.55rem] font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.15rem]">
                  {title}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">{lede}</p>

                <div className="mt-8 flex flex-wrap items-end gap-x-3 gap-y-2">
                  <p className="mb-1 text-sm font-medium text-zinc-400">de la</p>
                  <p className="font-[var(--font-space)] text-5xl font-semibold tabular-nums tracking-tight text-white">
                    {fromRon}
                  </p>
                  <p className="mb-1 text-sm font-semibold text-zinc-200">RON</p>
                  {priceConfirmed ? null : (
                    <p className="mb-1.5 rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
                      Preț de confirmat
                    </p>
                  )}
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <article className="rounded-2xl border border-[var(--sand)]/35 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sand)]">Top 30</p>
                    <p className="mt-3 font-[var(--font-space)] text-4xl font-semibold tabular-nums tracking-tight text-white">
                      {fromRon}
                      <span className="ml-1.5 text-base font-medium text-zinc-400">RON</span>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      Monedă mare. Șapte grafice și secțiunea Risc token.
                    </p>
                  </article>
                  <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Altcoin</p>
                    <p className="mt-3 font-[var(--font-space)] text-4xl font-semibold tabular-nums tracking-tight text-white">
                      {altcoinRon}
                      <span className="ml-1.5 text-base font-medium text-zinc-400">RON</span>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      Activ în afara top 30. Aceleași șapte grafice și secțiunea Risc token.
                    </p>
                  </article>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  Altcoin: {altcoinRon} RON. Ambele tarife includ cele șapte grafice și secțiunea Risc token. Fără livrare express.
                </p>
                <p className="mt-2 text-sm text-zinc-400">Livrare orientativă: {deliveryLabel}.</p>

                <ul className="mt-6 flex flex-col gap-2 text-sm text-zinc-300 sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--sand)]" aria-hidden="true" />
                    Daniel Mihai îl revizuiește
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" aria-hidden="true" />
                    Pleacă pe email
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70" aria-hidden="true" />
                    Fără apeluri de cumpărare sau de vânzare
                  </li>
                </ul>
              </div>

              <aside
                id="comanda"
                className="scroll-mt-24 lg:col-span-5 lg:row-span-2 lg:sticky lg:top-24 lg:self-start"
              >
                <div className="rounded-3xl border border-white/10 bg-[#12141a]/92 p-5 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-6">
                  {aside}
                </div>
              </aside>

              <div className="lg:col-span-7">{children}</div>
            </div>
          </div>
        </section>

        {below ? <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">{below}</div> : null}
      </main>
      <Footer />
      <MobileOrderBar label={`Comandă analiza · de la ${fromRon} RON`} />
    </div>
  );
}
