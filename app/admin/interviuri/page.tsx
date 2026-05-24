import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AdminInterviewsTable from '@/components/admin/AdminInterviewsTable';
import { createClient } from '@/lib/supabase/server';
import type { Interview } from '@/lib/types/interviews';

export const metadata: Metadata = {
  title: 'Admin Interviuri | Știrile Crypto',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminInterviuriPage() {
  let interviews: Interview[] = [];
  let fetchError: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      fetchError = error.message;
      console.error('[admin/interviuri]', error.message);
    } else {
      interviews = (data ?? []) as Interview[];
    }
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Eroare la conectarea la Supabase.';
    console.error('[admin/interviuri]', fetchError);
  }

  return (
    <AdminShell title="Interviuri editoriale" backHref="/admin" backLabel="Articole">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <p className="text-slate-400 text-sm font-[var(--font-inter)]">
          {interviews.length} interviu{interviews.length === 1 ? '' : 'uri'} în baza de date.
        </p>
        <Link
          href="/admin/interviuri/create"
          className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-3 rounded-xl transition-colors shadow-lg shadow-violet-900/20 text-sm"
        >
          <Plus size={18} />
          Adaugă Interviu
        </Link>
      </div>

      {fetchError ? (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 text-sm">
          Nu s-au putut încărca interviurile: {fetchError}. Verifică dacă ai rulat{' '}
          <code className="text-amber-100">supabase/interviews-schema.sql</code> în Supabase.
        </div>
      ) : null}

      <AdminInterviewsTable interviews={interviews} />
    </AdminShell>
  );
}
