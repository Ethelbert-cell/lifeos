"use client";

import { XPBar } from "@/components/gamification/XPBar";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export function TopBar() {
  const { data: session } = useSession();
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 ml-0 md:ml-64">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold capitalize tracking-tight hidden sm:block">
          Welcome back
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Gamification Elements */}
        <div className="flex items-center gap-6 pr-6 mr-2">
          <XPBar />
          <div className="h-8 w-px bg-white/10" />
          <LevelBadge />
        </div>
        
        {/* Sign Out Button */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
