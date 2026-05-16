'use client';

import dynamic from 'next/dynamic';

export const TickerTape = dynamic(() => import('@/components/TickerTape'), {
  ssr: false,
  loading: () => <div className="h-10 bg-white/5 rounded-xl animate-pulse" />,
});

export const NewsFeed = dynamic(() => import('@/components/NewsFeed'), {
  ssr: true,
  loading: () => (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-12 space-y-6">
      <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  ),
});
