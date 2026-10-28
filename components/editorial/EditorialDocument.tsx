import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EditorialDocument({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#02050a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 md:px-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-400">{kicker}</p>
        <h1 className="mb-6 text-4xl font-black leading-tight md:text-5xl">{title}</h1>
        <p className="mb-10 text-lg leading-relaxed text-gray-400">{lede}</p>
        <div className="space-y-6 font-[var(--font-inter)] leading-relaxed text-gray-300 [&_a]:text-blue-400 [&_a]:underline [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
        <p className="mt-12 text-xs text-gray-500">
          Text de pornire, 28 octombrie 2026. Poate fi editat de redacție.
        </p>
      </main>
      <Footer />
    </div>
  );
}
