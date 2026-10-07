import type { Intent, QueryResponse, QueryRow, RootCause } from "./api";

export function humanizeLabel(raw: string): string {
  if (!raw) return "";
  const field = raw.includes(".") ? raw.split(".").pop()! : raw;
  const spaced = field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isRatioLike(key: string): boolean {
  return /margin|percent|rate|ratio|avg|average/i.test(key);
}

export function formatNumberCompact(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatMeasureValue(key: string, value: number): string {
  if (!Number.isFinite(value)) return "—";
  return isRatioLike(key) ? formatPercent(value) : formatNumberCompact(value);
}

export function formatTimeAxisLabel(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function shortenCategoryLabel(value: string, maxLength = 18): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

export function formatCellValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const numeric = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(numeric) && typeof value !== "boolean") {
    return formatMeasureValue(key, numeric);
  }
  return String(value);
}

function matchColumn(candidates: string[], keys: string[]): string | undefined {
  for (const candidate of candidates) {
    if (keys.includes(candidate)) return candidate;
  }

  const lowerKeys = keys.map((key) => key.toLowerCase());
  for (const candidate of candidates) {
    const index = lowerKeys.indexOf(candidate.toLowerCase());
    if (index !== -1) return keys[index];
  }

  for (const candidate of candidates) {
    const found = keys.find((key) =>
      key.toLowerCase().endsWith(candidate.toLowerCase()),
    );
    if (found) return found;
  }

  return undefined;
}

export function getDimensionColumn(
  rows: QueryRow[],
  dimensions?: string[],
): string | undefined {
  const keys = rows.length ? Object.keys(rows[0]) : [];
  if (!keys.length) return undefined;
  return (dimensions?.length && matchColumn(dimensions, keys)) || keys[0];
}

export function getMeasureColumns(
  rows: QueryRow[],
  measures?: string[],
): string[] {
  const keys = rows.length ? Object.keys(rows[0]) : [];
  if (!keys.length) return [];

  if (measures?.length) {
    const matched = measures
      .map((measure) => matchColumn([measure, `Sales.${measure}`], keys))
      .filter((value): value is string => Boolean(value));
    if (matched.length) return matched;
  }

  return keys.filter((key) => {
    const value = rows[0][key];
    return typeof value === "number" ||
      (typeof value === "string" && value !== "" && Number.isFinite(Number(value)));
  });
}

export function isTimeDimension(key: string | undefined): boolean {
  return Boolean(key && /date|time|month|year|quarter|week|day/i.test(key));
}

export function sortRowsByTimeDimension(
  rows: QueryRow[],
  dimensions?: string[],
): QueryRow[] {
  const dimensionKey = getDimensionColumn(rows, dimensions);
  if (!dimensionKey || !isTimeDimension(dimensionKey)) return rows;

  const datedRows = rows.map((row, index) => ({
    row,
    index,
    timestamp: new Date(String(row[dimensionKey] ?? "")).getTime(),
  }));

  if (datedRows.some(({ timestamp }) => !Number.isFinite(timestamp))) return rows;

  return [...datedRows]
    .sort((left, right) => left.timestamp - right.timestamp || left.index - right.index)
    .map(({ row }) => row);
}

export interface Kpi {
  key: string;
  label: string;
  value: string;
}

export function computeKpis(rows: QueryRow[], measures?: string[]): Kpi[] {
  if (!rows.length) return [];
  const measureColumns = getMeasureColumns(rows, measures);
  if (!measureColumns.length) return [];

  if (rows.length === 1) {
    return measureColumns.flatMap((column) => {
      const value = Number(rows[0][column]);
      return Number.isFinite(value)
        ? [{ key: column, label: humanizeLabel(column), value: formatMeasureValue(column, value) }]
        : [];
    });
  }

  return measureColumns
    .filter((column) => !isRatioLike(column))
    .map((column) => {
      const total = rows.reduce((sum, row) => {
        const value = Number(row[column]);
        return sum + (Number.isFinite(value) ? value : 0);
      }, 0);
      return {
        key: column,
        label: `Total ${humanizeLabel(column)}`,
        value: formatMeasureValue(column, total),
      };
    });
}

export interface ExecutiveSummary {
  title: string;
  body: string;
}

export function buildExecutiveSummary(
  response: QueryResponse,
): ExecutiveSummary | null {
  const rows = response.data?.data ?? [];
  if (!rows.length) return null;

  const dimensionColumn = getDimensionColumn(rows, response.intent?.dimensions);
  const measureColumns = getMeasureColumns(rows, response.intent?.measures);
  if (!measureColumns.length) return null;

  const measureColumn = measureColumns[0];
  const title = dimensionColumn
    ? `${humanizeLabel(measureColumn)} by ${humanizeLabel(dimensionColumn)}`
    : humanizeLabel(measureColumn);

  if (!dimensionColumn || rows.length === 1) {
    const value = Number(rows[0][measureColumn]);
    return Number.isFinite(value)
      ? { title, body: `${humanizeLabel(measureColumn)} is ${formatMeasureValue(measureColumn, value)}.` }
      : null;
  }

  const ranked = rows
    .map((row) => ({ label: String(row[dimensionColumn]), value: Number(row[measureColumn]) }))
    .filter((row) => Number.isFinite(row.value))
    .sort((a, b) => b.value - a.value);

  if (!ranked.length) return null;
  const top = ranked[0];
  const next = ranked[1];
  const body = `${top.label} leads with ${formatMeasureValue(measureColumn, top.value)}${
    next ? `, followed by ${next.label} at ${formatMeasureValue(measureColumn, next.value)}.` : "."
  }`;

  return { title, body };
}

export interface RootCauseMetric {
  label: string;
  value: string;
}

export function getRootCauseMetrics(rootCause?: RootCause): RootCauseMetric[] {
  const rows = rootCause?.data?.data ?? [];
  if (!rows.length) return [];

  const row = rows[0];
  const keys = Object.keys(row);
  const salesColumn = matchColumn(["totalSales", "Sales.totalSales", "sales"], keys);
  const profitColumn = matchColumn(["totalProfit", "Sales.totalProfit", "profit"], keys);
  const costColumn = matchColumn(["totalCost", "Sales.totalCost", "cost"], keys);
  const sales = salesColumn ? Number(row[salesColumn]) : NaN;
  const profit = profitColumn ? Number(row[profitColumn]) : NaN;
  const cost = costColumn ? Number(row[costColumn]) : NaN;

  const metrics: RootCauseMetric[] = [];
  if (Number.isFinite(sales)) metrics.push({ label: "Sales", value: formatNumberCompact(sales) });
  if (Number.isFinite(cost)) metrics.push({ label: "Total Cost", value: formatNumberCompact(cost) });
  if (Number.isFinite(profit)) metrics.push({ label: "Total Profit", value: formatNumberCompact(profit) });
  if (Number.isFinite(sales) && sales !== 0 && Number.isFinite(profit)) {
    metrics.push({ label: "Profit Margin", value: formatPercent((profit / sales) * 100) });
  }
  return metrics;
}

export function describeRootCauseScope(
  rootCause: RootCause,
  intent?: Intent,
): string {
  const rootCauseFilters = rootCause.query?.filters ?? [];
  const rootCauseScopeFilter = rootCauseFilters.find((filter) =>
    /region|market/i.test(filter.member),
  );

  if (rootCauseScopeFilter) {
    return `Scope returned by API: ${formatFilter(rootCauseScopeFilter)}.`;
  }

  const detectedScopeFilter = intent?.filters?.find((filter) =>
    /region|market/i.test(filter.member),
  );

  if (detectedScopeFilter) {
    return `The detected question filter (${formatFilter(detectedScopeFilter)}) is not present in the returned root-cause query. This section reflects the root-cause query exactly as returned.`;
  }

  return "No region or market filter was present in the root-cause query returned by the API.";
}

export function formatFilter(filter: Intent["filters"][number]): string {
  const member = filter.member ? humanizeLabel(filter.member) : "Filter";
  const operator = filter.operator
    ? filter.operator.replace(/([A-Z])/g, " $1").toLowerCase()
    : "matches";
  const values = Array.isArray(filter.values) ? filter.values.join(", ") : "";
  return values ? `${member} ${operator} ${values}` : `${member} ${operator}`;
}
