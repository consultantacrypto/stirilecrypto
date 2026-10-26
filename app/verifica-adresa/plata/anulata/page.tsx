import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckerFrame } from '../../frame';
import { checkerCancelEmbedSrc } from '@/lib/products/placement';

export const metadata: Metadata = {
  title: 'Plată anulată',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <CheckerFrame title="Plată anulată" src={checkerCancelEmbedSrc()} />
      </main>
      <Footer />
    </div>
  );
}
