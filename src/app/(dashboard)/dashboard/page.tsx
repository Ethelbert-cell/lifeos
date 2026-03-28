"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useHabitStore } from "@/store/useHabitStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useNoteStore } from "@/store/useNoteStore";
import { useUserStore } from "@/store/useUserStore";
import { CheckSquare, Flame, TrendingUp, BookText, Zap, ChevronRight, Activity, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardIndex() {
  const { user } = useUserStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { habits, fetchHabits } = useHabitStore();
  const { goals, fetchGoals } = useGoalStore();
  const { notes, fetchNotes } = useNoteStore();
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchHabits();
    fetchGoals();
    fetchNotes();
    setMounted(true);
  }, []);

  if (!mounted || !user) return null;

  // Calculables
  const activeTasks = tasks.filter(t => t.status !== "done").length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  
  const activeHabits = habits.length;
  const habitsCheckedToday = habits.filter(h => {
     if (!h.completionLogs || h.completionLogs.length === 0) return false;
     const lastDate = new Date(h.completionLogs[h.completionLogs.length - 1]);
     const today = new Date();
     return lastDate.toDateString() === today.toDateString();
  }).length;

  const totalNotes = notes.length;
  
  const activeGoals = goals.filter(g => g.status === 'active').length;
  const avgGoalProgress = goals.length > 0 ? goals.reduce((acc, g) => acc + g.progress, 0) / goals.length : 0;

  return (
    <div className="flex flex-col h-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
       
       <header className="flex flex-col md:flex-row justify-between md:items-end gap-6 pt-6">
          <div className="space-y-2">
             <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
               Dashboard <Flame className="w-8 h-8 text-orange-500 fill-orange-500/20" />
             </h1>
             <p className="text-muted-foreground text-lg">
                Level {user.level} Gamified Control Center
             </p>
          </div>
       </header>

       {/* Kpi Grid */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Zap} iconColor="text-amber-500" iconBg="bg-amber-500/10"
            title="Total XP" value={user.xp.toLocaleString()} 
            subtitle={`Lvl ${user.level} currently`} 
          />
          <StatCard 
            icon={CheckSquare} iconColor="text-indigo-500" iconBg="bg-indigo-500/10"
            title="Tasks Done" value={completedTasks} 
            subtitle={`${activeTasks} tasks pending`} 
          />
          <StatCard 
            icon={Activity} iconColor="text-emerald-500" iconBg="bg-emerald-500/10"
            title="Habit Hit Rate" value={`${habitsCheckedToday}/${activeHabits}`} 
            subtitle="Completed today" 
          />
          <StatCard 
            icon={Target} iconColor="text-rose-500" iconBg="bg-rose-500/10"
            title="Goal Progress" value={`${Math.round(avgGoalProgress)}%`} 
            subtitle={`${activeGoals} active goals`} 
          />
       </div>

       {/* Wide Action Links */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          <Link href="/dashboard/tasks" className="p-6 rounded-2xl bg-card border border-white/5 shadow-sm hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group flex items-start gap-4">
             <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center shrink-0 bg-background/50 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                <CheckSquare />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                   Kanban Workspace <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                   Drag-and-drop your daily tickets. Earning <span className="text-amber-400 font-semibold">+25 XP</span> each time.
                </p>
             </div>
          </Link>

          <Link href="/dashboard/habits" className="p-6 rounded-2xl bg-card border border-white/5 shadow-sm hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group flex items-start gap-4">
             <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center shrink-0 bg-background/50 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <TrendingUp />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                   Habit Heatmaps <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                   Track 28 day consecutive chains and unlock massive streak milestone XP multipliers.
                </p>
             </div>
          </Link>

          <Link href="/dashboard/notes" className="p-6 rounded-2xl bg-card border border-white/5 shadow-sm hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group flex items-start gap-4">
             <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center shrink-0 bg-background/50 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                <BookText />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-bold group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                   Rich Markdown Notes <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                   Instantly searchable second brain indexing spanning {totalNotes} encrypted notes globally.
                </p>
             </div>
          </Link>
          
          <Link href="/dashboard/goals" className="p-6 rounded-2xl bg-card border border-white/5 shadow-sm hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group flex items-start gap-4">
             <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center shrink-0 bg-background/50 text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
                <Target />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-bold group-hover:text-rose-400 transition-colors flex items-center justify-between">
                   Active Goals <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                   Define monumental roadmaps and complete milestones to level up exponentially.
                </p>
             </div>
          </Link>

       </div>
    </div>
  );
}

// Micro Component
function StatCard({ icon: Icon, title, value, subtitle, iconColor, iconBg }: any) {
  return (
    <div className="bg-card border border-white/5 p-5 rounded-2xl shadow-sm hover:border-white/10 transition-colors">
       <div className={cn("inline-flex p-2.5 rounded-xl mb-4", iconBg, iconColor)}>
          <Icon className="w-5 h-5" />
       </div>
       <div className="space-y-1">
         <p className="text-sm font-medium text-muted-foreground">{title}</p>
         <p className="text-3xl font-black">{typeof value === 'number' ? value.toLocaleString() : value}</p>
         {subtitle && <p className="text-xs text-muted-foreground opacity-80">{subtitle}</p>}
       </div>
    </div>
  )
}
