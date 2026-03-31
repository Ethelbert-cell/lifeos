"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Target, BookText, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dash", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Habits", href: "/dashboard/habits", icon: ArrowLeftRight },
  { name: "Notes", href: "/dashboard/notes", icon: BookText },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 px-1 bg-card/95 backdrop-blur border-t border-white/10 md:hidden pb-safe">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive 
                ? "text-indigo-400" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "opacity-70")} />
            <span className="text-[10px] font-medium tracking-wide">
               {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
