import {
  findFieldKey,
  formatCompactNumber,
  formatDimensionLabel,
  formatMetricLabel,
  numericValue,
} from "../../types/query";
import type { MetricIntent, QueryRow } from "../../types/query";

interface ExecutiveSummaryProps {
  question: string;
  intent: MetricIntent;
  rows: QueryRow[];
}

export default function ExecutiveSummary({ question, intent, rows }: ExecutiveSummaryProps) {
  const measure = intent.measures[0];
  const measureKey = findFieldKey(rows, measure, 1);
  const values = measureKey
    ? rows.map((row) => numericValue(row[measureKey])).filter((value): value is number => value !== null)
    : [];
  const isAdditive = measure ? /^(total|shippingCost|materialCost)/i.test(measure) : false;
  const total = isAdditive && values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : null;
  const dimension = intent.dimensions[0];
  const dimensionText = dimension ? ` across ${formatDimensionLabel(dimension)} results` : "";

  let answer = "Structured analysis is ready for review.";
  if (rows.length === 0) {
    answer = "No matching data was returned for this question.";
  } else if (measure && total !== null) {
    answer = `${formatMetricLabel(measure)} returned ${formatCompactNumber(total, measure)}${dimensionText}.`;
  } else if (measure) {
    answer = `${formatMetricLabel(measure)} returned ${rows.length} result${rows.length === 1 ? "" : "s"}${dimensionText}.`;
  } else {
    answer = `${rows.length} result${rows.length === 1 ? "" : "s"} returned for this analysis.`;
  }

  return (
    <section className="answer-panel" aria-labelledby="answer-title">
      <div className="answer-mark" aria-hidden="true">↗</div>
      <div className="answer-content">
        <p className="eyebrow">Business answer</p>
        <h2 id="answer-title">{answer}</h2>
        <p className="answer-question">“{question}”</p>
      </div>
    </section>
  );
}

