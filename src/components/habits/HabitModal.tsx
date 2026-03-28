"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useHabitStore } from "@/store/useHabitStore";

interface HabitModalProps {
  onClose: () => void;
}

const PRESET_COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#0ea5e9", // Sky
  "#8b5cf6", // Violet
];

const PRESET_ICONS = ["💧", "📖", "🏃", "🧘", "🥗", "💻", "🎸", "💊"];

export function HabitModal({ onClose }: HabitModalProps) {
  const { createHabit } = useHabitStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💧");
  const [color, setColor] = useState("#6366f1");
  const [frequency, setFrequency] = useState("daily");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      await createHabit({ name, icon, color, frequency: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] });
      onClose();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-card border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">New Habit</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
          {/* Name */}
          <div className="space-y-1.5">
             <label className="text-xs font-medium text-muted-foreground">Habit Name</label>
             <input
               autoFocus
               required
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="e.g. Drink Water"
               className="w-full h-10 px-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
             />
          </div>

          <div className="grid grid-cols-2 gap-6">
              {/* Icon */}
              <div className="space-y-2">
                 <label className="text-xs font-medium text-muted-foreground">Icon</label>
                 <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-2xl border border-white/5 relative overflow-hidden group">
                     {icon}
                     <input 
                       type="text" 
                       value={icon}
                       onChange={(e) => setIcon(e.target.value)}
                       maxLength={2}
                       className="absolute inset-0 opacity-0 cursor-text text-center text-2xl"
                     />
                 </div>
                 <div className="flex gap-1.5 flex-wrap">
                    {PRESET_ICONS.map(i => (
                        <button key={i} type="button" onClick={() => setIcon(i)} className="w-6 h-6 text-sm hover:scale-110 hover:bg-white/10 rounded">{i}</button>
                    ))}
                 </div>
              </div>

              {/* Color */}
              <div className="space-y-2">
                 <label className="text-xs font-medium text-muted-foreground">Theme Color</label>
                 <div className="flex gap-2 flex-wrap">
                     {PRESET_COLORS.map(c => (
                         <button
                           key={c}
                           type="button"
                           onClick={() => setColor(c)}
                           className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                           style={{ 
                               backgroundColor: c, 
                               borderColor: color === c ? '#fff' : 'transparent',
                               boxShadow: color === c ? `0 0 10px ${c}80` : 'none'
                           }}
                         />
                     ))}
                 </div>
              </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end pt-4 mt-2 border-t gap-3">
            <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 hover:bg-secondary rounded-xl text-sm font-medium transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit"
                disabled={isSaving || !name.trim()}
                className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                style={{ backgroundColor: color }}
            >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
