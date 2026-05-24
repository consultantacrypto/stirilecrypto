import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AdminInterviewForm from '@/components/admin/AdminInterviewForm';
import { createClient } from '@/lib/supabase/server';
import type { Interview } from '@/lib/types/interviews';

export const metadata: Metadata = {
  title: 'Editează interviu | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminEditInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase.from('interviews').select('*').eq('id', id).maybeSingle();

  if (error) {
    console.error('[admin/interviuri/edit]', error.message);
  }

  if (!data) {
    notFound();
  }

  const interview = data as Interview;

  return (
    <AdminShell title="Editează interviu" backHref="/admin/interviuri" backLabel="Interviuri">
      <AdminInterviewForm key={interview.id} mode="edit" initialData={interview} />
    </AdminShell>
  );
}
