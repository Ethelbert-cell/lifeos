"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import { ShieldAlert, ChevronUp } from "lucide-react";
import confetti from "canvas-confetti";

export function LevelUpModal() {
  const { user } = useUserStore();
  const prevLevelRef = useRef<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
     if (!user) return;
     
     if (prevLevelRef.current === null) {
         prevLevelRef.current = user.level;
         return;
     }

     if (user.level > prevLevelRef.current) {
         setCurrentLevel(user.level);
         setShowModal(true);
         fireConfetti();
         
         // Auto-close after 5 seconds
         setTimeout(() => setShowModal(false), 5000);
     }

     prevLevelRef.current = user.level;
  }, [user]);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#f59e0b', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#3b82f6', '#8b5cf6']
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             onClick={() => setShowModal(false)}
           />
           
           <motion.div 
             initial={{ scale: 0.8, opacity: 0, y: 50 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             exit={{ scale: 0.9, opacity: 0, y: 20 }}
             transition={{ type: "spring", damping: 12 }}
             className="relative bg-gradient-to-b from-indigo-500/20 to-card border-2 border-indigo-500/50 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center overflow-hidden"
           >
              {/* Background Ray effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(var(--tw-gradient-stops))] from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 animate-spin-slow pointer-events-none" />
              
              <div className="relative z-10 w-24 h-24 bg-card rounded-full border-4 border-indigo-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.6)]">
                 <ShieldAlert className="w-12 h-12 text-indigo-400" />
                 <ChevronUp className="absolute -top-3 w-8 h-8 text-amber-400 animate-bounce" />
              </div>

              <h2 className="relative z-10 text-4xl font-black mb-2 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                 Level Up!
              </h2>
              
              <p className="relative z-10 text-xl font-medium text-foreground mb-6">
                 You reached Level {currentLevel}
              </p>

              <button 
                 onClick={() => setShowModal(false)}
                 className="relative z-10 w-full py-3 bg-foreground text-background rounded-xl font-bold hover:scale-105 active:scale-95 transition-all"
              >
                 Keep Grinding
              </button>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
