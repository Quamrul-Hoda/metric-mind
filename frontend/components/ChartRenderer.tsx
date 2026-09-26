"use client";

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  formatMeasureValue,
  getDimensionColumn,
  getMeasureColumns,
  humanizeLabel,
  isTimeDimension,
  formatTimeAxisLabel,
  shortenCategoryLabel,
} from "../lib/format";
import type { QueryRow } from "../lib/api";

interface ChartRendererProps {
  rows: QueryRow[];
  dimensions?: string[];
  measures?: string[];
}
function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const SERIES_COLORS = ["#24406f", "#1f8a70", "#a3660f"];

type TooltipParam = {
  axisValue?: string;
  seriesName?: string;
  value?: number | string;
};

function escapeTooltipValue(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

export default function ChartRenderer({ rows, dimensions = [], measures = [] }: ChartRendererProps) {
  const isDark = useIsDark();
  const inkMuted = isDark ? "#98a2b3" : "#5b6472";
  const border = isDark ? "#2a323d" : "#dde2e8";
  const ink = isDark ? "#e7ebf1" : "#12161c";

  if (!rows || rows.length === 0) {
    return <div className="flex h-64 items-center justify-center rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface-alt)] text-sm text-[var(--mm-ink-muted)]">No data available for visualization.</div>;
  }

  const dimensionKey = getDimensionColumn(rows, dimensions);
  const measureKeys = getMeasureColumns(rows, measures).slice(0, 3);

  if (!dimensionKey || measureKeys.length === 0) {
    return <div className="flex h-64 items-center justify-center rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface-alt)] text-sm text-[var(--mm-ink-muted)]">Insufficient data for visualization.</div>;
  }

  const timeSeries = isTimeDimension(dimensionKey);
  const categories = rows.map((row) => String(row[dimensionKey] ?? "—"));
  const horizontalBars = !timeSeries && categories.length >= 8;
  const series = measureKeys.map((key, index) => ({
    name: humanizeLabel(key),
    type: timeSeries ? "line" : "bar",
    smooth: timeSeries,
    showSymbol: !timeSeries || categories.length <= 24,
    data: rows.map((row) => {
      const value = Number(row[key]);
      return Number.isFinite(value) ? value : 0;
    }),
    itemStyle: { color: SERIES_COLORS[index % SERIES_COLORS.length] },
    lineStyle: { color: SERIES_COLORS[index % SERIES_COLORS.length] },
    barMaxWidth: 42,
  }));

  const option = {
    backgroundColor: "transparent",
    textStyle: { color: ink, fontFamily: "var(--font-sans, sans-serif)" },
    title: {
      text: `${measureKeys.map(humanizeLabel).join(" & ")} ${timeSeries ? "over time" : `by ${humanizeLabel(dimensionKey)}`}`,
      left: 0,
      textStyle: { color: ink, fontSize: 14, fontWeight: 500 },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: TooltipParam[] | TooltipParam) => {
        const items = Array.isArray(params) ? params : [params];
        const rawCategory = String(items[0]?.axisValue ?? "");
        const rows = items.map((item) => {
          const measureKey = measureKeys.find((key) => humanizeLabel(key) === item.seriesName) ?? measureKeys[0];
          return `${escapeTooltipValue(item.seriesName ?? humanizeLabel(measureKey))}: ${formatMeasureValue(measureKey, Number(item.value))}`;
        });
        return [`<strong>${escapeTooltipValue(rawCategory)}</strong>`, ...rows].join("<br />");
      },
      backgroundColor: isDark ? "#151b23" : "#ffffff",
      borderColor: border,
      textStyle: { color: ink },
    },
    legend: measureKeys.length > 1 ? { top: 0, right: 0, textStyle: { color: inkMuted, fontSize: 12 } } : undefined,
    grid: {
      left: horizontalBars ? "18%" : "1%",
      right: "2%",
      top: measureKeys.length > 1 ? 56 : 40,
      bottom: timeSeries ? 44 : 36,
      containLabel: true,
    },
    xAxis: horizontalBars
      ? {
          type: "value",
          axisLine: { show: false },
          splitLine: { lineStyle: { color: border } },
          axisLabel: { color: inkMuted, formatter: (value: number) => formatMeasureValue(measureKeys[0], value) },
        }
      : {
          type: "category",
          data: categories,
          axisLine: { lineStyle: { color: border } },
          axisLabel: {
            color: inkMuted,
            interval: timeSeries && categories.length > 12 ? Math.ceil(categories.length / 12) - 1 : 0,
            rotate: !timeSeries && categories.length > 6 ? 30 : 0,
            hideOverlap: true,
            formatter: (value: string) => timeSeries ? formatTimeAxisLabel(value) : shortenCategoryLabel(value),
          },
        },
    yAxis: horizontalBars
      ? {
          type: "category",
          data: categories,
          axisLine: { lineStyle: { color: border } },
          axisLabel: { color: inkMuted, formatter: (value: string) => shortenCategoryLabel(value) },
        }
      : {
          type: "value",
          axisLine: { show: false },
          splitLine: { lineStyle: { color: border } },
          axisLabel: { color: inkMuted, formatter: (value: number) => formatMeasureValue(measureKeys[0], value) },
        },
    series,
  };

  const chartHeight = horizontalBars
    ? Math.min(620, Math.max(380, 220 + categories.length * 28))
    : 380;

  return (
    <div className="rounded-lg border border-[var(--mm-border)] bg-[var(--mm-surface)] p-4">
      <ReactECharts option={option} style={{ height: `${chartHeight}px`, width: "100%" }} notMerge={true} lazyUpdate={true} />
    </div>
  );
}
