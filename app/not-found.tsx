import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagină negăsită',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-4">404</p>
      <h1 className="text-3xl md:text-5xl font-black mb-4 font-[var(--font-space)]">
        Pagina nu există
      </h1>
      <p className="text-gray-400 max-w-md mb-10">
        Linkul poate fi vechi sau greșit. Continuă pe ultimele știri sau pe pagina principală.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold"
        >
          Acasă
        </Link>
        <Link
          href="/stiri"
          className="inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-xl border border-white/20 hover:border-blue-500 font-bold"
        >
          Toate știrile
        </Link>
      </div>
    </main>
  );
}
