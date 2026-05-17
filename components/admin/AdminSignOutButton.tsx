'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminSignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
      Deconectare
    </button>
  );
}
