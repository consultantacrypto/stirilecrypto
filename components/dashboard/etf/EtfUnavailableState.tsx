interface EtfUnavailableStateProps {
  message?: string;
  onRetry?: () => void;
}

export function EtfUnavailableState({
  message = 'Date indisponibile',
  onRetry,
}: EtfUnavailableStateProps) {
  return (
    <div className="glass-card rounded-xl border border-white/10 p-5 text-center">
      <p className="text-sm text-slate-400 font-[var(--font-inter)]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          Reîncearcă
        </button>
      ) : null}
    </div>
  );
}
