"use client";

import { memo } from "react";
import { format, subDays, startOfDay, isSameDay } from "date-fns";
import { IHabit } from "@/models/Habit";
import { cn } from "@/lib/utils";

interface HabitCalendarProps {
  habit: IHabit;
}

// Generate an array of the last 28 days (4 weeks) 
const getLast28Days = () => {
  const days = [];
  const today = startOfDay(new Date());
  for (let i = 27; i >= 0; i--) {
    days.push(subDays(today, i));
  }
  return days;
};

export const HabitCalendar = memo(function HabitCalendar({ habit }: HabitCalendarProps) {
  const days = getLast28Days();
  const hexColor = habit.color || "#6366f1";
  
  // Normalize logs to midnights to cleanly match
  const logs = habit.completionLogs.map(str => startOfDay(new Date(str)).getTime());

  return (
    <div className="flex flex-col gap-2 p-4 bg-card/50 border border-white/5 rounded-2xl">
       <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
           <span className="text-xl">{habit.icon}</span>
           <span className="text-sm font-medium">{habit.name}</span>
         </div>
         <div className="text-xs text-muted-foreground">
           Last 28 Days
         </div>
       </div>

       {/* Heatmap Grid */}
       <div className="grid grid-flow-col grid-rows-4 gap-1.5 mt-2">
         {days.map((date, i) => {
           const isDone = logs.includes(date.getTime());
           const isFuture = date > new Date();

           return (
             <div
               key={date.toISOString()}
               title={format(date, "MMM d, yyyy")}
               className={cn(
                 "w-4 h-4 rounded-sm transition-all",
                 isFuture ? "opacity-0" : "",
                 isDone ? "opacity-100" : "bg-white/5"
               )}
               style={{
                 ...(isDone ? { backgroundColor: hexColor } : {})
               }}
             />
           );
         })}
       </div>
    </div>
  );
});
