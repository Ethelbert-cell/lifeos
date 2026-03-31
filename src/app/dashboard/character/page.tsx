"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";
import { xpProgress } from "@/lib/utils";
import { Swords, Zap, Flame, Trophy, Shield, Star, Target, Loader2, CheckSquare, BookText } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { useHabitStore } from "@/store/useHabitStore";
import { useGoalStore } from "@/store/useGoalStore";

// ─── Tier definitions (matches settings page) ───────────────────────────────
const TIERS = [
  { min: 1,   max: 9,   title: "Novice",     color: "from-slate-500 to-slate-600",   text: "text-slate-300",   ring: "ring-slate-500/40",   emoji: "🥉" },
  { min: 10,  max: 24,  title: "Apprentice", color: "from-green-500 to-emerald-600", text: "text-emerald-300", ring: "ring-emerald-500/40", emoji: "🌿" },
  { min: 25,  max: 49,  title: "Adept",      color: "from-blue-500 to-indigo-600",   text: "text-indigo-300",  ring: "ring-indigo-500/40",  emoji: "🔷" },
  { min: 50,  max: 74,  title: "Champion",   color: "from-violet-500 to-purple-600", text: "text-violet-300",  ring: "ring-violet-500/40",  emoji: "💎" },
  { min: 75,  max: 99,  title: "Legend",     color: "from-amber-400 to-orange-500",  text: "text-amber-300",   ring: "ring-amber-400/40",   emoji: "👑" },
  { min: 100, max: Infinity, title: "Mythic",color: "from-rose-500 to-pink-600",     text: "text-rose-300",    ring: "ring-rose-500/40",    emoji: "🌟" },
];

function getTier(level: number) {
  return TIERS.find(t => level >= t.min && level <= t.max) ?? TIERS[0];
}

// ─── All possible achievements ────────────────────────────────────────────────
const ALL_ACHIEVEMENTS = [
  { id: "first_task",    title: "First Step",       desc: "Complete your first task",       icon: "✅", category: "tasks",  xp: 25  },
  { id: "task_10",       title: "Getting Things Done", desc: "Complete 10 tasks",            icon: "📋", category: "tasks",  xp: 50  },
  { id: "task_50",       title: "Task Master",       desc: "Complete 50 tasks",              icon: "🏆", category: "tasks",  xp: 100 },
  { id: "first_habit",   title: "Habit Formed",      desc: "Check in on a habit",            icon: "🔄", category: "habits", xp: 25  },
  { id: "streak_7",      title: "Week Warrior",      desc: "Achieve a 7-day streak",         icon: "🔥", category: "streak", xp: 50  },
  { id: "streak_30",     title: "Iron Will",         desc: "Achieve a 30-day streak",        icon: "⚡", category: "streak", xp: 200 },
  { id: "first_goal",    title: "Dream Big",         desc: "Set your first goal",            icon: "🎯", category: "goals",  xp: 25  },
  { id: "goal_done",     title: "Goal Crusher",      desc: "Complete a goal",                icon: "💪", category: "goals",  xp: 100 },
  { id: "first_note",    title: "Knowledge Seeker",  desc: "Write your first note",          icon: "📝", category: "notes",  xp: 25  },
  { id: "note_10",       title: "Chronicler",        desc: "Write 10 notes",                 icon: "📚", category: "notes",  xp: 50  },
  { id: "first_gym",     title: "First Rep",         desc: "Log your first workout",         icon: "🏋️", category: "gym",    xp: 25  },
  { id: "gym_streak_7",  title: "Gym Warrior",       desc: "7-day gym streak",               icon: "💪", category: "gym",    xp: 50  },
  { id: "xp_100",        title: "XP Collector",      desc: "Earn 100 XP",                    icon: "⭐", category: "xp",     xp: 0   },
  { id: "xp_500",        title: "Power Leveller",    desc: "Earn 500 XP",                    icon: "🌟", category: "xp",     xp: 0   },
  { id: "xp_1000",       title: "Thousand Club",     desc: "Earn 1000 XP",                   icon: "💎", category: "xp",     xp: 0   },
  { id: "level_10",      title: "Apprentice Class",  desc: "Reach Level 10",                 icon: "🔷", category: "xp",     xp: 100 },
  { id: "level_25",      title: "Adept Ascension",   desc: "Reach Level 25",                 icon: "🌀", category: "xp",     xp: 250 },
];

