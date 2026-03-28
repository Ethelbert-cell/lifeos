"use client";

import { useEffect, useState } from "react";
import { useHabitStore } from "@/store/useHabitStore";
import { useUserStore } from "@/store/useUserStore";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitCalendar } from "@/components/habits/HabitCalendar";
import { HabitModal } from "@/components/habits/HabitModal";
import toast from "react-hot-toast";

export default function HabitsPage() {
  const { habits, fetchHabits, checkInHabit, deleteHabit, isLoading } = useHabitStore();
  const { addLocalXp } = useUserStore();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleCheckIn = async (id: string) => {
     const result = await checkInHabit(id);
     if (result) {
         // Show standard Toast
         toast.success(`Check-in complete! +${result.xpEarned} XP`, { icon: '🔥' });
         
         // If a streak milestone was hit, show a huge celebration!
         if (result.streakMilestone) {
             toast(`Huge Streak Bonus! +50 XP`, {
                 icon: '🏆',
                 duration: 4000,
                 style: { background: '#f59e0b', color: '#fff', padding: '16px', borderRadius: '12px' }
             });
         }
         
         // Update the TopBar purely client side
         addLocalXp(result.xpEarned);
     }
  };

  const handleDelete = async (id: string) => {
      if (confirm("Delete this habit? It will wipe your streak memory forever.")) {
          await deleteHabit(id);
      }
  };

  if (isLoading && habits.length === 0) {
      return <div className="animate-pulse h-[400px] rounded-2xl bg-white/5" />;
  }

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
          <p className="text-muted-foreground mt-1 text-sm">Consistency builds empires. Keep the streaks alive.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md flex-shrink-0"
        >
          New Habit
        </button>
      </div>

      {/* Grid of Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {habits.map(habit => (
             <HabitCard 
                 key={String(habit._id)} 
                 habit={habit} 
                 onCheckIn={handleCheckIn}
                 onDelete={handleDelete}
             />
         ))}
         {habits.length === 0 && !isLoading && (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-card/50 rounded-2xl border border-dashed border-white/10">
                 <div className="text-4xl mb-4">🌱</div>
                 <h3 className="text-lg font-medium text-foreground">No habits yet</h3>
                 <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                     Start small. Pick one thing you want to do every day and track it here.
                 </p>
             </div>
         )}
      </div>

      {/* Heatmaps Area */}
      {habits.length > 0 && (
          <div className="pt-8 mt-8 border-t border-white/5">
              <h3 className="text-lg font-semibold mb-6">30-Day Activity History</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {habits.map(habit => (
                    <HabitCalendar key={`cal-${String(habit._id)}`} habit={habit} />
                 ))}
              </div>
          </div>
      )}

      {/* Modal */}
      {modalOpen && <HabitModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
