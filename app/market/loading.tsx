export default function MarketLoading() {
  return (
    <div className="min-h-screen bg-[#07080b] text-white">
      <div className="h-16 border-b border-white/[0.08] bg-[#07080b]" />
      <div className="h-9 border-b border-white/[0.08]" />
      <main className="site-wrap py-8">
        <div className="mb-6 h-3 w-24 animate-pulse bg-white/[0.06]" />
        <div className="mb-3 h-8 w-64 animate-pulse bg-white/[0.06]" />
        <div className="mb-8 h-4 w-full max-w-xl animate-pulse bg-white/[0.04]" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse border border-white/[0.08] bg-white/[0.03]" />
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="h-80 animate-pulse border border-white/[0.08] bg-white/[0.03] lg:col-span-2" />
          <div className="h-80 animate-pulse border border-white/[0.08] bg-white/[0.03]" />
        </div>
      </main>
    </div>
  );
}
