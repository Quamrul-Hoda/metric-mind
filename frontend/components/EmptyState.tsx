"use client";

import ExampleQuestions from "./ExampleQuestions";

const TOPICS = ["Sales", "Profit", "Revenue", "Costs", "Margins", "Regions", "Time trends"];

export default function EmptyState({ onSelect }: { onSelect: (question: string) => void }) {
  return (
    <div className="mm-fade-in rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] px-6 py-10 text-center sm:px-10 sm:py-14">
      <p className="text-xs font-medium tracking-wide text-[var(--mm-ink-muted)]">No analysis yet</p>
      <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-medium text-[var(--mm-ink)] sm:text-3xl">Ask MetricMind about your business data</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-[var(--mm-ink-muted)]">Every answer is generated from your governed semantic model, not free-form SQL — so the numbers you see are the same ones your metrics layer defines.</p>
      <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2">{TOPICS.map((topic) => <span key={topic} className="rounded-md border border-[var(--mm-border)] bg-[var(--mm-surface-alt)] px-3 py-1 text-xs text-[var(--mm-ink-muted)]">{topic}</span>)}</div>
      <div className="mt-8"><ExampleQuestions onSelect={onSelect} align="center" /></div>
    </div>
  );
}

