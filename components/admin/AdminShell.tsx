import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminSignOutButton from '@/components/admin/AdminSignOutButton';

type AdminShellProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
};

export default function AdminShell({
  title,
  subtitle = 'Admin Panel',
  backHref = '/admin',
  backLabel = 'Dashboard',
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <header className="border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-blue-400 mb-1">
              {subtitle}
            </p>
            <h1 className="text-2xl font-bold tracking-tight font-[var(--font-space)]">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-[var(--font-inter)]"
            >
              <ArrowLeft size={16} />
              {backLabel}
            </Link>
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors font-[var(--font-inter)]"
            >
              Site
            </Link>
            <AdminSignOutButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-10 lg:py-14">{children}</div>
    </main>
  );
}
