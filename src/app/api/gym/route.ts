import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { GymLog } from "@/models/GymLog";
import { GymRoutine } from "@/models/GymRoutine";
import User from "@/models/User";

const GYM_XP = 25;
const GYM_STREAK_BONUS = 50;

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30");
  const since = new Date();
  since.setDate(since.getDate() - days);

  const logs = await GymLog.find({
    userId: session.user.id,
    date: { $gte: since },
  }).sort({ date: -1 }).lean();

  // Compute streak from logs
  const today = new Date();
  const sortedDates = logs
    .map((l) => new Date(l.date).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i); // unique days

  let streak = 0;
  let check = new Date(today);
  for (let i = 0; i < 365; i++) {
    const ds = check.toDateString();
    if (sortedDates.includes(ds)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else if (i === 0) {
      // No workout today — check yesterday
      check.setDate(check.getDate() - 1);
      const ys = check.toDateString();
      if (!sortedDates.includes(ys)) break;
    } else {
      break;
    }
  }

  return NextResponse.json({ logs, streak });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const body = await req.json();
  const { title, workoutType, duration, exercises = [], notes, date, routineId } = body;

  if (!title?.trim() || !duration || duration < 1) {
    return NextResponse.json({ error: "title and duration (≥1 min) are required" }, { status: 400 });
  }

  // Check if already logged today (for streak bonus logic)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const alreadyLoggedToday = await GymLog.exists({
    userId: session.user.id,
    date: { $gte: todayStart },
  });

  const exactDate = date ? new Date(date) : new Date();

  const log = await GymLog.create({
    userId:      session.user.id,
    title:       title.trim(),
    workoutType: workoutType ?? "strength",
    duration,
    exercises,
    notes:       notes?.trim(),
    date:        exactDate,
    xpAwarded:   GYM_XP,
    routineId,
  });

  if (routineId) {
    await GymRoutine.findByIdAndUpdate(routineId, { lastCompleted: exactDate });
  }

  // Award XP — only for the first workout logged today to prevent farming
  let xpGained = 0;
  if (!alreadyLoggedToday) {
    xpGained = GYM_XP;

    // Check if this completes a 7-day gym streak
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const recentLogs = await GymLog.find({
      userId: session.user.id,
      date: { $gte: sevenDaysAgo },
    }).lean();

    const uniqueWorkoutDays = new Set(
      recentLogs.map((l) => new Date(l.date).toDateString())
    ).size;

    if (uniqueWorkoutDays >= 7) {
      xpGained += GYM_STREAK_BONUS;
    }

    await User.findByIdAndUpdate(session.user.id, { $inc: { xp: xpGained } });
  }

  return NextResponse.json({ log, xpGained });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const log = await GymLog.findOneAndDelete({ _id: id, userId: session.user.id });
  if (!log) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Deduct XP to prevent farming
  await User.findByIdAndUpdate(session.user.id, { $inc: { xp: -log.xpAwarded } });

  return NextResponse.json({ ok: true });
}
