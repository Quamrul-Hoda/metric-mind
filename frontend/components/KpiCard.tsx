import type { Kpi } from "../lib/format";

export default function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] px-4 py-3.5" title="Derived from returned API rows">
      <p className="text-xs font-medium text-[var(--mm-ink-muted)]">{kpi.label}</p>
      <p className="mt-1.5 font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--mm-ink)]">{kpi.value}</p>
    </div>
  );
}

