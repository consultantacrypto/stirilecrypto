export default function EtfFlowsSkeleton() {
  return (
    <section
      aria-label="Fluxuri ETF instituționale"
      aria-busy="true"
      className="mb-12 min-w-0"
    >
      <div className="mb-6 space-y-2">
        <div className="h-5 w-48 animate-pulse rounded-md bg-white/5" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-md bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="h-[320px] animate-pulse rounded-2xl border border-violet-500/10 bg-zinc-950/80" />
        <div className="h-[320px] animate-pulse rounded-2xl border border-violet-500/10 bg-zinc-950/80" />
      </div>
    </section>
  );
}
