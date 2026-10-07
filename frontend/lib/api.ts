import { parseQueryResponse } from "../types/query";
import type {
  CubePayload,
  MetricFilter,
  MetricIntent,
  QueryResponse,
  QueryRow,
  RootCauseResponse,
} from "../types/query";

export type Intent = MetricIntent;
export type IntentFilter = MetricFilter;
export type CubeResult = CubePayload;
export type RootCause = RootCauseResponse;
export type { QueryResponse, QueryRow };

export class MetricMindError extends Error {
  detail?: string;
  status?: number;

  constructor(message: string, opts?: { detail?: string; status?: number }) {
    super(message);
    this.name = "MetricMindError";
    this.detail = opts?.detail;
    this.status = opts?.status;
  }
}

const API_URL =
  process.env.NEXT_PUBLIC_METRICMIND_API_URL || "http://localhost:8000";

export const METRICMIND_QUERY_ENDPOINT = `${API_URL}/query`;

export async function askMetricMind(
  question: string,
  signal?: AbortSignal,
): Promise<QueryResponse> {
  let response: Response;

  try {
    response = await fetch(METRICMIND_QUERY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal,
    });
  } catch (error) {
    throw new MetricMindError(
      "We could not connect to the MetricMind analysis service.",
      { detail: error instanceof Error ? error.message : String(error) },
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null && "detail" in payload
        ? String(payload.detail ?? "")
        : undefined;

    throw new MetricMindError(
      detail || `The analysis service returned HTTP ${response.status}.`,
      { detail, status: response.status },
    );
  }

  const parsed = parseQueryResponse(payload);
  if (!parsed) {
    throw new MetricMindError(
      "The analysis service returned an unexpected response shape.",
    );
  }

  return parsed;
}

