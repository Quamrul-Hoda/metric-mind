"use client";

export type View = "ask" | "history" | "governance" | "system";

const NAV: { id: View; label: string }[] = [
  { id: "ask", label: "Ask MetricMind" },
  { id: "history", label: "Analysis History" },
  { id: "governance", label: "Governance" },
  { id: "system", label: "System Info" },
];

export default function Sidebar({
  active,
  status,
  open,
  onNavigate,
  onCloseMobile,
}: {
  active: View;
  status: "unknown" | "online" | "offline";
  open: boolean;
  onNavigate: (view: View) => void;
  onCloseMobile: () => void;
}) {
  const statusMeta = {
    unknown: { label: "Not yet checked", color: "bg-[var(--mm-ink-muted)]" },
    online: { label: "Last query succeeded", color: "bg-[var(--mm-verified)]" },
    offline: { label: "Connection issue", color: "bg-[var(--mm-error)]" },
  }[status];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={
          "fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-[var(--mm-border)] bg-[var(--mm-surface)] transition-transform lg:static lg:translate-x-0 " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--mm-accent)] font-[family-name:var(--font-display)] text-sm font-medium text-[var(--mm-accent-ink)]">
            M
          </span>
          <span className="font-[family-name:var(--font-display)] text-base font-medium text-[var(--mm-ink)]">
            MetricMind
          </span>
        </div>

        <nav className="flex-1 space-y-0.5 px-3" aria-label="Primary navigation">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              aria-current={active === item.id ? "page" : undefined}
              className={
                "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors " +
                (active === item.id
                  ? "bg-[var(--mm-accent-soft)] font-medium text-[var(--mm-accent)]"
                  : "text-[var(--mm-ink-muted)] hover:bg-[var(--mm-surface-alt)] hover:text-[var(--mm-ink)]")
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-[var(--mm-border)] px-5 py-4">
          <p className="text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">REQUEST STATUS</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--mm-ink)]">
            <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.color}`} />
            {statusMeta.label}
          </div>
        </div>
      </aside>
    </>
  );
}

