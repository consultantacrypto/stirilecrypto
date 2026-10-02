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
    <div
      className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-8"
      aria-hidden
    />
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
