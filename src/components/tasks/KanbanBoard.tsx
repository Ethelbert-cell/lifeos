"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useTaskStore } from "@/store/useTaskStore";
import { useUserStore } from "@/store/useUserStore";
import { TaskCard } from "./TaskCard";
import { ITask } from "@/models/Task";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { XP_REWARDS, cn } from "@/lib/utils";

const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" }
];

interface KanbanBoardProps {
  onEditTask: (task: ITask) => void;
  onNewTask: (status: string) => void;
}

export function KanbanBoard({ onEditTask, onNewTask }: KanbanBoardProps) {
  const { tasks, fetchTasks, updateTask, bulkUpdateTasks } = useTaskStore();
  const { addLocalXp } = useUserStore();
  
  // Hydration fix for @hello-pangea/dnd
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    fetchTasks();
  }, [fetchTasks]);

  if (!isMounted) return <div className="animate-pulse h-[600px] bg-white/5 rounded-2xl" />;

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Isolate columns
    const sourceTasks = tasks.filter(t => t.status === source.droppableId).sort((a,b) => a.order - b.order);
    const destTasks = source.droppableId === destination.droppableId 
        ? sourceTasks 
        : tasks.filter(t => t.status === destination.droppableId).sort((a,b) => a.order - b.order);

    const movedTask = sourceTasks[source.index];
    
    // Simulate array splice
    sourceTasks.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) {
        sourceTasks.splice(destination.index, 0, movedTask);
    } else {
        destTasks.splice(destination.index, 0, movedTask);
    }

    // Recalculate 'order' spacing for the whole destination column
    const updates = destTasks.map((t, index) => ({
      _id: String(t._id),
      status: destination.droppableId,
      order: (index + 1) * 1024 
    }));

    // If moved between columns, we also need to enforce the source array orders so they don't break
    if (source.droppableId !== destination.droppableId) {
        sourceTasks.forEach((t, index) => {
            updates.push({
                _id: String(t._id),
                status: source.droppableId,
                order: (index + 1) * 1024
            });
        });
    }

    // Gamification Toast Alert
    if (source.droppableId !== "done" && destination.droppableId === "done") {
        toast.success(`Task complete! +${XP_REWARDS.TASK_DONE} XP`, {
          icon: '✨',
          style: { background: '#10b981', color: '#fff', padding: '16px', borderRadius: '12px' }
        });
        addLocalXp(XP_REWARDS.TASK_DONE);
    } else if (source.droppableId === "done" && destination.droppableId !== "done") {
        // Technically losing XP but we don't toast negative reinforcement
        addLocalXp(-XP_REWARDS.TASK_DONE);
    }

    await bulkUpdateTasks(updates);
  };

  const handleQuickComplete = async (e: React.MouseEvent, task: ITask) => {
    e.stopPropagation();
    toast.success(`Task complete! +${XP_REWARDS.TASK_DONE} XP`, { icon: '✨' });
    addLocalXp(XP_REWARDS.TASK_DONE);
    await updateTask(String(task._id), { status: "done" });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 gap-6 items-start h-full no-scrollbar">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id).sort((a, b) => a.order - b.order);
          
          return (
            <div key={col.id} className="flex flex-col gap-4 bg-muted/50 border border-border p-4 rounded-2xl min-h-[500px] min-w-[85vw] snap-center md:min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {col.title}
                  <span className="text-xs bg-black/20 text-muted-foreground px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </h3>
                <button 
                  onClick={() => onNewTask(col.id)}
                  className="p-1.5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 flex flex-col gap-3 rounded-xl transition-colors",
                      snapshot.isDraggingOver && "bg-indigo-500/5 ring-1 ring-inset ring-indigo-500/20"
                    )}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={String(task._id)} draggableId={String(task._id)} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps} // applying handle props to the whole card for ease, or we can isolate it
                            style={{ ...provided.draggableProps.style, ...(snapshot.isDragging ? { zIndex: 9999 } : {}) }}
                          >
                            <TaskCard 
                                task={task} 
                                onClick={onEditTask} 
                                onQuickComplete={handleQuickComplete}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
