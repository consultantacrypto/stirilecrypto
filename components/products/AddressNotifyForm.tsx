'use client';

import { useState, type FormEvent } from 'react';

const fieldClass =
  'w-full min-h-12 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-blue-500';

export default function AddressNotifyForm({ source }: { source: string | null }) {
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    setPending(true);
    try {
      const response = await fetch('/api/address-check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          consent,
          source: source ?? '',
          company: String(form.get('company_website') ?? ''),
        }),
      });
      const data = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setError(data.error || 'Nu am putut salva emailul.');
        return;
      }
      setMessage(data.message || 'Te anunțăm când verificarea este deschisă.');
      event.currentTarget.reset();
      setConsent(false);
    } catch {
      setError('Nu am putut salva emailul. Încearcă din nou.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div>
        <label htmlFor="address-email" className="mb-1.5 block text-sm font-medium text-slate-300">
          Email
        </label>
        <input id="address-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
      </div>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
        />
        <span>Vreau să primesc un email când verificarea de portofel este disponibilă.</span>
      </label>
      {error ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100 disabled:opacity-60"
      >
        {pending ? 'Se trimite…' : 'Anunță-mă'}
      </button>
      <p className="text-xs leading-relaxed text-slate-500">Nu se încasează nimic pe pagina aceasta.</p>
    </form>
  );
}
