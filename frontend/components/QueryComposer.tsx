"use client";

import type { KeyboardEvent } from "react";
import ExampleQuestions from "./ExampleQuestions";

export default function QueryComposer({
  question,
  onChange,
  onSubmit,
  loading,
}: {
  question: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <section className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-medium text-[var(--mm-ink)]">Ask MetricMind</h1>
        <span className="text-xs text-[var(--mm-ink-muted)]">⌘/Ctrl + Enter to ask</span>
      </div>
      <p className="mt-1 text-sm text-[var(--mm-ink-muted)]">What would you like to know about your business data?</p>

      <div className="mt-4">
        <label htmlFor="mm-question" className="sr-only">Business question</label>
        <textarea
          id="mm-question"
          value={question}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. What were total sales by region?"
          rows={3}
          disabled={loading}
          className="w-full resize-none rounded-md border border-[var(--mm-border)] bg-[var(--mm-bg)] p-4 text-[15px] text-[var(--mm-ink)] placeholder-[var(--mm-ink-muted)] outline-none transition-shadow focus:border-[var(--mm-accent)] focus:ring-2 focus:ring-[var(--mm-accent-soft)] disabled:opacity-60"
        />
      </div>

      <div className="mt-4 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
        <ExampleQuestions onSelect={onChange} />
        <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
          {question && !loading && (
            <button type="button" onClick={() => onChange("")} className="rounded-md px-3 py-2 text-sm text-[var(--mm-ink-muted)] hover:text-[var(--mm-ink)]">
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !question.trim()}
            className="rounded-md bg-[var(--mm-accent)] px-5 py-2.5 text-sm font-medium text-[var(--mm-accent-ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Analyzing…" : "Ask MetricMind →"}
          </button>
        </div>
      </div>
    </section>
  );
}

