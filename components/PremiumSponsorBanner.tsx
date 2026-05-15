import { ArrowUpRight } from 'lucide-react';

export default function PremiumSponsorBanner() {
  return (
    <section aria-label="Partener editorial premium" className="bg-black py-12 lg:py-16">      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-[#1c1c1e]/80 backdrop-blur-xl p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1 max-w-2xl space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Editorial &amp; analiză susținută de
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Mihai Daniel
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Treci la nivelul următor în Web3. Descoperă strategii instituționale, alpha exclusiv și consultanță premium 1-la-1.
            </p>
          </div>

          <a
            href="https://mihaidaniel.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-colors duration-300 shrink-0"
          >
            Aplică pentru Mentorat
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
