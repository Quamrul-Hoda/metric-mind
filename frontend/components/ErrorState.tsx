"use client";

import { useState } from "react";

export default function ErrorState({
  message,
  detail,
  onRetry,
}: {
  message: string;
  detail?: string;
  onRetry: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <section className="mm-fade-in rounded-lg border border-[var(--mm-error)]/30 bg-[var(--mm-error-soft)] p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--mm-error)] text-xs text-[var(--mm-error)]">!</span>
        <div className="min-w-0 flex-1">
          <h2 className="font-[family-name:var(--font-display)] text-base font-medium text-[var(--mm-ink)]">Analysis could not be completed</h2>
          <p className="mt-1 text-sm text-[var(--mm-ink-muted)]">{message}</p>
          <div className="mt-4 flex items-center gap-4">
            <button type="button" onClick={onRetry} className="rounded-md bg-[var(--mm-accent)] px-4 py-2 text-sm font-medium text-[var(--mm-accent-ink)] hover:opacity-90">Try again</button>
            {detail && <button type="button" onClick={() => setShowDetail((value) => !value)} className="text-sm text-[var(--mm-ink-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--mm-ink)]">{showDetail ? "Hide technical details" : "Show technical details"}</button>}
          </div>
          {showDetail && detail && <pre className="mm-scroll mt-4 overflow-x-auto rounded-md bg-[var(--mm-code-bg)] p-3 font-[family-name:var(--font-mono)] text-xs text-[var(--mm-code-ink)]">{detail}</pre>}
        </div>
      </div>
    </section>
  );
}

