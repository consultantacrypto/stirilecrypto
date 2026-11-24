import type { Metadata } from 'next';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import OrderDeliveryButton from '@/components/admin/OrderDeliveryButton';
import {
  DELIVERY_COPY,
  deliveryColumnText,
  filterInquiriesByDelivery,
  loadAdminInquiries,
  parseDeliveryFilter,
  type DeliveryFilter,
} from '@/lib/admin/inquiry-delivery';
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
  address_check: 'Verificare portofel crypto',
};

const FILTERS: { key: DeliveryFilter; href: string; label: string }[] = [
  { key: 'all', href: '/admin/comenzi', label: 'Toate' },
  { key: 'pending', href: '/admin/comenzi?livrare=asteptare', label: 'În așteptare' },
  { key: 'delivered', href: '/admin/comenzi?livrare=livrate', label: 'Livrate' },
];

function tierLabel(tier: unknown): string {
  if (tier === 'major') return 'Monedă mare, 79 lei';
  if (tier === 'altcoin') return 'Altcoin, 139 lei';
  return '—';
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ livrare?: string | string[] }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const loaded = await loadAdminInquiries(async (columns) => {
    const { data, error } = await supabase
      .from('product_inquiries')
      .select(columns)
      .order('created_at', { ascending: false })
      .limit(100);
    return {
      data: (data ?? null) as Array<Record<string, unknown>> | null,
      error: error ? { message: error.message, code: error.code } : null,
    };
  });

  const filter = loaded.deliveryKnown ? parseDeliveryFilter(params.livrare) : 'all';
  const rows = filterInquiriesByDelivery(loaded.rows, filter);

  return (
    <AdminShell title="Comenzi analiză" subtitle="Livrare manuală">
      <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-400">
        După o plată confirmată de Stripe, statusul devine <span className="text-slate-200">paid</span>.
        Un coleg pregătește analiza, Daniel Mihai o revizuiește, apoi pleacă pe email de la
        contact@stirilecrypto.ro. Lista aceasta nu trimite analiza și nu încasează.{' '}
        <span className="text-slate-200">{DELIVERY_COPY.mark}</span> doar notează că analiza a plecat.
      </p>
      {loaded.error ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Comenzile nu pot fi citite încă ({loaded.error.message}). Aplică{' '}
          <span className="font-mono">supabase/product-inquiries.sql</span> dacă tabelul lipsește.
        </p>
      ) : (
        <>
          {loaded.deliveryKnown ? null : (
            <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Coloanele de livrare nu sunt încă în baza de date, așa că «{DELIVERY_COPY.column}» arată «
              {DELIVERY_COPY.unknown}». Aplică{' '}
              <span className="font-mono">supabase/product-inquiries-delivery.sql</span> înainte de a marca
              o comandă. Fișierul nu a fost aplicat din acest deploy.
            </p>
          )}
          {loaded.rows.length === 0 ? (
            <p className="text-sm text-slate-500">Nu există comenzi înregistrate.</p>
          ) : (
            <>
              {loaded.deliveryKnown ? (
                <nav aria-label="Filtru livrare" className="mb-4 flex flex-wrap gap-2">
                  {FILTERS.map((item) => {
                    const active = item.key === filter;
                    return (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                          active
                            ? 'border-white/40 bg-white/10 text-white'
                            : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                        }`}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              ) : null}
              {rows.length === 0 ? (
                <p className="text-sm text-slate-500">Nicio comandă pentru filtrul ales.</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full min-w-[980px] text-left text-sm">
                    <thead className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Data</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">{DELIVERY_COPY.column}</th>
                        <th className="px-4 py-3 font-semibold">Produs</th>
                        <th className="px-4 py-3 font-semibold">Activ</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Sumă</th>
                        <th className="px-4 py-3 font-semibold">Tarif</th>
                        <th className="px-4 py-3 font-semibold">Sursă</th>
                        <th className="px-4 py-3 font-semibold">Acțiune</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-300">
                      {rows.map((row) => {
                        const delivery = deliveryColumnText({
                          known: loaded.deliveryKnown,
                          status: row.delivery_status,
                          deliveredAt: row.delivered_at,
                        });
                        return (
                          <tr key={row.id}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {new Date(row.created_at).toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
                            </td>
                            <td className="px-4 py-3 font-semibold text-white">{row.status}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {delivery.label === DELIVERY_COPY.delivered ? (
                                <>
                                  <span className="font-semibold text-emerald-300">{delivery.label}</span>
                                  {delivery.at ? (
                                    <span className="mt-0.5 block text-xs text-slate-400">{delivery.at}</span>
                                  ) : null}
                                </>
                              ) : delivery.label === DELIVERY_COPY.pending ? (
                                <span className="text-amber-200">{delivery.label}</span>
                              ) : (
                                <span className="text-slate-500">{delivery.label}</span>
                              )}
                            </td>
                            <td className="px-4 py-3">{PRODUCT_LABEL[row.product] ?? row.product}</td>
                            <td className="px-4 py-3">{row.asset || '—'}</td>
                            <td className="px-4 py-3">{row.email}</td>
                            <td className="px-4 py-3 tabular-nums">
                              {row.amount_ron == null ? '—' : `${row.amount_ron} RON`}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{tierLabel(row.payload?.tier)}</td>
                            <td className="px-4 py-3">
                              {typeof row.payload?.source === 'string' ? row.payload.source : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <OrderDeliveryButton
                                id={row.id}
                                status={row.delivery_status}
                                enabled={loaded.deliveryKnown}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </AdminShell>
  );
}
