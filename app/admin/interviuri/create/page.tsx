import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';
import AdminInterviewForm from '@/components/admin/AdminInterviewForm';

export const metadata: Metadata = {
  title: 'Adaugă interviu | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminCreateInterviewPage() {
  return (
    <AdminShell
      title="Adaugă interviu editorial"
      backHref="/admin/interviuri"
      backLabel="Interviuri"
    >
      <AdminInterviewForm mode="create" />
    </AdminShell>
  );
}
