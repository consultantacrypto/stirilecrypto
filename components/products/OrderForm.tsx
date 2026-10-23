'use client';

import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { validateOrder, type RiskConcern } from '@/lib/products/intake';

const CONCERNS: { id: RiskConcern; label: string }[] = [
  { id: 'dump', label: 'Dump / vânzare bruscă' },
  { id: 'unlocks', label: 'Deblocări și inflație' },
  { id: 'liquidity', label: 'Lichiditate' },
  { id: 'scam', label: 'Scam / contract' },
  { id: 'team', label: 'Echipă și transparență' },
];

const fieldClass =
  'w-full min-h-12 rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none focus:border-sky-400/70';

interface OrderFormProps {
  product: 'ta_mtf' | 'risk_report';
  chargeTa: boolean;
  chargeRisk: boolean;
  taPriceRon: number;
  riskPriceRon: number;
  riskPriceConfirmed: boolean;
  bundlePriceRon: number;
  bundlePriceConfirmed: boolean;
  deliveryLabel: string;
}

export default function OrderForm(props: OrderFormProps) {
  const [bundle, setBundle] = useState(false);
  const [holds, setHolds] = useState<boolean | null>(null);
  const [concerns, setConcerns] = useState<RiskConcern[]>([]);
  const [nativeAsset, setNativeAsset] = useState(false);
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canPay = useMemo(() => {
    const wantsTa = props.product === 'ta_mtf' || bundle;
    const wantsRisk = props.product === 'risk_report' || bundle;
    return (!wantsTa || props.chargeTa) && (!wantsRisk || props.chargeRisk);
  }, [bundle, props.chargeRisk, props.chargeTa, props.product]);

  function toggleConcern(id: RiskConcern) {
    setConcerns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      intent: canPay ? 'pay' : 'waitlist',
      product: props.product,
      bundle,
      email: String(form.get('email') ?? ''),
      consent,
      asset: String(form.get('asset') ?? ''),
      question: String(form.get('question') ?? ''),
      coin: String(form.get('coin') ?? ''),
      ticker: String(form.get('ticker') ?? ''),
      network: String(form.get('network') ?? ''),
      contractAddress: String(form.get('contractAddress') ?? ''),
      nativeAsset,
      why: String(form.get('why') ?? ''),
      holds,
      entryPrice: String(form.get('entryPrice') ?? ''),
      horizon: String(form.get('horizon') ?? ''),
      concerns,
      questions: String(form.get('questions') ?? ''),
      delivery: String(form.get('delivery') ?? ''),
      company: String(form.get('company_website') ?? ''),
    };

    const validated = validateOrder(payload);
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setPending(true);
    try {
      const response = await fetch('/api/premium/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; message?: string; mode?: string; url?: string };
      if (!response.ok) {
        setError(data.error || 'Nu am putut trimite cererea.');
        return;
      }
      if (data.mode === 'checkout' && data.url) {
        window.location.assign(data.url);
        return;
      }
      setMessage(data.message || 'Cererea a fost înregistrată. Nu s-a încasat nimic.');
    } catch {
      setError('Nu am putut trimite cererea. Încearcă din nou.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
        {canPay ? (
          <p>Plata se face pe pagina securizată Stripe. Livrarea rămâne manuală.</p>
        ) : (
          <p>
            <span className="font-semibold text-white">Disponibil în curând.</span> Plățile sunt oprite.
            Poți lăsa cererea pe lista de așteptare, fără să plătești.
          </p>
        )}
        <p className="mt-1 text-slate-500">Livrare orientativă: {props.deliveryLabel}.</p>
      </div>

      {props.product === 'ta_mtf' ? (
        <>
          <Field label="Simbolul activului" htmlFor="asset">
            <input id="asset" name="asset" required maxLength={12} placeholder="BTC" className={fieldClass} />
          </Field>
          <Field label="Întrebare (opțional)" htmlFor="question">
            <textarea id="question" name="question" maxLength={1000} rows={3} className={fieldClass} />
          </Field>
        </>
      ) : null}

      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={bundle}
          onChange={(event) => setBundle(event.target.checked)}
        />
        <span>
          {props.product === 'ta_mtf'
            ? `Adaugă și raportul de risc (${props.riskPriceRon} RON${props.riskPriceConfirmed ? '' : ', preț de confirmat'})`
            : `Adaugă și analiza tehnică multi-timeframe (${props.taPriceRon} RON)`}
          {bundle ? (
            <span className="mt-1 block text-slate-500">
              Pachet orientativ: {props.bundlePriceRon} RON
              {props.bundlePriceConfirmed ? '' : ' — preț de confirmat'}.
            </span>
          ) : null}
        </span>
      </label>

      {props.product === 'risk_report' || bundle ? <RiskFields holds={holds} setHolds={setHolds} concerns={concerns} toggleConcern={toggleConcern} nativeAsset={nativeAsset} setNativeAsset={setNativeAsset} showAsset={props.product === 'risk_report' && bundle} /> : null}

      <Field label="Email" htmlFor="email">
        <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
      </Field>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
        />
        <span>
          Sunt de acord cu executarea imediată a conținutului digital și confirm că îmi pierd dreptul de
          retragere în 14 zile, conform art. 16 lit. m) din OUG nr. 34/2014.
        </span>
      </label>

      <p className="text-xs leading-relaxed text-slate-500">
        Material educațional, nu o recomandare de investiții personalizată și fără apeluri de cumpărare
        sau de vânzare.
      </p>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-bold text-black hover:bg-slate-100 disabled:opacity-60"
      >
        {pending ? 'Se trimite…' : canPay ? 'Continuă către plată' : 'Înscrie-te pe lista de așteptare'}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function RiskFields({
  holds,
  setHolds,
  concerns,
  toggleConcern,
  nativeAsset,
  setNativeAsset,
  showAsset,
}: {
  holds: boolean | null;
  setHolds: (value: boolean) => void;
  concerns: RiskConcern[];
  toggleConcern: (id: RiskConcern) => void;
  nativeAsset: boolean;
  setNativeAsset: (value: boolean) => void;
  showAsset: boolean;
}) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-white/10 p-4">
      <legend className="px-1 text-sm font-semibold text-white">Despre monedă</legend>
      <Field label="Numele monedei" htmlFor="coin">
        <input id="coin" name="coin" required maxLength={80} className={fieldClass} />
      </Field>
      <Field label="Ticker" htmlFor="ticker">
        <input id="ticker" name="ticker" required maxLength={12} placeholder="XMPL" className={fieldClass} />
      </Field>
      {showAsset ? (
        <Field label="Simbol pentru analiza tehnică (opțional, altfel folosim ticker-ul)" htmlFor="asset">
          <input id="asset" name="asset" maxLength={12} className={fieldClass} />
        </Field>
      ) : null}
      <Field label="Rețea" htmlFor="network">
        <input id="network" name="network" required maxLength={40} placeholder="Ethereum, Solana, Bitcoin" className={fieldClass} />
      </Field>
      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={nativeAsset}
          onChange={(event) => setNativeAsset(event.target.checked)}
        />
        <span>Activ nativ, fără contract (de exemplu BTC sau ETH).</span>
      </label>
      {nativeAsset ? null : (
        <Field label="Adresa contractului" htmlFor="contractAddress">
          <input id="contractAddress" name="contractAddress" maxLength={128} className={fieldClass} />
        </Field>
      )}
      <Field label="De ce te interesează" htmlFor="why">
        <textarea id="why" name="why" required minLength={20} maxLength={2000} rows={3} className={fieldClass} />
      </Field>
      <fieldset>
        <legend className="mb-2 text-sm text-slate-300">Deții deja moneda?</legend>
        <div className="flex gap-4 text-sm text-slate-300">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="holds-ui" checked={holds === true} onChange={() => setHolds(true)} />
            Da
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="holds-ui" checked={holds === false} onChange={() => setHolds(false)} />
            Nu
          </label>
        </div>
      </fieldset>
      {holds ? (
        <Field label="Preț aproximativ de intrare (opțional)" htmlFor="entryPrice">
          <input id="entryPrice" name="entryPrice" maxLength={40} className={fieldClass} />
        </Field>
      ) : null}
      <Field label="Orizont" htmlFor="horizon">
        <select id="horizon" name="horizon" required defaultValue="" className={fieldClass}>
          <option value="" disabled>
            Alege
          </option>
          <option value="days">Zile</option>
          <option value="weeks">Săptămâni</option>
          <option value="months">Luni</option>
        </select>
      </Field>
      <fieldset>
        <legend className="mb-2 text-sm text-slate-300">Principalele îngrijorări</legend>
        <div className="space-y-2">
          {CONCERNS.map((item) => (
            <label key={item.id} className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={concerns.includes(item.id)}
                onChange={() => toggleConcern(item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Întrebări specifice (opțional)" htmlFor="questions">
        <textarea id="questions" name="questions" maxLength={2000} rows={3} className={fieldClass} />
      </Field>
      <fieldset>
        <legend className="mb-2 text-sm text-slate-300">Livrare preferată</legend>
        <div className="flex gap-4 text-sm text-slate-300">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="delivery" value="email" defaultChecked />
            Email
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="delivery" value="pdf" />
            PDF
          </label>
        </div>
      </fieldset>
    </fieldset>
  );
}
