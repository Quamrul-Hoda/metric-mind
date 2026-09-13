"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

interface ChartRendererProps {
  rows: Record<string, any>[];
  dimensions?: string[];
  measures?: string[];
}

export default function ChartRenderer({
  rows,
  dimensions = [],
  measures = [],
}: ChartRendererProps) {
  if (!rows || rows.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        No data available for visualization.
      </div>
    );
  }

  const keys = Object.keys(rows[0]);

  const dimensionKey =
    dimensions.length > 0
      ? dimensions.find((dimension) =>
          keys.some((key) => key === dimension)
        ) || keys[0]
      : keys[0];

  const measureKey =
    measures.length > 0
      ? measures.find((measure) =>
          keys.some((key) => key === measure)
        ) || keys[1]
      : keys[1];

  if (!dimensionKey || !measureKey) {
    return (
      <div className="mt-4 rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        Insufficient data for visualization.
      </div>
    );
  }

  const isTimeSeries =
    dimensionKey.toLowerCase().includes("date") ||
    dimensionKey.toLowerCase().includes("time");

  const categories = rows.map((row) => String(row[dimensionKey]));

  const values = rows.map((row) => {
    const value = Number(row[measureKey]);
    return Number.isFinite(value) ? value : 0;
  });

  const option = {
    tooltip: {
      trigger: "axis",
    },

    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        rotate: categories.length > 8 ? 35 : 0,
      },
    },

    yAxis: {
      type: "value",
    },

    series: [
      {
        name: measureKey,
        type: isTimeSeries ? "line" : "bar",
        data: values,
        smooth: isTimeSeries,
      },
    ],
  };

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
      <ReactECharts
        option={option}
        style={{ height: "400px", width: "100%" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
