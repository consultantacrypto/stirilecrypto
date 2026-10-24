import type { Metadata } from 'next';
import AdminShell from '@/components/admin/AdminShell';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Comenzi analiză',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const PRODUCT_LABEL: Record<string, string> = {
  ta_mtf: 'Analiză tehnică',
  risk_report: 'Raport de risc (comandă veche)',
  bundle: 'Pachet (comandă veche)',
  address_check: 'Verificare adresă',
};

interface InquiryRow {
  id: string;
  product: string;
  email: string;
  asset: string | null;
  amount_ron: number | null;
  status: string;
  stripe_session_id: string | null;
  created_at: string;
  payload: { source?: unknown } | null;
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('product_inquiries')
    .select('id, product, email, asset, amount_ron, status, stripe_session_id, created_at, payload')
    .order('created_at', { ascending: false })
    .limit(100);

  const rows = (data ?? []) as InquiryRow[];

  return (
    <AdminShell title="Comenzi analiză" subtitle="Livrare manuală">
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-400">
        După o plată confirmată de Stripe, statusul devine <span className="text-slate-200">paid</span>.
        Un coleg pregătește analiza, Daniel Mihai o revizuiește, apoi pleacă pe email de la
        contact@stirilecrypto.ro. Lista aceasta nu trimite analiza și nu încasează.
      </p>
      {error ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Comenzile nu pot fi citite încă ({error.message}). Aplică{' '}
          <span className="font-mono">supabase/product-inquiries.sql</span> dacă tabelul lipsește.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-500">Nu există comenzi înregistrate.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Produs</th>
                <th className="px-4 py-3 font-semibold">Activ</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Sumă</th>
                <th className="px-4 py-3 font-semibold">Sursă</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{row.status}</td>
                  <td className="px-4 py-3">{PRODUCT_LABEL[row.product] ?? row.product}</td>
                  <td className="px-4 py-3">{row.asset || '—'}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3 tabular-nums">{row.amount_ron == null ? '—' : `${row.amount_ron} RON`}</td>
                  <td className="px-4 py-3">{typeof row.payload?.source === 'string' ? row.payload.source : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
