import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IHabit } from '@/models/Habit';

interface HabitState {
  habits: IHabit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  createHabit: (data: Partial<IHabit>) => Promise<void>;
  checkInHabit: (id: string) => Promise<{ xpEarned: number; streakMilestone: boolean } | null>;
  deleteHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/habits');
      if (!res.ok) throw new Error('Failed to fetch habits');
      const data = await res.json();
      set({ habits: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createHabit: async (data) => {
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create habit');
      const newHabit = await res.json();
      set(state => ({ habits: [newHabit, ...state.habits] }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  checkInHabit: async (id) => {
    try {
      const res = await fetch('/api/habits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'check-in' }),
      });

      const json = await res.json();
      // Handle the 400 Already Completed gracefully
      if (!res.ok) throw new Error(json.error || 'Failed to check-in');

      // Hydrate local cache with fresh habit + streak math from db
      set(state => ({
        habits: state.habits.map(h => String(h._id) === id ? json.habit : h)
      }));

      // Return the gamification variables yielded by the backend (xpEarned, streakMilestone)
      return { xpEarned: json.xpEarned, streakMilestone: json.streakMilestone };
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteHabit: async (id) => {
    const oldHabits = get().habits;
    set(state => ({ habits: state.habits.filter(h => String(h._id) !== id) }));

    try {
      const res = await fetch(`/api/habits?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete habit');
    } catch (err: any) {
      set({ habits: oldHabits, error: err.message });
      throw err;
    }
  }
}), { name: 'lifeos-habits' }));
