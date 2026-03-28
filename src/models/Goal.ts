import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMilestone {
  title: string;
  completed: boolean;
}

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId | string;
  title: string;
  description?: string;
  status: 'active' | 'completed';
  progress: number;
  milestones: IMilestone[];
  targetDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { _id: true } // Subdocuments get their own _id by default, useful for selective updates
);

const GoalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    milestones: { type: [MilestoneSchema], default: [] },
    targetDate: { type: Date },
  },
  { timestamps: true }
);

GoalSchema.index({ userId: 1, targetDate: 1 });

const Goal: Model<IGoal> =
  mongoose.models.Goal ?? mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;
