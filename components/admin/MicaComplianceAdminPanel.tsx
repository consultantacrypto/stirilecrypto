'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/slugify';
import type {
  DashboardPublishStatus,
  MicaComplianceItem,
  MicaComplianceStatus,
  MicaEntityType,
} from '@/lib/types/dashboard';

const STATUSES: MicaComplianceStatus[] = ['safe', 'risky', 'banned', 'transitional'];
const ENTITY_TYPES: MicaEntityType[] = ['exchange', 'stablecoin'];

type Props = {
  items: MicaComplianceItem[];
};

const emptyDraft = {
  name: '',
  slug: '',
  entity_type: 'exchange' as MicaEntityType,
  compliance_status: 'transitional' as MicaComplianceStatus,
  jurisdiction: '',
  notes: '',
  source_url: '',
  sort_order: 0,
  status: 'draft' as DashboardPublishStatus,
};

export default function MicaComplianceAdminPanel({ items: initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState(emptyDraft);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!draft.name.trim()) {
      setError('Numele este obligatoriu.');
      return;
    }
    setError(null);
    setSavingId('new');

    const payload = {
      ...draft,
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      jurisdiction: draft.jurisdiction.trim() || null,
      notes: draft.notes.trim() || null,
      source_url: draft.source_url.trim() || null,
    };

    try {
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from('mica_compliance_items')
        .insert(payload)
        .select('*')
        .single();
      if (insertError) throw new Error(insertError.message);
      setItems((prev) => [...prev, data as MicaComplianceItem]);
      setDraft(emptyDraft);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Creare eșuată.');
    } finally {
      setSavingId(null);
    }
  };

  const updateItem = async (id: string, patch: Partial<MicaComplianceItem>) => {
    setSavingId(id);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('mica_compliance_items')
        .update(patch)
        .eq('id', id);
      if (updateError) throw new Error(updateError.message);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Actualizare eșuată.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('Ștergi această intrare MiCA?')) return;
    setSavingId(id);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('mica_compliance_items')
        .delete()
        .eq('id', id);
      if (deleteError) throw new Error(deleteError.message);
      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ștergere eșuată.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-[var(--font-space)]">MiCA Safety Radar</h2>
        <p className="text-sm text-slate-400 mt-1">Gestionează exchange-uri și stablecoins pentru /dashboard.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <input
          placeholder="Nume (ex. Bybit EU)"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          className="rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
        />
        <select
          value={draft.entity_type}
          onChange={(e) => setDraft((d) => ({ ...d, entity_type: e.target.value as MicaEntityType }))}
          className="rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
        >
          {ENTITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={draft.compliance_status}
          onChange={(e) =>
            setDraft((d) => ({ ...d, compliance_status: e.target.value as MicaComplianceStatus }))
          }
          className="rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          placeholder="Jurisdicție"
          value={draft.jurisdiction}
          onChange={(e) => setDraft((d) => ({ ...d, jurisdiction: e.target.value }))}
          className="rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
        />
        <input
          placeholder="Sort order"
          type="number"
          value={draft.sort_order}
          onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))}
          className="rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
        />
        <select
          value={draft.status}
          onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as DashboardPublishStatus }))}
          className="rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
        <textarea
          placeholder="Notes"
          value={draft.notes}
          onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
          className="md:col-span-2 lg:col-span-3 rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
          rows={2}
        />
        <input
          placeholder="Source URL"
          value={draft.source_url}
          onChange={(e) => setDraft((d) => ({ ...d, source_url: e.target.value }))}
          className="md:col-span-2 lg:col-span-2 rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white text-sm"
        />
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={savingId === 'new'}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 text-sm disabled:opacity-60"
        >
          {savingId === 'new' ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Adaugă
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-500 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Nume</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Public</th>
              <th className="px-4 py-3">Ordine</th>
              <th className="px-4 py-3 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                <td className="px-4 py-3 text-slate-400">{item.entity_type}</td>
                <td className="px-4 py-3">
                  <select
                    value={item.compliance_status}
                    onChange={(e) =>
                      void updateItem(item.id, {
                        compliance_status: e.target.value as MicaComplianceStatus,
                      })
                    }
                    className="rounded-lg border border-white/10 bg-[#1c1c1e] px-2 py-1 text-white text-xs"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      void updateItem(item.id, { status: e.target.value as DashboardPublishStatus })
                    }
                    className="rounded-lg border border-white/10 bg-[#1c1c1e] px-2 py-1 text-white text-xs"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={item.sort_order}
                    onBlur={(e) =>
                      void updateItem(item.id, { sort_order: Number(e.target.value) })
                    }
                    className="w-20 rounded-lg border border-white/10 bg-[#1c1c1e] px-2 py-1 text-white text-xs"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => void deleteItem(item.id)}
                    disabled={savingId === item.id}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 text-slate-400 hover:text-red-400"
                  >
                    {savingId === item.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
