"use client";

import dynamic from 'next/dynamic';
import { MetricPoint } from '@/lib/metrics-api';

const TwoYearMAChart = dynamic(() => import('@/components/TwoYearMAChart'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-[#0b1221] rounded-2xl flex items-center justify-center border border-white/10">
        <p className="text-gray-500 animate-pulse">Se încarcă graficul...</p>
    </div>
  )
});

export default function TwoYearMAChartWrapper({ data }: { data: MetricPoint[] }) {
  return <TwoYearMAChart data={data} />;
}