import ChartRenderer from "../ChartRenderer";
import { formatMetricLabel } from "../../types/query";
import type { MetricIntent, QueryRow } from "../../types/query";

interface AnalysisChartProps {
  intent: MetricIntent;
  rows: QueryRow[];
}

export default function AnalysisChart({ intent, rows }: AnalysisChartProps) {
  return (
    <section className="content-panel chart-panel" aria-labelledby="chart-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Visualization</p>
          <h2 id="chart-title">Analysis view</h2>
        </div>
        <span className="panel-meta">
          {intent.measures[0] ? formatMetricLabel(intent.measures[0]) : "Returned data"}
        </span>
      </div>
      <ChartRenderer rows={rows} dimensions={intent.dimensions} measures={intent.measures} />
    </section>
  );
}
