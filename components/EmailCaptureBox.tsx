'use client';

import { useState } from 'react';
import { Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

type EmailCaptureBoxProps = {
  id?: string;
  location?: string;
};

const WAITLIST_SUCCESS = 'Înscrierea pe lista de așteptare a fost înregistrată.';
const WAITLIST_DUPLICATE = 'Această adresă este deja pe lista de așteptare.';

export default function EmailCaptureBox({
  id,
  location = 'article_inline',
}: EmailCaptureBoxProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
        alreadySubscribed?: boolean;
      };

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error ?? 'Nu am putut înregistra înscrierea. Încearcă din nou.');
        return;
      }

      if (data.alreadySubscribed) {
        setStatus('success');
        setMessage(data.message ?? WAITLIST_DUPLICATE);
        return;
      }

      setStatus('success');
      setMessage(data.message ?? WAITLIST_SUCCESS);
      trackEvent('newsletter_subscribe', {
        location,
        page: window.location.pathname,
        waitlist: true,
      });
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Conexiune eșuată. Verifică rețeaua și încearcă din nou.');
    }
  };

  return (
    <section
      id={id}
      className="my-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 scroll-mt-24"
      aria-label="Lista de așteptare"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/25">
          <Mail size={18} className="text-blue-400" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white font-[var(--font-space)] tracking-tight">
            Lista de așteptare
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-400 leading-relaxed font-[var(--font-inter)]">
            Newsletterul nu este încă activ. Poți lăsa emailul pentru lista de așteptare; nu
            trimitem mesaje în acest moment.
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm font-[var(--font-inter)]"
        >
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" aria-hidden />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="waitlist-email" className="sr-only">
              Email
            </label>
            <input
              id="waitlist-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              required
              autoComplete="email"
              placeholder="email@exemplu.ro"
              disabled={status === 'loading'}
              className="flex-1 bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-colors font-[var(--font-inter)] placeholder:text-gray-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/60 font-bold px-6 py-3 rounded-xl transition-all text-white shrink-0 font-[var(--font-inter)] min-h-12"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                  Se înregistrează...
                </>
              ) : (
                'Înscrie-te pe listă'
              )}
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
        </form>
      )}
    </section>
  );
}
