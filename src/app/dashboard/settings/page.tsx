"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useUserStore } from "@/store/useUserStore";
import { xpProgress } from "@/lib/utils";
import { 
  Download, LogOut, User, Shield, Zap, Sun, Moon, Monitor,
  Trophy, Trash2, AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const TIER_THRESHOLDS = [
  { min: 1,  max: 9,  title: "Novice",     color: "text-slate-400",   bg: "bg-slate-500/10"   },
  { min: 10, max: 24, title: "Apprentice", color: "text-green-400",   bg: "bg-green-500/10"   },
  { min: 25, max: 49, title: "Adept",      color: "text-blue-400",    bg: "bg-blue-500/10"    },
  { min: 50, max: 74, title: "Champion",   color: "text-violet-400",  bg: "bg-violet-500/10"  },
  { min: 75, max: 99, title: "Legend",     color: "text-amber-400",   bg: "bg-amber-500/10"   },
  { min: 100, max: Infinity, title: "Mythic", color: "text-rose-400", bg: "bg-rose-500/10"    },
];

function getTier(level: number) {
  return TIER_THRESHOLDS.find(t => level >= t.min && level <= t.max) ?? TIER_THRESHOLDS[0];
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Mounted guard: theme=undefined on server → active-button class mismatch → hydration crash
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const xp = user?.xp ?? 0;
  const { level, currentXP, xpToNext, percent } = xpProgress(xp);
  const tier = getTier(level);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lifeos-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded!", { icon: "📦" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your profile, data, and account.</p>
      </div>

      {/* ── Profile Card ── */}
      <section className="bg-card border border-border rounded-2xl p-6 flex items-center gap-6">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Avatar"
            width={72}
            height={72}
            className="rounded-full ring-4 ring-indigo-500/20"
          />
        ) : (
          <div className="w-18 h-18 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <User className="w-8 h-8 text-indigo-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold truncate">{session?.user?.name ?? "LifeOS User"}</h2>
          <p className="text-sm text-muted-foreground truncate">{session?.user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.bg} ${tier.color}`}>
              {tier.title}
            </span>
            <span className="text-xs text-muted-foreground">· Level {level}</span>
          </div>
        </div>
      </section>

      {/* ── XP Progress ── */}
      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold">XP Progress</h3>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>{currentXP.toLocaleString()} XP this level</span>
          <span>{xpToNext.toLocaleString()} XP to Level {level + 1}</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <Stat icon={<Trophy className="w-4 h-4 text-amber-400" />} label="Total XP" value={xp.toLocaleString()} />
          <Stat icon={<Shield className="w-4 h-4 text-indigo-400" />} label="Level" value={String(level)} />
          <Stat icon={<Zap className="w-4 h-4 text-violet-400" />} label="Streak" value={`${user?.streak ?? 0} days`} />
        </div>
      </section>

      {/* ── Lifetime Stats ── */}
      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Lifetime Activity
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MiniStat icon="✅" label="Tasks" />
          <MiniStat icon="🔥" label="Habits" />
          <MiniStat icon="📝" label="Notes" />
          <MiniStat icon="🎯" label="Goals" />
        </div>
      </section>

      {/* ── Data Sovereignty ── */}
      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold">Your Data</h3>
        <p className="text-sm text-muted-foreground">
          Your data belongs to you. Export a full JSON backup of everything in your LifeOS account at any time.
        </p>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Preparing Export…" : "Export My Data (JSON)"}
        </button>
      </section>

      {/* ── Appearance ── */}
      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" /> Appearance
        </h3>
        <p className="text-sm text-muted-foreground">Choose how LifeOS looks to you.</p>
        <div className="flex gap-2">
          {([
            { value: "light", label: "Light", icon: Sun },
            { value: "dark",  label: "Dark",  icon: Moon },
            { value: "system",label: "System",icon: Monitor },
          ] as const).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                mounted && theme === value
                  ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                  : "bg-muted text-muted-foreground border-border hover:border-indigo-500/50 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Account Actions ── */}
      <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold">Account</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 px-5 py-2.5 bg-muted hover:bg-accent border border-border rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm font-medium transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-sm text-rose-400">This is irreversible. Contact support to proceed.</span>
              <button onClick={() => setShowDeleteConfirm(false)} className="text-xs underline text-muted-foreground ml-auto whitespace-nowrap">
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted rounded-xl py-4 px-2 gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">{icon} {label}</div>
      <span className="text-2xl font-black">{value}</span>
    </div>
  );
}

function MiniStat({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-muted rounded-xl py-4">
      <span className="text-2xl">{icon}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
