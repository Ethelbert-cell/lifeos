import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IGymLog extends Document {
  userId: string;
  date: Date;
  workoutType: "strength" | "cardio" | "flexibility" | "sports" | "hiit" | "other";
  title: string;
  duration: number; // minutes
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number; // kg
    distance?: number; // km
    notes?: string;
  }[];
  xpAwarded: number;
  notes?: string;
  routineId?: string;
}

const ExerciseSchema = new Schema({
  name:     { type: String, required: true, trim: true },
  sets:     { type: Number },
  reps:     { type: Number },
  weight:   { type: Number },
  distance: { type: Number },
  notes:    { type: String, trim: true },
}, { _id: false });

const GymLogSchema = new Schema<IGymLog>(
  {
    userId:      { type: String, required: true, index: true },
    date:        { type: Date, required: true, default: Date.now },
    workoutType: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "sports", "hiit", "other"],
      default: "strength",
    },
    title:       { type: String, required: true, trim: true },
    duration:    { type: Number, required: true, min: 1 },
    exercises:   { type: [ExerciseSchema], default: [] },
    xpAwarded:   { type: Number, default: 25 },
    notes:       { type: String, trim: true },
    routineId:   { type: String, index: true },
  },
  { timestamps: true }
);

// Compound index for efficient user + date queries
GymLogSchema.index({ userId: 1, date: -1 });

export const GymLog = models.GymLog ?? model<IGymLog>("GymLog", GymLogSchema);
