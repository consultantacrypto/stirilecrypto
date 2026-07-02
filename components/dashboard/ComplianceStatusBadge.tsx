import { Badge } from '@/components/ui/badge';
import type { MicaComplianceStatus } from '@/lib/types/dashboard';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<
  MicaComplianceStatus,
  { label: string; className: string }
> = {
  safe: {
    label: 'Safe',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  },
  risky: {
    label: 'Risky',
    className: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  },
  banned: {
    label: 'Banned',
    className: 'border-red-500/30 bg-red-500/10 text-red-300',
  },
  transitional: {
    label: 'Transitional',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
};

export default function ComplianceStatusBadge({
  status,
  className,
}: {
  status: MicaComplianceStatus;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge className={cn('uppercase tracking-wider text-[10px]', config.className, className)}>
      {config.label}
    </Badge>
  );
}
