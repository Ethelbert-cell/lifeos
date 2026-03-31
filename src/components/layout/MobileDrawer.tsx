"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, CheckSquare, Target, BookText,
  ArrowLeftRight, Settings, BarChart2, LogOut,
  Sun, Moon, X, Zap, Dumbbell, Swords,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import { levelFromXP } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const PRODUCTIVITY_ITEMS = [
  { name: "Dashboard",  href: "/dashboard",            icon: LayoutDashboard },
  { name: "Tasks",      href: "/dashboard/tasks",       icon: CheckSquare },
  { name: "Habits",     href: "/dashboard/habits",      icon: ArrowLeftRight },
  { name: "Notes",      href: "/dashboard/notes",       icon: BookText },
  { name: "Goals",      href: "/dashboard/goals",       icon: Target },
  { name: "Analytics",  href: "/dashboard/analytics",   icon: BarChart2 },
];

const FITNESS_ITEMS = [
  { name: "Gym Tracker",  href: "/dashboard/gym",           icon: Dumbbell },
  { name: "Character",    href: "/dashboard/character",     icon: Swords },
];

const BOTTOM_ITEMS = [
  { name: "Settings",  href: "/dashboard/settings",  icon: Settings },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function NavSection({
  label,
  items,
  pathname,
  onClose,
}: {
  label: string;
  items: typeof PRODUCTIVITY_ITEMS;
  pathname: string;
  onClose: () => void;
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
            onClick={onClose}
            className={cn(
              "relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "text-indigo-500 dark:text-indigo-400"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="drawer-active-pill"
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

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { user } = useUserStore();
  const { theme, setTheme } = useTheme();
  const level = user ? levelFromXP(user.xp) : 1;
  const drawerRef = useRef<HTMLDivElement>(null);
  // Mounted guard: next-themes returns theme=undefined on server.
  // Without this, the Sun/Moon icon differs between SSR and CSR → hydration crash.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Close on route change
  useEffect(() => { onClose(); }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="fixed left-0 top-0 bottom-0 z-50 flex flex-col w-72 bg-card border-r border-border shadow-2xl md:hidden"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-border shrink-0">
              <div className="font-bold text-lg tracking-tight flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-black">L</span>
                </div>
                LifeOS
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User area */}
            <div className="px-4 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-indigo-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-indigo-400">
                      {session?.user?.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">
                    {session?.user?.name ?? "LifeOS User"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Level {level} · {user?.xp?.toLocaleString() ?? 0} XP
                  </p>
                </div>
              </div>
            </div>

            {/* Main Nav — scrollable */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-5">
              <NavSection
                label="Productivity"
                items={PRODUCTIVITY_ITEMS}
                pathname={pathname}
                onClose={onClose}
              />

              <div className="border-t border-border pt-5">
                <NavSection
                  label="Fitness & Growth"
                  items={FITNESS_ITEMS}
                  pathname={pathname}
                  onClose={onClose}
                />
              </div>

              <div className="border-t border-border pt-5">
                <NavSection
                  label="Account"
                  items={BOTTOM_ITEMS}
                  pathname={pathname}
                  onClose={onClose}
                />
              </div>
            </nav>

            {/* Footer: Theme + Sign Out */}
            <div className="p-4 border-t border-border space-y-2 shrink-0">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-muted">
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-background hover:bg-accent border border-border transition-colors"
                >
                  {mounted && (
                    theme === "dark" ? (
                      <><Sun className="w-3.5 h-3.5" /> Light</>
                    ) : (
                      <><Moon className="w-3.5 h-3.5" /> Dark</>
                    )
                  )}
                </button>
              </div>

              {/* Sign Out */}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
