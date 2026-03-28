import Link from "next/link";
import { ArrowRight, Target, CheckCircle, Flame } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center">
            <span className="text-white text-xs font-black">L</span>
          </div>
          LifeOS
        </div>
        <Link 
          href="/dashboard"
          className="text-sm font-medium hover:text-indigo-500 transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
            Level up your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
              productivity.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            A gamified dashboard that turns your daily tasks, habits, notes, and long-term goals into an RPG. Earn XP, maintain streaks, and watch your reality level up.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="group flex items-center justify-center gap-2 bg-foreground text-background font-medium h-12 px-8 rounded-full hover:bg-foreground/90 transition-all active:scale-95"
            >
              Enter Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="pt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-500">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Master Tasks</h3>
              <p className="text-sm text-muted-foreground">A powerful Kanban board to organize your deep work.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center mb-4 text-rose-500">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Build Habits</h3>
              <p className="text-sm text-muted-foreground">Keep the streak alive and unlock massive XP bonuses.</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 text-amber-500">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Hit Goals</h3>
              <p className="text-sm text-muted-foreground">Break huge life milestones down into executable steps.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
