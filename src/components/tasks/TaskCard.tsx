"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Flag, Calendar, GripVertical, CheckCircle2 } from "lucide-react";
import { ITask } from "@/models/Task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: ITask;
  onClick: (task: ITask) => void;
  onQuickComplete: (e: React.MouseEvent, task: ITask) => void;
}

export function TaskCard({ task, onClick, onQuickComplete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Priority styling
  const priorityColors = {
    low: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <div
      onClick={() => onClick(task)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative bg-card border shadow-sm rounded-xl p-3 flex flex-col gap-3 cursor-pointer transition-all",
        "hover:shadow-md hover:border-foreground/20",
        task.status === "done" ? "opacity-60 border-white/5" : "border-white/10"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className={cn(
          "font-medium text-sm leading-snug line-clamp-2",
          task.status === "done" && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h4>
        <div 
          className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-grab active:cursor-grabbing p-1 -m-1"
          {...{ 'data-drag-handle': true }}
        >
          <GripVertical className="w-4 h-4" />
        </div>
      </div>

      {(task.tags?.length > 0 || task.dueDate || task.priority) && (
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-1">
          {/* Priority Badge */}
          {task.status !== 'done' && (
             <div className={cn("flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-sm border", priorityColors[task.priority])}>
               <Flag className="w-3 h-3" />
               {task.priority}
             </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1.5 text-xs text-muted-foreground",
              new Date(task.dueDate) < new Date() && task.status !== 'done' && "text-rose-500 font-medium"
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
        </div>
      )}
      
      {/* Quick Complete Action Button */}
      {task.status !== 'done' && (
        <button
          onClick={(e) => onQuickComplete(e, task)}
          className={cn(
            "absolute bottom-3 right-3 p-1.5 rounded-full bg-background border border-white/10 shadow-sm text-muted-foreground transition-all duration-200",
            "hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:scale-110",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
