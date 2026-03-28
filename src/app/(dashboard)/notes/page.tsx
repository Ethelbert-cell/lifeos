"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { useNoteStore } from "@/store/useNoteStore";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { INote } from "@/models/Note";
import toast from "react-hot-toast";

export default function NotesPage() {
  const { notes, fetchNotes, createNote, pinNote, isLoading } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNote, setActiveNote] = useState<INote | null>(null);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
       fetchNotes(searchQuery);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchQuery, fetchNotes]);

  const handleCreateNote = async () => {
     try {
         await createNote({ title: "", content: "", plainText: "", wordCount: 0 });
         // Because createNote automatically fetches, the newly created note will be the first one (0 index generally)
         toast.success("Note created! +10 XP", { icon: '📝' });
         // We must delay slightly or immediately fetch the newest via local array, actually Zustand array updates immediately
     } catch (err: any) {
         toast.error(err.message);
     }
  };

  // We automatically set the active note once it appears in the store if we just clicked "New"
  // but it's simpler to listen for length differences:
  const prevNotesLength = useMemo(() => notes.length, [notes.length]);
  useEffect(() => {
     // If a new note was just added, and we don't have an active note, auto-open it
     if (notes.length > prevNotesLength && !activeNote && notes.length > 0) {
         // Assuming new notes are first due to sort order
         setActiveNote(notes[0]);
     }
  }, [notes, prevNotesLength, activeNote]);


  const handlePin = (e: React.MouseEvent, id: string, isPinned: boolean) => {
      e.stopPropagation();
      pinNote(id, isPinned);
  };

  if (activeNote) {
     const freshActiveNote = notes.find(n => n._id === activeNote._id) || activeNote;
     return (
        <div className="h-full">
            <NoteEditor note={freshActiveNote} onBack={() => setActiveNote(null)} />
        </div>
     );
  }

  return (
    <div className="flex flex-col h-full gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground mt-1 text-sm">Capture ideas. Search instantly. Expand your brain.</p>
        </div>
        <button 
          onClick={handleCreateNote}
          className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl line-clamp-1">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
         <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes globally..."
            className="w-full h-12 pl-12 pr-4 bg-card border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
         />
      </div>

      {/* Grid of Notes */}
      {isLoading && notes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-56 bg-white/5 rounded-2xl" />)}
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {notes.map(note => (
                 <NoteCard 
                    key={String(note._id)} 
                    note={note} 
                    onClick={setActiveNote}
                    onPin={handlePin}
                 />
             ))}

             {notes.length === 0 && (
                 <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-card/50 rounded-2xl border border-dashed border-white/10 mt-8">
                     <div className="text-4xl mb-4">📓</div>
                     <h3 className="text-lg font-medium text-foreground">
                         {searchQuery ? "No search results" : "Your notebook is empty"}
                     </h3>
                     <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                         {searchQuery 
                            ? "Try adjusting your search terms." 
                            : "Click 'New Note' to start writing down your thoughts, resources, and ideas."}
                     </p>
                 </div>
             )}
          </div>
      )}
    </div>
  );
}
