"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { 
  CheckSquare, Flame, BookText, Dumbbell, Target, 
  Settings, LogOut, ArrowRight, Activity, Search
} from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 backdrop-blur-sm bg-black/40">
      <div className="fixed inset-0" onClick={() => setOpen(false)} />
      
      <Command 
        className="relative w-full max-w-2xl bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        label="Global Command Menu"
      >
        <div className="flex items-center border-b border-white/5 px-4">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Command.Input 
            autoFocus
            placeholder="Type a command or search..." 
            className="flex-1 px-4 py-4 bg-transparent outline-none border-none text-base placeholder:text-muted-foreground w-full"
          />
        </div>

        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group heading="Navigation" className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard"))}
              className="flex items-center gap-2 px-3 py-2.5 mt-1 text-sm rounded-lg hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400 cursor-pointer transition-colors"
            >
              <Activity className="w-4 h-4" /> Go to Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard/tasks"))}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400 cursor-pointer transition-colors"
            >
              <CheckSquare className="w-4 h-4" /> Go to Kanban Tasks
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard/habits"))}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400 cursor-pointer transition-colors"
            >
              <Flame className="w-4 h-4" /> Go to Habit Tracker
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard/gym"))}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400 cursor-pointer transition-colors"
            >
              <Dumbbell className="w-4 h-4" /> Go to Gym Routines
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard/notes"))}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400 cursor-pointer transition-colors"
            >
              <BookText className="w-4 h-4" /> Search Notes 
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/dashboard/goals"))}
              className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 aria-selected:bg-indigo-500/10 aria-selected:text-indigo-400 cursor-pointer transition-colors"
            >
              <Target className="w-4 h-4" /> View Life Goals
            </Command.Item>
          </Command.Group>

          <div className="h-px bg-white/5 my-1" />

          <Command.Group heading="Settings" className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
            <Command.Item 
              onSelect={() => runCommand(() => window.location.href = "/api/auth/signout")}
              className="flex items-center gap-2 px-3 py-2.5 mt-1 text-sm rounded-lg hover:bg-rose-500/10 text-rose-400 cursor-pointer transition-colors aria-selected:bg-rose-500/10 aria-selected:text-rose-400"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="bg-card border-t border-white/5 p-3 flex items-center justify-between text-xs text-muted-foreground">
           <span>Use <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground border border-white/10 font-sans">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground border border-white/10 font-sans">↓</kbd> to navigate</span>
           <span>Use <kbd className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground border border-white/10 font-sans">enter</kbd> to jump</span>
        </div>
      </Command>
    </div>
  );
}
