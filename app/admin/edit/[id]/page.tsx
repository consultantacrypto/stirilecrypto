import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AdminArticleForm from '@/components/admin/AdminArticleForm';
import { createClient } from '@/lib/supabase/server';
import type { Stire } from '@/lib/types/stiri';

export const metadata: Metadata = {
  title: 'Editează Articol | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type EditArticlePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.from('stiri').select('*').eq('id', id).maybeSingle();

  if (error || !data) {
    notFound();
  }

  const article = data as Stire;

  return (
    <AdminShell
      title="Editează articol"
      backHref="/admin"
      backLabel="Back to Dashboard"
    >
      <AdminArticleForm initialData={article} />
    </AdminShell>
  );
}
