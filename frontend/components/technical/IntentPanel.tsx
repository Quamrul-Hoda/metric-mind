import { formatDimensionLabel, formatMetricLabel } from "../../types/query";
import type { MetricIntent } from "../../types/query";

interface IntentPanelProps {
  intent: MetricIntent;
}

function ListValue({ values, empty = "None detected" }: { values: string[]; empty?: string }) {
  return values.length > 0 ? (
    <div className="token-list">
      {values.map((value) => <span className="token" key={value}>{value}</span>)}
    </div>
  ) : <span className="muted-copy">{empty}</span>;
}

export default function IntentPanel({ intent }: IntentPanelProps) {
  return (
    <section className="content-panel technical-panel" aria-labelledby="intent-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Interpretation</p>
          <h2 id="intent-title">Detected intent</h2>
        </div>
        <span className="panel-meta">From agent output</span>
      </div>
      <div className="intent-grid">
        <div>
          <p className="detail-label">Measures</p>
          <ListValue values={intent.measures.map(formatMetricLabel)} />
        </div>
        <div>
          <p className="detail-label">Dimensions</p>
          <ListValue values={intent.dimensions.map(formatDimensionLabel)} />
        </div>
        <div className="intent-filter-block">
          <p className="detail-label">Filters</p>
          {intent.filters.length > 0 ? (
            <div className="filter-list">
              {intent.filters.map((filter, index) => (
                <span className="filter-line" key={`${filter.member}-${index}`}>
                  {filter.member} {filter.operator} {filter.values.join(", ") || "—"}
                </span>
              ))}
            </div>
          ) : <span className="muted-copy">None detected</span>}
        </div>
      </div>
    </section>
  );
}

