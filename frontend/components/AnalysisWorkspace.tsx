"use client";

import { useState } from "react";
import type { QueryResponse } from "../lib/api";
import { buildExecutiveSummary, computeKpis, sortRowsByTimeDimension } from "../lib/format";
import ChartRenderer from "./ChartRenderer";
import InsightCard from "./InsightCard";
import IntentPanel from "./IntentPanel";
import KpiCard from "./KpiCard";
import QueryPanel from "./QueryPanel";
import ResultsTable from "./ResultsTable";
import RootCausePanel from "./RootCausePanel";
import TransparencyModal from "./TransparencyModal";

export default function AnalysisWorkspace({
  question,
  response,
}: {
  question: string;
  response: QueryResponse;
}) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const rows = sortRowsByTimeDimension(response.data?.data ?? [], response.intent?.dimensions);
  const summary = buildExecutiveSummary(response);
  const kpis = computeKpis(rows, response.intent?.measures);

  return (
    <div className="mm-fade-in space-y-7">
      {summary ? <InsightCard title={summary.title} body={summary.body} /> : <InsightCard title="Analysis complete" body="See the visualization and detailed results below." />}

      {kpis.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{kpis.map((kpi) => <KpiCard key={kpi.key} kpi={kpi} />)}</div>}

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-[var(--mm-ink-muted)]">Visualization</h2>
          <span className="text-xs text-[var(--mm-ink-muted)]">{response.intent?.measures?.map((measure) => measure.replace(/^Sales\./, "")).join(", ") || "Returned data"}</span>
        </div>
        <ChartRenderer rows={rows} dimensions={response.intent?.dimensions} measures={response.intent?.measures} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium text-[var(--mm-ink-muted)]">Results</h2>
        <ResultsTable rows={rows} />
      </section>

      {response.root_cause && <RootCausePanel rootCause={response.root_cause} intent={response.intent} />}

      <section className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-5">
        <h2 className="mb-3 text-sm font-medium text-[var(--mm-ink-muted)]">Analysis Intent</h2>
        <IntentPanel intent={response.intent} />
      </section>

      <section className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)]">
        <button
          type="button"
          onClick={() => setShowTechnical((value) => !value)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-[var(--mm-ink)]"
          aria-expanded={showTechnical}
        >
          How MetricMind generated this analysis
          <span className="text-[var(--mm-ink-muted)]">{showTechnical ? "▲" : "▼"}</span>
        </button>

        {showTechnical && (
          <div className="border-t border-[var(--mm-border)] p-5">
            <p className="mb-2 text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">SEMANTIC QUERY</p>
            <QueryPanel query={response.query} />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setShowModal(true)} className="rounded-md border border-[var(--mm-border)] px-3 py-1.5 text-sm text-[var(--mm-ink)] hover:bg-[var(--mm-surface-alt)]">View API Call</button>
              <button type="button" onClick={() => setShowModal(true)} className="rounded-md border border-[var(--mm-border)] px-3 py-1.5 text-sm text-[var(--mm-ink)] hover:bg-[var(--mm-surface-alt)]">View SQL Availability</button>
            </div>
          </div>
        )}
      </section>

      {showModal && <TransparencyModal question={question} response={response} onClose={() => setShowModal(false)} />}
    </div>
  );
}
