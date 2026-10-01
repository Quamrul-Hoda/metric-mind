import { formatCellValue } from "../../types/query";
import type { QueryRow } from "../../types/query";

interface ResultsTableProps {
  rows: QueryRow[];
}

export default function ResultsTable({ rows }: ResultsTableProps) {
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return (
    <section className="content-panel table-panel" aria-labelledby="table-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Detailed data</p>
          <h2 id="table-title">Returned results</h2>
        </div>
        <span className="panel-meta">{rows.length} row{rows.length === 1 ? "" : "s"}</span>
      </div>

      {rows.length === 0 ? (
        <div className="empty-inline">No rows were returned for this analysis.</div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${rowIndex}-${columns.join("-")}`}>
                  {columns.map((column) => {
                    const value = formatCellValue(row[column], column);
                    return <td key={column} title={value}>{value}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

