'use client';

import { useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/slugify';
import {
  AIRDROP_PROGRAM_STATUSES,
  AIRDROP_PROGRAM_TYPES,
  PROGRAM_STATUS_LABEL,
  PROGRAM_TYPE_LABEL,
  type AirdropAlert,
  type AirdropProgramStatus,
  type AirdropProgramType,
  type AirdropPublishStatus,
} from '@/lib/airdrop-alert';

type Draft = {
  name: string;
  slug: string;
  programType: AirdropProgramType;
  programStatus: AirdropProgramStatus;
  windowLabel: string;
  sourceUrl: string;
  sourceUrlSecondary: string;
  note: string;
  deadlineAt: string;
  riskLevel: '' | 'higher';
  sortOrder: number;
  publishStatus: AirdropPublishStatus;
};

const emptyDraft = (): Draft => ({
  name: '',
  slug: '',
  programType: 'points',
  programStatus: 'active',
  windowLabel: '',
  sourceUrl: '',
  sourceUrlSecondary: '',
  note: '',
  deadlineAt: '',
  riskLevel: '',
  sortOrder: 100,
  publishStatus: 'draft',
});

function draftFromItem(item: AirdropAlert): Draft {
  return {
    name: item.name,
    slug: item.slug,
    programType: item.programType,
    programStatus: item.programStatus,
    windowLabel: item.windowLabel,
    sourceUrl: item.sourceUrl,
    sourceUrlSecondary: item.sourceUrlSecondary ?? '',
    note: item.note ?? '',
    deadlineAt: item.deadlineAt ?? '',
    riskLevel: item.riskLevel ?? '',
    sortOrder: item.sortOrder,
    publishStatus: item.publishStatus,
  };
}

function payloadFromDraft(draft: Draft, previousStatus?: AirdropPublishStatus) {
  const sourceUrl = draft.sourceUrl.trim();
  const secondary = draft.sourceUrlSecondary.trim();
  const deadline = draft.deadlineAt.trim();
  if (!draft.name.trim() || !draft.windowLabel.trim() || !sourceUrl.startsWith('https://')) {
    throw new Error('Nume, fereastră și sursa https sunt obligatorii.');
  }
  if (secondary && !secondary.startsWith('https://')) {
    throw new Error('Sursa secundară trebuie să înceapă cu https://');
  }
  if (deadline && !Number.isFinite(new Date(deadline).getTime())) {
    throw new Error('Termenul trebuie să fie o dată ISO, de exemplu 2026-11-02T10:00:00.000Z.');
  }
  const status = draft.publishStatus;
  return {
    name: draft.name.trim(),
    slug: draft.slug.trim() || slugify(draft.name),
    program_type: draft.programType,
    program_status: draft.programStatus,
    window_label: draft.windowLabel.trim(),
    source_url: sourceUrl,
    source_url_secondary: secondary || null,
    note: draft.note.trim() || null,
    deadline_at: deadline ? new Date(deadline).toISOString() : null,
    risk_level: draft.riskLevel || null,
    sort_order: Number(draft.sortOrder) || 0,
    status,
    ...(status === 'draft'
      ? { published_at: null }
      : previousStatus !== 'published'
        ? { published_at: new Date().toISOString() }
        : {}),
  };
}

export default function AirdropAlertAdminPanel({ items: initialItems }: { items: AirdropAlert[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(initialItems.map((item) => [item.id, draftFromItem(item)])),
  );
  const [creating, setCreating] = useState(emptyDraft());
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveNew = async () => {
    setSavingId('new');
    setError(null);
    try {
      const payload = payloadFromDraft(creating);
      const supabase = createClient();
      const { error: insertError } = await supabase.from('airdrop_alerts').insert(payload);
      if (insertError) throw new Error(insertError.message);
      setCreating(emptyDraft());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvare eșuată.');
    } finally {
      setSavingId(null);
    }
  };

  const saveItem = async (item: AirdropAlert) => {
    const draft = drafts[item.id];
    if (!draft) return;
    setSavingId(item.id);
    setError(null);
    try {
      const payload = payloadFromDraft(draft, item.publishStatus);
      const supabase = createClient();
      const { error: updateError } = await supabase.from('airdrop_alerts').update(payload).eq('id', item.id);
      if (updateError) throw new Error(updateError.message);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Actualizare eșuată.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteItem = async (item: AirdropAlert) => {
    if (!window.confirm(`Ștergi ${item.name} din Airdrop Alert?`)) return;
    setSavingId(item.id);
    setError(null);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase.from('airdrop_alerts').delete().eq('id', item.id);
      if (deleteError) throw new Error(deleteError.message);
      setItems((prev) => prev.filter((row) => row.id !== item.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ștergere eșuată.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-400">
        Rândurile publicate apar pe /airdrop-alert. Drafturile rămân aici. Notele sunt o linie, fără pași de farming.
        Termenul se salvează în UTC: 2 nov 2026, 12:00 ora României = 2026-11-02T10:00:00.000Z.
      </p>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="font-[var(--font-space)] text-lg font-bold">Program nou</h2>
        <DraftFields draft={creating} onChange={setCreating} />
        <button
          type="button"
          onClick={saveNew}
          disabled={savingId === 'new'}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {savingId === 'new' ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Adaugă
        </button>
      </section>

      <ul className="space-y-3">
        {items.map((item) => {
          const draft = drafts[item.id] ?? draftFromItem(item);
          return (
            <li key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03]">
              <details>
                <summary className="cursor-pointer list-none px-4 py-3">
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="ml-2 text-xs text-slate-400">
                    {PROGRAM_TYPE_LABEL[item.programType]} · {PROGRAM_STATUS_LABEL[item.programStatus]} ·{' '}
                    {item.publishStatus}
                  </span>
                </summary>
                <div className="border-t border-white/10 px-4 py-4">
                  <DraftFields
                    draft={draft}
                    onChange={(next) => setDrafts((prev) => ({ ...prev, [item.id]: next }))}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => saveItem(item)}
                      disabled={savingId === item.id}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                    >
                      {savingId === item.id ? <Loader2 size={16} className="animate-spin" /> : null}
                      Salvează
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item)}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-rose-200"
                    >
                      <Trash2 size={16} />
                      Șterge
                    </button>
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DraftFields({ draft, onChange }: { draft: Draft; onChange: (next: Draft) => void }) {
  const field =
    (key: keyof Draft) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value;
      onChange({ ...draft, [key]: key === 'sortOrder' ? Number(value) : value });
    };

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="text-xs text-slate-400">
        Nume
        <input value={draft.name} onChange={field('name')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
      <label className="text-xs text-slate-400">
        Slug
        <input value={draft.slug} onChange={field('slug')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
      <label className="text-xs text-slate-400">
        Tip
        <select value={draft.programType} onChange={field('programType')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white">
          {AIRDROP_PROGRAM_TYPES.map((type) => (
            <option key={type} value={type}>
              {PROGRAM_TYPE_LABEL[type]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-slate-400">
        Stare program
        <select value={draft.programStatus} onChange={field('programStatus')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white">
          {AIRDROP_PROGRAM_STATUSES.map((status) => (
            <option key={status} value={status}>
              {PROGRAM_STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs text-slate-400">
        TGE / fereastră
        <input value={draft.windowLabel} onChange={field('windowLabel')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
      <label className="text-xs text-slate-400">
        Publicare
        <select value={draft.publishStatus} onChange={field('publishStatus')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white">
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
      </label>
      <label className="text-xs text-slate-400 sm:col-span-2">
        Sursă principală (https)
        <input value={draft.sourceUrl} onChange={field('sourceUrl')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
      <label className="text-xs text-slate-400 sm:col-span-2">
        Sursă secundară (opțional)
        <input value={draft.sourceUrlSecondary} onChange={field('sourceUrlSecondary')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
      <label className="text-xs text-slate-400 sm:col-span-2">
        Notă (o linie)
        <textarea value={draft.note} onChange={field('note')} rows={2} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
      <label className="text-xs text-slate-400">
        Termen ISO (UTC, opțional)
        <input value={draft.deadlineAt} onChange={field('deadlineAt')} placeholder="2026-11-02T10:00:00.000Z" className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
      <label className="text-xs text-slate-400">
        Risc
        <select value={draft.riskLevel} onChange={field('riskLevel')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white">
          <option value="">standard</option>
          <option value="higher">mai mare</option>
        </select>
      </label>
      <label className="text-xs text-slate-400">
        Ordine
        <input type="number" value={draft.sortOrder} onChange={field('sortOrder')} className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-white" />
      </label>
    </div>
  );
}
