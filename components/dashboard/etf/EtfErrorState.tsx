interface EtfErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function EtfErrorState({ error, onRetry }: EtfErrorStateProps) {
  return (
    <div className="glass-card rounded-xl border border-red-500/30 p-5 text-center">
      <p className="mb-3 text-sm text-red-300 font-[var(--font-inter)]">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        Reîncarcă datele
      </button>
    </div>
  );
}
