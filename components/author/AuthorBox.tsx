import Image from 'next/image';
import Link from 'next/link';
import { DANIEL_MIHAI } from '@/lib/authors';

export default function AuthorBox() {
  return (
    <aside className="my-10 flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <Image
        src={DANIEL_MIHAI.photo}
        alt={DANIEL_MIHAI.photoAlt}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Autor</p>
        <Link
          href={DANIEL_MIHAI.path}
          className="font-[var(--font-space)] text-base font-semibold text-white hover:text-blue-400"
        >
          {DANIEL_MIHAI.name}
        </Link>
        <p className="text-xs text-slate-500">{DANIEL_MIHAI.role}, Știrile Crypto</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{DANIEL_MIHAI.shortBio}</p>
        <a
          href={DANIEL_MIHAI.consultancyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-slate-500 underline decoration-white/20 underline-offset-2 hover:text-white"
        >
          Consultanță
        </a>
      </div>
    </aside>
  );
}
