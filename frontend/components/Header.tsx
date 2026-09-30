"use client";

import { useEffect, useState } from "react";

export default function Header({
  status,
  onOpenMobileNav,
}: {
  status: "unknown" | "online" | "offline";
  onOpenMobileNav: () => void;
}) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("metricmind_theme", next ? "dark" : "light");
    } catch {
      // Theme persistence is optional.
    }
  }

  const statusMeta = {
    unknown: { label: "Status unknown", color: "bg-[var(--mm-ink-muted)]" },
    online: { label: "Last query succeeded", color: "bg-[var(--mm-verified)]" },
    offline: { label: "Connection issue", color: "bg-[var(--mm-error)]" },
  }[status];

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-[var(--mm-border)] bg-[var(--mm-bg)]/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="rounded-md border border-[var(--mm-border)] p-1.5 text-[var(--mm-ink-muted)] lg:hidden"
        >
          ☰
        </button>
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-sm font-medium text-[var(--mm-ink)] sm:text-base">
            MetricMind
          </h1>
          <p className="hidden text-xs text-[var(--mm-ink-muted)] sm:block">Agentic Semantic BI</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 rounded-full border border-[var(--mm-border)] px-2.5 py-1 text-xs text-[var(--mm-ink-muted)] sm:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.color}`} />
          {statusMeta.label}
        </span>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          className="rounded-md border border-[var(--mm-border)] px-2.5 py-1.5 text-xs text-[var(--mm-ink-muted)] hover:text-[var(--mm-ink)]"
        >
          {dark ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
