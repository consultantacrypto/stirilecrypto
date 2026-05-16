'use client';

import dynamic from 'next/dynamic';

export const TickerTape = dynamic(() => import('@/components/TickerTape'), {
  ssr: false,
  loading: () => <div className="h-10 bg-white/5 rounded-xl animate-pulse" />,
});

export const InstitutionalTracker = dynamic(() => import('@/components/InstitutionalTracker'), {
  ssr: false,
  loading: () => <div className="h-96 bg-white/5 rounded-xl animate-pulse" />,
});

export const AltcoinSeasonWidget = dynamic(() => import('@/components/AltcoinSeasonWidget'), {
  ssr: false,
  loading: () => <div className="h-72 bg-white/5 rounded-2xl animate-pulse" />,
});

export const WhaleWallWidget = dynamic(() => import('@/components/WhaleWallWidget'), {
  ssr: false,
  loading: () => <div className="h-[350px] bg-white/5 rounded-2xl animate-pulse" />,
});
