'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_BYBIT_AFFILIATE_URL } from '@/lib/affiliates';
import type {
  DashboardPublishStatus,
  PulseTerminalLevel,
  PulseTerminalSnapshot,
  PulseTrend,
} from '@/lib/types/dashboard';

const TRENDS: PulseTrend[] = ['bullish', 'bearish', 'neutral', 'range'];

function levelsToText(levels: PulseTerminalLevel[]): string {
  return levels.map((l) => `${l.label ? `${l.label}:` : ''}${l.price}`).join('\n');
}

function parseLevelsText(raw: string): PulseTerminalLevel[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes(':')) {
        const [label, priceStr] = line.split(':').map((s) => s.trim());
        const price = Number(priceStr);
        if (!Number.isFinite(price)) return null;
        return { price, label: label || undefined };
      }
      const price = Number(line);
      if (!Number.isFinite(price)) return null;
      return { price };
    })
    .filter((level): level is PulseTerminalLevel => level !== null);
}

type Props = {
  initialSnapshot: PulseTerminalSnapshot | null;
};

export default function PulseTerminalAdminForm({ initialSnapshot }: Props) {
  const router = useRouter();
  const [snapshotId, setSnapshotId] = useState(initialSnapshot?.id);
  const [assetSymbol, setAssetSymbol] = useState(initialSnapshot?.asset_symbol ?? 'BTC');
  const [assetLabel, setAssetLabel] = useState(initialSnapshot?.asset_label ?? 'Bitcoin');
  const [trend, setTrend] = useState<PulseTrend>(initialSnapshot?.trend ?? 'range');
  const [supportText, setSupportText] = useState(
    levelsToText(initialSnapshot?.support_levels ?? []),
  );
  const [resistanceText, setResistanceText] = useState(
    levelsToText(initialSnapshot?.resistance_levels ?? []),
  );
  const [summary, setSummary] = useState(initialSnapshot?.summary ?? '');
  const [linkedSlug, setLinkedSlug] = useState(initialSnapshot?.linked_article_slug ?? '');
  const [affiliatePartner, setAffiliatePartner] = useState(
    initialSnapshot?.affiliate_partner ?? 'bybit',
  );
  const [affiliateUrl, setAffiliateUrl] = useState(
    initialSnapshot?.affiliate_url ?? DEFAULT_BYBIT_AFFILIATE_URL,
  );
  const [status, setStatus] = useState<DashboardPublishStatus>(
    initialSnapshot?.status ?? 'draft',
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      asset_symbol: assetSymbol.toUpperCase(),
      asset_label: assetLabel.trim(),
      trend,
      support_levels: parseLevelsText(supportText),
      resistance_levels: parseLevelsText(resistanceText),
      summary: summary.trim() || null,
      linked_article_slug: linkedSlug.trim() || null,
      affiliate_partner: affiliatePartner.trim() || 'bybit',
      affiliate_url: affiliateUrl.trim() || DEFAULT_BYBIT_AFFILIATE_URL,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    };

    try {
      const supabase = createClient();

      if (snapshotId) {
        const { error: updateError } = await supabase
          .from('pulse_terminal_snapshots')
          .update(payload)
          .eq('id', snapshotId);
        if (updateError) throw new Error(updateError.message);
      } else {
        const { data, error: insertError } = await supabase
          .from('pulse_terminal_snapshots')
          .insert(payload)
          .select('id')
          .single();
        if (insertError) throw new Error(insertError.message);
        setSnapshotId(data.id as string);
      }

      setSuccess(status === 'published' ? 'Terminal publicat.' : 'Draft salvat.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvare eșuată.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6 space-y-5">
      <div>
        <h2 className="text-lg font-bold text-white font-[var(--font-space)]">Market Pulse Terminal</h2>
        <p className="text-sm text-slate-400 mt-1">
          Un singur snapshot publicat per asset (ex. BTC). Format niveluri:{' '}
          <code className="text-amber-300">S1:92000</code> sau <code className="text-amber-300">92000</code>{' '}
          pe linie.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Asset symbol</span>
          <select
            value={assetSymbol}
            onChange={(e) => setAssetSymbol(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
          >
            <option value="BTC">BTC</option>
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Asset label</span>
          <input
            value={assetLabel}
            onChange={(e) => setAssetLabel(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Trend</span>
          <select
            value={trend}
            onChange={(e) => setTrend(e.target.value as PulseTrend)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
          >
            {TRENDS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as DashboardPublishStatus)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Support levels</span>
          <textarea
            rows={5}
            value={supportText}
            onChange={(e) => setSupportText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white font-mono text-sm"
            placeholder={'S1:92000\nS2:89500'}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Resistance levels</span>
          <textarea
            rows={5}
            value={resistanceText}
            onChange={(e) => setResistanceText(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white font-mono text-sm"
            placeholder={'R1:98000\nR2:102000'}
          />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="text-slate-400">Summary</span>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="text-slate-400">Linked editorial slug (optional)</span>
        <input
          value={linkedSlug}
          onChange={(e) => setLinkedSlug(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
          placeholder="analiza-zilnica-btc-..."
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Affiliate partner</span>
          <input
            value={affiliatePartner}
            onChange={(e) => setAffiliatePartner(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-slate-400">Affiliate URL</span>
          <input
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-black font-bold px-5 py-3 text-sm"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Salvează Terminal
      </button>
    </div>
  );
}
