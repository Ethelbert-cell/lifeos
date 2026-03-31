import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IAchievement extends Document {
  userId: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string; // emoji
  category: "tasks" | "habits" | "goals" | "gym" | "streak" | "xp" | "notes";
  xpReward: number;
  unlockedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    userId:        { type: String, required: true, index: true },
    achievementId: { type: String, required: true },
    title:         { type: String, required: true },
    description:   { type: String, required: true },
    icon:          { type: String, default: "🏆" },
    category:      {
      type: String,
      enum: ["tasks", "habits", "goals", "gym", "streak", "xp", "notes"],
      required: true,
    },
    xpReward:   { type: Number, default: 50 },
    unlockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate achievements per user
AchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const Achievement = models.Achievement ?? model<IAchievement>("Achievement", AchievementSchema);
