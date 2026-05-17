'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Stire } from '@/lib/types/stiri';

function formatRowDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

type AdminArticlesTableProps = {
  articles: Stire[];
};

export default function AdminArticlesTable({ articles: initialArticles }: AdminArticlesTableProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Ești sigur că vrei să ștergi acest articol?');
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from('stiri').delete().eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ștergerea a eșuat.');
    } finally {
      setDeletingId(null);
    }
  };

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-12 text-center">
        <p className="text-slate-400 font-[var(--font-inter)]">Nu există articole în baza de date.</p>
        <Link
          href="/admin/create"
          className="inline-block mt-4 text-blue-400 hover:text-blue-300 text-sm font-semibold"
        >
          Creează primul articol →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0f1e] shadow-xl">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-slate-500 font-[var(--font-space)]">
              <th className="px-4 py-4 font-bold">Copertă</th>
              <th className="px-4 py-4 font-bold">Titlu</th>
              <th className="px-4 py-4 font-bold">Status</th>
              <th className="px-4 py-4 font-bold">Dată</th>
              <th className="px-4 py-4 font-bold text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-[var(--font-inter)]">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-slate-800 border border-white/10">
                    {article.image_url ? (
                      <Image
                        src={article.image_url}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-600 uppercase">
                        N/A
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-white line-clamp-2 max-w-xs">{article.title}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-xs">
                    /stiri/{article.slug}
                  </p>
                </td>
                <td className="px-4 py-3">
                  {article.status === 'published' ? (
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/15 text-green-400 border border-green-500/30">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                  {formatRowDate(article.published_at ?? article.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/edit/${article.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors"
                      title="Editează"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(article.id)}
                      disabled={deletingId === article.id}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-red-400 hover:border-red-500/40 disabled:opacity-50 transition-colors"
                      title="Șterge"
                    >
                      {deletingId === article.id ? (
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
