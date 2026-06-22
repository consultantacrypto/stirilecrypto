import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';
import AdminArticleForm from '@/components/admin/AdminArticleForm';
import type { ArticleContentType } from '@/lib/types/stiri';

export const metadata: Metadata = {
  title: 'Articol Nou | Admin',
  robots: { index: false, follow: false },
};

export default async function AdminCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const initialContentType: ArticleContentType | undefined =
    params.type === 'market_pulse' ? 'market_pulse' : undefined;

  const title =
    initialContentType === 'market_pulse'
      ? 'Analiză Market Pulse nouă'
      : 'Publică articol nou';

  return (
    <AdminShell title={title} backHref="/admin" backLabel="Dashboard">
      <AdminArticleForm initialContentType={initialContentType} />
    </AdminShell>
  );
}
