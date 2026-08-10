interface EtfLoadingSkeletonProps {
  height?: number;
}

export function EtfLoadingSkeleton({ height = 180 }: EtfLoadingSkeletonProps) {
  return (
    <div
      className="glass-card animate-pulse rounded-xl border border-white/10 p-5"
      style={{ minHeight: height }}
      aria-hidden
    >
      <div className="mb-4 h-4 w-1/3 rounded bg-white/10" />
      <div className="mb-2 h-8 w-1/2 rounded bg-white/10" />
      <div className="mb-6 h-4 w-1/4 rounded bg-white/10" />
      <div className="h-16 rounded bg-white/5" />
    </div>
  );
}
