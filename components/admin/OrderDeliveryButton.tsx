'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DELIVERY_COPY, type DeliveryTarget } from '@/lib/admin/inquiry-delivery';

type OrderDeliveryButtonProps = {
  id: string;
  status: string | null;
  enabled: boolean;
};

export default function OrderDeliveryButton({ id, status, enabled }: OrderDeliveryButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const delivered = status === 'delivered';
  const nextStatus: DeliveryTarget = delivered ? 'pending' : 'delivered';

  async function onClick() {
    if (!enabled || pending) return;
    const confirmed = window.confirm(
      delivered ? DELIVERY_COPY.confirmUndo : DELIVERY_COPY.confirmDelivered,
    );
    if (!confirmed) return;

    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/comenzi/livrare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, delivery_status: nextStatus }),
      });
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        setError(payload?.error || DELIVERY_COPY.saveFailed);
        return;
      }
      router.refresh();
    } catch {
      setError(DELIVERY_COPY.saveFailed);
    } finally {
      setPending(false);
    }
  }

  const label = pending ? DELIVERY_COPY.saving : delivered ? DELIVERY_COPY.undo : DELIVERY_COPY.mark;

  return (
    <div className="min-w-[9.5rem]">
      <button
        type="button"
        onClick={onClick}
        disabled={!enabled || pending}
        title={enabled ? undefined : DELIVERY_COPY.missingColumns}
        className={`rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/15 disabled:hover:bg-white/5 ${
          delivered
            ? 'hover:border-amber-400/50 hover:bg-amber-500/10'
            : 'hover:border-emerald-400/50 hover:bg-emerald-500/10'
        }`}
      >
        {label}
      </button>
      {error ? <p className="mt-1 max-w-[14rem] text-xs leading-snug text-red-300">{error}</p> : null}
    </div>
  );
}
