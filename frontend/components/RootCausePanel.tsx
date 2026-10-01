import type { RootCause } from "../lib/api";
import type { Intent } from "../lib/api";
import { describeRootCauseScope, formatCellValue, getRootCauseMetrics } from "../lib/format";

export default function RootCausePanel({ rootCause, intent }: { rootCause: RootCause; intent?: Intent }) {
  const metrics = getRootCauseMetrics(rootCause);
  const supportingRows = rootCause.data?.data ?? [];
  const scopeDescription = describeRootCauseScope(rootCause, intent);

  return (
    <section className="mm-fade-in overflow-hidden rounded-lg border border-[var(--mm-accent)]/30 bg-[var(--mm-surface)]">
      <div className="border-b border-[var(--mm-border)] bg-[var(--mm-accent-soft)] px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--mm-accent)]" />
          <h2 className="text-sm font-medium text-[var(--mm-accent)]">Root-Cause Analysis</h2>
          <span className="rounded-full border border-[var(--mm-accent)]/25 px-2 py-0.5 text-xs text-[var(--mm-accent)]">{rootCause.analysis || "Analysis type not returned"}</span>
        </div>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[var(--mm-ink-muted)]">{scopeDescription}</p>
      </div>

      <div className="p-5 sm:p-6">
        {metrics.length > 0 && (
          <div className="border-b border-[var(--mm-border)] pb-5">
            <p className="text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">SUPPORTING METRICS</p>
            <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {metrics.map((metric) => <div key={metric.label}><dt className="text-xs text-[var(--mm-ink-muted)]">{metric.label}</dt><dd className="mt-1 font-[family-name:var(--font-display)] text-lg font-medium text-[var(--mm-ink)]">{metric.value}</dd></div>)}
            </dl>
          </div>
        )}

        <div className="pt-5">
          <p className="text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">EXPLANATION FROM API</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--mm-ink)]">{rootCause.explanation || "No root-cause explanation was returned."}</p>
        </div>

        <div className="mt-5 grid gap-3 border-t border-[var(--mm-border)] pt-4 sm:grid-cols-2">
          <div><p className="text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">SUPPORTING DATA</p><p className="mt-1 text-sm text-[var(--mm-ink)]">{supportingRows.length} row{supportingRows.length === 1 ? "" : "s"} returned</p></div>
          <div><p className="text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">ROOT-CAUSE QUERY</p><p className="mt-1 text-sm text-[var(--mm-ink)]">{rootCause.query ? "Available below" : "Not returned"}</p></div>
        </div>

        {supportingRows.length > 0 && (
          <details className="mt-5 border-t border-[var(--mm-border)] pt-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--mm-ink-muted)]">View supporting data</summary>
            <div className="mm-scroll mt-3 overflow-auto">
              <table className="w-full min-w-[420px] text-left text-xs">
                <thead><tr>{Object.keys(supportingRows[0]).map((key) => <th key={key} className="border-b border-[var(--mm-border)] px-3 py-2 text-[var(--mm-ink-muted)]">{key}</th>)}</tr></thead>
                <tbody>{supportingRows.slice(0, 5).map((row, index) => <tr key={index}>{Object.keys(supportingRows[0]).map((key) => <td key={key} className="border-b border-[var(--mm-border)] px-3 py-2 text-[var(--mm-ink)]">{formatCellValue(key, row[key])}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </details>
        )}

        {rootCause.query && (
          <details className="mt-3 border-t border-[var(--mm-border)] pt-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--mm-ink-muted)]">View root-cause query</summary>
            <pre className="mm-scroll mt-3 overflow-auto rounded-md bg-[var(--mm-code-bg)] p-4 font-[family-name:var(--font-mono)] text-xs text-[var(--mm-code-ink)]">{JSON.stringify(rootCause.query, null, 2)}</pre>
          </details>
        )}
      </div>
    </section>
  );
}
