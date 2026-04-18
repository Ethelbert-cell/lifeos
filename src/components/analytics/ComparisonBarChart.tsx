"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface DayData {
  date: string;
  tasks: number;
  habits: number;
  notes: number;
  gym: number;
  total: number;
}

interface ComparisonBarChartProps {
  data: DayData[]; // 14 days
}

function shortDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}

export function ComparisonBarChart({ data }: ComparisonBarChartProps) {
  const chartData = data.map(d => ({
    date: shortDate(d.date),
    Tasks:  d.tasks,
    Habits: d.habits,
    Notes:  d.notes,
    Gym:    d.gym,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        barSize={12}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={1}
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
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}
        />
        <Bar dataKey="Tasks"  stackId="a" fill="#818cf8" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Habits" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Notes"  stackId="a" fill="#38bdf8" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Gym"    stackId="a" fill="#fbbf24" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
