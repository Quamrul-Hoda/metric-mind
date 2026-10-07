export type QueryRow = Record<string, unknown>;

export interface MetricFilter {
  member: string;
  operator: string;
  values: string[];
}

export interface MetricIntent {
  measures: string[];
  dimensions: string[];
  filters: MetricFilter[];
}

export interface CubeQuery {
  measures?: string[];
  dimensions?: string[];
  filters?: MetricFilter[];
  [key: string]: unknown;
}

export interface CubePayload {
  data: QueryRow[];
  [key: string]: unknown;
}

export interface RootCauseResponse {
  analysis?: string;
  query?: CubeQuery;
  data?: CubePayload;
  explanation?: string;
  [key: string]: unknown;
}

export interface QueryResponse {
  intent: MetricIntent;
  query: CubeQuery;
  data: CubePayload;
  root_cause?: RootCauseResponse;
  [key: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function normalizeFilters(value: unknown): MetricFilter[] {
  if (!Array.isArray(value)) return [];

  return value.filter(isRecord).map((filter) => ({
    member: typeof filter.member === "string" ? filter.member : "",
    operator: typeof filter.operator === "string" ? filter.operator : "",
    values: stringArray(filter.values),
  }));
}

function normalizeRows(value: unknown): QueryRow[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter(isRecord);
}

export function parseQueryResponse(value: unknown): QueryResponse | null {
  if (!isRecord(value) || !isRecord(value.data)) return null;

  const rows = normalizeRows(value.data.data);
  if (!rows) return null;

  const rawIntent = isRecord(value.intent) ? value.intent : {};
  const rawQuery = isRecord(value.query) ? value.query : {};
  const rawRootCause = isRecord(value.root_cause)
    ? value.root_cause
    : undefined;

  const normalizedRootCause = rawRootCause
    ? {
        ...rawRootCause,
        query: isRecord(rawRootCause.query) ? rawRootCause.query : undefined,
        data: isRecord(rawRootCause.data)
          ? {
              ...rawRootCause.data,
              data: normalizeRows(rawRootCause.data.data) ?? [],
            }
          : undefined,
      }
    : undefined;

  return {
    ...value,
    intent: {
      measures: stringArray(rawIntent.measures),
      dimensions: stringArray(rawIntent.dimensions),
      filters: normalizeFilters(rawIntent.filters),
    },
    query: rawQuery,
    data: {
      ...value.data,
      data: rows,
    },
    root_cause: normalizedRootCause,
  };
}

export function fieldCandidates(field: string): string[] {
  return [field, `Sales.${field}`];
}

export function findFieldKey(
  rows: QueryRow[],
  field: string | undefined,
  fallbackIndex?: number,
): string | undefined {
  if (!field || rows.length === 0) return undefined;

  const keys = Object.keys(rows[0]);
  const exact = fieldCandidates(field).find((candidate) => keys.includes(candidate));
  if (exact) return exact;

  const suffixMatches = keys.filter((key) => key.endsWith(`.${field}`));
  if (suffixMatches.length === 1) return suffixMatches[0];

  return fallbackIndex !== undefined ? keys[fallbackIndex] : undefined;
}

export function formatMetricLabel(metric: string): string {
  return metric
    .replace(/^Sales\./, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

export function formatDimensionLabel(dimension: string): string {
  return formatMetricLabel(dimension);
}

export function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function formatExactNumber(value: number, metric?: string): string {
  const isPercentage = metric?.toLowerCase().includes("margin");
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: isPercentage ? 2 : 0,
  }).format(value) + (isPercentage ? "%" : "");
}

export function formatCompactNumber(value: number, metric?: string): string {
  const isPercentage = metric?.toLowerCase().includes("margin");
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
    minimumFractionDigits: isPercentage ? 2 : 0,
  }).format(value) + (isPercentage ? "%" : "");
}

export function formatCellValue(value: unknown, key: string): string {
  if (value === null || value === undefined || value === "") return "—";

  const numeric = numericValue(value);
  if (numeric !== null && !key.toLowerCase().includes("date")) {
    return formatExactNumber(numeric, key);
  }

  return String(value);
}

