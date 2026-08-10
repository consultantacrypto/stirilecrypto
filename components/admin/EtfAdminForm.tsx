'use client';

import { useCallback, useEffect, useState } from 'react';
import type { EtfAssetSymbol, EtfSnapshot } from '@/lib/etf/types';
import { formatFlowMillions } from '@/lib/etf/format';

interface FormState {
  asset: EtfAssetSymbol;
  snapshot_date: string;
  net_flow_m: string;
  aum_b: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function EtfAdminForm() {
  const [form, setForm] = useState<FormState>({
    asset: 'BTC',
    snapshot_date: todayIso(),
    net_flow_m: '',
    aum_b: '',
  });
  const [recent, setRecent] = useState<EtfSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const fetchRecent = useCallback(async (asset: EtfAssetSymbol) => {
    try {
      const res = await fetch(`/api/etf?asset=${asset}&period=10d`, { cache: 'no-store' });
      const json = (await res.json()) as {
        success: boolean;
        data?: EtfSnapshot[];
      };
      if (json.success && json.data) {
        setRecent([...json.data].reverse().slice(0, 8));
      }
    } catch {
      // non-blocking
    }
  }, []);

  useEffect(() => {
    void fetchRecent(form.asset);
  }, [form.asset, fetchRecent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/etf/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: form.asset,
          snapshot_date: form.snapshot_date,
          net_flow_m: Number(form.net_flow_m),
          aum_b: form.aum_b.trim() ? Number(form.aum_b) : undefined,
        }),
      });

      const json = (await res.json()) as { success: boolean; error?: string; message?: string };

      if (!res.ok || !json.success) {
        setMessage({ tone: 'err', text: json.error ?? 'Salvare eșuată' });
        return;
      }

      setMessage({ tone: 'ok', text: 'Salvat cu succes în etf_snapshots.' });
      setForm((prev) => ({ ...prev, net_flow_m: '', aum_b: '' }));
      await fetchRecent(form.asset);
    } catch {
      setMessage({ tone: 'err', text: 'Eroare de rețea' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {message ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.tone === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="glass-card space-y-4 rounded-2xl border border-white/10 p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">Asset</label>
          <select
            value={form.asset}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, asset: e.target.value as EtfAssetSymbol }))
            }
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-violet-500"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">Data</label>
          <input
            type="date"
            value={form.snapshot_date}
            max={todayIso()}
            onChange={(e) => setForm((prev) => ({ ...prev, snapshot_date: e.target.value }))}
            required
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            Net Flow ($M) — negativ pentru outflow
          </label>
          <input
            type="number"
            step="0.1"
            value={form.net_flow_m}
            onChange={(e) => setForm((prev) => ({ ...prev, net_flow_m: e.target.value }))}
            placeholder="ex: 125.5 sau -45.2"
            required
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300">
            AUM ($B) — opțional
          </label>
          <input
            type="number"
            step="0.01"
            value={form.aum_b}
            onChange={(e) => setForm((prev) => ({ ...prev, aum_b: e.target.value }))}
            placeholder="ex: 45.3"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 font-bold text-white transition hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? 'Se salvează…' : 'Salvează în DB'}
        </button>
      </form>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-white">Ultimele intrări ({form.asset})</h2>
        <div className="space-y-2">
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">Nicio intrare recentă.</p>
          ) : (
            recent.map((row) => (
              <div
                key={row.id}
                className="glass-card flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"
              >
                <div>
                  <p className="font-mono text-sm text-slate-300">{row.snapshot_date}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{row.source}</p>
                </div>
                <span
                  className={`font-bold tabular-nums ${
                    row.net_flow_usd >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {formatFlowMillions(row.net_flow_usd)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
