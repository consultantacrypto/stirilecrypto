'use client';

import dynamic from 'next/dynamic';

function ChartInlineSkeleton() {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl bg-white/[0.03]">
      <div className="h-full w-full animate-pulse rounded-xl bg-white/5" />
    </div>
  );
}

export const EtfFlowsChart = dynamic(
  () => import('@/components/dashboard/etf/EtfFlowsChart'),
  {
    ssr: false,
    loading: () => <ChartInlineSkeleton />,
  },
);
