"use client";

import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { xpProgress } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function XPBar() {
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user) {
     return <div className="h-10 w-48 bg-white/5 animate-pulse rounded-xl" />;
  }

  const { currentXP, xpToNext, percent } = xpProgress(user.xp);

  return (
    <div className="flex flex-col gap-1 w-48 sm:w-64 relative group cursor-pointer" title={`${currentXP} / ${xpToNext} XP to next level`}>
       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors px-1">
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> XP</span>
          <span>{currentXP} / {xpToNext}</span>
       </div>
       
       <div className="h-3 relative bg-black/40 rounded-full overflow-hidden border border-white/10 shadow-inner group-hover:border-white/20 transition-colors">
          <motion.div
             initial={{ width: 0 }}
             animate={{ width: `${percent}%` }}
             transition={{ type: "spring", stiffness: 50, damping: 15 }}
             className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
          />
       </div>
    </div>
  );
}
