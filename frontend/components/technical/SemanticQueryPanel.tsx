import type { CubeQuery } from "../../types/query";

export default function SemanticQueryPanel({ query }: { query: CubeQuery }) {
  return (
    <section className="content-panel technical-panel" aria-labelledby="semantic-query-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Governance</p>
          <h2 id="semantic-query-title">Semantic query</h2>
        </div>
        <span className="panel-meta">Cube request</span>
      </div>
      <details className="technical-disclosure" open>
        <summary>View Cube query JSON</summary>
        <pre>{JSON.stringify(query, null, 2)}</pre>
      </details>
    </section>
  );
}

