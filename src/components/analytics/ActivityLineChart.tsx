"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useState } from "react";

interface DayData {
  date: string;
  total: number;
  tasks: number;
  habits: number;
  notes: number;
}

interface ActivityLineChartProps {
  thisWeek: DayData[];
  lastWeek: DayData[];
  thisWeekTotal: number;
  lastWeekTotal: number;
}

function shortDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

const delta = (a: number, b: number) =>
  b === 0 ? null : ((a - b) / b) * 100;

export function ActivityLineChart({
  thisWeek,
  lastWeek,
  thisWeekTotal,
  lastWeekTotal,
}: ActivityLineChartProps) {
  const [view, setView] = useState<"week" | "compare">("week");

  const chartData = thisWeek.map((d, i) => ({
    day: shortDate(d.date),
    "This Week": d.total,
    "Last Week": lastWeek[i]?.total ?? 0,
  }));

  const change = delta(thisWeekTotal, lastWeekTotal);

  return (
    <div className="space-y-4">
      {/* Header + Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-black">{thisWeekTotal} actions</p>
          {change !== null && (
            <p className={`text-xs font-medium mt-0.5 ${change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(0)}% vs last week
            </p>
          )}
        </div>
        <div className="flex bg-white/5 rounded-xl p-1 gap-1">
          {(["week", "compare"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === v ? "bg-indigo-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "week" ? "This Week" : "Compare"}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="day"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="This Week"
            stroke="#818cf8"
            strokeWidth={2.5}
            dot={{ fill: "#818cf8", r: 3 }}
            activeDot={{ r: 5 }}
          />
          {view === "compare" && (
            <Line
              type="monotone"
              dataKey="Last Week"
              stroke="rgba(129,140,248,0.35)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          )}
          {view === "compare" && <Legend />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
