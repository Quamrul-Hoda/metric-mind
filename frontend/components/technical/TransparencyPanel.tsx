import type { CubeQuery } from "../../types/query";

interface TransparencyPanelProps {
  question: string;
  query: CubeQuery;
  response: unknown;
}

export default function TransparencyPanel({ question, query, response }: TransparencyPanelProps) {
  return (
    <section className="content-panel technical-panel" aria-labelledby="transparency-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Technical transparency</p>
          <h2 id="transparency-title">How this result was produced</h2>
        </div>
        <span className="panel-meta">Available response data</span>
      </div>

      <div className="disclosure-stack">
        <details className="technical-disclosure">
          <summary>View API call</summary>
          <pre>{JSON.stringify({
            method: "POST",
            endpoint: "http://localhost:8000/query",
            headers: { "Content-Type": "application/json" },
            body: { question },
          }, null, 2)}</pre>
        </details>
        <details className="technical-disclosure">
          <summary>View response</summary>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </details>
        <details className="technical-disclosure">
          <summary>View semantic query</summary>
          <pre>{JSON.stringify(query, null, 2)}</pre>
        </details>
        <div className="sql-notice">
          <p className="detail-label">SQL transparency</p>
          <p>SQL is not exposed by the current API.</p>
        </div>
      </div>
    </section>
  );
}

