const SCORES = [
  ['Lichiditate', '58', 'Volum și adâncime de ordin inventate; lichiditate DEX fictivă de 1,2 mil. USD.'],
  ['Calitatea listărilor', '41', 'Lipsește de pe bursele tier-1 în acest exemplu. Listat doar pe „Exemplu Exchange”.'],
  ['Deținători', '33', 'Portofelul Exemplu-1 are 18%, trezoreria 9%, un portofel de bursă 7%. Cifre inventate.'],
  ['Tokenomics', '46', 'Deblocare fictivă de 2% în ziua 9. Inflație anuală ilustrativă: 11%.'],
  ['Risc de dump', '62', 'Concentrare mare în mostră. Nu înseamnă că un activ real arată la fel.'],
  ['Semnale pump-and-dump', '55', 'Creștere ilustrativă de volum fără știre. Semnal de urmărit, nu un verdict.'],
  ['Contract / securitate', '70', 'Fără funcție de mint în exemplul acesta. Nu este un audit.'],
  ['Transparența echipei', '38', 'Echipă pseudonimă în scenariul fictiv. Fără documente publice inventate ca reale.'],
] as const;

export default function RiskSample() {
  return (
    <section aria-label="Exemplu de raport cu date fictive" className="mt-12">
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        Exemplu cu date fictive. Exemplum (XMPL), rețeaua Exemplaris și adresa 0xEXMPL0000000000000000000000000000000
        nu există. Scorurile nu descriu niciun activ real și nu sunt recomandări de cumpărare sau de vânzare.
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 p-4 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Mostră de raport</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[var(--font-space)] text-2xl font-bold text-white">Exemplum · XMPL</h2>
            <p className="mt-1 text-sm text-slate-400">Rețea Exemplaris · activ inventat · orizont de urmărit: 14 zile</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Scor de risc</p>
            <p className="font-[var(--font-space)] text-4xl font-black tabular-nums text-white">64</p>
            <p className="text-xs text-slate-500">din 100, doar în acest exemplu</p>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-white/10">
          {SCORES.map(([label, score, note]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[180px_48px_1fr] sm:gap-4">
              <dt className="text-sm font-semibold text-white">{label}</dt>
              <dd className="font-[var(--font-space)] text-sm tabular-nums text-slate-300">{score}</dd>
              <dd className="text-sm leading-relaxed text-slate-400">{note}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300">
          <p className="font-semibold text-white">Ce s-ar urmări în următoarele zile</p>
          <p className="mt-2 text-slate-400">
            În scenariul fictiv: deblocarea de 2% din ziua 9, adâncimea de ordin sub un prag inventat și
            dacă portofelul Exemplu-1 mută fonduri către bursa din exemplu. Contextul tehnic multi-timeframe
            intră în același raport, cu aceleași limite: descriere, nu apel de tranzacționare.
          </p>
        </div>
      </div>
    </section>
  );
}
