import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  default: 'border-white/10 bg-white/5 text-slate-200',
  positive: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  negative: 'border-red-500/20 bg-red-500/10 text-red-400',
  outline: 'border-white/15 bg-transparent text-slate-300',
} as const;

export type BadgeVariant = keyof typeof variants;

export function Badge({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
