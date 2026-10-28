import Image from 'next/image';
import Link from 'next/link';
import { authorByKey, type PersonAuthorKey } from '@/lib/authors';

export default function AuthorBox({ authorKey }: { authorKey: PersonAuthorKey }) {
  const author = authorByKey(authorKey);

  return (
    <aside className="my-10 flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      {author.photo ? (
        <Image
          src={author.photo}
          alt={author.photoAlt ?? author.name}
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full object-cover"
        />
      ) : null}
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Autor</p>
        <Link
          href={author.path}
          className="font-[var(--font-space)] text-base font-semibold text-white hover:text-blue-400"
        >
          {author.name}
        </Link>
        <p className="text-xs text-slate-500">{author.role}, Știrile Crypto</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{author.shortBio}</p>
        {author.consultancyUrl ? (
          <a
            href={author.consultancyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-slate-500 underline decoration-white/20 underline-offset-2 hover:text-white"
          >
            Consultanță
          </a>
        ) : null}
      </div>
    </aside>
  );
}
