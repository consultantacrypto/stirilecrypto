import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InterviewGrid from '@/components/InterviewGrid';
import { MOCK_INTERVIEWS } from '@/lib/interviews';

export const metadata: Metadata = {
  title: 'Interviuri & Analize Premium | StirileCrypto',
  description:
    'Interviuri exclusive, analize de piață și discuții fără filtru cu fondatori și KOLs din industria crypto și tech.',
};

export default function InterviuriPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 sm:px-6 max-w-6xl w-full flex flex-col">
        <header className="pt-32 pb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight font-[var(--font-space)]">
            Interviuri Exclusive
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-gray-400 leading-relaxed font-[var(--font-inter)]">
            Zgomotul e gratuit. Semnalul îl găsești aici. Discuții 1-la-1 cu liderii
            pieței.
          </p>
        </header>

        <InterviewGrid
          interviews={MOCK_INTERVIEWS}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16"
        />
      </main>

      <Footer />
    </div>
  );
}
