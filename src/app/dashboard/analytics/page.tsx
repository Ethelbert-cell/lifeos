"use client";

import { useEffect, useState } from "react";
import { BarChart2, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { WeekInPixels } from "@/components/analytics/WeekInPixels";
import { ActivityLineChart } from "@/components/analytics/ActivityLineChart";
import { ComparisonBarChart } from "@/components/analytics/ComparisonBarChart";

interface AnalyticsData {
  daily: any[];
  today: { total: number; tasks: number; habits: number; notes: number };
  yesterday: { total: number; tasks: number; habits: number; notes: number };
  thisWeekTotal: number;
  lastWeekTotal: number;
  thisWeek: any[];
  lastWeek: any[];
}

function CompareCard({
  label,
  a,
  aLabel,
  b,
  bLabel,
}: {
  label: string;
  a: number;
  aLabel: string;
  b: number;
  bLabel: string;
}) {
  const change = b === 0 ? null : ((a - b) / b) * 100;
  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex items-end gap-4">
        <div>
          <p className="text-3xl font-black">{a}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{aLabel}</p>
        </div>
        {change !== null && (
          <p className={`text-sm font-bold mb-1 ${change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(0)}%
          </p>
        )}
        <div className="text-right ml-auto opacity-50">
          <p className="text-xl font-bold">{b}</p>
          <p className="text-xs text-muted-foreground">{bLabel}</p>
        </div>
      </div>
      {/* Mini bar */}
      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-white/5">
        <div
          className="bg-indigo-500 rounded-full transition-all duration-700"
          style={{ width: `${(a / (a + b || 1)) * 100}%` }}
        />
        <div className="bg-white/10 rounded-full flex-1" />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setIsLoading(false); })
      .catch((e) => { setError(e.message); setIsLoading(false); });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-rose-400">
        Failed to load analytics: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          Analytics <BarChart2 className="w-7 h-7 text-indigo-400" />
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Your last 14 days of activity, visualised.</p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CompareCard
          label="Today vs Yesterday"
          a={data.today.total}
          aLabel="Today"
          b={data.yesterday.total}
          bLabel="Yesterday"
        />
        <CompareCard
          label="This Week vs Last Week"
          a={data.thisWeekTotal}
          aLabel="This week"
          b={data.lastWeekTotal}
          bLabel="Last week"
        />
      </div>

      {/* Activity Line Chart */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold">Weekly Activity Trend</h3>
        </div>
        <ActivityLineChart
          thisWeek={data.thisWeek}
          lastWeek={data.lastWeek}
          thisWeekTotal={data.thisWeekTotal}
          lastWeekTotal={data.lastWeekTotal}
        />
      </div>

      {/* Week in Pixels */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold">14-Day Activity Heatmap</h3>
        </div>
        <WeekInPixels data={data.daily} />
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold">Activity Breakdown — Last 14 Days</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          <span className="inline-block w-2 h-2 rounded-sm bg-indigo-400 mr-1" />Tasks
          <span className="inline-block w-2 h-2 rounded-sm bg-emerald-400 mx-1 ml-3" />Habits
          <span className="inline-block w-2 h-2 rounded-sm bg-sky-400 mx-1 ml-3" />Notes
          <span className="inline-block w-2 h-2 rounded-sm bg-amber-400 mx-1 ml-3" />Gym
        </p>
        <ComparisonBarChart data={data.daily} />
      </div>
    </div>
  );
}
