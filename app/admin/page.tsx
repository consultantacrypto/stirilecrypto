import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminArticlesTable from '@/components/admin/AdminArticlesTable';
import { createClient } from '@/lib/supabase/server';
import type { Stire } from '@/lib/types/stiri';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Știrile Crypto',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('stiri')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin dashboard]', error.message);
  }

  const articles = (data ?? []) as Stire[];

  return (
    <AdminShell title="Management Articole" backHref="/" backLabel="Site">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p className="text-slate-400 text-sm font-[var(--font-inter)]">
          {articles.length} articol{articles.length === 1 ? '' : 'e'} în baza de date (draft + publicat).
        </p>
        <Link
          href="/admin/create"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20 text-sm"
        >
          <Plus size={18} />
          Create New Article
        </Link>
      </div>

      <AdminArticlesTable articles={articles} />
    </AdminShell>
  );
}
