import { formatCellValue, formatMetricLabel } from "../../types/query";
import type { RootCauseResponse, QueryRow } from "../../types/query";

interface RootCausePanelProps {
  rootCause: RootCauseResponse;
}

function DataPreview({ rows }: { rows: QueryRow[] }) {
  if (rows.length === 0) return <p className="muted-copy">No supporting rows were returned.</p>;
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return (
    <div className="support-table-wrap">
      <table className="support-table">
        <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
        <tbody>
          {rows.slice(0, 5).map((row, index) => (
            <tr key={index}>
              {columns.map((column) => <td key={column}>{formatCellValue(row[column], column)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RootCausePanel({ rootCause }: RootCausePanelProps) {
  const supportingRows = rootCause.data?.data ?? [];
  const supportingMeasures = rootCause.query?.measures ?? [];

  return (
    <section className="content-panel root-cause-panel" aria-labelledby="root-cause-title">
      <div className="root-cause-heading">
        <div className="root-cause-icon" aria-hidden="true">!</div>
        <div>
          <p className="eyebrow">Diagnostic insight</p>
          <h2 id="root-cause-title">Root Cause Analysis</h2>
        </div>
        <span className="analysis-tag">{rootCause.analysis ? formatMetricLabel(rootCause.analysis) : "Analysis"}</span>
      </div>

      <p className="root-cause-explanation">
        {rootCause.explanation ?? "No root-cause explanation was returned."}
      </p>

      <div className="root-cause-details">
        <div>
          <p className="detail-label">Supporting metrics</p>
          <p className="detail-value">
            {supportingMeasures.length > 0
              ? supportingMeasures.map(formatMetricLabel).join(", ")
              : "Not returned"}
          </p>
        </div>
        <div>
          <p className="detail-label">Supporting data</p>
          <p className="detail-value">{supportingRows.length} row{supportingRows.length === 1 ? "" : "s"} returned</p>
        </div>
      </div>

      <details className="technical-disclosure">
        <summary>View supporting data</summary>
        <DataPreview rows={supportingRows} />
      </details>

      {rootCause.query && (
        <details className="technical-disclosure">
          <summary>View root-cause query</summary>
          <pre>{JSON.stringify(rootCause.query, null, 2)}</pre>
        </details>
      )}
    </section>
  );
}

