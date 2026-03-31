"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { LayoutDashboard, CheckSquare, Target, BookText, ArrowLeftRight, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { levelFromXP } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Habits", href: "/dashboard/habits", icon: ArrowLeftRight },
  { name: "Notes", href: "/dashboard/notes", icon: BookText },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user } = useUserStore();
  const level = user ? levelFromXP(user.xp) : 1;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-white/5 hidden md:flex flex-col z-40">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/dashboard" className="font-bold text-lg tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center">
            <span className="text-white text-xs font-black">L</span>
          </div>
          LifeOS
        </Link>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-indigo-500 dark:text-indigo-400" : "opacity-70")} />
              {item.name}
            </Link>
          );
        })}

        {/* Settings link */}
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-4 border-t border-white/5 pt-4",
            pathname === "/dashboard/settings"
              ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          <Settings className={cn("w-5 h-5", pathname === "/dashboard/settings" ? "text-indigo-500" : "opacity-70")} />
          Settings
        </Link>
      </nav>

      {/* User Footer — real data */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-default">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-indigo-500/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-indigo-300">
                {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium leading-none truncate">
              {session?.user?.name?.split(" ")[0] ?? "User"}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              Level {level}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
