'use client';

import dynamic from 'next/dynamic';

export const TickerTape = dynamic(() => import('@/components/TickerTape'), {
  ssr: false,
  loading: () => <div className="h-10 bg-white/5 rounded-xl animate-pulse" />,
});
