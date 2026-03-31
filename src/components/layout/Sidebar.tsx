"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  LayoutDashboard, CheckSquare, Target, BookText,
  ArrowLeftRight, Settings, Zap, BarChart2, Dumbbell,
  Swords, LogOut, Sun, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { levelFromXP } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PRODUCTIVITY_ITEMS = [
  { name: "Dashboard",  href: "/dashboard",            icon: LayoutDashboard },
  { name: "Tasks",      href: "/dashboard/tasks",       icon: CheckSquare },
  { name: "Habits",     href: "/dashboard/habits",      icon: ArrowLeftRight },
  { name: "Notes",      href: "/dashboard/notes",       icon: BookText },
  { name: "Goals",      href: "/dashboard/goals",       icon: Target },
  { name: "Analytics",  href: "/dashboard/analytics",   icon: BarChart2 },
];

const FITNESS_ITEMS = [
  { name: "Gym Tracker",   href: "/dashboard/gym",             icon: Dumbbell },
  { name: "Character",     href: "/dashboard/character",       icon: Swords },
];

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: typeof PRODUCTIVITY_ITEMS;
  pathname: string;
}) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 select-none">
        {label}
      </p>
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (pathname.startsWith(item.href) && item.href !== "/dashboard");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-xl bg-indigo-500/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon
              className={cn(
                "relative z-10 w-5 h-5 shrink-0",
                isActive ? "text-indigo-500 dark:text-indigo-400" : "opacity-60"
              )}
            />
            <span className="relative z-10">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();
  const level = user ? levelFromXP(user.xp) : 1;
  // Prevent hydration mismatch: next-themes resolves theme client-side only.
  // Server renders theme=undefined, so we must defer any theme-conditional
  // rendering until after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden md:flex flex-col z-40">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <Link href="/dashboard" className="font-bold text-lg tracking-tight flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-black">L</span>
          </div>
          <span>LifeOS</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-5">
        <NavGroup label="Productivity" items={PRODUCTIVITY_ITEMS} pathname={pathname} />
        <div className="border-t border-border pt-5">
          <NavGroup label="Fitness & Growth" items={FITNESS_ITEMS} pathname={pathname} />
        </div>

        {/* Settings */}
        <div className="border-t border-border pt-5">
          <Link
            href="/dashboard/settings"
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              pathname === "/dashboard/settings"
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {pathname === "/dashboard/settings" && (
              <motion.span
                layoutId="sidebar-active-pill"
                className="absolute inset-0 rounded-xl bg-indigo-500/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Settings
              className={cn(
                "relative z-10 w-5 h-5 shrink-0",
                pathname === "/dashboard/settings" ? "text-indigo-500" : "opacity-60"
              )}
            />
            <span className="relative z-10">Settings</span>
          </Link>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border shrink-0 space-y-3">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium bg-muted hover:bg-accent transition-colors"
        >
          <span className="text-muted-foreground">Appearance</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold">
            {/* Render only after mount to avoid server/client theme mismatch */}
            {mounted && (
              theme === "dark" ? (
                <><Sun className="w-3.5 h-3.5" /> Light</>
              ) : (
                <><Moon className="w-3.5 h-3.5" /> Dark</>
              )
            )}
          </span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-accent transition-colors cursor-default">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-indigo-500/30 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-indigo-400">
                {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium leading-none truncate">
              {session?.user?.name?.split(" ")[0] ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              Level {level}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign Out"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
