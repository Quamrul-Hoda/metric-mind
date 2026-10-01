"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Understanding business intent",
  "Mapping semantic metrics",
  "Querying analytical data",
  "Preparing visualization",
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveStep((step) => Math.min(step + 1, STEPS.length - 1)), 750);
    return () => clearInterval(interval);
  }, []);

  return (
    <section role="status" aria-live="polite" className="mm-fade-in rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-6">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--mm-ink)]">Analyzing your question…</h2>
      <ul className="mt-4 space-y-3">
        {STEPS.map((step, index) => {
          const state = index < activeStep ? "done" : index === activeStep ? "active" : "pending";
          return <li key={step} className="flex items-center gap-3 text-sm"><span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${state === "done" ? "border-[var(--mm-verified)] bg-[var(--mm-verified-soft)] text-[var(--mm-verified)]" : state === "active" ? "border-[var(--mm-accent)] text-[var(--mm-accent)]" : "border-[var(--mm-border)] text-[var(--mm-ink-muted)]"}`}>{state === "done" ? "✓" : state === "active" ? "●" : "○"}</span><span className={state === "pending" ? "text-[var(--mm-ink-muted)]" : "text-[var(--mm-ink)]"}>{step}{state === "active" && <span className="ml-1 inline-block animate-pulse text-[var(--mm-accent)]">…</span>}</span></li>;
        })}
      </ul>
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-[var(--mm-surface-alt)]"><div className="h-full w-1/3 animate-[mm-loading-bar_1.4s_ease-in-out_infinite] rounded-full bg-[var(--mm-accent)]" /></div>
    </section>
  );
}
