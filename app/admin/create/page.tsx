import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';
import AdminArticleForm from '@/components/admin/AdminArticleForm';

export const metadata: Metadata = {
  title: 'Articol Nou | Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreatePage() {
  return (
    <AdminShell title="Publică articol nou" backHref="/admin" backLabel="Dashboard">
      <AdminArticleForm />
    </AdminShell>
  );
}
