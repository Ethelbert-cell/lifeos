"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useGoalStore } from "@/store/useGoalStore";
import { useUserStore } from "@/store/useUserStore";
import { IGoal, IMilestone } from "@/models/Goal";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface GoalModalProps {
  goal?: IGoal | null;
  onClose: () => void;
}

export function GoalModal({ goal, onClose }: GoalModalProps) {
  const { createGoal, updateGoal, deleteGoal } = useGoalStore();
  const { addLocalXp } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [category, setCategory] = useState(goal?.category || "personal");
  const [targetDate, setTargetDate] = useState(goal?.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : "");
  
  // Milestones local state
  const [milestones, setMilestones] = useState<IMilestone[]>(goal?.milestones || []);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; }
  }, []);

  const handleAddMilestone = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMilestoneTitle.trim()) return;
      
      const newM: IMilestone = { title: newMilestoneTitle.trim(), completed: false };
      setMilestones([...milestones, newM]);
      setNewMilestoneTitle("");
  };

  const toggleMilestone = async (index: number) => {
      const updated = [...milestones];
      updated[index].completed = !updated[index].completed;
      setMilestones(updated);

      // Auto-save mutation immediately if goal exists
      if (goal?._id) {
          try {
              const res = await updateGoal(String(goal._id), { milestones: updated });
              // Evaluate dynamic XP delta from response
              if (res && res.xpDelta !== 0) {
                 addLocalXp(res.xpDelta);
                 if (res.xpDelta > 0) toast.success(`Milestone completed! +${res.xpDelta} XP`, { icon: '🎯' });
              }
          } catch (err: any) {
              toast.error("Failed to update milestone");
              // Revert optimistic if needed
              const reverted = [...updated];
              reverted[index].completed = !reverted[index].completed;
              setMilestones(reverted);
          }
      }
  };

  const removeMilestone = (index: number) => {
      setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
      if (!title.trim()) return;
      setIsSaving(true);

      const payload = {
          title,
          description,
          category: category as any,
          targetDate: targetDate ? new Date(targetDate) : undefined,
          milestones
      };

      try {
          if (goal?._id) {
             await updateGoal(String(goal._id), payload);
          } else {
             await createGoal(payload);
          }
          onClose();
      } catch (err: any) {
          toast.error(err.message);
          setIsSaving(false);
      }
  };

  const handleCompleteGoal = async () => {
      if (!goal?._id) return;
      const confirmMsg = goal.status === 'completed' ? "Mark goal as active again?" : "Mark this massive goal as completely achieved?";
      if (confirm(confirmMsg)) {
         setIsSaving(true);
         const res = await updateGoal(String(goal._id), { status: goal.status === 'completed' ? 'active' : 'completed' });
         if (res && res.xpDelta > 0) {
             addLocalXp(res.xpDelta);
             toast.success(`GOAL COMPLETED! +${res.xpDelta} XP`, {
                 duration: 4000,
                 style: { background: '#10b981', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold' }
             });
         }
         onClose();
      }
  };

  const handleDelete = async () => {
      if (!goal?._id) return;
      if (confirm("Delete this goal? XP earned from it will be deducted.")) {
         setIsSaving(true);
         await deleteGoal(String(goal._id));
         onClose();
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-card border shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-xl font-bold">{goal ? "Manage Goal" : "Design a Goal"}</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-muted-foreground hover:bg-secondary justify-center rounded-full transition-colors"><X className="w-5 h-5"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Fundamentals */}
            <div className="space-y-4">
                <input
                   autoFocus
                   placeholder="E.g. Launch my startup..."
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   className="w-full text-2xl font-black bg-transparent border-b border-transparent focus:border-indigo-500 placeholder:text-muted-foreground/30 focus:outline-none pb-2 transition-colors"
                />
                <textarea
                   placeholder="Why does this matter? What's the vision?"
                   value={description}
                   onChange={(e) => setDescription(e.target.value)}
                   rows={2}
                   className="w-full text-sm bg-transparent border-b border-white/5 focus:border-indigo-500 placeholder:text-muted-foreground pb-2 focus:outline-none resize-none transition-colors"
                />
                
                <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-1.5">
                       <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</label>
                       <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full h-10 px-3 bg-secondary rounded-lg border-transparent focus:ring-2 focus:ring-indigo-500 text-sm outline-none">
                          <option value="personal">Personal</option>
                          <option value="health">Health</option>
                          <option value="career">Career</option>
                          <option value="learning">Learning</option>
                          <option value="finance">Finance</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Date</label>
                       <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full h-10 px-3 bg-secondary rounded-lg border-transparent focus:ring-2 focus:ring-indigo-500 text-sm outline-none color-scheme-[dark]" />
                    </div>
                </div>
            </div>

            {/* Milestones Area */}
            <div className="space-y-4">
               <h3 className="font-semibold text-lg flex items-center justify-between">
                  Milestones
                  <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                     +20 XP each
                  </span>
               </h3>

               {/* Add Milestone Form */}
               <form onSubmit={handleAddMilestone} className="relative">
                  <input
                     type="text"
                     placeholder="Add a milestone step..."
                     value={newMilestoneTitle}
                     onChange={(e) => setNewMilestoneTitle(e.target.value)}
                     className="w-full h-10 pl-4 pr-10 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" disabled={!newMilestoneTitle.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"><Plus className="w-4 h-4"/></button>
               </form>

               {/* Milestone List */}
               <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                   {milestones.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Break your goal down into actionable chunks.</p>}
                   {milestones.map((m, i) => (
                       <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-white/5 hover:border-white/10 group transition-all">
                          <button 
                             type="button"
                             onClick={() => toggleMilestone(i)}
                             className="flex items-center gap-3 text-left flex-1"
                          >
                             {m.completed ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground hover:text-indigo-500 transition-colors flex-shrink-0" />}
                             <span className={cn("text-sm transition-all", m.completed && "line-through text-muted-foreground")}>{m.title}</span>
                          </button>
                          
                          <button type="button" onClick={() => removeMilestone(i)} className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-all">
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                   ))}
               </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-secondary/50 border-t shrink-0">
            <div className="flex gap-2">
                {goal?._id && (
                    <button type="button" onClick={handleDelete} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" title="Delete Goal"><Trash2 className="w-4 h-4" /></button>
                )}
                {goal?._id && (
                    <button type="button" onClick={handleCompleteGoal} className={cn("px-3 text-sm font-bold flex items-center gap-2 rounded-lg transition-all", goal.status === 'completed' ? "text-amber-500 hover:bg-amber-500/10" : "text-emerald-500 hover:bg-emerald-500/10")}>
                        {goal.status === 'completed' ? "Revert Goal" : "Achieve Goal"}
                    </button>
                )}
            </div>

            <div className="flex gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-white/5 rounded-xl text-sm font-medium transition-colors">Close</button>
                <button 
                    type="button" 
                    onClick={handleSave} 
                    disabled={isSaving || !title.trim()} 
                    className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Goal
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
