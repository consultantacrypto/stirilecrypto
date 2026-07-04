'use client';

import dynamic from 'next/dynamic';

function ChartInlineSkeleton() {
  return (
    <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl bg-white/[0.03]">
      <div className="h-full w-full animate-pulse rounded-xl bg-white/5" />
    </div>
  );
}

function PremiumFormSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-12 animate-pulse rounded-xl bg-white/5" />
      <div className="h-12 animate-pulse rounded-xl bg-white/5" />
      <div className="h-12 animate-pulse rounded-xl bg-white/5" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-12 flex-1 animate-pulse rounded-xl bg-white/5" />
        <div className="h-12 flex-1 animate-pulse rounded-xl bg-white/5" />
      </div>
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

export const PremiumCheckoutForm = dynamic(
  () => import('@/components/dashboard/premium/PremiumCheckoutForm'),
  {
    ssr: false,
    loading: () => <PremiumFormSkeleton />,
  },
);
