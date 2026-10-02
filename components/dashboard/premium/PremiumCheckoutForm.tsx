import { AlertCircle } from 'lucide-react';

export default function PremiumCheckoutForm() {
  return (
    <div
      role="status"
      className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-4 text-sm text-amber-100 font-[var(--font-inter)]"
    >
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-400" aria-hidden />
        <div>
          <p className="font-semibold text-white">Comenzile sunt temporar indisponibile</p>
          <p className="mt-1 text-slate-300">
            Plățile și livrarea nu sunt active. Nu se înregistrează comenzi noi.
          </p>
        </div>
      </div>
    </div>
  );
}
