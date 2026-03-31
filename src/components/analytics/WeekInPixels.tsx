"use client";

import { Tooltip, TooltipProps } from "recharts";

interface DayData {
  date: string;
  total: number;
  tasks: number;
  habits: number;
  notes: number;
}

interface WeekInPixelsProps {
  data: DayData[];
}

function getIntensityClass(total: number): string {
  if (total === 0) return "bg-white/5 border-white/5";
  if (total <= 1)  return "bg-indigo-500/20 border-indigo-500/20";
  if (total <= 3)  return "bg-indigo-500/40 border-indigo-500/40";
  if (total <= 6)  return "bg-indigo-500/65 border-indigo-500/65";
  return                 "bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/30";
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function isToday(dateStr: string) {
  return dateStr === new Date().toISOString().split("T")[0];
}

export function WeekInPixels({ data }: WeekInPixelsProps) {
  // Show last 14 days — 2 rows of 7
  const rows = [data.slice(0, 7), data.slice(7, 14)];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-3">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2">
        {days.map(d => (
          <div key={d} className="text-[10px] text-muted-foreground text-center font-medium">{d}</div>
        ))}
      </div>

      {/* Pixel rows */}
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-7 gap-2">
          {row.map((day) => (
            <div key={day.date} className="group relative">
              <div
                className={`
                  aspect-square rounded-lg border transition-all duration-200 cursor-default
                  group-hover:scale-110 group-hover:shadow-md
                  ${getIntensityClass(day.total)}
                  ${isToday(day.date) ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-background" : ""}
                `}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 hidden group-hover:block pointer-events-none">
                <div className="bg-popover border border-border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                  <p className="font-semibold mb-1">{formatDate(day.date)}{isToday(day.date) ? " (Today)" : ""}</p>
                  <p className="text-muted-foreground">✅ {day.tasks} tasks · 🔥 {day.habits} habits · 📝 {day.notes} notes</p>
                  <p className="text-indigo-400 font-medium mt-0.5">{day.total} total actions</p>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-45 -mt-1" />
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-3 justify-end pt-1">
        <span className="text-[10px] text-muted-foreground">Less</span>
        {["bg-white/5", "bg-indigo-500/20", "bg-indigo-500/40", "bg-indigo-500/65", "bg-indigo-500"].map((cls, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${cls} border border-white/10`} />
        ))}
        <span className="text-[10px] text-muted-foreground">More</span>
      </div>
    </div>
  );
}
