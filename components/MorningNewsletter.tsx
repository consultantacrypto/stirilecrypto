'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const SUCCESS = 'Ești înscris la Știrile Crypto de dimineață.';
const DUPLICATE = 'Această adresă primește deja emailul de dimineață.';

export default function MorningNewsletter({
  id = 'newsletter',
  location = 'homepage',
  variant = 'band',
}: {
  id?: string;
  location?: string;
  variant?: 'band' | 'compact';
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, list: 'dimineata' }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
        alreadySubscribed?: boolean;
      };

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Nu am putut înregistra înscrierea. Încearcă din nou.');
        return;
      }

      setStatus('success');
      setMessage(data.alreadySubscribed ? data.message ?? DUPLICATE : data.message ?? SUCCESS);
      if (!data.alreadySubscribed) {
        trackEvent('newsletter_subscribe', {
          location,
          page: window.location.pathname,
          list: 'dimineata',
        });
      }
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Conexiune eșuată. Verifică rețeaua și încearcă din nou.');
    }
  }

  const field = (
    <form onSubmit={handleSubmit} className={variant === 'band' ? 'flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center' : 'mt-3 flex flex-col gap-2 sm:flex-row'}>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email
      </label>
      <input
        id={`${id}-email`}
        type="email"
        name="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (status === 'error') setStatus('idle');
        }}
        required
        autoComplete="email"
        placeholder="email@exemplu.ro"
        disabled={status === 'loading'}
        className="h-10 w-full rounded-md border border-white/[0.08] bg-black/40 px-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#3e6ae1] disabled:opacity-60 sm:w-64"
      />
      <button type="submit" disabled={status === 'loading'} className="btn-primary whitespace-nowrap">
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" aria-hidden />
            Se înregistrează
          </>
        ) : (
          'Vreau emailul'
        )}
      </button>
    </form>
  );

  const statusBlock =
    status === 'success' ? (
      <p role="status" className="flex items-center gap-2 text-sm text-slate-200">
        <CheckCircle2 size={16} className="shrink-0 text-emerald-400" aria-hidden />
        {message}
      </p>
    ) : (
      field
    );

  const error =
    status === 'error' && message ? (
      <p role="alert" className="mt-2 flex items-center gap-2 text-sm text-red-300">
        <AlertCircle size={16} className="shrink-0" aria-hidden />
        {message}
      </p>
    ) : null;

  if (variant === 'compact') {
    return (
      <section id={id} aria-label="Știrile Crypto de dimineață" className="scroll-mt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9eb4f0]">Dimineața</p>
        <p className="mt-1 text-sm leading-snug text-slate-300">Știrile Crypto de dimineață. Un email pe zi.</p>
        {statusBlock}
        {error}
      </section>
    );
  }

  return (
    <section id={id} aria-label="Știrile Crypto de dimineață" className="scroll-mt-24 border-y border-white/[0.08] bg-white/[0.02]">
      <div className="site-wrap flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9eb4f0]">Dimineața</p>
          <p className="mt-1 text-sm text-slate-200">
            <span className="font-medium text-white">Știrile Crypto de dimineață.</span> Un email pe zi, cu ce contează în piață.
          </p>
        </div>
        <div className="shrink-0">
          {statusBlock}
          {error}
        </div>
      </div>
    </section>
  );
}
