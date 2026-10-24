'use client';

import { useCallback, useEffect, useState } from 'react';
import { isStaleDate } from '@/lib/etf/format';
import type { EtfApiSuccess, EtfAssetSymbol, EtfInitialSeries, EtfPeriod, EtfSnapshot } from '@/lib/etf/types';

function seededRows(asset: EtfAssetSymbol, period: EtfPeriod, initial?: EtfInitialSeries): EtfSnapshot[] | null {
  if (!initial || initial.period !== period) return null;
  return asset === 'BTC' ? initial.btc : initial.eth;
}

export interface UseEtfDataReturn {
  data: EtfSnapshot[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: string | null;
  isStale: boolean;
}

export function useEtfData(
  asset: EtfAssetSymbol,
  period: EtfPeriod,
  initial?: EtfInitialSeries,
): UseEtfDataReturn {
  const seed = seededRows(asset, period, initial);
  const [data, setData] = useState<EtfSnapshot[]>(seed ?? []);
  const [loading, setLoading] = useState(seed == null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(seed?.at(-1)?.snapshot_date ?? null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/etf?asset=${asset}&period=${period}`, {
        cache: 'no-store',
      });
      const json = (await res.json()) as EtfApiSuccess | { success: false; error?: string };
      if (!res.ok || !json.success) {
        setError(!json.success ? json.error || 'Eroare necunoscută' : 'Eroare necunoscută');
        setData([]);
        setLastUpdated(null);
        return;
      }
      setData(json.data);
      setLastUpdated(json.lastUpdated);
    } catch {
      setError('Eroare de rețea');
      setData([]);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, [asset, period]);

  useEffect(() => {
    const rows = seededRows(asset, period, initial);
    if (rows) {
      setData(rows);
      setLastUpdated(rows.at(-1)?.snapshot_date ?? null);
      setError(null);
      setLoading(false);
      return;
    }
    void fetchData();
  }, [asset, period, initial, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: () => {
      void fetchData();
    },
    lastUpdated,
    isStale: isStaleDate(lastUpdated, 3),
  };
}
