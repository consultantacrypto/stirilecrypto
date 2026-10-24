'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail } from 'lucide-react';
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

  const inputClass =
    'rounded-xl border border-white/10 bg-black/40 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-60';

  const form = (
    <form onSubmit={handleSubmit} className={variant === 'compact' ? 'mt-3 flex flex-col gap-2 sm:flex-row' : 'flex w-full flex-col gap-3 sm:w-auto sm:flex-row'}>
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
        className={`${inputClass} ${variant === 'compact' ? 'h-10 px-3 text-sm sm:w-56' : 'h-12 flex-1 px-4 sm:w-64'}`}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition-all hover:bg-blue-500 disabled:bg-blue-600/60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden />
            Se înregistrează
          </>
        ) : (
          'Vreau emailul'
        )}
      </button>
    </form>
  );

  const body =
    status === 'success' ? (
      <p role="status" className="flex items-start gap-2 text-sm text-green-300">
        <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden />
        {message}
      </p>
    ) : (
      form
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
        <p className="font-[var(--font-space)] text-sm font-bold text-white">Știrile Crypto de dimineață</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-400">Un email pe zi. Îl poți opri oricând.</p>
        {body}
        {error}
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-label="Știrile Crypto de dimineață"
      className="my-8 scroll-mt-24 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md md:px-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/15">
            <Mail size={16} className="text-blue-400" aria-hidden />
          </div>
          <div>
            <h2 className="font-[var(--font-space)] text-base font-bold tracking-tight text-white">
              Știrile Crypto de dimineață
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              Un email pe zi, dimineața, cu ce contează în piață. Îl poți opri oricând.
            </p>
          </div>
        </div>
        <div className="shrink-0">
          {body}
          {error}
        </div>
      </div>
    </section>
  );
}
