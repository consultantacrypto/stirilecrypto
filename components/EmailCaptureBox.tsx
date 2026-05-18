'use client';

import { useState } from 'react';
import { Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function EmailCaptureBox() {
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
        setMessage(data.error ?? 'A apărut o eroare. Încearcă din nou.');
        return;
      }

      setStatus('success');
      setMessage(data.message ?? 'Te-ai abonat cu succes!');
      if (!data.alreadySubscribed) {
        setEmail('');
      }
    } catch {
      setStatus('error');
      setMessage('Conexiune eșuată. Verifică rețeaua și încearcă din nou.');
    }
  };

  return (
    <section
      className="my-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8"
      aria-label="Abonare newsletter"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 border border-blue-500/25">
          <Mail size={18} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-[var(--font-space)] tracking-tight">
            Rămâi în fața pieței
          </h3>
          <p className="mt-2 text-sm md:text-base text-gray-400 leading-relaxed font-[var(--font-inter)]">
            Alătură-te comunității și primește analize exclusive, alerte de lichiditate și
            oportunități crypto direct în inbox.
          </p>
        </div>
      </div>

      {status === 'success' ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm font-[var(--font-inter)]"
        >
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
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
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/60 font-bold px-6 py-3 rounded-xl transition-all text-white shrink-0 font-[var(--font-inter)]"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Se trimite...
                </>
              ) : (
                'Abonează-te'
              )}
            </button>
          </div>

          {status === 'error' && message ? (
            <p
              role="alert"
              className="flex items-center gap-2 text-sm text-red-300 font-[var(--font-inter)]"
            >
              <AlertCircle size={16} className="shrink-0" />
              {message}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
