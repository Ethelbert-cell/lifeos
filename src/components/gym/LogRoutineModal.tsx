"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Plus, Dumbbell, Zap } from "lucide-react";
import { useGymStore, IGymRoutine } from "@/store/useGymStore";
import toast from "react-hot-toast";

interface LogRoutineModalProps {
  routine: IGymRoutine;
  onClose: () => void;
}

export function LogRoutineModal({ routine, onClose }: LogRoutineModalProps) {
  const { logWorkout } = useGymStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState(routine.name);
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState("");
  // Pre-fill exercises from template, but add 'weight' for todays log
  const [exercises, setExercises] = useState(
    routine.templateExercises.map(ex => ({ ...ex, weight: "" }))
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || duration < 1) return;

    setIsSaving(true);
    try {
      const { xpGained } = await logWorkout({
        routineId: routine._id,
        title,
        workoutType: routine.workoutType,
        duration,
        notes,
        exercises: exercises.map(ex => ({
          name: ex.name,
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          weight: Number(ex.weight) || 0,
        })).filter(ex => ex.name.trim())
      });
      toast.success(`Workout logged! +${xpGained} XP 💪`, { icon: '🏋️' });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to log workout");
      setIsSaving(false);
    }
  };

  const addExercise = () => setExercises([...exercises, { name: "", sets: 3, reps: 10, weight: "" }]);
  const updateExercise = (index: number, field: string, value: any) => {
    const newEx = [...exercises];
    newEx[index] = { ...newEx[index], [field]: value };
    setExercises(newEx);
  };
  const removeExercise = (index: number) => setExercises(exercises.filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card border shadow-2xl rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        
        {/* Header - styled heavily with the routine's color */}
        <div 
           className="px-6 py-5 border-b shrink-0 flex items-start justify-between relative overflow-hidden"
           style={{ backgroundColor: `${routine.color}15` }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-2xl rounded-full translate-x-10 -translate-y-10" />
          
          <div className="relative z-10 flex items-center gap-4">
             <div 
               className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl shadow-sm"
               style={{ backgroundColor: routine.color }}
             >
               {routine.icon}
             </div>
             <div>
                <h2 className="text-xl font-bold" style={{ color: routine.color }}>{routine.name}</h2>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-60">Log Session</p>
             </div>
          </div>

          <button onClick={onClose} className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-black/10 transition-colors relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
               <label className="text-xs font-medium text-muted-foreground">Session Title</label>
               <input
                 required value={title} onChange={(e) => setTitle(e.target.value)}
                 className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-xs font-medium text-muted-foreground">Duration (min)</label>
               <input
                 type="number" min={1} required value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                 className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
               />
            </div>
          </div>

          {/* Exercises */}
          <div>
             <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-medium text-muted-foreground">Exercises</label>
                <button type="button" onClick={addExercise} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  <Plus className="w-3 h-3" /> Add
                </button>
             </div>
             
             <div className="space-y-2">
               {exercises.map((ex, i) => (
                 <div key={i} className="flex items-center gap-2 bg-secondary/50 p-2 rounded-xl border border-white/5">
                   <input
                     value={ex.name} onChange={e => updateExercise(i, "name", e.target.value)} placeholder="Exercise"
                     className="flex-1 h-9 px-3 bg-background rounded-lg text-sm focus:outline-none border-transparent focus:border-indigo-500 font-medium"
                   />
                   <div className="flex flex-col gap-1 items-center">
                     <span className="text-[10px] text-muted-foreground font-bold uppercase">Sets</span>
                     <input
                       type="number" min={1} value={ex.sets} onChange={e => updateExercise(i, "sets", e.target.value)}
                       className="w-12 h-8 px-1 text-center bg-background rounded-lg text-sm outline-none"
                     />
                   </div>
                   <div className="flex flex-col gap-1 items-center">
                     <span className="text-[10px] text-muted-foreground font-bold uppercase">Reps</span>
                     <input
                       type="number" min={1} value={ex.reps} onChange={e => updateExercise(i, "reps", e.target.value)}
                       className="w-12 h-8 px-1 text-center bg-background rounded-lg text-sm outline-none"
                     />
                   </div>
                   <div className="flex flex-col gap-1 items-center">
                     <span className="text-[10px] text-muted-foreground font-bold uppercase">Lbs/Kg</span>
                     <input
                       type="number" min={0} value={ex.weight} onChange={e => updateExercise(i, "weight", e.target.value)}
                       placeholder="0"
                       className="w-14 h-8 px-1 text-center bg-background rounded-lg text-sm outline-none"
                     />
                   </div>

                   <button type="button" onClick={() => removeExercise(i)} className="p-2 ml-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                   </button>
                 </div>
               ))}
               {exercises.length === 0 && <p className="text-xs text-muted-foreground italic px-2">No exercises added.</p>}
             </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-medium text-muted-foreground">Notes</label>
             <textarea
               value={notes} onChange={(e) => setNotes(e.target.value)}
               placeholder="How did it feel?" rows={2}
               className="w-full py-2 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
             />
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t flex items-center justify-between shrink-0 bg-card">
          <p className="text-xs font-bold text-amber-500 flex items-center gap-1 opacity-80 decoration-slice">
             <Zap className="w-3.5 h-3.5 fill-amber-500" /> +25 XP
          </p>
          <div className="flex items-center gap-3">
             <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-secondary rounded-xl text-sm font-medium transition-colors">Cancel</button>
             <button 
                 onClick={handleSave}
                 disabled={isSaving || !title.trim()}
                 className="px-6 py-2 text-white hover:brightness-110 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                 style={{ backgroundColor: routine.color }}
             >
                 {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                 Complete Session
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
