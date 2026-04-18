import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IGymRoutine extends Document {
  userId: string;
  name: string;
  icon: string;
  color: string;
  workoutType: "strength" | "cardio" | "flexibility" | "sports" | "hiit" | "other";
  targetDaysPerWeek: number;
  templateExercises: {
    name: string;
    sets?: number;
    reps?: number;
    notes?: string;
  }[];
  streak: number;
  longestStreak: number;
  lastCompleted?: Date;
}

const ExerciseTemplateSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  sets:     { type: Number },
  reps:     { type: Number },
  notes:    { type: String, trim: true },
}, { _id: false });

const GymRoutineSchema = new Schema<IGymRoutine>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: "🏋️" },
    color: { type: String, default: "#6366f1" },
    workoutType: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "sports", "hiit", "other"],
      default: "strength",
    },
    targetDaysPerWeek: { type: Number, default: 3, min: 1, max: 7 },
    templateExercises: { type: [ExerciseTemplateSchema], default: [] },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastCompleted: { type: Date },
  },
  { timestamps: true }
);

export const GymRoutine = models.GymRoutine ?? model<IGymRoutine>("GymRoutine", GymRoutineSchema);
