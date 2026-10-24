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
}: {
  id?: string;
  location?: string;
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

  return (
    <section
      id={id}
      className="my-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:p-8 scroll-mt-24"
      aria-label="Știrile Crypto de dimineață"
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/15">
          <Mail size={18} className="text-blue-400" aria-hidden />
        </div>
        <div>
          <h2 className="font-[var(--font-space)] text-xl font-bold tracking-tight text-white md:text-2xl">
            Știrile Crypto de dimineață
          </h2>
          <p className="mt-2 font-[var(--font-inter)] text-sm leading-relaxed text-gray-400 md:text-base">
            Un email pe zi, dimineața, cu ce contează în piață. Îl poți opri oricând.
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
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
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-500 disabled:bg-blue-600/60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                  Se înregistrează...
                </>
              ) : (
                'Vreau emailul de dimineață'
              )}
            </button>
          </div>
          {status === 'error' && message ? (
            <p role="alert" className="flex items-center gap-2 text-sm text-red-300">
              <AlertCircle size={16} className="shrink-0" aria-hidden />
              {message}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}