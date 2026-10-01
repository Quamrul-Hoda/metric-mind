import { METRICMIND_QUERY_ENDPOINT } from "../lib/api";

export function HistoryPanel({ history, onSelect, onClear }: { history: string[]; onSelect: (question: string) => void; onClear: () => void }) {
  return (
    <section className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-5 sm:p-6">
      <div className="flex items-center justify-between"><h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--mm-ink)]">Recent analyses</h2>{history.length > 0 && <button type="button" onClick={onClear} className="text-sm text-[var(--mm-ink-muted)] hover:text-[var(--mm-ink)]">Clear</button>}</div>
      {history.length === 0 ? <p className="mt-3 text-sm text-[var(--mm-ink-muted)]">Questions you ask will show up here — stored locally in this browser only.</p> : <ul className="mt-4 divide-y divide-[var(--mm-border)]">{history.map((question, index) => <li key={`${question}-${index}`}><button type="button" onClick={() => onSelect(question)} className="w-full py-3 text-left text-sm text-[var(--mm-ink)] hover:text-[var(--mm-accent)]">{question}</button></li>)}</ul>}
    </section>
  );
}

export function GovernancePanel() {
  const steps = [
    ["Intent parsing", "The question is mapped to approved measures, dimensions, and filters."],
    ["Semantic layer", "Cube resolves the request against governed business definitions."],
    ["Data platform", "The semantic query is executed through the configured analytical platform."],
  ];

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-5 sm:p-6"><h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--mm-ink)]">How MetricMind governs analysis</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--mm-ink-muted)]">MetricMind translates questions into requests against a governed semantic layer instead of allowing the language model to write arbitrary SQL against raw warehouse tables.</p></div>
      <div className="grid gap-3 sm:grid-cols-3">{steps.map(([title, body]) => <div key={title} className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-4"><p className="text-sm font-medium text-[var(--mm-ink)]">{title}</p><p className="mt-1.5 text-sm text-[var(--mm-ink-muted)]">{body}</p></div>)}</div>
    </section>
  );
}

export function SystemInfoPanel({ status }: { status: "unknown" | "online" | "offline" }) {
  const statusMeta = {
    unknown: { label: "Not yet checked", color: "bg-[var(--mm-ink-muted)]" },
    online: { label: "Last query succeeded", color: "bg-[var(--mm-verified)]" },
    offline: { label: "Connection issue", color: "bg-[var(--mm-error)]" },
  }[status];

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-5 sm:p-6"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${statusMeta.color}`} /><p className="text-sm font-medium text-[var(--mm-ink)]">{statusMeta.label}</p></div><p className="mt-1.5 text-xs text-[var(--mm-ink-muted)]">This reflects the last request to {METRICMIND_QUERY_ENDPOINT}. It is not a per-layer health check.</p></div>
      <div className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-5 sm:p-6"><h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--mm-ink)]">Stack</h2><dl className="mt-3 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">{[["Frontend", "Next.js, React, TypeScript, Tailwind CSS"], ["Charts", "ECharts"], ["Backend", "FastAPI, LangChain"], ["Agent model", "Llama 3.1 8B via Ollama"], ["Semantic layer", "Cube.dev"], ["Data platform", "Databricks"]].map(([label, value]) => <div key={label} className="flex justify-between border-b border-[var(--mm-border)] pb-2 sm:block sm:border-0 sm:pb-0"><dt className="text-[var(--mm-ink-muted)]">{label}</dt><dd className="text-[var(--mm-ink)] sm:mt-0.5">{value}</dd></div>)}</dl></div>
    </section>
  );
}

