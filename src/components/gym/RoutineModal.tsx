"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Plus, Dumbbell } from "lucide-react";
import { useGymStore } from "@/store/useGymStore";

interface RoutineModalProps {
  onClose: () => void;
}

const PRESET_COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9", "#8b5cf6"];
const PRESET_ICONS = ["🏋️", "🏃", "🤸", "💪", "🧘", "🚲"];
const TYPES = ["strength", "cardio", "flexibility", "hiit", "sports", "other"];

export function RoutineModal({ onClose }: RoutineModalProps) {
  const { createRoutine } = useGymStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🏋️");
  const [color, setColor] = useState("#6366f1");
  const [type, setType] = useState("strength");
  const [exercises, setExercises] = useState([{ name: "", sets: 3, reps: 10 }]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await createRoutine({ 
        name, icon, color, 
        workoutType: type,
        templateExercises: exercises.filter(ex => ex.name.trim() !== "")
      });
      onClose();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const addExercise = () => setExercises([...exercises, { name: "", sets: 3, reps: 10 }]);
  const updateExercise = (index: number, field: string, value: any) => {
    const newEx = [...exercises];
    newEx[index] = { ...newEx[index], [field]: value };
    setExercises(newEx);
  };
  const removeExercise = (index: number) => setExercises(exercises.filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-card border shadow-2xl rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-indigo-400" /> New Routine Template
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
               <label className="text-xs font-medium text-muted-foreground">Routine Name</label>
               <input
                 required
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 placeholder="e.g. Pull Day"
                 className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
               />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
               <label className="text-xs font-medium text-muted-foreground">Type</label>
               <select
                 value={type}
                 onChange={(e) => setType(e.target.value)}
                 className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 capitalize"
               >
                 {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
          </div>

          {/* Aesthetic */}
          <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-xs font-medium text-muted-foreground">Icon</label>
                 <div className="flex gap-2 flex-wrap">
                    {PRESET_ICONS.map(i => (
                        <button key={i} type="button" onClick={() => setIcon(i)} className={`w-8 h-8 text-lg rounded-lg border transition-all ${icon === i ? 'bg-indigo-500/20 border-indigo-500' : 'bg-secondary border-transparent'} hover:scale-110`}>
                          {i}
                        </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-medium text-muted-foreground">Theme Color</label>
                 <div className="flex gap-2 flex-wrap">
                     {PRESET_COLORS.map(c => (
                         <button
                           key={c} type="button" onClick={() => setColor(c)}
                           className="w-7 h-7 rounded-full transition-transform hover:scale-110 border-2"
                           style={{ backgroundColor: c, borderColor: color === c ? '#fff' : 'transparent', boxShadow: color === c ? `0 0 10px ${c}80` : 'none' }}
                         />
                     ))}
                 </div>
              </div>
          </div>

          {/* Exercises */}
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Default Exercises</label>
                <button type="button" onClick={addExercise} className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold">
                  <Plus className="w-3 h-3" /> Add
                </button>
             </div>
             
             {exercises.map((ex, i) => (
               <div key={i} className="flex items-center gap-2">
                 <input
                   value={ex.name}
                   onChange={e => updateExercise(i, "name", e.target.value)}
                   placeholder="Exercise name"
                   className="flex-1 h-9 px-3 bg-secondary rounded-lg text-sm focus:outline-none border-transparent focus:border-indigo-500"
                 />
                 <input
                   type="number" min={1} placeholder="Sets" value={ex.sets}
                   onChange={e => updateExercise(i, "sets", Number(e.target.value))}
                   className="w-16 h-9 px-2 text-center bg-secondary rounded-lg text-sm outline-none"
                 />
                 <span className="text-muted-foreground text-xs">x</span>
                 <input
                   type="number" min={1} placeholder="Reps" value={ex.reps}
                   onChange={e => updateExercise(i, "reps", Number(e.target.value))}
                   className="w-16 h-9 px-2 text-center bg-secondary rounded-lg text-sm outline-none"
                 />
                 <button type="button" onClick={() => removeExercise(i)} className="p-1.5 text-muted-foreground hover:text-rose-500">
                    <X className="w-4 h-4" />
                 </button>
               </div>
             ))}
             {exercises.length === 0 && <p className="text-xs text-muted-foreground italic">No default exercises added.</p>}
          </div>

        </form>
        {/* Footer Actions */}
        <div className="p-4 border-t flex items-center justify-end gap-3 shrink-0 bg-card">
          <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-secondary rounded-xl text-sm font-medium transition-colors">Cancel</button>
          <button 
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="px-6 py-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Template
          </button>
        </div>
      </div>
    </div>
  );
}
