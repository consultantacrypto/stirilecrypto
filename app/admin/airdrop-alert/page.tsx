import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import AirdropAlertAdminPanel from '@/components/admin/AirdropAlertAdminPanel';
import { rowToAirdropAlert, type AirdropAlert } from '@/lib/airdrop-alert';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Airdrop Alert | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminAirdropAlertPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('airdrop_alerts')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  const items = (data ?? [])
    .map((row) => rowToAirdropAlert(row as Record<string, unknown>))
    .filter((row): row is AirdropAlert => row !== null);

  return (
    <AdminShell title="Airdrop Alert" subtitle="Admin" backHref="/admin" backLabel="Dashboard">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">CMS pentru /airdrop-alert. Doar rândurile published sunt publice.</p>
        <Link
          href="/airdrop-alert"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
        >
          Vezi pagina publică
          <ExternalLink size={14} />
        </Link>
      </div>
      {error ? (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-100">
          Tabela nu răspunde: {error.message}. Rulează supabase/airdrop-alerts-schema.sql în SQL Editor.
        </p>
      ) : (
        <AirdropAlertAdminPanel items={items} />
      )}
    </AdminShell>
  );
}
