"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Target } from "lucide-react";
import { useGoalStore } from "@/store/useGoalStore";
import { GoalCard } from "@/components/goals/GoalCard";
import { GoalModal } from "@/components/goals/GoalModal";
import { IGoal } from "@/models/Goal";
import { cn } from "@/lib/utils";

const CATEGORIES = ["all", "personal", "health", "career", "learning", "finance"];

export default function GoalsPage() {
  const { goals, fetchGoals, isLoading } = useGoalStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState<IGoal | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleOpenNew = () => {
     setActiveGoal(null);
     setModalOpen(true);
  };

  const handleOpenEdit = (goal: IGoal) => {
     setActiveGoal(goal);
     setModalOpen(true);
  };

  const filteredGoals = useMemo(() => {
     return goals.filter(g => activeFilter === "all" || g.category === activeFilter);
  }, [goals, activeFilter]);

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1 text-sm">Break massive milestones down into actionable steps.</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
         {CATEGORIES.map(cat => (
             <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={cn(
                   "px-4 py-1.5 rounded-full text-sm font-medium capitalize tracking-wide transition-colors whitespace-nowrap",
                   activeFilter === cat 
                     ? "bg-foreground text-background" 
                     : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
             >
                {cat}
             </button>
         ))}
      </div>

      {/* Goals Masonry/Grid */}
      {isLoading && goals.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              <div className="h-64 bg-white/5 rounded-2xl" />
              <div className="h-64 bg-white/5 rounded-2xl" />
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredGoals.map((goal) => (
                 <GoalCard 
                    key={String(goal._id)} 
                    goal={goal} 
                    onClick={handleOpenEdit} 
                 />
             ))}

             {filteredGoals.length === 0 && !isLoading && (
                 <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-card/50 rounded-2xl border border-dashed border-white/10 mt-4">
                     <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                        <Target className="w-8 h-8 text-indigo-500" />
                     </div>
                     <h3 className="text-lg font-medium text-foreground">
                         {activeFilter === "all" ? "No monumental goals yet" : `No goals in ${activeFilter}`}
                     </h3>
                     <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                         Decide what you really want, set a target date, and start moving towards it.
                     </p>
                 </div>
             )}
          </div>
      )}

      {/* Modal */}
      {modalOpen && (
          <GoalModal goal={activeGoal} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
