import Link from 'next/link';

export default function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = 'Vezi tot →',
}: {
  eyebrow: string;
  title?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/[0.08] pb-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9eb4f0]">{eyebrow}</p>
        {title ? (
          <h2 className="mt-1 font-[family-name:var(--font-space)] text-xl font-semibold leading-tight tracking-[-0.02em] text-white">
            {title}
          </h2>
        ) : null}
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-sm font-medium text-slate-300 hover:text-white">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
