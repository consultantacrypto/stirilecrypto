import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import CryptoAziAdminForm from '@/components/admin/CryptoAziAdminForm';
import { getCryptoBriefAdminAction } from '@/app/admin/crypto-azi/actions';

export const metadata: Metadata = {
  title: 'Crypto Azi — editare | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function AdminCryptoAziEditPage({ params }: Props) {
  const { id } = await params;
  const brief = await getCryptoBriefAdminAction(id);
  if (!brief) notFound();

  return (
    <AdminShell title="Editează briefing" backHref="/admin/crypto-azi" backLabel="Crypto Azi">
      <CryptoAziAdminForm mode="edit" initial={brief} />
    </AdminShell>
  );
}
