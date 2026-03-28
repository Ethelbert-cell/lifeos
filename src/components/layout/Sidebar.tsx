"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Target, BookText, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Habits", href: "/dashboard/habits", icon: ArrowLeftRight },
  { name: "Notes", href: "/dashboard/notes", icon: BookText },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

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
      </nav>

      {/* User Area Footer placeholder (will implement fully in Phase 4) */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 shadow-inner flex items-center justify-center overflow-hidden">
             <span className="text-xs font-semibold">ME</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">Profile</span>
            <span className="text-xs text-muted-foreground mt-1">Free Tier</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
