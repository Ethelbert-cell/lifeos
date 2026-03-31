import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IInstructor extends Document {
  name: string;
  avatar?: string;
  specialties: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  experience: number; // years
  certifications: string[];
  schedule: {
    day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
    slots: string[]; // e.g. ["09:00", "11:00", "14:00"]
  }[];
  isAvailable: boolean;
  contactEmail?: string;
}

const ScheduleSchema = new Schema({
  day:   { type: String, enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], required: true },
  slots: { type: [String], default: [] },
}, { _id: false });

const InstructorSchema = new Schema<IInstructor>(
  {
    name:           { type: String, required: true, trim: true },
    avatar:         { type: String },
    specialties:    { type: [String], default: [] },
    bio:            { type: String, trim: true, default: "" },
    rating:         { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount:    { type: Number, default: 0 },
    experience:     { type: Number, default: 1 },
    certifications: { type: [String], default: [] },
    schedule:       { type: [ScheduleSchema], default: [] },
    isAvailable:    { type: Boolean, default: true },
    contactEmail:   { type: String },
  },
  { timestamps: true }
);

export const Instructor = models.Instructor ?? model<IInstructor>("Instructor", InstructorSchema);
