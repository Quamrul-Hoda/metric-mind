"use client";

import { useEffect, useState } from "react";
import type { QueryResponse } from "../lib/api";
import { METRICMIND_QUERY_ENDPOINT } from "../lib/api";

type Tab = "request" | "response" | "query" | "sql";

export default function TransparencyModal({ question, response, onClose }: { question: string; response: QueryResponse; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("request");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const requestPayload = { endpoint: `POST ${METRICMIND_QUERY_ENDPOINT}`, body: { question } };
  const content = tab === "request" ? JSON.stringify(requestPayload, null, 2) : tab === "response" ? JSON.stringify(response, null, 2) : tab === "query" ? JSON.stringify(response.query, null, 2) : null;

  async function handleCopy() {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access is optional.
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="How MetricMind generated this analysis" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="mm-fade-in max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--mm-border)] px-5 py-4"><h2 className="font-[family-name:var(--font-display)] text-base font-medium text-[var(--mm-ink)]">How MetricMind generated this analysis</h2><button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 text-[var(--mm-ink-muted)] hover:bg-[var(--mm-surface-alt)] hover:text-[var(--mm-ink)]">✕</button></div>
        <div className="flex gap-1 overflow-x-auto border-b border-[var(--mm-border)] px-5 pt-3">{(["request", "response", "query", "sql"] as Tab[]).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-t-md px-3 py-2 text-sm ${tab === item ? "border-b-2 border-[var(--mm-accent)] font-medium text-[var(--mm-accent)]" : "text-[var(--mm-ink-muted)] hover:text-[var(--mm-ink)]"}`}>{item === "request" ? "API Request" : item === "response" ? "Response" : item === "query" ? "Semantic Query" : "SQL"}</button>)}</div>
        <div className="mm-scroll max-h-[55vh] overflow-auto p-5">{tab === "sql" ? <p className="rounded-md border border-[var(--mm-warning)]/30 bg-[var(--mm-warning-soft)] p-3 text-sm text-[var(--mm-ink)]">SQL is not exposed by the current MetricMind API. The available transparency surface is the Cube semantic query.</p> : <pre className="font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--mm-code-ink)]">{content}</pre>}</div>
        {tab !== "sql" && <div className="flex justify-end border-t border-[var(--mm-border)] px-5 py-3"><button type="button" onClick={handleCopy} className="rounded-md border border-[var(--mm-border)] px-3 py-1.5 text-sm text-[var(--mm-ink)] hover:bg-[var(--mm-surface-alt)]">{copied ? "Copied" : "Copy"}</button></div>}
      </div>
    </div>
  );
}

