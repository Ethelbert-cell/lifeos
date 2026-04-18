"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Plus, Trash2, Clock, Zap, Loader2, Play } from "lucide-react";
import toast from "react-hot-toast";
import { useGymStore, IGymRoutine } from "@/store/useGymStore";
import { RoutineModal } from "@/components/gym/RoutineModal";
import { LogRoutineModal } from "@/components/gym/LogRoutineModal";
import { isToday } from "@/lib/utils";

const WORKOUT_TYPES = [
  { value: "strength", label: "Strength",    emoji: "💪" },
  { value: "cardio",   label: "Cardio",      emoji: "🏃" },
  { value: "hiit",     label: "HIIT",        emoji: "⚡" },
  { value: "flexibility", label: "Flex",     emoji: "🧘" },
  { value: "sports",   label: "Sports",      emoji: "⚽" },
  { value: "other",    label: "Other",       emoji: "🏋️" },
];

const TYPE_COLORS: Record<string, string> = {
  strength: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  cardio:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  hiit:     "text-amber-400 bg-amber-500/10 border-amber-500/20",
  flexibility: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  sports:   "text-rose-400 bg-rose-500/10 border-rose-500/20",
  other:    "text-violet-400 bg-violet-500/10 border-violet-500/20",
};

export default function GymPage() {
  const { routines, logs, streak, isLoading, fetchData, deleteRoutine, deleteLog } = useGymStore();
  
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [activeRoutineId, setActiveRoutineId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  const activeRoutine = routines.find(r => r._id === activeRoutineId);
  const totalDuration = logs.reduce((a, l) => a + l.duration, 0);
  const totalXP = logs.reduce((a, l) => a + l.xpAwarded, 0);

  // 7-day grid 
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    const hasWorkout = logs.some(l => new Date(l.date).toDateString() === ds);
    return { date: d, hasWorkout, label: d.toLocaleDateString("en", { weekday: "short" }) };
  });

  return (
    <>
      <AnimatePresence>
        {showRoutineModal && <RoutineModal onClose={() => setShowRoutineModal(false)} />}
        {activeRoutine && <LogRoutineModal routine={activeRoutine} onClose={() => setActiveRoutineId(null)} />}
      </AnimatePresence>

      <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              Gym Tracker <Dumbbell className="w-8 h-8 text-indigo-400" />
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Design routines, log your stats, get stronger.</p>
          </div>
          <button
            onClick={() => setShowRoutineModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> New Routine
          </button>
        </div>

        {/* Routines Grid (Like Habits) */}
        <div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {routines.map(routine => {
                 // Has this routine been logged today?
                 const didToday = logs.some(l => l.routineId === routine._id && isToday(new Date(l.date)));
                 
                 return (
                   <div 
                     key={routine._id}
                     className={`group relative bg-card border rounded-2xl p-5 overflow-hidden transition-all ${didToday ? 'border-primary/50 bg-primary/5 shadow-md' : 'border-border hover:border-white/20'}`}
                   >
                     {didToday && <div className="absolute inset-0 bg-primary/5 -z-10" style={{ backgroundColor: routine.color, opacity: 0.05 }} />}
                     
                     <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: `${routine.color}20`, color: routine.color }}>
                              {routine.icon}
                           </div>
                           <div>
                              <h3 className="font-bold">{routine.name}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">{routine.templateExercises.length} exercises</p>
                           </div>
                        </div>

                        {/* Action Side */}
                        <div className="flex items-center gap-2">
                           <button onClick={() => { if(confirm("Delete routine?")) deleteRoutine(routine._id); }} className="p-2 text-muted-foreground/30 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all md:opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                           </button>

                           {/* Big Play Button */}
                           <button
                              onClick={() => setActiveRoutineId(routine._id)}
                              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${didToday ? 'cursor-default scale-105 shadow-lg border-transparent text-white' : 'border-border hover:border-foreground/20 cursor-pointer text-muted-foreground hover:text-foreground'}`}
                              style={didToday ? { backgroundColor: routine.color } : undefined}
                           >
                              {didToday ? <Zap className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 ml-0.5" />}
                           </button>
                        </div>
                     </div>
                   </div>
                 );
              })}
           </div>
           
           {routines.length === 0 && (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-card/50 rounded-2xl border border-dashed border-white/10">
                 <div className="text-4xl mb-4 text-indigo-400">📝</div>
                 <h3 className="text-lg font-medium text-foreground">No templates yet</h3>
                 <p className="text-sm text-muted-foreground mt-1 max-w-sm">Create a routine template first. E.g. "Push Day" or "Morning Yoga".</p>
             </div>
           )}
        </div>

        {/* 7-Day & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Activity</h2>
              <div className="grid grid-cols-7 gap-2">
                {last7.map(({ date, hasWorkout, label }, i) => {
                  const isCurrentDay = isToday(date);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <span className="text-xs text-muted-foreground font-medium">{label}</span>
                      <div className={`w-full aspect-square max-w-[3rem] rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                        hasWorkout ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" : isCurrentDay ? "border-indigo-500/30 border-dashed text-muted-foreground" : "border-border text-muted-foreground/30"
                      }`}>
                        {hasWorkout ? <Dumbbell className="w-4 h-4" /> : <span className="text-lg">{isCurrentDay ? "⚡" : "·"}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
           </div>

           <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-center gap-6">
              <div className="flex justify-between items-center bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                 <div className="flex gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                       <p className="font-bold text-amber-500">{streak} Day Streak</p>
                       <p className="text-xs text-amber-500/70">Keep it up!</p>
                    </div>
                 </div>
              </div>
              <div className="flex justify-between">
                 <div>
                    <span className="text-2xl text-emerald-400">⏱️</span>
                    <p className="font-bold text-lg">{Math.round(totalDuration/60)}h {totalDuration%60}m</p>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                 </div>
                 <div>
                    <span className="text-2xl text-violet-400">⚡</span>
                    <p className="font-bold text-lg">{totalXP.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">XP Earned</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Recent Logs (The Diary) */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Workout Logbook</h2>
          {logs.length === 0 ? (
            <div className="text-center py-10 bg-card border rounded-2xl text-muted-foreground text-sm">No gym sessions logged yet.</div>
          ) : (
            <div className="space-y-3">
              {logs.map(log => {
                const typeInfo = WORKOUT_TYPES.find(t => t.value === log.workoutType) ?? WORKOUT_TYPES[0];
                const colorClass = TYPE_COLORS[log.workoutType] ?? TYPE_COLORS.other;
                const routineLinked = routines.find(r => r._id === log.routineId);

                return (
                  <motion.div key={log._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 bg-card border rounded-2xl group">
                    <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${colorClass} shrink-0`}>
                          {routineLinked ? routineLinked.icon : typeInfo.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{log.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span>{new Date(log.date).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{log.duration}m</span>
                            {log.exercises.length > 0 && <><span>•</span> <span>{log.exercises.length} exercises</span></>}
                          </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-border">
                      <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">+{log.xpAwarded} XP</span>
                      <button onClick={() => { if(confirm("Remove this log?")) deleteLog(log._id); }} className="p-1.5 rounded-lg text-muted-foreground/30 hover:text-rose-500 hover:bg-rose-500/10 md:opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
