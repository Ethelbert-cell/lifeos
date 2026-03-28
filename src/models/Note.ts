import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  content: string;
  plainText: string;
  tags: string[];
  isPinned: boolean;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    plainText: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false },
    wordCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// MongoDB text index for full-text search requested in Phase 2
NoteSchema.index({ title: 'text', plainText: 'text' });
// Sort index for recent notes
NoteSchema.index({ userId: 1, updatedAt: -1 });

const Note: Model<INote> =
  mongoose.models.Note ?? mongoose.model<INote>('Note', NoteSchema);

export default Note;
