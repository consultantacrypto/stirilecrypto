import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import PulseTerminalAdminForm from '@/components/admin/PulseTerminalAdminForm';
import MicaComplianceAdminPanel from '@/components/admin/MicaComplianceAdminPanel';
import { createClient } from '@/lib/supabase/server';
import type { PulseTerminalSnapshot } from '@/lib/types/dashboard';
import type { MicaComplianceItem } from '@/lib/types/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard Public Data | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardDataPage() {
  const supabase = await createClient();

  const [{ data: snapshots }, { data: micaItems }] = await Promise.all([
    supabase
      .from('pulse_terminal_snapshots')
      .select('*')
      .order('updated_at', { ascending: false }),
    supabase
      .from('mica_compliance_items')
      .select('*')
      .order('entity_type', { ascending: true })
      .order('sort_order', { ascending: true }),
  ]);

  const btcSnapshot =
    (snapshots as PulseTerminalSnapshot[] | null)?.find((s) => s.asset_symbol === 'BTC') ??
    (snapshots as PulseTerminalSnapshot[] | null)?.[0] ??
    null;

  return (
    <AdminShell title="Dashboard Public (/dashboard)" backHref="/admin" backLabel="Dashboard">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate-400 text-sm">
          Gestionează datele pentru Market Pulse Terminal, MiCA Safety Radar și ETF Flows.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/etf"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300"
          >
            ETF Data Entry
          </Link>
          <Link
            href="/dashboard"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
          >
            Vezi pagina publică
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <PulseTerminalAdminForm initialSnapshot={btcSnapshot} />
        <MicaComplianceAdminPanel items={(micaItems as MicaComplianceItem[]) ?? []} />
      </div>
    </AdminShell>
  );
}
