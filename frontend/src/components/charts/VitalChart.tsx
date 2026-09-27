"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface VitalChartProps {
  data: number[];
  label: string;
  color?: string;
  unit?: string;
  variant?: "line" | "area";
}

export function VitalChart({
  data,
  label,
  color = "#0069c6",
  unit = "",
  variant = "area",
}: VitalChartProps) {
  const chartData = data.map((value, i) => ({ t: i + 1, value }));

  const Chart = variant === "area" ? AreaChart : LineChart;

  return (
    <div className="h-36 w-full">
      <p className="mb-2 text-xs font-medium text-slate-500">{label}</p>
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="t" tick={{ fontSize: 10 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}${unit}`, label]}
          />
          {variant === "area" ? (
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.15}
              strokeWidth={2}
              isAnimationActive
              animationDuration={800}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={800}
            />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
