"use client";

import { useState } from "react";
import AnalysisWorkspace from "../components/AnalysisWorkspace";
import AppShell from "../components/AppShell";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import QueryComposer from "../components/QueryComposer";
import { GovernancePanel, HistoryPanel, SystemInfoPanel } from "../components/SecondaryPanels";
import { type View } from "../components/Sidebar";
import { askMetricMind, MetricMindError } from "../lib/api";
import type { QueryResponse } from "../lib/api";

const HISTORY_KEY = "metricmind_history";
const HISTORY_LIMIT = 10;

type Status = "unknown" | "online" | "offline";

export default function Home() {
  const [view, setView] = useState<View>("ask");
  const [question, setQuestion] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<{ message: string; detail?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("unknown");
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  function saveHistory(next: string[]) {
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // History persistence is optional.
    }
  }

  function pushHistory(value: string) {
    saveHistory([value, ...history.filter((item) => item !== value)].slice(0, HISTORY_LIMIT));
  }

  async function runQuestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    setView("ask");
    setLoading(true);
    setError(null);
    setResponse(null);
    setAskedQuestion(trimmed);

    try {
      const data = await askMetricMind(trimmed);
      setResponse(data);
      setStatus("online");
      pushHistory(trimmed);
    } catch (requestError) {
      setStatus("offline");
      if (requestError instanceof MetricMindError) {
        setError({ message: requestError.message, detail: requestError.detail });
      } else {
        setError({ message: "Something unexpected went wrong.", detail: String(requestError) });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell active={view} onNavigate={setView} status={status}>
      {view === "ask" && (
        <div className="space-y-6">
          <QueryComposer question={question} onChange={setQuestion} onSubmit={() => runQuestion(question)} loading={loading} />
          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error.message} detail={error.detail} onRetry={() => runQuestion(askedQuestion)} />}
          {!loading && !error && response && <AnalysisWorkspace question={askedQuestion} response={response} />}
          {!loading && !error && !response && <EmptyState onSelect={setQuestion} />}
        </div>
      )}

      {view === "history" && <HistoryPanel history={history} onSelect={(value) => { setQuestion(value); void runQuestion(value); }} onClear={() => saveHistory([])} />}
      {view === "governance" && <GovernancePanel />}
      {view === "system" && <SystemInfoPanel status={status} />}
    </AppShell>
  );
}
