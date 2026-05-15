import { ArrowUpRight } from 'lucide-react';

export default function PremiumSponsorBanner() {
  return (
    <section
      aria-label="Partener editorial premium"
      className="bg-[#020617] py-10 lg:py-12"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-blue-900/30 bg-gradient-to-br from-[#0a0f1e] via-[#020617] to-slate-950 shadow-[0_0_40px_rgba(30,58,138,0.12)]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 p-6 sm:p-8 lg:p-10 lg:flex-row lg:items-center lg:justify-between backdrop-blur-sm bg-white/[0.02]">
            <div className="flex-1 max-w-2xl">
              <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                Editorial &amp; analiză susținută de
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-[var(--font-space)] tracking-tight mb-4">
                Mihai Daniel
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Treci la nivelul următor în Web3. Descoperă strategii instituționale, alpha exclusiv și consultanță premium 1-la-1.
              </p>
            </div>

            <div className="shrink-0 flex justify-start lg:justify-end">
              <a
                href="https://mihaidaniel.ro"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/30 shadow-[0_0_28px_rgba(59,130,246,0.35)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 hover:-translate-y-0.5"
              >
                Aplică pentru Mentorat
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
