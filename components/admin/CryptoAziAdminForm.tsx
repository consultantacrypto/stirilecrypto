'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import {
  createCryptoBriefAction,
  updateCryptoBriefAction,
  deleteCryptoBriefAction,
} from '@/app/admin/crypto-azi/actions';
import {
  emptyTakeaways,
  normalizeTakeaways,
  validateTakeaways,
  bucharestDateIso,
  formatBucharestDate,
} from '@/lib/crypto-azi/format';
import type {
  CryptoBriefStatus,
  CryptoDailyBrief,
  CryptoTakeaway,
} from '@/lib/crypto-azi/types';

type FormState = {
  brief_date: string;
  status: CryptoBriefStatus;
  title: string;
  introduction: string;
  takeaways: CryptoTakeaway[];
};

function formFromBrief(brief: CryptoDailyBrief): FormState {
  return {
    brief_date: brief.brief_date,
    status: brief.status,
    title: brief.title,
    introduction: brief.introduction,
    takeaways: normalizeTakeaways(brief.takeaways),
  };
}

const emptyForm = (): FormState => ({
  brief_date: bucharestDateIso(),
  status: 'draft',
  title: '',
  introduction: '',
  takeaways: emptyTakeaways(),
});

type Props = {
  initial?: CryptoDailyBrief | null;
  mode: 'create' | 'edit';
};

export default function CryptoAziAdminForm({ initial = null, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() =>
    initial ? formFromBrief(initial) : emptyForm(),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const validation = useMemo(() => validateTakeaways(form.takeaways), [form.takeaways]);
  const canPublish = validation.ok && form.title.trim().length > 0;

  function updateTakeaway(index: number, patch: Partial<CryptoTakeaway>) {
    setForm((prev) => {
      const next = [...prev.takeaways];
      next[index] = { ...next[index], ...patch };
      return { ...prev, takeaways: next };
    });
  }

  async function persist(nextStatus: CryptoBriefStatus) {
    setSaving(true);
    setMessage(null);

    if (nextStatus === 'published') {
      const check = validateTakeaways(form.takeaways);
      if (!check.ok || !form.title.trim()) {
        setMessage({
          tone: 'err',
          text:
            check.errors[0] ??
            'Publicarea cere titlu și exact trei takeaways cu surse complete.',
        });
        setSaving(false);
        return;
      }
    }

    const input = {
      brief_date: form.brief_date,
      status: nextStatus,
      title: form.title,
      introduction: form.introduction,
      takeaways: form.takeaways,
    };

    try {
      if (mode === 'create') {
        const result = await createCryptoBriefAction(input);
        if (!result.success) {
          setMessage({ tone: 'err', text: result.error });
          return;
        }
        setMessage({ tone: 'ok', text: 'Brief salvat.' });
        router.push(`/admin/crypto-azi/edit/${result.id}`);
        router.refresh();
        return;
      }

      if (!initial?.id) throw new Error('ID lipsă');
      const result = await updateCryptoBriefAction(
        initial.id,
        input,
        initial.published_at ?? null,
      );
      if (!result.success) {
        setMessage({ tone: 'err', text: result.error });
        return;
      }
      setForm((prev) => ({ ...prev, status: nextStatus }));
      setMessage({
        tone: 'ok',
        text:
          nextStatus === 'published'
            ? 'Brief publicat.'
            : nextStatus === 'archived'
              ? 'Brief arhivat.'
              : 'Draft salvat.',
      });
      router.refresh();
    } catch (err) {
      const text =
        err instanceof Error ? err.message : 'Salvare eșuată';
      setMessage({ tone: 'err', text });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!window.confirm('Ștergi definitiv acest briefing?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await deleteCryptoBriefAction(initial.id);
      if (!result.success) {
        setMessage({ tone: 'err', text: result.error });
        return;
      }
      router.push('/admin/crypto-azi');
      router.refresh();
    } catch (err) {
      setMessage({
        tone: 'err',
        text: err instanceof Error ? err.message : 'Ștergere eșuată',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            message.tone === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {message.tone === 'ok' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-bold uppercase tracking-wider text-slate-300">
          Status: {form.status}
        </span>
        <span className="text-slate-500">
          Dată RO: {formatBucharestDate(form.brief_date)}
        </span>
        <Link
          href="/crypto-azi"
          target="_blank"
          className="text-sky-400 hover:text-sky-300 font-semibold"
        >
          Preview public →
        </Link>
      </div>

      <form
        className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void persist(form.status === 'published' ? 'published' : 'draft');
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Data briefingului (Europe/Bucharest)
            </span>
            <input
              type="date"
              required
              value={form.brief_date}
              onChange={(e) => setForm((p) => ({ ...p, brief_date: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-sky-500"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Titlu
            </span>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-sky-500"
              placeholder="Crypto Azi — rezumatul zilei"
            />
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Introducere
          </span>
          <textarea
            rows={3}
            value={form.introduction}
            onChange={(e) => setForm((p) => ({ ...p, introduction: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-sky-500"
            placeholder="Context scurt pentru cititor…"
          />
        </label>

        <div className="space-y-6">
          {form.takeaways.map((item, index) => (
            <fieldset
              key={index}
              className="space-y-3 rounded-xl border border-white/10 p-4"
            >
              <legend className="px-1 text-xs font-bold uppercase tracking-wider text-sky-400">
                Takeaway {index + 1}
              </legend>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateTakeaway(index, { title: e.target.value })}
                placeholder="Titlu"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-sky-500"
              />
              <textarea
                rows={3}
                value={item.why_it_matters}
                onChange={(e) => updateTakeaway(index, { why_it_matters: e.target.value })}
                placeholder="De ce contează"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-sky-500"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={item.source_label}
                  onChange={(e) => updateTakeaway(index, { source_label: e.target.value })}
                  placeholder="Etichetă sursă"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-sky-500"
                />
                <input
                  type="url"
                  value={item.source_url}
                  onChange={(e) => updateTakeaway(index, { source_url: e.target.value })}
                  placeholder="https://…"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-sky-500"
                />
              </div>
            </fieldset>
          ))}
        </div>

        {!validation.ok ? (
          <ul className="space-y-1 text-sm text-amber-300">
            {validation.errors.map((err) => (
              <li key={err}>• {err}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-300">Sursele și cele 3 takeaways sunt valide.</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void persist('draft')}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={16} /> : null}
            Salvează draft
          </button>
          <button
            type="button"
            disabled={saving || !canPublish}
            onClick={() => void persist('published')}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-500 disabled:opacity-60"
          >
            Publică
          </button>
          {mode === 'edit' ? (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={() => void persist('archived')}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-bold text-amber-200 hover:bg-amber-500/15 disabled:opacity-60"
              >
                Arhivează
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleDelete()}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-200 hover:bg-red-500/15 disabled:opacity-60"
              >
                Șterge
              </button>
            </>
          ) : null}
        </div>
      </form>
    </div>
  );
}
