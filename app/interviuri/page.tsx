import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InterviewCard from '@/components/InterviewCard';
import { getPublishedInterviews } from '@/lib/interviews-db';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Interviuri & Analize Premium | StirileCrypto',
  description:
    'Interviuri exclusive, analize de piață și discuții fără filtru cu fondatori și KOLs din industria crypto și tech.',
  alternates: {
    canonical: `${SITE_URL}/interviuri`,
  },
};

export const revalidate = 60;

export default async function InterviuriPage() {
  const interviews = await getPublishedInterviews();

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

        {interviews.length === 0 ? (
          <p className="pb-16 text-center text-slate-500 text-sm font-[var(--font-inter)]">
            Nu există interviuri publicate momentan. Revino în curând.
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0 pb-16">
            {interviews.map((interview) => (
              <li key={interview.slug} className="min-w-0">
                <InterviewCard item={interview} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
