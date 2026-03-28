"use client";

import { useUserStore } from "@/store/useUserStore";
import { useMemo, useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function LevelBadge() {
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { color, glow } = useMemo(() => {
      if (!user) return { color: "text-slate-400", glow: "" };
      const lv = user.level;
      if (lv >= 50) return { color: "text-indigo-400 fill-indigo-500/20", glow: "drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" };
      if (lv >= 30) return { color: "text-rose-400 fill-rose-500/20", glow: "drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" };
      if (lv >= 15) return { color: "text-emerald-400 fill-emerald-500/20", glow: "drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" };
      if (lv >= 5)  return { color: "text-amber-400 fill-amber-500/20", glow: "drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]" };
      return { color: "text-slate-300", glow: "" };
  }, [user]);

  if (!mounted || !user) return <div className="w-10 h-10 bg-white/5 animate-pulse rounded-xl" />;

  return (
    <div className="relative flex flex-col items-center justify-center -ml-2 select-none group">
       <div className={cn("relative w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:scale-110", glow)}>
           <Shield className={cn("absolute inset-0 w-full h-full", color)} strokeWidth={1.5} />
           <span className="relative z-10 font-bold text-lg leading-none mt-0.5 text-foreground drop-shadow-md">
              {user.level}
           </span>
       </div>
    </div>
  );
}
