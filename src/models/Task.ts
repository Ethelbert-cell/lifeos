import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: { type: Date },
    tags: { type: [String], default: [] },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// High-performance compound index for per-user querying sorted by KanBan order
TaskSchema.index({ userId: 1, order: 1 });

const Task: Model<ITask> =
  mongoose.models.Task ?? mongoose.model<ITask>('Task', TaskSchema);

export default Task;
