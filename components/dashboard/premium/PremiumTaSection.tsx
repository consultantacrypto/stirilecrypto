import { Crown, FileText, Sparkles, Zap } from 'lucide-react';
import { PremiumCheckoutForm } from '@/components/lazy/dashboard-widgets';

export default function PremiumTaSection() {
  return (
    <section
      id="premium-ta"
      aria-label="Analiză tehnică premium on-demand"
      className="glass-card relative mb-12 min-w-0 rounded-2xl p-6 md:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/[0.04] via-transparent to-violet-500/[0.03]"
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 max-w-xl space-y-5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200/90">
            <Sparkles size={12} className="text-amber-400" aria-hidden />
            Premium On-Demand
          </span>

          <div className="space-y-3">
            <h2 className="font-[var(--font-space)] text-2xl font-bold tracking-tight text-white md:text-3xl leading-snug">
              Analiză Tehnică{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Personalizată
              </span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-400 font-[var(--font-inter)] md:text-base">
              Analiză tehnică on-demand (100 RON) — comenzile noi sunt oprite până la activarea
              plăților și a livrării.
            </p>
          </div>

          <div className="flex items-end gap-2">
            <p className="font-[var(--font-space)] text-4xl font-black tabular-nums text-white md:text-5xl">
              100
            </p>
            <p className="mb-1.5 text-lg font-bold text-amber-400 font-[var(--font-space)]">RON</p>
          </div>

          <ul className="space-y-3 text-sm text-slate-300 font-[var(--font-inter)]">
            <li className="flex items-start gap-3">
              <Crown size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden />
              <span>Analiză dedicată activului tău (orice ticker major)</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden />
              <span>Livrarea pe email va fi disponibilă odată cu plățile</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText size={16} className="mt-0.5 shrink-0 text-amber-400" aria-hidden />
              <span>Suport / rezistență, trend și scenarii de acțiune</span>
            </li>
          </ul>
        </div>

        <div className="relative w-full shrink-0 lg:max-w-md">
          <div className="rounded-xl border border-white/10 bg-black/20 p-5 md:p-6 backdrop-blur-sm">
            <h3 className="mb-4 font-[var(--font-space)] text-lg font-bold text-white">
              Status comenzi
            </h3>
            <PremiumCheckoutForm />
          </div>
        </div>
      </div>
    </section>
  );
}
