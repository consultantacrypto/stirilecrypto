'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  AIRDROP_PROGRAM_STATUSES,
  AIRDROP_PROGRAM_TYPES,
  PROGRAM_STATUS_LABEL,
  PROGRAM_TYPE_LABEL,
  deadlinePhase,
  formatDeadlineRo,
  sourceHost,
  type AirdropAlert,
  type AirdropProgramStatus,
  type AirdropProgramType,
} from '@/lib/airdrop-alert';

type StatusFilter = 'all' | AirdropProgramStatus;
type TypeFilter = 'all' | AirdropProgramType;

const STATUS_CHIP: Record<AirdropProgramStatus, string> = {
  active: 'bg-emerald-400/15 text-emerald-200 ring-emerald-400/30',
  upcoming: 'bg-sky-400/15 text-sky-200 ring-sky-400/30',
  ended: 'bg-white/10 text-slate-300 ring-white/15',
};

function sources(item: AirdropAlert): string[] {
  return [item.sourceUrl, item.sourceUrlSecondary].filter((url): url is string => Boolean(url));
}

function SourceLinks({ item }: { item: AirdropAlert }) {
  return (
    <div className="flex flex-col gap-1">
      {sources(item).map((url) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-300 underline decoration-blue-300/30 underline-offset-4 hover:text-blue-200"
        >
          {sourceHost(url)}
          <ExternalLink size={12} aria-hidden />
          <span className="sr-only">, sursă pentru {item.name}</span>
        </a>
      ))}
    </div>
  );
}

function StatusChip({ status }: { status: AirdropProgramStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${STATUS_CHIP[status]}`}>
      {PROGRAM_STATUS_LABEL[status]}
    </span>
  );
}

function ProjectHeading({ item }: { item: AirdropAlert }) {
  const phase = item.deadlineAt ? deadlinePhase(item.deadlineAt) : null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="font-[var(--font-space)] text-base font-bold text-white">{item.name}</h2>
      <StatusChip status={item.programStatus} />
      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-slate-300 ring-1 ring-inset ring-white/10">
        {PROGRAM_TYPE_LABEL[item.programType]}
      </span>
      {item.riskLevel === 'higher' ? (
        <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-bold text-amber-200 ring-1 ring-inset ring-amber-400/30">
          Risc mai mare
        </span>
      ) : null}
      {phase === 'open' ? (
        <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[11px] font-bold text-rose-100 ring-1 ring-inset ring-rose-400/40">
          Termen scurt
        </span>
      ) : null}
      {phase === 'passed' ? (
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-bold text-slate-300 ring-1 ring-inset ring-white/15">
          Termenul a trecut
        </span>
      ) : null}
    </div>
  );
}

export default function AirdropAlertBoard({ items }: { items: AirdropAlert[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const openDeadlines = useMemo(
    () => items.filter((item) => item.deadlineAt && deadlinePhase(item.deadlineAt) === 'open'),
    [items],
  );

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (statusFilter !== 'all' && item.programStatus !== statusFilter) return false;
        if (typeFilter !== 'all' && item.programType !== typeFilter) return false;
        return true;
      }),
    [items, statusFilter, typeFilter],
  );

  return (
    <div>
      {openDeadlines.length > 0 ? (
        <div className="mb-8 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-200">Termen scurt</p>
          <ul className="mt-3 space-y-2">
            {openDeadlines.map((item) => (
              <li key={item.id} className="text-sm leading-relaxed text-rose-50">
                <span className="font-semibold">{item.name}:</span> termen{' '}
                {formatDeadlineRo(item.deadlineAt!)}. {item.note}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtru stare">
          <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>
            Toate
          </FilterChip>
          {AIRDROP_PROGRAM_STATUSES.map((status) => (
            <FilterChip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
              {PROGRAM_STATUS_LABEL[status]}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtru tip">
          <FilterChip active={typeFilter === 'all'} onClick={() => setTypeFilter('all')}>
            Orice tip
          </FilterChip>
          {AIRDROP_PROGRAM_TYPES.map((type) => (
            <FilterChip key={type} active={typeFilter === type} onClick={() => setTypeFilter(type)}>
              {PROGRAM_TYPE_LABEL[type]}
            </FilterChip>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {visible.length} {visible.length === 1 ? 'program' : 'programe'}
      </p>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
          Nimic în filtrul ăsta.
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li
              key={item.id}
              className={`rounded-2xl border bg-white/[0.03] p-4 sm:p-5 ${
                item.deadlineAt && deadlinePhase(item.deadlineAt) === 'open'
                  ? 'border-rose-400/40'
                  : 'border-white/10'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <ProjectHeading item={item} />
                  <p className="mt-2 text-sm text-slate-300">
                    <span className="font-semibold text-slate-500">TGE / fereastră: </span>
                    {item.windowLabel}
                  </p>
                  {item.note ? <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.note}</p> : null}
                </div>
                <SourceLinks item={item} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        active ? 'bg-white text-black' : 'bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}
