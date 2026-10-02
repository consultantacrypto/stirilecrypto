import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { listCryptoBriefsAdminAction } from '@/app/admin/crypto-azi/actions';
import { formatBucharestDate, formatBucharestDateTime } from '@/lib/crypto-azi/format';

export const metadata: Metadata = {
  title: 'Crypto Azi | Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const statusClass: Record<string, string> = {
  draft: 'border-white/15 bg-white/5 text-slate-300',
  published: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  archived: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
};

export default async function AdminCryptoAziPage() {
  const briefs = await listCryptoBriefsAdminAction();

  return (
    <AdminShell title="Crypto Azi" backHref="/admin" backLabel="Articole">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400 font-[var(--font-inter)]">
          {briefs.length} briefing{briefs.length === 1 ? '' : 'uri'} · data în Europe/Bucharest
        </p>
        <Link
          href="/admin/crypto-azi/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-500"
        >
          <Plus size={16} />
          Briefing nou
        </Link>
      </div>

      {briefs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-slate-400 text-sm">
          Niciun briefing încă. Creează primul draft. Tabelul{' '}
          <code className="text-sky-300">crypto_daily_briefs</code> trebuie migrat în Supabase
          înainte ca salvările să funcționeze.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Dată RO</th>
                <th className="px-4 py-3">Titlu</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actualizat</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {briefs.map((brief) => (
                <tr key={brief.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    {formatBucharestDate(brief.brief_date)}
                  </td>
                  <td className="px-4 py-3 text-white font-medium">{brief.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass[brief.status] ?? statusClass.draft}`}
                    >
                      {brief.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {formatBucharestDateTime(brief.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/crypto-azi/edit/${brief.id}`}
                      className="font-semibold text-sky-400 hover:text-sky-300"
                    >
                      Editează
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
