'use client';

import type { EtfPeriod } from '@/lib/etf/types';

const PERIODS: { value: EtfPeriod; label: string }[] = [
  { value: '5d', label: '5z' },
  { value: '10d', label: '10z' },
  { value: '30d', label: '30z' },
  { value: 'ytd', label: 'YTD' },
];

interface EtfPeriodSelectorProps {
  period: EtfPeriod;
  onChange: (period: EtfPeriod) => void;
}

export function EtfPeriodSelector({ period, onChange }: EtfPeriodSelectorProps) {
  return (
    <div
      className="flex gap-1 rounded-lg border border-white/10 bg-black/40 p-1"
      role="group"
      aria-label="Perioadă ETF"
    >
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={`min-h-10 rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            period === p.value
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
