"use client";

import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskModal } from "@/components/tasks/TaskModal";
import { useState } from "react";
import { ITask } from "@/models/Task";

export default function TasksPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [initialStatus, setInitialStatus] = useState("todo");

  const openNewTaskModal = (status: string) => {
    setEditingTask(null);
    setInitialStatus(status);
    setModalOpen(true);
  };

  const openEditTaskModal = (task: ITask) => {
    setEditingTask(task);
    setInitialStatus(task.status);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1 text-sm">Organize your deep work in a Kanban flow.</p>
        </div>
        <button 
          onClick={() => openNewTaskModal("todo")}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md"
        >
          New Task
        </button>
      </div>

      <div className="flex-1 w-full min-h-[600px] overflow-hidden rounded-2xl border bg-card/50 shadow-sm p-4">
        <KanbanBoard onEditTask={openEditTaskModal} onNewTask={openNewTaskModal} />
      </div>

      {modalOpen && (
        <TaskModal 
          task={editingTask} 
          initialStatus={initialStatus} 
          onClose={() => setModalOpen(false)} 
        />
      )}
    </div>
  );
}