function StatBar({ label, value, max, color, icon }: { label: string; value: number; max: number; color: string; icon: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium">
          <span>{icon}</span> {label}
        </span>
        <span className="text-muted-foreground text-xs">{value} / {max}</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function AchievementBadge({ achievement, unlocked, unlockedAt }: {
  achievement: typeof ALL_ACHIEVEMENTS[0];
  unlocked: boolean;
  unlockedAt?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: unlocked ? 1.04 : 1 }}
      className={`relative p-4 rounded-2xl border flex flex-col items-center gap-2 text-center transition-all ${
        unlocked
          ? "bg-card border-indigo-500/30 shadow-sm"
          : "bg-muted/50 border-border opacity-50 grayscale"
      }`}
    >
      {unlocked && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      )}
      <span className="text-3xl">{achievement.icon}</span>
      <div>
        <p className="text-xs font-bold leading-tight">{achievement.title}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{achievement.desc}</p>
      </div>
      {unlocked && unlockedAt && (
        <p className="text-[10px] text-indigo-400 font-semibold">
          {new Date(unlockedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
        </p>
      )}
      {!unlocked && (
        <p className="text-[10px] text-muted-foreground">+{achievement.xp} XP</p>
      )}
    </motion.div>
  );
}

export default function CharacterPage() {
  const { data: session } = useSession();
  const { user, fetchUser } = useUserStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { habits, fetchHabits } = useHabitStore();
  const { goals, fetchGoals } = useGoalStore();

  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    setMounted(true);
    fetchUser();
    fetchTasks();
    fetchHabits();
    fetchGoals();
    fetch("/api/achievements")
      .then(r => r.json())
      .then(d => setUnlockedAchievements(d.achievements ?? []))
      .catch(() => {});
  }, []);

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const { level, percent, currentXP, xpToNext } = xpProgress(user.xp);
  const tier = getTier(level);
  const initials = session?.user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  // Compute stats for RPG bars
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const activeHabits = habits.length;
  const completedGoals = goals.filter(g => g.status === "completed").length;

  // Derive "unlocked" achievements based on real user data
  const derivedUnlocked = new Set(
    unlockedAchievements.map((a: any) => a.achievementId)
  );

  // Also derive from current data (achievements API might lag)
  if (completedTasks >= 1) derivedUnlocked.add("first_task");
  if (completedTasks >= 10) derivedUnlocked.add("task_10");
  if (completedTasks >= 50) derivedUnlocked.add("task_50");
  if (activeHabits >= 1) derivedUnlocked.add("first_habit");
  if ((user.streak ?? 0) >= 7) derivedUnlocked.add("streak_7");
  if ((user.streak ?? 0) >= 30) derivedUnlocked.add("streak_30");
  if (goals.length >= 1) derivedUnlocked.add("first_goal");
  if (completedGoals >= 1) derivedUnlocked.add("goal_done");
  if (user.xp >= 100) derivedUnlocked.add("xp_100");
  if (user.xp >= 500) derivedUnlocked.add("xp_500");
  if (user.xp >= 1000) derivedUnlocked.add("xp_1000");
  if (level >= 10) derivedUnlocked.add("level_10");
  if (level >= 25) derivedUnlocked.add("level_25");

  const CATEGORIES = ["all", "tasks", "habits", "streak", "goals", "notes", "gym", "xp"];

  const filtered = ALL_ACHIEVEMENTS.filter(
    a => activeFilter === "all" || a.category === activeFilter
  );

  const unlockedCount = ALL_ACHIEVEMENTS.filter(a => derivedUnlocked.has(a.id)).length;

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          Character <Swords className="w-8 h-8 text-indigo-400" />
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Your progression, tier, and achievements.</p>
      </div>

      {/* Character Card */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${tier.color} rounded-2xl p-8 text-white shadow-2xl`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex items-center gap-6">
          {/* Avatar */}
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt="Avatar"
              className={`w-20 h-20 rounded-2xl ring-4 ${tier.ring} object-cover shrink-0`}
            />
          ) : (
            <div className={`w-20 h-20 rounded-2xl ring-4 ${tier.ring} bg-white/20 flex items-center justify-center text-3xl font-black shrink-0`}>
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{tier.emoji}</span>
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">{tier.title}</span>
            </div>
            <h2 className="text-2xl font-black truncate">{session?.user?.name ?? "Hero"}</h2>
            <p className={`text-sm opacity-80 mt-0.5`}>Level {level} · {user.xp.toLocaleString()} XP total</p>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <p className="text-4xl font-black">{level}</p>
            <p className="text-xs opacity-70 uppercase tracking-widest">Level</p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="relative mt-6">
          <div className="flex justify-between text-xs opacity-70 mb-1.5">
            <span>{currentXP.toLocaleString()} XP</span>
            <span>{xpToNext.toLocaleString()} to Level {level + 1}</span>
          </div>
          <div className="h-3 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-white/70"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Daily Streak",   value: user.streak ?? 0,  suffix: "d",   icon: <Flame className="w-5 h-5 text-amber-400" />,  bg: "bg-amber-500/10" },
          { label: "Tasks Done",     value: completedTasks,    suffix: "",    icon: <CheckSquare className="w-5 h-5 text-indigo-400" />, bg: "bg-indigo-500/10" },
          { label: "Goals Crushed",  value: completedGoals,    suffix: "",    icon: <Target className="w-5 h-5 text-rose-400" />,    bg: "bg-rose-500/10" },
          { label: "Achievements",   value: `${unlockedCount}/${ALL_ACHIEVEMENTS.length}`, suffix: "", icon: <Trophy className="w-5 h-5 text-violet-400" />, bg: "bg-violet-500/10" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
            <div className={`inline-flex p-2.5 rounded-xl ${s.bg} mb-3`}>{s.icon}</div>
            <p className="text-2xl font-black">{s.value}{s.suffix}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* RPG Stat Bars */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h2 className="font-bold text-base flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" /> Character Stats
        </h2>
        <StatBar label="Productivity" value={completedTasks} max={100} color="bg-gradient-to-r from-indigo-500 to-violet-500" icon="⚡" />
        <StatBar label="Consistency"  value={user.streak ?? 0} max={30}  color="bg-gradient-to-r from-amber-400 to-orange-500"  icon="🔥" />
        <StatBar label="Goal Power"   value={completedGoals} max={20}   color="bg-gradient-to-r from-rose-500 to-pink-500"      icon="🎯" />
        <StatBar label="Total XP"     value={Math.min(user.xp, 5000)} max={5000} color="bg-gradient-to-r from-emerald-400 to-teal-500"   icon="🌟" />
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Achievements
            <span className="text-xs font-normal text-muted-foreground">({unlockedCount} / {ALL_ACHIEVEMENTS.length})</span>
          </h2>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`capitalize px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeFilter === cat
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-card text-muted-foreground border-border hover:border-indigo-500/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((achievement, i) => {
            const ua = unlockedAchievements.find((a: any) => a.achievementId === achievement.id);
            return (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                unlocked={derivedUnlocked.has(achievement.id)}
                unlockedAt={ua?.unlockedAt}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
