'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import { deleteInterviewAction } from '@/app/admin/interviuri/actions';
import type { Interview } from '@/lib/types/interviews';

function formatRowDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

type AdminInterviewsTableProps = {
  interviews: Interview[];
};

export default function AdminInterviewsTable({ interviews: initialInterviews }: AdminInterviewsTableProps) {
  const router = useRouter();
  const [interviews, setInterviews] = useState(initialInterviews);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Ștergi acest interviu?')) return;

    setDeletingId(id);
    setError(null);

    const result = await deleteInterviewAction(id);
    if (!result.success) {
      setError(result.error);
    } else {
      setInterviews((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    }
    setDeletingId(null);
  };

  if (interviews.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-12 text-center">
        <p className="text-slate-400 font-[var(--font-inter)]">Nu există interviuri încă.</p>
        <Link
          href="/admin/interviuri/create"
          className="inline-block mt-4 text-violet-400 hover:text-violet-300 text-sm font-semibold"
        >
          Adaugă primul interviu →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0f1e] shadow-xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500 font-[var(--font-space)]">
              <th className="px-4 py-4 font-bold">Titlu</th>
              <th className="px-4 py-4 font-bold">Invitat</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold">Dată</th>
              <th className="px-4 py-4 font-bold text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-[var(--font-inter)]">
            {interviews.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-white line-clamp-2 max-w-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">/interviuri/{item.slug}</p>
                </td>
                <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{item.guest_name}</td>
                <td className="px-4 py-3">
                  {item.status === 'published' ? (
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/30">
                      published
                    </span>
                  ) : (
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                  {formatRowDate(item.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/interviuri/edit/${item.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors"
                      title="Editează"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-red-400 hover:border-red-500/40 disabled:opacity-50 transition-colors"
                      title="Șterge"
                    >
                      {deletingId === item.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
