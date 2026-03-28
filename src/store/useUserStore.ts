import { create } from 'zustand';
import { levelFromXP } from '@/lib/utils';

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  xp: number;
  level: number;
  streak: number;
}

interface UserState {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  addLocalXp: (amount: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,

  // Called to initialize the gamification loop, trigger the daily +5 XP, and sync the NextAuth session.
  fetchUser: async () => {
    try {
      const res = await fetch('/api/user');
      if (!res.ok) {
         if (res.status === 401) return; // Session dead
         throw new Error('Failed to fetch user');
      }
      const data = await res.json();
      set({ user: data, isLoading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateUser: async (updates) => {
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update user profile');
      const updatedUser = await res.json();
      set({ user: updatedUser });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  // Called explicitly by other stores (like checking off a Kanban task) 
  // to sync the UI XP bar immediately without triggering a roundtrip refetch
  // Note: The underlying API route has already granted the XP securely.
  addLocalXp: (amount) => {
    const currentUser = get().user;
    if (!currentUser) return;
    
    const newXp = currentUser.xp + amount;
    const newLevel = levelFromXP(newXp);

    set({ user: { ...currentUser, xp: newXp, level: newLevel } });
  }
}));
