"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target, CheckCircle, Flame, Dumbbell, BarChart2, Zap, ArrowUp, ChevronDown } from "lucide-react";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const FAQS = [
  { q: "Is LifeOS free to use?", a: "Yes! LifeOS is completely free to use. We believe in accessible productivity for everyone." },
  { q: "How does the XP system work?", a: "Every task, habit, and gym session you log grants you XP. Accumulate enough XP to level up your character from Novice to Mythic status." },
  { q: "Can I use it on my phone?", a: "Absolutely! LifeOS is a Progressive Web App (PWA). Just open it in Safari/Chrome on your phone and tap 'Add to Home Screen' for a fully native app experience." },
  { q: "What is the Gym Tracker?", a: "Our Gym Tracker lets you build reusable workout routines (like 'Push Day') and log your daily sets and weights seamlessly, integrating perfectly with your other habits." },
];

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl bg-card overflow-hidden transition-all">
      <button onClick={() => setOpen(!open)} className="w-full px-6 py-4 flex items-center justify-between font-semibold text-left">
        {question}
        <ChevronDown className={`w-5 h-5 transition-transform ${open ? 'rotate-180 text-indigo-400' : 'text-muted-foreground'}`} />
      </button>
      {open && (
        <div className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-indigo-500/10 dark:bg-indigo-600/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-rose-500/10 dark:bg-rose-600/20 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white text-sm font-black">L</span>
          </div>
          LifeOS
        </div>
        <Link 
          href="/dashboard"
          className="text-sm font-semibold bg-white text-black dark:bg-white/10 dark:text-white px-5 py-2.5 rounded-full hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center z-10">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-6xl mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="flex-1 text-center lg:text-left space-y-8"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.1]">
              Level up your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
                reality.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto lg:mx-0">
              Transform your daily tasks, habits, gym routines, and long-term goals into an RPG. Earn XP, maintain streaks, and watch your actual life level up.
            </motion.p>

            <motion.div variants={fadeIn} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/dashboard"
                className="group flex items-center justify-center gap-2 bg-indigo-500 text-white font-bold h-14 px-8 rounded-full hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 text-lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-6 h-14 flex items-center">
                Explore Features
              </a>
            </motion.div>
          </motion.div>

          {/* Isometric UI Replica Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: -10, rotateX: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: -5, rotateX: 5 }}
            transition={{ duration: 1, type: "spring" }}
            className="flex-1 w-full max-w-lg hidden md:block perspective-1000"
          >
             <div className="bg-card border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 shadow-indigo-500/10 transform-style-3d hover:rotate-0 hover:scale-105 transition-all duration-700">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center text-xl">⚔️</div>
                      <div>
                         <h3 className="font-bold text-lg">Level 14 Paladin</h3>
                         <div className="w-32 h-1.5 bg-black/20 rounded-full overflow-hidden mt-1"><div className="w-[70%] h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div></div>
                      </div>
                   </div>
                   <span className="bg-amber-500/10 text-amber-500 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm"><Zap className="w-3 h-3 fill-amber-500"/> 2,450 XP</span>
                </div>
                
                <div className="space-y-3">
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Daily Quests</p>
                   <div className="bg-background border border-white/5 p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-white" /></div>
                         <span className="font-medium line-through opacity-50">Morning Meditation</span>
                      </div>
                      <span className="text-xs text-amber-500 font-bold">+15 XP</span>
                   </div>
                   <div className="bg-background border border-white/5 p-4 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-md border-2 border-muted-foreground/30 flex items-center justify-center" />
                         <span className="font-medium">Complete Deep Work</span>
                      </div>
                      <span className="text-xs text-amber-500/50 font-bold">+25 XP</span>
                   </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-card border border-white/10 p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-bounce shrink-0" style={{ animationDuration: '3s' }}>
                   <div className="w-10 h-10 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center"><Flame className="w-5 h-5"/></div>
                   <div>
                       <p className="font-bold text-sm">7 Day Streak!</p>
                       <p className="text-xs text-muted-foreground">Habit Bonus +50 XP</p>
                   </div>
                </div>
             </div>
          </motion.div>
        </section>

        {/* LOGOS / STATS BANNER */}
        <div className="w-full border-y border-white/5 bg-white/5 py-10 my-10 hidden sm:block">
           <div className="max-w-5xl mx-auto px-6 flex justify-around items-center opacity-50 font-black text-xl italic tracking-tighter">
              <div className="flex items-center gap-2"><CheckCircle className="w-8 h-8" /> TASKS</div>
              <div className="flex items-center gap-2"><Flame className="w-8 h-8" /> HABITS</div>
              <div className="flex items-center gap-2"><Dumbbell className="w-8 h-8" /> GYM</div>
              <div className="flex items-center gap-2"><Target className="w-8 h-8" /> GOALS</div>
           </div>
        </div>

        {/* FEATURES GRID */}
        <section id="features" className="w-full max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to <span className="text-indigo-400">succeed</span>.</h2>
             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Stop bouncing between 5 different apps. Keep your entire life organized in one cohesive ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              { icon: CheckCircle, color: "text-indigo-500", bg: "bg-indigo-500/10", title: "Master Tasks", desc: "A powerful Kanban board to organize deep work and track daily to-dos seamlessly." },
              { icon: Flame, color: "text-rose-500", bg: "bg-rose-500/10", title: "Build Habits", desc: "Visually maintain streaks, log daily routines, and earn massive XP bonuses across weeks." },
              { icon: Dumbbell, color: "text-amber-500", bg: "bg-amber-500/10", title: "Gym Tracker", desc: "Design custom workout templates and log reps, sets, and weights from your phone." },
              { icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Hit Goals", desc: "Break massive life aspirations into bite-sized, executable milestones." },
              { icon: BarChart2, color: "text-sky-500", bg: "bg-sky-500/10", title: "Deep Analytics", desc: "View gorgeous 14-day Pixel Heatmaps and stacked bar charts for all your activity." },
              { icon: ArrowUp, color: "text-violet-500", bg: "bg-violet-500/10", title: "RPG Leveling", desc: "A customized Character sheet showing your stats (Productivity, Fitness, Consistency)." }
            ].map((f, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="p-8 rounded-3xl bg-card border border-white/5 shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full max-w-3xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center mb-16 space-y-3">
             <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
             <p className="text-muted-foreground">Everything you need to know about the platform.</p>
          </div>
          <div className="space-y-4">
             {FAQS.map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-background/50 backdrop-blur-sm mt-auto py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 text-sm font-medium">
           <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">L</span>
             </div>
             LifeOS © {new Date().getFullYear()}
           </div>
           <div className="flex gap-6">
              <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">GitHub</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">Twitter</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
