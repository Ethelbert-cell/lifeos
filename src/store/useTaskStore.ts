import { create } from 'zustand';
import { ITask } from '@/models/Task';

interface TaskState {
  tasks: ITask[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: Partial<ITask>) => Promise<void>;
  updateTask: (id: string, updates: Partial<ITask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  bulkUpdateTasks: (updates: { _id: string; status: string; order: number }[]) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      set({ tasks: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const newTask = await res.json();
      set(state => ({ tasks: [...state.tasks, newTask] }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateTask: async (id, updates) => {
    // Optimistic UI Update setup
    const oldTasks = get().tasks;
    set(state => ({
      tasks: state.tasks.map(t => String(t._id) === id ? { ...t, ...updates } as ITask : t)
    }));

    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...updates }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updatedTask = await res.json();
      // Sync fresh data from API
      set(state => ({
        tasks: state.tasks.map(t => String(t._id) === id ? updatedTask : t)
      }));
    } catch (err: any) {
      // Revert Optimistic Update
      set({ tasks: oldTasks, error: err.message });
      throw err;
    }
  },

  deleteTask: async (id) => {
    const oldTasks = get().tasks;
    set(state => ({ tasks: state.tasks.filter(t => String(t._id) !== id) }));

    try {
      const res = await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
    } catch (err: any) {
      set({ tasks: oldTasks, error: err.message });
      throw err;
    }
  },

  bulkUpdateTasks: async (updates) => {
    // Highly specific for Kanban drag & drop across columns
    const idToUpdateMap = new Map(updates.map(u => [u._id, u]));
    
    // Optimistic Update
    const oldTasks = get().tasks;
    set(state => ({
      tasks: state.tasks.map(t => {
        const _idString = t._id!.toString();
        const update = idToUpdateMap.get(_idString);
        return update 
          ? ({ ...t, status: update.status as any, order: update.order } as ITask)
          : t }).sort((a, b) => a.order - b.order)
    }));

    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulkUpdate: true, tasks: updates }),
      });
      if (!res.ok) throw new Error('Failed to bulk update tasks');
    } catch (err: any) {
      set({ tasks: oldTasks, error: err.message });
      throw err;
    }
  }
}));
