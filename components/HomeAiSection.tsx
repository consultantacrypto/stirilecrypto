'use client';

import dynamic from 'next/dynamic';

const AiTerminal = dynamic(() => import('@/components/AiTerminal'), {
  ssr: false,
  loading: () => <div className="min-h-[600px] w-full bg-[#01030c] animate-pulse" />,
});

export default function HomeAiSection() {
  return <AiTerminal />;
}
