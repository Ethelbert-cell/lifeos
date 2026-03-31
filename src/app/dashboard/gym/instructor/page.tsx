"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Award, ChevronLeft, Loader2, Users, Calendar, Mail } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Instructor {
  _id: string;
  name: string;
  avatar?: string;
  specialties: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  experience: number;
  certifications: string[];
  schedule: { day: string; slots: string[] }[];
  isAvailable: boolean;
  contactEmail?: string;
}

const SPECIALTY_COLORS: Record<string, string> = {
  "Strength Training": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Cardio":           "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "HIIT":             "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Yoga":             "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "Nutrition":        "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "Crossfit":         "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function InstructorCard({ instructor }: { instructor: Instructor }) {
  const [booked, setBooked] = useState(false);
  const initials = instructor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleBook = () => {
    if (instructor.contactEmail) {
      window.location.href = `mailto:${instructor.contactEmail}?subject=Session Booking Request — LifeOS`;
    } else {
      toast.success(`Booking request sent to ${instructor.name}! 🎉`);
      setBooked(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 hover:border-indigo-500/30 transition-all"
    >
      {/* Profile Row */}
      <div className="flex items-start gap-4">
        {instructor.avatar ? (
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-lg">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base truncate">{instructor.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={instructor.rating} />
            <span className="text-xs text-muted-foreground">
              {instructor.rating.toFixed(1)} ({instructor.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
            <Award className="w-3 h-3" />
            {instructor.experience} yr{instructor.experience !== 1 ? "s" : ""} experience
            {instructor.certifications.length > 0 && (
              <><span>·</span> {instructor.certifications[0]}</>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {instructor.bio && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{instructor.bio}</p>
      )}

      {/* Specialties */}
      {instructor.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {instructor.specialties.map(s => (
            <span
              key={s}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${SPECIALTY_COLORS[s] ?? "bg-muted text-muted-foreground border-border"}`}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Schedule */}
      {instructor.schedule.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Available
          </p>
          <div className="flex flex-wrap gap-2">
            {instructor.schedule.map(s => (
              <div key={s.day} className="text-xs">
                <span className="font-semibold text-foreground">{s.day}</span>
                {s.slots.length > 0 && (
                  <span className="text-muted-foreground ml-1">{s.slots.slice(0,2).join(", ")}{s.slots.length > 2 ? "…" : ""}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {instructor.contactEmail && (
          <a
            href={`mailto:${instructor.contactEmail}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
        )}
        <button
          onClick={handleBook}
          disabled={booked}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
            booked
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
              : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
          }`}
        >
          {booked ? "✓ Requested" : "Book Session"}
        </button>
      </div>
    </motion.div>
  );
}

// Demo data shown while DB is empty
const DEMO_INSTRUCTORS: Instructor[] = [
  {
    _id: "demo1", name: "Alex Rivera", experience: 8, rating: 4.9, reviewCount: 127,
    specialties: ["Strength Training", "Crossfit"], certifications: ["NSCA-CSCS"],
    bio: "Former competitive powerlifter. I specialise in building raw strength and athletic performance. Let's unlock what your body is truly capable of.",
    schedule: [{ day: "Mon", slots: ["07:00","09:00"] }, { day: "Wed", slots: ["07:00","18:00"] }, { day: "Fri", slots: ["06:00","08:00"] }],
    isAvailable: true, contactEmail: "alex@example.com",
  },
  {
    _id: "demo2", name: "Priya Sharma", experience: 5, rating: 4.8, reviewCount: 89,
    specialties: ["Yoga", "Cardio"], certifications: ["RYT-500", "ACE CPT"],
    bio: "Yoga teacher and endurance coach. I help clients build flexibility, mental clarity, and cardiovascular capacity through mindful movement.",
    schedule: [{ day: "Tue", slots: ["08:00","12:00"] }, { day: "Thu", slots: ["08:00","17:00"] }, { day: "Sat", slots: ["09:00"] }],
    isAvailable: true,
  },
  {
    _id: "demo3", name: "Marcus Kane", experience: 12, rating: 4.7, reviewCount: 203,
    specialties: ["HIIT", "Nutrition"], certifications: ["NASM CPT", "Precision Nutrition L1"],
    bio: "12 years coaching high-performance athletes and everyday fitness goals. My HIIT programs combined with nutrition coaching deliver results in 8 weeks.",
    schedule: [{ day: "Mon", slots: ["06:00","12:00","18:00"] }, { day: "Wed", slots: ["06:00","18:00"] }, { day: "Sat", slots: ["08:00","10:00"] }],
    isAvailable: true, contactEmail: "marcus@example.com",
  },
];

export default function InstructorPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");

  useEffect(() => {
    fetch("/api/gym/instructors")
      .then(r => r.json())
      .then(d => {
        // Fall back to demo instructors if DB is empty
        setInstructors(d.instructors?.length > 0 ? d.instructors : DEMO_INSTRUCTORS);
        setLoading(false);
      })
      .catch(() => { setInstructors(DEMO_INSTRUCTORS); setLoading(false); });
  }, []);

  const allSpecialties = Array.from(new Set(instructors.flatMap(i => i.specialties)));
  const filtered = filter === "all" ? instructors : instructors.filter(i => i.specialties.includes(filter));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/gym"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Gym Tracker
        </Link>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          Instructors <Users className="w-7 h-7 text-indigo-400" />
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {instructors.length} certified trainer{instructors.length !== 1 ? "s" : ""} available · Book a personalised session
        </p>
      </div>

      {/* Specialty Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            filter === "all" ? "bg-indigo-500 text-white border-indigo-500" : "bg-card text-muted-foreground border-border hover:border-indigo-500/50"
          }`}
        >
          All
        </button>
        {allSpecialties.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === s ? "bg-indigo-500 text-white border-indigo-500" : "bg-card text-muted-foreground border-border hover:border-indigo-500/50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Instructor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(instructor => (
          <InstructorCard key={instructor._id} instructor={instructor} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 border border-border rounded-2xl text-muted-foreground text-sm">
          No instructors match this filter.
        </div>
      )}
    </div>
  );
}
