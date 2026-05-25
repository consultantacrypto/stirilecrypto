import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const CONSULT_HREF = 'https://www.mihaidaniel.ro/';

export default function ConsultingCta() {
  return (
    <aside
      aria-label="Consultanță crypto 1-la-1"
      className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-[#1c1c1e] p-6 md:p-8 shadow-[0_0_40px_rgba(245,158,11,0.06)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/[0.07] via-transparent to-orange-600/[0.04]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200/90">
            <Sparkles size={12} className="text-amber-400" />
            Mentorat 1-la-1
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-[var(--font-space)] leading-snug">
            Datele brute sunt doar zgomot fără o strategie.
          </h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed font-[var(--font-inter)]">
            Află cum să interpretezi acest screener, să identifici intrările asimetrice și să îți
            construiești un portofoliu rezilient.
          </p>
        </div>

        <Link
          href={CONSULT_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-900/30 transition-all hover:from-amber-400 hover:to-orange-400 hover:shadow-amber-500/25 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 md:min-w-[260px]"
        >
          Programează o sesiune 1-la-1
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </aside>
  );
}
