import { LayoutDashboard } from 'lucide-react';

export default function DashboardPageHeader() {
  return (
    <header className="mb-10 md:mb-12 text-center md:text-left">
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-300">
        <LayoutDashboard size={14} />
        Command Center
      </span>
      <h1 className="mb-3 text-3xl font-black tracking-tight md:text-5xl font-[var(--font-space)]">
        Dashboard <span className="text-amber-400">Instituțional</span>
      </h1>
      <p className="max-w-2xl text-sm text-slate-400 md:text-base font-[var(--font-inter)] mx-auto md:mx-0">
        Market Pulse Terminal și MiCA Safety Radar — semnal tehnic și conformitate, într-un singur
        ecran premium.
      </p>
    </header>
  );
}
