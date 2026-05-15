"use client";
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
        setStatus('success');
        setEmail('');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="w-full bg-green-900/10 border border-green-500/30 p-8 rounded-3xl text-center my-12">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Te-ai abonat cu succes! 🚀</h3>
        <p className="text-gray-400">Bine ai venit în Alpha Group.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0a0f1e] border border-blue-500/20 p-8 md:p-12 rounded-3xl my-16 text-center relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <Mail size={14} /> Newsletter Privat
        </div>
        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">Nu rata următorul Alpha</h3>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">Primește analizele mele direct în inbox. Fără spam.</p>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Email-ul tău..." 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl focus:border-blue-500 outline-none"
          />
          <button type="submit" disabled={status === 'loading'} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all">
            {status === 'loading' ? '...' : <ArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
}