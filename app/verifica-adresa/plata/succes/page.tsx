import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckerFrame } from '../../frame';
import { checkerSuccessEmbedSrc } from '@/lib/products/placement';

export const metadata: Metadata = {
  title: 'Raportul tău',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId = '' } = await searchParams;
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <CheckerFrame title="Raportul tău" src={checkerSuccessEmbedSrc(sessionId)} />
      </main>
      <Footer />
    </div>
  );
}
