import { ArrowRight, TrendingUp } from 'lucide-react';

const BYBIT_AFFILIATE_URL = 'https://partner.bybit.eu/b/STIRICRYPTO';
const BINANCE_AFFILIATE_URL = 'https://www.binance.com/join?ref=35329648';

export default function AffiliateCta() {
  return (
    <aside
      aria-label="Tranzacționare pe platforme partenere"
      className="relative overflow-hidden rounded-2xl"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/35 via-white/[0.04] to-red-500/35 motion-safe:animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl bg-[conic-gradient(from_0deg,transparent,rgba(16,185,129,0.25),transparent,rgba(239,68,68,0.25),transparent)] motion-safe:animate-[spin_14s_linear_infinite] opacity-60"
      />

      <div className="relative m-px rounded-2xl border border-white/[0.06] bg-[#1c1c1e] p-6 shadow-[0_12px_48px_rgba(0,0,0,0.45)] md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-red-500/[0.05]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-red-500/10 blur-3xl"
        />

        <div className="relative z-10 flex flex-col gap-6 md:gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <TrendingUp size={12} className="text-emerald-400" aria-hidden />
              Execuție live
            </span>
            <h2 className="max-w-3xl text-xl font-bold leading-snug tracking-tight text-white md:text-2xl font-[var(--font-space)]">
              Volatilitatea înseamnă oportunitate. Protejează-te și execută.
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base font-[var(--font-inter)]">
              Tranzacționează lichidările în timp real pe platforme de top, cu comisioane
              optimizate la maximum și securitate garantată pentru capitalul tău.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a
              href={BYBIT_AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#f7a600]/30 bg-[#f7a600]/10 px-5 py-3.5 text-sm font-bold text-white transition-all hover:border-[#f7a600]/60 hover:bg-[#f7a600]/20 hover:shadow-[0_0_24px_rgba(247,166,0,0.25)] hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7a600]/50"
            >
              Tranzacționează pe Bybit
              <ArrowRight
                size={16}
                className="text-[#f7a600] transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <a
              href={BINANCE_AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#FCD535]/25 bg-[#FCD535]/[0.08] px-5 py-3.5 text-sm font-bold text-white transition-all hover:border-[#FCD535]/50 hover:bg-[#FCD535]/15 hover:shadow-[0_0_24px_rgba(252,213,53,0.2)] hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FCD535]/40"
            >
              Tranzacționează pe Binance
              <ArrowRight
                size={16}
                className="text-[#FCD535] transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>

          <p className="text-[10px] leading-relaxed text-slate-600">
            Link de afiliere — fără costuri suplimentare pentru tine. Ne susține redacția.
          </p>
        </div>
      </div>
    </aside>
  );
}
