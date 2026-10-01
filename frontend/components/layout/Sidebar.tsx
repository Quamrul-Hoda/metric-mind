const navigation = [
  { label: "Overview", active: true },
  { label: "New analysis", active: false, status: "Current workspace" },
  { label: "History", active: false, status: "Coming soon" },
  { label: "About / System", active: false, status: "Coming soon" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">M</div>
        <div>
          <p className="brand-name">MetricMind</p>
          <p className="brand-caption">Semantic BI</p>
        </div>
      </div>

      <div className="sidebar-section-label">Workspace</div>
      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <div
            className={`sidebar-nav-item ${item.active ? "is-active" : "is-disabled"}`}
            key={item.label}
            title={item.status}
            aria-current={item.active ? "page" : undefined}
          >
            <span className="nav-dot" aria-hidden="true" />
            <span>{item.label}</span>
            {!item.active && <span className="nav-status">{item.status}</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-line">
          <span className="status-dot" aria-hidden="true" />
          <span>Local workspace</span>
        </div>
        <p>Queries run through the governed semantic layer.</p>
      </div>
    </aside>
  );
}

