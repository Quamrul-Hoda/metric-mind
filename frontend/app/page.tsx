"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    if (!question.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Backend request failed.");
      }

      setResponse(data);
    } catch (error: any) {
      setResponse({
        error: error.message || "Unable to connect to MetricMind backend.",
      });
    } finally {
      setLoading(false);
    }
  }

  const rows = response?.data?.data || [];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-900">MetricMind</h1>

        <p className="mt-2 text-gray-600">Agentic Semantic BI Engine</p>

        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <label className="block text-sm font-medium text-gray-700">
            Ask a business question
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Show total sales by region",
              "Show total profit by region",
              "Show profit margin by region",
              "Why did European margins decline?",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuestion(example)}
                className="rounded-full border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {example}
              </button>
            ))}
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Show total sales by region"
            className="mt-2 w-full rounded-lg border border-gray-300 p-4 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Ask MetricMind"}
          </button>
        </div>

        {response && !response.error && (
          <div className="mt-6 space-y-6">
            {response.root_cause && (
              <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900">
                  Root-Cause Analysis
                </h2>

                <p className="mt-4 text-gray-700">
                  {response.root_cause.explanation}
                </p>
              </div>
            )}

            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900">
                Detected Intent
              </h2>

              <p className="mt-3 text-gray-700">
                <strong>Measures:</strong>{" "}
                {response.intent?.measures?.join(", ")}
              </p>

              <p className="mt-2 text-gray-700">
                <strong>Dimensions:</strong>{" "}
                {response.intent?.dimensions?.join(", ")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900">Query</h2>

              <pre className="mt-3 overflow-auto rounded-lg bg-gray-900 p-4 text-sm text-white">
                {JSON.stringify(response.query, null, 2)}
              </pre>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900">Results</h2>

              {rows.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(rows[0]).map((key) => (
                          <th
                            key={key}
                            className="px-4 py-3 font-semibold text-gray-700"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {rows.map((row: any, index: number) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((value: any, i: number) => (
                            <td key={i} className="px-4 py-3 text-gray-800">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-gray-500">No data returned.</p>
              )}
            </div>
          </div>
        )}

        {response?.error && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Error</h2>

            <p className="mt-3 text-gray-700">{response.error}</p>
          </div>
        )}
      </div>
    </main>
  );
}
