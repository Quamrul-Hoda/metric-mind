export default function Header() {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-kicker">MetricMind</p>
        <h1>Agentic Semantic BI</h1>
      </div>
      <div className="topbar-status" title="This reflects the application workspace, not a backend health check.">
        <span className="status-dot" aria-hidden="true" />
        <span>System ready</span>
      </div>
    </header>
  );
}

