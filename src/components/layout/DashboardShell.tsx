"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

// The only client-side wrapper needed for drawer state
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen relative bg-background w-full">
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <main className="md:ml-64 pt-16 p-6 overflow-x-hidden min-h-screen relative">
        {/* Ambient glow */}
        <div className="fixed top-0 right-0 w-[40vw] h-[40vh] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          {children}
        </div>
      </main>
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
