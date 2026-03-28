"use client";

import { motion } from "framer-motion";
import { Clock, Target, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { IGoal } from "@/models/Goal";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: IGoal;
  onClick: (goal: IGoal) => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const isCompleted = goal.status === 'completed';
  
  // Progress math
  const totalMilestones = goal.milestones?.length || 0;
  const completedMilestones = goal.milestones?.filter(m => m.completed).length || 0;
  const progressPercent = totalMilestones > 0 
      ? Math.round((completedMilestones / totalMilestones) * 100) 
      : (isCompleted ? 100 : 0);

  // Time math
  let timeRemaining = "";
  let isOverdue = false;
  if (goal.targetDate) {
      const date = new Date(goal.targetDate);
      if (isPast(date) && !isCompleted) {
          isOverdue = true;
          timeRemaining = formatDistanceToNow(date) + " overdue";
      } else {
          timeRemaining = formatDistanceToNow(date, { addSuffix: true });
      }
  }

  // Visuals
  const categoryColors: Record<string, string> = {
      'personal': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      'health': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'career': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      'learning': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'finance': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  const badgeColor = categoryColors[goal.category] || categoryColors.personal;

  return (
    <div 
      onClick={() => onClick(goal)}
      className="bg-card border border-white/5 rounded-2xl p-5 hover:border-white/20 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full group"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
         <div>
            <div className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border mb-2", badgeColor)}>
               {goal.category}
            </div>
            <h3 className={cn("font-bold text-lg leading-tight line-clamp-2", isCompleted && "text-muted-foreground")}>
               {goal.title}
            </h3>
         </div>
         {isCompleted && <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />}
      </div>

      <div className="flex-1">
         {goal.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
               {goal.description}
            </p>
         )}
      </div>

      <div className="mt-auto space-y-4 pt-4 border-t border-white/5">
         {/* Progress Bar */}
         <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
               <span className="text-muted-foreground">Progress</span>
               <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                      "h-full rounded-full",
                      isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-indigo-400"
                  )}
               />
            </div>
            <div className="text-[10px] text-muted-foreground/60 text-right">
               {completedMilestones} / {totalMilestones} milestones
            </div>
         </div>

         {/* Meta Footer */}
         <div className="flex items-center gap-4 text-xs font-medium">
            {goal.targetDate && (
                <div className={cn(
                   "flex items-center gap-1.5",
                   isOverdue ? "text-rose-500" : "text-muted-foreground"
                )}>
                   <Clock className="w-3.5 h-3.5" />
                   {timeRemaining}
                </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground ml-auto">
                <Target className="w-3.5 h-3.5" />
                {isCompleted ? 'Achieved' : 'Active'}
            </div>
         </div>
      </div>
    </div>
  );
}
