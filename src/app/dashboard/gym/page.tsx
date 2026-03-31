"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Flame, Plus, Trash2, Clock, Zap, ChevronRight, X, Loader2, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
}

interface GymLog {
  _id: string;
  title: string;
  workoutType: string;
  duration: number;
  exercises: Exercise[];
  date: string;
  xpAwarded: number;
  notes?: string;
}

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

function LogWorkoutModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("strength");
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([{ name: "" }]);
  const [saving, setSaving] = useState(false);

  const addExercise = () => setExercises(prev => [...prev, { name: "" }]);
  const removeExercise = (i: number) => setExercises(prev => prev.filter((_, idx) => idx !== i));
  const updateExercise = (i: number, field: keyof Exercise, value: string | number) =>
    setExercises(prev => prev.map((ex, idx) => idx === i ? { ...ex, [field]: value } : ex));

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Workout title is required");
    if (duration < 1)  return toast.error("Duration must be at least 1 minute");

    setSaving(true);
    try {
      const res = await fetch("/api/gym", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, workoutType: type, duration,
          exercises: exercises.filter(e => e.name.trim()),
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Workout logged! +${data.xpGained} XP 💪`, { icon: "🏋️" });
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-indigo-400" /> Log Workout
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Workout Name</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Upper Body Power"
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          {/* Type + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {WORKOUT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Duration (min)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exercises</label>
              <button onClick={addExercise} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors">
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {exercises.map((ex, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={ex.name}
                    onChange={e => updateExercise(i, "name", e.target.value)}
                    placeholder={`Exercise ${i + 1}`}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <input
                    type="number" min={1}
                    value={ex.sets ?? ""}
                    onChange={e => updateExercise(i, "sets", Number(e.target.value))}
                    placeholder="Sets"
                    className="w-16 px-2 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none text-center"
                  />
                  <input
                    type="number" min={1}
                    value={ex.reps ?? ""}
                    onChange={e => updateExercise(i, "reps", Number(e.target.value))}
                    placeholder="Reps"
                    className="w-16 px-2 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none text-center"
                  />
                  {exercises.length > 1 && (
                    <button onClick={() => removeExercise(i)} className="p-1.5 text-muted-foreground hover:text-rose-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="How did it feel? PRs? Any notes..."
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Dumbbell className="w-4 h-4" />}
            {saving ? "Saving…" : "Log Workout (+25 XP)"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GymPage() {
  const [logs, setLogs] = useState<GymLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchLogs = async () => {
    const res = await fetch("/api/gym?days=30");
    const data = await res.json();
    setLogs(data.logs ?? []);
    setStreak(data.streak ?? 0);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/gym?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Workout removed");
      setLogs(prev => prev.filter(l => l._id !== id));
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const totalDuration = logs.reduce((a, l) => a + l.duration, 0);
  const totalXP = logs.reduce((a, l) => a + l.xpAwarded, 0);

  // Build the last 7-day workout grid
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const ds = d.toDateString();
    const hasWorkout = logs.some(l => new Date(l.date).toDateString() === ds);
    return { date: d, hasWorkout, label: d.toLocaleDateString("en", { weekday: "short" }) };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <LogWorkoutModal onClose={() => setShowModal(false)} onSaved={fetchLogs} />
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              Gym Tracker <Dumbbell className="w-8 h-8 text-indigo-400" />
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Log workouts, build streaks, earn XP.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Log Workout
          </button>
        </div>

        {/* Streak Banner */}
        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl"
          >
            <span className="text-3xl">🔥</span>
            <div>
              <p className="font-bold text-amber-400">{streak}-Day Gym Streak!</p>
              <p className="text-xs text-muted-foreground">
                {streak >= 7 ? "You earned the 7-day streak bonus! +50 XP 🏆" : `${7 - streak} more day${7 - streak !== 1 ? "s" : ""} to unlock the streak bonus (+50 XP)`}
              </p>
            </div>
          </motion.div>
        )}

        {/* 7-Day Activity Grid */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">This Week</h2>
          <div className="grid grid-cols-7 gap-2">
            {last7.map(({ date, hasWorkout, label }, i) => {
              const isToday = date.toDateString() === new Date().toDateString();
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                    hasWorkout
                      ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
                      : isToday
                      ? "border-indigo-500/30 border-dashed text-muted-foreground"
                      : "border-border text-muted-foreground/30"
                  }`}>
                    {hasWorkout ? <Dumbbell className="w-5 h-5" /> : <span className="text-lg">{isToday ? "⚡" : "·"}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Workouts",    value: logs.length,                    icon: "🏋️", color: "text-indigo-400" },
            { label: "Gym Streak",  value: `${streak}d`,                   icon: "🔥", color: "text-amber-400" },
            { label: "Total Time",  value: `${Math.round(totalDuration/60)}h ${totalDuration%60}m`, icon: "⏱️", color: "text-emerald-400" },
            { label: "XP Earned",   value: totalXP.toLocaleString(),       icon: "⚡", color: "text-violet-400" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className="text-2xl mb-1">{s.icon}</div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Instructor CTA */}
        <Link
          href="/dashboard/gym/instructor"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl hover:border-indigo-500/40 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl">🧑‍🏫</div>
            <div>
              <p className="font-semibold text-sm">Work with an Instructor</p>
              <p className="text-xs text-muted-foreground">Browse certified trainers and book sessions</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Recent Logs */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Workouts</h2>
          {logs.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <span className="text-5xl">🏋️</span>
              <p className="text-muted-foreground mt-3 text-sm">No workouts logged yet.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all"
              >
                Log your first workout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map(log => {
                const typeInfo = WORKOUT_TYPES.find(t => t.value === log.workoutType) ?? WORKOUT_TYPES[0];
                const colorClass = TYPE_COLORS[log.workoutType] ?? TYPE_COLORS.other;
                return (
                  <motion.div
                    key={log._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-2xl hover:border-indigo-500/30 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${colorClass} shrink-0`}>
                      {typeInfo.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{log.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <Clock className="w-3 h-3" />{log.duration} min
                        <span>·</span>
                        {new Date(log.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                        {log.exercises.length > 0 && <><span>·</span> {log.exercises.length} exercises</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" />+{log.xpAwarded}
                      </span>
                      <button
                        onClick={() => handleDelete(log._id)}
                        disabled={deleting === log._id}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        {deleting === log._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
