"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";
import { XPBar } from "@/components/gamification/XPBar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { Menu } from "lucide-react";
import { useEffect, useMemo } from "react";
import Image from "next/image";

const PAGE_NAMES: Record<string, string> = {
  "/dashboard":             "Command Center",
  "/dashboard/tasks":       "Tasks",
  "/dashboard/habits":      "Habits",
  "/dashboard/notes":       "Notes",
  "/dashboard/goals":       "Goals",
  "/dashboard/analytics":   "Analytics",
  "/dashboard/settings":    "Settings",
  "/dashboard/gym":         "Gym Tracker",
  "/dashboard/character":   "Character",
};

function getGreeting(name?: string | null) {
  const hour = new Date().getHours();
  const first = name?.split(" ")[0] ?? "there";
  if (hour < 12) return `Good morning, ${first} ☀️`;
  if (hour < 17) return `Good afternoon, ${first} 👋`;
  return `Good evening, ${first} 🌙`;
}

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { fetchUser, user } = useUserStore();

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const pageName = PAGE_NAMES[pathname] ?? "LifeOS";
  const greeting = useMemo(() => getGreeting(session?.user?.name), [session?.user?.name]);

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        {/* Left: Hamburger (mobile) + Page Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors md:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h2 className="text-base font-semibold leading-none">{pageName}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{greeting}</p>
          </div>
        </div>

        {/* Right: XP Bar + Level (desktop), Avatar */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden sm:flex items-center gap-4">
            <XPBar />
            <div className="h-6 w-px bg-border" />
            <LevelBadge />
          </div>

          {session?.user?.image && (
            <Image
              src={session.user.image}
              alt="Your avatar"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-indigo-500/30 cursor-pointer hover:ring-indigo-500/60 transition-all hidden md:block"
            />
          )}
        </div>
      </div>

      {/* Mobile XP strip — visible only on small screens */}
      {user && (
        <MobileXPStrip xp={user.xp} />
      )}
    </header>
  );
}

function MobileXPStrip({ xp }: { xp: number }) {
  // Inline the XP math to avoid a heavy import
  const base = 100;
  const rate = 1.4;
  let level = 1;
  let spent = 0;
  while (xp >= spent + Math.floor(base * Math.pow(rate, level - 1))) {
    spent += Math.floor(base * Math.pow(rate, level - 1));
    level++;
  }
  const xpInLevel = xp - spent;
  const xpToNext = Math.floor(base * Math.pow(rate, level - 1));
  const pct = Math.min(100, (xpInLevel / xpToNext) * 100);

  return (
    <div className="md:hidden h-0.5 bg-muted">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
