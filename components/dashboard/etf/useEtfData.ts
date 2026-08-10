'use client';

import { useCallback, useEffect, useState } from 'react';
import { isStaleDate } from '@/lib/etf/format';
import type { EtfApiSuccess, EtfAssetSymbol, EtfPeriod, EtfSnapshot } from '@/lib/etf/types';

export interface UseEtfDataReturn {
  data: EtfSnapshot[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastUpdated: string | null;
  isStale: boolean;
}

export function useEtfData(asset: EtfAssetSymbol, period: EtfPeriod): UseEtfDataReturn {
  const [data, setData] = useState<EtfSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

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
    void fetchData();
  }, [fetchData]);

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
