import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminArticleForm from '@/components/admin/AdminArticleForm';

export const metadata: Metadata = {
  title: 'Admin — Știri',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-blue-400 mb-1">
              Admin Panel
            </p>
            <h1 className="text-2xl font-bold tracking-tight">Publică articol nou</h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Site
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-10 lg:py-14">
        <AdminArticleForm />
      </div>
    </main>
  );
}
