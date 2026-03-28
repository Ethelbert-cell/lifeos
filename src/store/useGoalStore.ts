import { create } from 'zustand';
import { IGoal } from '@/models/Goal';

interface GoalState {
  goals: IGoal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (data: Partial<IGoal>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<IGoal>) => Promise<{ xpDelta: number } | null>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/goals');
      if (!res.ok) throw new Error('Failed to fetch goals');
      const data = await res.json();
      set({ goals: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createGoal: async (data) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create goal');
      const newGoal = await res.json();
      set(state => ({ goals: [newGoal, ...state.goals] }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...updates }),
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update goal');
      
      // Hydrate local cache with exact goal returning from DB (critical for calculated milestone percentages)
      set(state => ({
        goals: state.goals.map(g => String(g._id) === id ? json.goal : g)
      }));

      // Return xpDelta for the toaster
      return { xpDelta: json.xpDelta };
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteGoal: async (id) => {
    const oldGoals = get().goals;
    set(state => ({ goals: state.goals.filter(g => String(g._id) !== id) }));
    try {
      const res = await fetch(`/api/goals?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete goal');
    } catch (err: any) {
      set({ goals: oldGoals, error: err.message });
      throw err;
    }
  }
}));
