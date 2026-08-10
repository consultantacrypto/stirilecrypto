import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import EtfAdminForm from '@/components/admin/EtfAdminForm';

export const metadata: Metadata = {
  title: 'ETF Flows | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function AdminEtfPage() {
  return (
    <AdminShell title="ETF Inflow / Outflow" backHref="/admin/dashboard" backLabel="Dashboard Data">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-slate-400">
          Introdu zilnic fluxul net agregat (Farside / SoSoValue) în ~30 secunde. Valorile se
          salvează în <code className="text-violet-300">etf_snapshots</code> și apar pe dashboard
          după refresh cache.
        </p>
        <Link
          href="/dashboard"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
        >
          Vezi /dashboard
          <ExternalLink size={14} />
        </Link>
      </div>

      <div className="max-w-2xl">
        <EtfAdminForm />
      </div>
    </AdminShell>
  );
}
