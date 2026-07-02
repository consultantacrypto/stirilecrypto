import Link from 'next/link';
import { ExternalLink, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ComplianceStatusBadge from '@/components/dashboard/ComplianceStatusBadge';
import type { MicaComplianceItem } from '@/lib/types/dashboard';

function ComplianceTable({
  title,
  items,
}: {
  title: string;
  items: MicaComplianceItem[];
}) {
  return (
    <Card className="border-white/5 bg-[#0a0f1e]/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-[var(--font-space)]">{title}</CardTitle>
        <CardDescription>{items.length} entități monitorizate</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-slate-500">Nicio intrare publicată.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-white font-[var(--font-space)]">{item.name}</p>
                    <ComplianceStatusBadge status={item.compliance_status} />
                  </div>
                  {item.jurisdiction ? (
                    <p className="text-xs text-slate-500">{item.jurisdiction}</p>
                  ) : null}
                  {item.notes ? (
                    <p className="text-sm text-slate-400 leading-relaxed font-[var(--font-inter)]">
                      {item.notes}
                    </p>
                  ) : null}
                </div>
                {item.source_url ? (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Sursă
                    <ExternalLink size={12} />
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function MicaSafetyRadar({
  exchanges,
  stablecoins,
}: {
  exchanges: MicaComplianceItem[];
  stablecoins: MicaComplianceItem[];
}) {
  const isEmpty = exchanges.length === 0 && stablecoins.length === 0;

  return (
    <section aria-label="MiCA Safety Radar" className="mb-12">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-300">
            <Shield size={14} />
            MiCA Safety Radar
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-[var(--font-space)]">
            Conformitate &amp; Risc
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400 font-[var(--font-inter)]">
            Status editorial al exchange-urilor și stablecoin-urilor majore în context MiCA. Nu
            constituie consultanță juridică.
          </p>
        </div>
        <Link
          href="/stiri/harta-oficiala-mica-2026-ghid-siguranta-crypto"
          className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
        >
          Ghid MiCA →
        </Link>
      </div>

      {isEmpty ? (
        <Card className="border-white/5 bg-[#0a0f1e]/80">
          <CardContent className="p-6 text-sm text-slate-500">
            Radarul MiCA nu are încă intrări publicate. Adaugă și publică din admin.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <ComplianceTable title="Exchange-uri" items={exchanges} />
          <ComplianceTable title="Stablecoins" items={stablecoins} />
        </div>
      )}
    </section>
  );
}
