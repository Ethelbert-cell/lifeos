import { formatDistanceToNow } from "date-fns";
import { Pin, FileText } from "lucide-react";
import { INote } from "@/models/Note";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: INote;
  onClick: (note: INote) => void;
  onPin: (e: React.MouseEvent, noteId: string, isPinned: boolean) => void;
}

export function NoteCard({ note, onClick, onPin }: NoteCardProps) {
  // Derive a plain text excerpt (approx 120 chars)
  const excerpt = note.plainText 
     ? note.plainText.substring(0, 120) + (note.plainText.length > 120 ? "..." : "")
     : "Empty note";

  return (
    <div
      onClick={() => onClick(note)}
      className="group flex flex-col h-56 p-5 bg-card border border-white/5 rounded-2xl shadow-sm hover:shadow-md hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
           {note.title || "Untitled Note"}
        </h3>
        
        <button
          onClick={(e) => onPin(e, String(note._id), !note.isPinned)}
          className={cn(
             "p-1.5 rounded-full transition-colors flex-shrink-0 -mr-1 -mt-1",
             note.isPinned 
               ? "text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20" 
               : "text-muted-foreground/0 group-hover:text-muted-foreground hover:bg-white/10"
          )}
        >
          <Pin className={cn("w-4 h-4", note.isPinned && "fill-indigo-500")} />
        </button>
      </div>

      <p className="text-sm text-muted-foreground flex-1 line-clamp-5 relative z-10">
         {excerpt}
      </p>

      {/* Footer Info */}
      <div className="pt-4 mt-auto flex items-center justify-between text-xs text-muted-foreground/60 border-t border-white/5 relative z-10">
         <span suppressHydrationWarning>
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
         </span>
         
         <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{note.wordCount || 0} words</span>
         </div>
      </div>

      {/* Subtle background icon */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.02] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-6">
        <FileText className="w-40 h-40" />
      </div>
    </div>
  );
}
