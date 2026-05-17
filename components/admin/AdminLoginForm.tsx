'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError('Credențiale incorecte');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Nu s-a putut realiza autentificarea. Verifică configurarea Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="text-center mb-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-4">
          <Lock className="text-blue-400" size={22} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin</h1>
        <p className="text-slate-500 text-sm mt-2">Autentificare securizată Supabase</p>
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-center text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
        >
          {error}
        </p>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="admin@exemplu.ro"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Parolă
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#1c1c1e] px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors"
      >
        {isLoading && <Loader2 size={18} className="animate-spin" />}
        Login
      </button>
    </form>
  );
}
