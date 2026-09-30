import type { Intent } from "../lib/api";
import { formatFilter, humanizeLabel } from "../lib/format";

export default function IntentPanel({ intent }: { intent?: Intent }) {
  if (!intent) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <IntentGroup label="Measures" items={intent.measures.map(humanizeLabel)} />
      <IntentGroup label="Dimensions" items={intent.dimensions.map(humanizeLabel)} />
      <IntentGroup label="Filters" items={intent.filters.map(formatFilter)} />
    </div>
  );
}

function IntentGroup({ label, items }: { label: string; items?: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">{label.toUpperCase()}</p>
      {items && items.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm text-[var(--mm-ink)]"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mm-accent)]" />{item}</li>)}
        </ul>
      ) : <p className="mt-2 text-sm text-[var(--mm-ink-muted)]">None</p>}
    </div>
  );
}

