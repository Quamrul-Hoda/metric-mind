"use client";

import { useEffect, useState } from "react";
import type { QueryResponse } from "../lib/api";
import { METRICMIND_QUERY_ENDPOINT } from "../lib/api";

type Tab = "request" | "response" | "query" | "governance" | "sql";

type GovernancePolicy = {
  query_timeout_seconds: number;
  max_query_retries: number;
  retry_wait_seconds: number;
  max_result_rows: number;
  audit_logging: boolean;
  semantic_layer: string;
  sql_exposed: boolean;
};

export default function TransparencyModal({
  question,
  response,
  onClose,
}: {
  question: string;
  response: QueryResponse;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("request");
  const [copied, setCopied] = useState(false);
  const [governance, setGovernance] =
    useState<GovernancePolicy | null>(null);
  const [governanceLoading, setGovernanceLoading] = useState(false);
  const [governanceError, setGovernanceError] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (tab !== "governance" || governance) return;

    async function loadGovernance() {
      setGovernanceLoading(true);
      setGovernanceError(false);

      try {
        const baseUrl = METRICMIND_QUERY_ENDPOINT.replace("/query", "");

        const result = await fetch(`${baseUrl}/governance`);

        if (!result.ok) {
          throw new Error("Failed to load governance policy.");
        }

        const data: GovernancePolicy = await result.json();
        setGovernance(data);
      } catch {
        setGovernanceError(true);
      } finally {
        setGovernanceLoading(false);
      }
    }

    loadGovernance();
  }, [tab, governance]);

  const requestPayload = {
    endpoint: `POST ${METRICMIND_QUERY_ENDPOINT}`,
    body: {
      question,
    },
  };

  const content =
    tab === "request"
      ? JSON.stringify(requestPayload, null, 2)
      : tab === "response"
        ? JSON.stringify(response, null, 2)
        : tab === "query"
          ? JSON.stringify(response.query, null, 2)
          : null;

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
    <div
      role="dialog"
      aria-modal="true"
      aria-label="How MetricMind generated this analysis"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="mm-fade-in max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--mm-border)] px-5 py-4">
          <h2 className="font-[family-name:var(--font-display)] text-base font-medium text-[var(--mm-ink)]">
            How MetricMind generated this analysis
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-[var(--mm-ink-muted)] hover:bg-[var(--mm-surface-alt)] hover:text-[var(--mm-ink)]"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-[var(--mm-border)] px-5 pt-3">
          {(
            [
              "request",
              "response",
              "query",
              "governance",
              "sql",
            ] as Tab[]
          ).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-t-md px-3 py-2 text-sm ${
                tab === item
                  ? "border-b-2 border-[var(--mm-accent)] font-medium text-[var(--mm-accent)]"
                  : "text-[var(--mm-ink-muted)] hover:text-[var(--mm-ink)]"
              }`}
            >
              {item === "request"
                ? "API Request"
                : item === "response"
                  ? "Response"
                  : item === "query"
                    ? "Semantic Query"
                    : item === "governance"
                      ? "Governance"
                      : "SQL"}
            </button>
          ))}
        </div>

        <div className="mm-scroll max-h-[55vh] overflow-auto p-5">
          {tab === "sql" ? (
            <p className="rounded-md border border-[var(--mm-warning)]/30 bg-[var(--mm-warning-soft)] p-3 text-sm text-[var(--mm-ink)]">
              SQL is not exposed by the current MetricMind API. The
              available transparency surface is the Cube semantic query.
            </p>
          ) : tab === "governance" ? (
            governanceLoading ? (
              <p className="text-sm text-[var(--mm-ink-muted)]">
                Loading governance policy...
              </p>
            ) : governanceError ? (
              <p className="rounded-md border border-[var(--mm-warning)]/30 bg-[var(--mm-warning-soft)] p-3 text-sm text-[var(--mm-ink)]">
                Governance policy could not be loaded from the MetricMind
                API.
              </p>
            ) : governance ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <GovernanceItem
                    label="Query timeout"
                    value={`${governance.query_timeout_seconds}s`}
                  />

                  <GovernanceItem
                    label="Maximum retries"
                    value={governance.max_query_retries}
                  />

                  <GovernanceItem
                    label="Retry wait"
                    value={`${governance.retry_wait_seconds}s`}
                  />

                  <GovernanceItem
                    label="Maximum result rows"
                    value={governance.max_result_rows}
                  />

                  <GovernanceItem
                    label="Audit logging"
                    value={governance.audit_logging ? "Enabled" : "Disabled"}
                  />

                  <GovernanceItem
                    label="Semantic layer"
                    value={governance.semantic_layer}
                  />

                  <GovernanceItem
                    label="SQL exposure"
                    value={governance.sql_exposed ? "Available" : "Not exposed"}
                  />
                </div>

                <p className="mt-4 rounded-md border border-[var(--mm-border)] bg-[var(--mm-surface-alt)] p-3 text-xs leading-relaxed text-[var(--mm-ink-muted)]">
                  These controls are enforced by the MetricMind backend
                  around semantic query execution.
                </p>
              </div>
            ) : null
          ) : (
            <pre className="font-[family-name:var(--font-mono)] text-xs leading-relaxed text-[var(--mm-code-ink)]">
              {content}
            </pre>
          )}
        </div>

        {tab !== "sql" && tab !== "governance" && (
          <div className="flex justify-end border-t border-[var(--mm-border)] px-5 py-3">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md border border-[var(--mm-border)] px-3 py-1.5 text-sm text-[var(--mm-ink)] hover:bg-[var(--mm-surface-alt)]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function GovernanceItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-[var(--mm-border)] bg-[var(--mm-surface-alt)] p-3">
      <div className="text-xs text-[var(--mm-ink-muted)]">{label}</div>
      <div className="mt-1 text-sm font-medium text-[var(--mm-ink)]">
        {value}
      </div>
    </div>
  );
}