"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Check, Trash2 } from "lucide-react";
import { IHabit } from "@/models/Habit";
import { isToday } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useHabitStore } from "@/store/useHabitStore";
import { useUserStore } from "@/store/useUserStore";

interface HabitCardProps {
  habit: IHabit;
  onCheckIn: (habitId: string) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
}

export function HabitCard({ habit, onCheckIn, onDelete }: HabitCardProps) {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const { addLocalXp } = useUserStore();
  const hexColor = habit.color || "#6366f1"; // Default indigo
  
  // A habit is checked in today if any completion log matches `isToday()`
  const checkedInToday = habit.completionLogs.some((d: any) => isToday(new Date(d)));

  const handleCircleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (checkedInToday || isCheckingIn) return;

    setIsCheckingIn(true);
    try {
      await onCheckIn(String(habit._id));
    } catch (err: any) {
      toast.error(err.message || "Failed to check in");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="relative group bg-card border border-white/10 rounded-2xl p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-4"
    >
      {/* Subtle Background Glow if accomplished today */}
      {checkedInToday && (
         <div 
           className="absolute inset-0 opacity-[0.03] transition-opacity duration-1000"
           style={{ backgroundColor: hexColor }}
         />
      )}

      {/* Info Side */}
      <div className="flex items-center gap-4 relative z-10">
        <div 
           className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
           style={{ backgroundColor: `${hexColor}15`, color: hexColor }}
        >
          {habit.icon || "✨"}
        </div>
        
        <div>
           <h3 className="font-semibold text-lg line-clamp-1">{habit.name}</h3>
           <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
             <div className="flex items-center gap-1">
                <Flame className={cn("w-4 h-4", habit.streak > 0 ? "text-orange-500 fill-orange-500/20" : "opacity-40")} />
                <span className={cn(habit.streak > 0 && "font-medium text-foreground")}>
                  {habit.streak} day streak
                </span>
             </div>
             {habit.longestStreak > 0 && (
                <span className="opacity-50 text-xs">Best: {habit.longestStreak}</span>
             )}
           </div>
        </div>
      </div>

      {/* Action Side */}
      <div className="flex items-center gap-3 relative z-10">
        
        {/* Delete Button (Hover Reveal) */}
        {!checkedInToday && (
          <button
            onClick={() => onDelete(String(habit._id))}
            className="p-2 text-rose-500/0 hover:text-rose-500 group-hover:text-rose-500/50 hover:bg-rose-500/10 rounded-full transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* The Big Circle */}
        <button
          onClick={handleCircleClick}
          disabled={checkedInToday || isCheckingIn}
          className={cn(
             "relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
             checkedInToday ? "border-transparent cursor-default scale-105 shadow-md" : "border-white/20 hover:border-white/40 cursor-pointer hover:scale-105 active:scale-95"
          )}
          style={{
             ...(checkedInToday ? { backgroundColor: hexColor } : {})
          }}
        >
          <AnimatePresence>
            {checkedInToday && (
               <motion.div
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="text-white"
               >
                 <Check className="w-6 h-6 stroke-[3]" />
               </motion.div>
            )}
          </AnimatePresence>
          
          {/* Unchecked state hover effect inside the style inject */}
        </button>
      </div>
    </motion.div>
  );
}
