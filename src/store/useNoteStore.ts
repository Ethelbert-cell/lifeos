import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INote } from '@/models/Note';

interface NoteState {
  notes: INote[];
  isLoading: boolean;
  error: string | null;
  fetchNotes: (query?: string) => Promise<void>;
  createNote: (data: Partial<INote>) => Promise<void>;
  updateNote: (id: string, updates: Partial<INote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  pinNote: (id: string, isPinned: boolean) => Promise<void>;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async (query = '') => {
    set({ isLoading: true, error: null });
    try {
      const url = query ? `/api/notes?q=${encodeURIComponent(query)}` : '/api/notes';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      set({ notes: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createNote: async (data) => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create note');
      
      // Auto-fetch to ensure the new note goes to the correct top position
      await get().fetchNotes();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateNote: async (id, updates) => {
    try {
      // Opt UI cache instantly so Tiptap typing doesn't jitter
      set(state => ({
        notes: state.notes.map(n => String(n._id) === id ? { ...n, ...updates } as INote : n)
      }));

      const res = await fetch('/api/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, ...updates }),
      });
      
      if (!res.ok) throw new Error('Failed to update note');
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  pinNote: async (id, isPinned) => {
    try {
      // Instantly pin in UI, then re-sort array: pinned notes at index 0
      set(state => {
        const updated = state.notes.map(n => String(n._id) === id ? { ...n, isPinned } as INote : n);
        return {
          notes: updated.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            // Fallback descending chronological
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          })
        };
      });

      const res = await fetch('/api/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, isPinned }),
      });

      if (!res.ok) throw new Error('Failed to pin note');
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteNote: async (id) => {
    const oldNotes = get().notes;
    set(state => ({ notes: state.notes.filter(n => String(n._id) !== id) }));
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete note');
    } catch (err: any) {
      set({ notes: oldNotes, error: err.message });
      throw err;
    }
  }
}), { name: 'lifeos-notes' }));
