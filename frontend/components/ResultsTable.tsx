"use client";

import { useState } from "react";
import { formatCellValue, humanizeLabel } from "../lib/format";
import type { QueryRow } from "../lib/api";

const PAGE_SIZE = 10;

export default function ResultsTable({ rows }: { rows: QueryRow[] }) {
  const [page, setPage] = useState(0);
  const keys = rows.length ? Object.keys(rows[0]) : [];
  const pageCount = Math.ceil(rows.length / PAGE_SIZE);
  const pageRows = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (!rows.length) {
    return <div className="flex h-32 items-center justify-center rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface-alt)] text-sm text-[var(--mm-ink-muted)]">No data returned for this question.</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--mm-border)]">
      <div className="mm-scroll max-h-96 overflow-auto">
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--mm-surface-alt)]">
            <tr>
              {keys.map((key) => <th key={key} scope="col" className="whitespace-nowrap border-b border-[var(--mm-border)] px-4 py-2.5 font-medium text-[var(--mm-ink-muted)]">{humanizeLabel(key)}</th>)}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row, index) => (
              <tr key={`${page}-${index}`} className="border-b border-[var(--mm-border)] bg-[var(--mm-surface)] last:border-0 even:bg-[var(--mm-surface-alt)]/40 hover:bg-[var(--mm-accent-soft)]/40">
                {keys.map((key) => <td key={key} className="whitespace-nowrap px-4 py-2.5 text-[var(--mm-ink)]">{formatCellValue(key, row[key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--mm-border)] bg-[var(--mm-surface)] px-4 py-2.5 text-xs text-[var(--mm-ink-muted)]">
          <span>Rows {page * PAGE_SIZE + 1}–{Math.min(rows.length, (page + 1) * PAGE_SIZE)} of {rows.length}</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0} className="rounded border border-[var(--mm-border)] px-2 py-1 disabled:opacity-40">Prev</button>
            <button type="button" onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} disabled={page >= pageCount - 1} className="rounded border border-[var(--mm-border)] px-2 py-1 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
