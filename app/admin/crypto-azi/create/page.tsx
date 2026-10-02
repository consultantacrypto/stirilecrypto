import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';
import CryptoAziAdminForm from '@/components/admin/CryptoAziAdminForm';

export const metadata: Metadata = {
  title: 'Crypto Azi — creare | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminCryptoAziCreatePage() {
  return (
    <AdminShell title="Briefing nou" backHref="/admin/crypto-azi" backLabel="Crypto Azi">
      <CryptoAziAdminForm mode="create" />
    </AdminShell>
  );
}
