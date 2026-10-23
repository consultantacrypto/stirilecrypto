const ROWS = [
  ['1h', 'Range', '0,98–1,03', 'Reacție scurtă în jurul unui nivel rotund inventat.'],
  ['4h', 'Neutru', '0,94–1,08', 'Două testări fictive, fără direcție obligatorie.'],
  ['12h', 'Structură mixtă', '0,90–1,12', 'Zonă de mijloc folosită doar ca exemplu de comentariu.'],
  ['1D', 'Lateral', '0,82–1,20', 'Interval ilustrativ, nu un nivel de tranzacționare.'],
  ['3D', 'Compresie', '0,75–1,28', 'Volatilitate desenată pentru demonstrație.'],
  ['1W', 'Context larg', '0,60–1,40', 'Cadru săptămânal fictiv, fără țintă de preț.'],
  ['1M', 'Ciclu nespecificat', '0,40–1,80', 'Doar ca să arătăm că luna intră în același material.'],
] as const;

export default function TaSample() {
  return (
    <section aria-label="Exemplu de analiză cu date fictive" className="mt-12">
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
        Exemplu cu date fictive. Activul XMPL nu există. Nu este o analiză reală, nu este un preț de
        piață și nu este o recomandare de cumpărare sau de vânzare.
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
        <div className="border-b border-white/10 px-4 py-4 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Mostră</p>
          <h2 className="mt-1 font-[var(--font-space)] text-xl font-bold text-white">XMPL / USD — Exemplum</h2>
          <p className="mt-2 text-sm text-slate-400">
            Preț ilustrativ folosit în mostră: 1,00 USD. Întrebarea inventată a cumpărătorului: „Cum
            arată structura dacă prețul revine în zona de mijloc?”
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-6">Timeframe</th>
                <th className="px-4 py-3 font-semibold">Context</th>
                <th className="px-4 py-3 font-semibold">Zonă fictivă</th>
                <th className="px-4 py-3 font-semibold">Notă</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {ROWS.map(([frame, context, zone, note]) => (
                <tr key={frame}>
                  <td className="px-4 py-3 font-semibold text-white sm:px-6">{frame}</td>
                  <td className="px-4 py-3">{context}</td>
                  <td className="px-4 py-3 tabular-nums">{zone}</td>
                  <td className="px-4 py-3 text-slate-400">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-white/10 px-4 py-4 text-sm leading-relaxed text-slate-400 sm:px-6">
          Comentariul din livrarea reală descrie structura și zonele observate. Nu include un apel de
          a cumpăra sau de a vinde. Cifrele de mai sus sunt inventate ca să arate formatul.
        </p>
      </div>
    </section>
  );
}
