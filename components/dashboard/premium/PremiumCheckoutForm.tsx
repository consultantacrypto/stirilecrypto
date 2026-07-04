'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, CreditCard, Loader2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';
type PaymentProvider = 'stripe' | 'binance_pay';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TICKER_REGEX = /^[A-Za-z0-9]{2,12}$/;

export default function PremiumCheckoutForm() {
  const [ticker, setTicker] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ ticker?: string; email?: string }>({});

  function validate(): boolean {
    const errors: { ticker?: string; email?: string } = {};
    const normalizedTicker = ticker.trim().toUpperCase();

    if (!TICKER_REGEX.test(normalizedTicker)) {
      errors.ticker = 'Ticker invalid (2–12 caractere alfanumerice).';
    }

    if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      errors.email = 'Introdu o adresă de email validă.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCheckout(provider: PaymentProvider) {
    if (status === 'loading') return;

    if (!validate()) {
      setStatus('error');
      setMessage('Verifică câmpurile marcate.');
      return;
    }

    setStatus('loading');
    setMessage('');

    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag!('event', 'begin_checkout', {
        currency: 'RON',
        value: 100,
        items: [
          {
            item_name: 'Analiză Tehnică Premium On-Demand',
            item_id: `premium_ta_${provider}`,
          },
        ],
      });
    }

    try {
      const res = await fetch('/api/premium/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: ticker.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          payment_provider: provider,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Nu am putut procesa comanda.');
        return;
      }

      setStatus('success');
      setMessage(data.message ?? 'Comanda a fost înregistrată cu succes.');
    } catch {
      setStatus('error');
      setMessage('Conexiune eșuată. Verifică rețeaua și încearcă din nou.');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300 font-[var(--font-inter)]"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold text-white">Comandă înregistrată</p>
            <p className="mt-1">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="premium-ticker"
          className="block text-xs font-bold uppercase tracking-widest text-slate-400 font-[var(--font-space)]"
        >
          Asset Ticker
        </label>
        <input
          id="premium-ticker"
          name="ticker"
          type="text"
          value={ticker}
          onChange={(e) => {
            setTicker(e.target.value.toUpperCase());
            if (fieldErrors.ticker) setFieldErrors((prev) => ({ ...prev, ticker: undefined }));
            if (status === 'error') setStatus('idle');
          }}
          placeholder="BTC, ETH, SOL..."
          autoComplete="off"
          disabled={status === 'loading'}
          className={cn(
            'w-full rounded-xl border bg-black/40 px-4 py-3 text-base text-white outline-none transition-colors font-[var(--font-inter)] placeholder:text-gray-500 disabled:opacity-60',
            fieldErrors.ticker
              ? 'border-red-500/50 focus:border-red-400'
              : 'border-white/10 focus:border-amber-500/60',
          )}
        />
        {fieldErrors.ticker ? (
          <p role="alert" className="text-xs text-red-400 font-[var(--font-inter)]">
            {fieldErrors.ticker}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="premium-email"
          className="block text-xs font-bold uppercase tracking-widest text-slate-400 font-[var(--font-space)]"
        >
          Email
        </label>
        <input
          id="premium-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
            if (status === 'error') setStatus('idle');
          }}
          placeholder="email@exemplu.ro"
          autoComplete="email"
          disabled={status === 'loading'}
          className={cn(
            'w-full rounded-xl border bg-black/40 px-4 py-3 text-base text-white outline-none transition-colors font-[var(--font-inter)] placeholder:text-gray-500 disabled:opacity-60',
            fieldErrors.email
              ? 'border-red-500/50 focus:border-red-400'
              : 'border-white/10 focus:border-amber-500/60',
          )}
        />
        {fieldErrors.email ? (
          <p role="alert" className="text-xs text-red-400 font-[var(--font-inter)]">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => handleCheckout('stripe')}
          disabled={status === 'loading'}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-4 py-3.5 text-sm font-bold text-white transition-all hover:border-indigo-400/50 hover:bg-indigo-500/25 disabled:opacity-60 font-[var(--font-inter)]"
        >
          {status === 'loading' ? (
            <Loader2 size={18} className="animate-spin" aria-hidden />
          ) : (
            <CreditCard size={18} aria-hidden />
          )}
          Plătește cu Stripe
        </button>
        <button
          type="button"
          onClick={() => handleCheckout('binance_pay')}
          disabled={status === 'loading'}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#f7a600]/30 bg-[#f7a600]/10 px-4 py-3.5 text-sm font-bold text-white transition-all hover:border-[#f7a600]/50 hover:bg-[#f7a600]/20 disabled:opacity-60 font-[var(--font-inter)]"
        >
          {status === 'loading' ? (
            <Loader2 size={18} className="animate-spin" aria-hidden />
          ) : (
            <Wallet size={18} className="text-[#f7a600]" aria-hidden />
          )}
          Binance Pay
        </button>
      </div>

      {status === 'error' && message ? (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-red-300 font-[var(--font-inter)]"
        >
          <AlertCircle size={16} className="shrink-0" aria-hidden />
          {message}
        </p>
      ) : null}

      <p className="text-[11px] leading-relaxed text-slate-500 font-[var(--font-inter)]">
        Prin continuare, accepți procesarea comenzii. Plata finală va fi activată în Phase 3
        (Stripe / Binance Pay redirect).
      </p>
    </div>
  );
}
