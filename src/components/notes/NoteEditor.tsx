"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';
import { INote } from '@/models/Note';
import { ChevronLeft, Save, Trash2, Bold, Italic, List, Heading2 } from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';
import { cn } from '@/lib/utils';
// If you want placeholder extension you would install @tiptap/extension-placeholder
// But we'll build a standard implementation using StarterKit

interface NoteEditorProps {
  note: INote | null; // If null, creating new. Since creating yields a blank note instantly, we actually expect a note object always.
  onBack: () => void;
}

export function NoteEditor({ note, onBack }: NoteEditorProps) {
  const { updateNote, deleteNote } = useNoteStore();
  const [title, setTitle] = useState(note?.title || "");
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "">("");

  // Debounced auto-save hook pattern
  const [debouncedContent, setDebouncedContent] = useState(note?.content || "");
  const [debouncedTitle, setDebouncedTitle] = useState(title);

  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert sm:prose-base focus:outline-none min-h-[500px] max-w-none w-full pb-32',
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus("Saving...");
      setDebouncedContent(editor.getHTML());
    },
  });

  // Debounce effect logic (1 second delay)
  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(async () => {
      // Don't patch if nothing changed from prop
      if (debouncedContent === note.content && debouncedTitle === note.title) return;

      const plainText = editor?.getText() || "";
      const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;

      try {
        await updateNote(String(note._id), {
          title: debouncedTitle,
          content: debouncedContent,
          plainText,
          wordCount
        });
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus(""), 2000);
      } catch (err) {
         setSaveStatus("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedContent, debouncedTitle, note, updateNote, editor]);

  // Handle title typing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setSaveStatus("Saving...");
     setTitle(e.target.value);
     setDebouncedTitle(e.target.value);
  };

  const handleDelete = async () => {
      if (!note) return;
      if (confirm("Are you sure you want to delete this note forever?")) {
         await deleteNote(String(note._id));
         onBack();
      }
  };

  if (!editor || !note) return <div className="animate-pulse bg-white/5 h-[800px] rounded-2xl" />;

  return (
    <div className="flex flex-col h-full bg-background relative max-w-4xl mx-auto w-full">
       {/* Sticky Toolbar area */}
       <div className="sticky top-0 z-10 bg-background/90 backdrop-blur pb-4 border-b border-white/5 mb-6 flex flex-col gap-4 pt-2">
          
          <div className="flex items-center justify-between">
             <button 
               onClick={onBack}
               className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-white/5"
             >
                <ChevronLeft className="w-4 h-4" /> Back to Notes
             </button>

             <div className="flex items-center gap-4 text-sm text-muted-foreground">
                 {saveStatus && (
                    <span className="flex items-center gap-1.5 animate-in fade-in">
                       {saveStatus === "Saved" && <Save className="w-3.5 h-3.5" />}
                       {saveStatus}
                    </span>
                 )}
                 <button 
                    onClick={handleDelete}
                    className="p-1.5 hover:bg-rose-500/10 hover:text-rose-500 rounded transition-colors"
                 >
                    <Trash2 className="w-4 h-4" />
                 </button>
             </div>
          </div>

          <input 
             type="text"
             value={title}
             onChange={handleTitleChange}
             placeholder="Untitled Note"
             className="text-4xl font-black bg-transparent border-none outline-none placeholder:text-muted-foreground/30 w-full"
          />

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg w-fit border border-white/10">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("p-2 rounded transition-colors", editor.isActive('bold') ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("p-2 rounded transition-colors", editor.isActive('italic') ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}
              >
                <Italic className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("p-2 rounded transition-colors", editor.isActive('heading', { level: 2 }) ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("p-2 rounded transition-colors", editor.isActive('bulletList') ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}
              >
                <List className="w-4 h-4" />
              </button>
          </div>
       </div>

       {/* Editor Area */}
       <div className="flex-1 overflow-y-auto px-4 sm:px-0">
          <EditorContent editor={editor} />
       </div>
    </div>
  );
}
