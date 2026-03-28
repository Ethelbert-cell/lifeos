import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Types.ObjectId | string;
  name: string;
  icon: string;
  color: string;
  frequency: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  streak: number;
  longestStreak: number;
  completionLogs: Date[];
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, default: 'check-circle' },
    color: { type: String, required: true, default: 'indigo' },
    frequency: {
      type: [String],
      enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      default: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    },
    streak: { type: Number, default: 0, min: 0 },
    longestStreak: { type: Number, default: 0, min: 0 },
    // Only stores dates at midnight (local time) to easily determine completion status
    completionLogs: { type: [Date], default: [] },
  },
  { timestamps: true }
);

HabitSchema.index({ userId: 1, createdAt: -1 });

const Habit: Model<IHabit> =
  mongoose.models.Habit ?? mongoose.model<IHabit>('Habit', HabitSchema);

export default Habit;
