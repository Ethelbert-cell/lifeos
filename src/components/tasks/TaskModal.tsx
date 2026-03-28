"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Calendar as CalendarIcon, Tag, Loader2, Trash2 } from "lucide-react";
import { ITask } from "@/models/Task";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";

interface TaskModalProps {
  task?: ITask | null; // If null, we are creating a new task
  initialStatus?: string;
  onClose: () => void;
}

export function TaskModal({ task, initialStatus = "todo", onClose }: TaskModalProps) {
  const { createTask, updateTask, deleteTask } = useTaskStore();
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<any>(task?.status || initialStatus);
  const [priority, setPriority] = useState<any>(task?.priority || "medium");
  const [dueDate, setDueDate] = useState<string>(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
  const [tagsInput, setTagsInput] = useState(task?.tags?.join(", ") || "");

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean)
    };

    try {
      if (task?._id) {
        await updateTask(String(task._id), payload);
      } else {
        await createTask({ ...payload, order: 0 }); // Server API assigns the real order at the bottom
      }
      onClose();
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task?._id) return;
    if (confirm("Are you sure you want to delete this task?")) {
      setIsSaving(true);
      await deleteTask(String(task._id));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative bg-card border shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{task ? "Edit Task" : "New Task"}</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
          {/* Title */}
          <div>
            <input
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-transparent text-xl font-semibold placeholder:text-muted-foreground focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors pb-2"
            />
          </div>

          {/* Details Grip */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" /> Due Date (Optional)
             </label>
             <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 [color-scheme:dark]"
             />
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Tags (comma separated)
             </label>
             <input 
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="work, frontend, important"
                className="w-full h-10 px-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
             />
          </div>

          <div className="space-y-1.5">
             <label className="text-xs font-medium text-muted-foreground">Description</label>
             <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                rows={3}
                className="w-full p-3 rounded-lg border bg-background text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-y"
             />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t">
            {task ? (
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="flex items-center gap-2 p-2 px-3 rounded-lg text-rose-500 hover:bg-rose-500/10 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
            ) : <div />}

            <div className="flex gap-3">
                <button 
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 hover:bg-secondary rounded-xl text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={isSaving || !title.trim()}
                    className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {task ? "Save Changes" : "Create Task"}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
