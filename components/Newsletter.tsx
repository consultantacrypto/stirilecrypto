'use client';
import { Mail } from 'lucide-react';

/**
 * Unused stub. Do not mount: it simulates a successful subscribe without saving.
 * Public waitlist lives in `EmailCaptureBox`.
 */
export default function Newsletter() {
  return (
    <div className="w-full bg-[#0a0f1e] border border-blue-500/20 p-8 rounded-3xl my-16 text-center">
      <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
        <Mail size={14} /> Lista de așteptare
      </div>
      <p className="text-gray-400">Folosește formularul de pe pagină pentru înscriere.</p>
    </div>
  );
}
