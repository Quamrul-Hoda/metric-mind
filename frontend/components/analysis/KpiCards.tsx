import {
  findFieldKey,
  formatCompactNumber,
  formatExactNumber,
  formatMetricLabel,
  numericValue,
} from "../../types/query";
import type { MetricIntent, QueryRow } from "../../types/query";

interface KpiCardsProps {
  intent: MetricIntent;
  rows: QueryRow[];
}

function getKpiValue(metric: string, rows: QueryRow[]): number | null {
  const key = findFieldKey(rows, metric, 1);
  if (!key) return null;

  const values = rows
    .map((row) => numericValue(row[key]))
    .filter((value): value is number => value !== null);

  if (values.length === 0) return null;
  if (values.length === 1 || rows.length === 1) return values[0];

  if (/^(total|shippingCost|materialCost)/i.test(metric)) {
    return values.reduce((sum, value) => sum + value, 0);
  }

  if (metric.toLowerCase().includes("margin")) {
    const profitKey = findFieldKey(rows, "totalProfit");
    const salesKey = findFieldKey(rows, "totalSales");
    if (profitKey && salesKey) {
      const profit = rows.reduce((sum, row) => sum + (numericValue(row[profitKey]) ?? 0), 0);
      const sales = rows.reduce((sum, row) => sum + (numericValue(row[salesKey]) ?? 0), 0);
      return sales ? (profit / sales) * 100 : null;
    }
  }

  return null;
}

export default function KpiCards({ intent, rows }: KpiCardsProps) {
  const cards = intent.measures
    .map((metric) => ({ metric, value: getKpiValue(metric, rows) }))
    .filter((card): card is { metric: string; value: number } => card.value !== null);

  if (cards.length === 0) return null;

  return (
    <section className="kpi-grid" aria-label="Key metrics">
      {cards.map(({ metric, value }) => (
        <article className="kpi-card" key={metric} title={`Exact value: ${formatExactNumber(value, metric)}`}>
          <p className="kpi-label">{formatMetricLabel(metric)}</p>
          <p className="kpi-value">{formatCompactNumber(value, metric)}</p>
          <p className="kpi-footnote">From returned analytical data</p>
        </article>
      ))}
    </section>
  );
}

