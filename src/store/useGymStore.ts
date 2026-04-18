import { create } from "zustand";

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
}

export interface IGymRoutine {
  _id: string;
  name: string;
  icon: string;
  color: string;
  workoutType: string;
  targetDaysPerWeek: number;
  templateExercises: Exercise[];
  lastCompleted?: string;
}

export interface IGymLog {
  _id: string;
  title: string;
  workoutType: string;
  duration: number;
  exercises: Exercise[];
  date: string;
  xpAwarded: number;
  routineId?: string;
}

interface GymStore {
  routines: IGymRoutine[];
  logs: IGymLog[];
  streak: number;
  isLoading: boolean;
  
  fetchData: () => Promise<void>;
  createRoutine: (data: Partial<IGymRoutine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  logWorkout: (data: any) => Promise<{ xpGained: number }>;
  deleteLog: (id: string) => Promise<void>;
}

export const useGymStore = create<GymStore>((set, get) => ({
  routines: [],
  logs: [],
  streak: 0,
  isLoading: true,

  fetchData: async () => {
    set({ isLoading: true });
    try {
      const [logsRes, routinesRes] = await Promise.all([
        fetch("/api/gym?days=30"),
        fetch("/api/gym/routines")
      ]);
      const logsData = await logsRes.json();
      const routinesData = await routinesRes.json();
      
      set({ 
        logs: logsData.logs || [], 
        streak: logsData.streak || 0,
        routines: routinesData.routines || [],
        isLoading: false 
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  createRoutine: async (data) => {
    const res = await fetch("/api/gym/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create routine");
    await get().fetchData();
  },

  deleteRoutine: async (id) => {
    const res = await fetch(`/api/gym/routines?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    set(state => ({ routines: state.routines.filter(r => r._id !== id) }));
  },

  logWorkout: async (data) => {
    const res = await fetch("/api/gym", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const parsed = await res.json();
    if (!res.ok) throw new Error(parsed.error || "Failed to log workout");
    await get().fetchData();
    return { xpGained: parsed.xpGained || 0 };
  },

  deleteLog: async (id) => {
    const res = await fetch(`/api/gym?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");
    set(state => ({ logs: state.logs.filter(l => l._id !== id) }));
  }
}));
