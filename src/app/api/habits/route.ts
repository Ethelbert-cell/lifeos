import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Habit from '@/models/Habit';
import User from '@/models/User';
import { XP_REWARDS, isToday } from '@/lib/utils';
import { startOfDay, subDays, isSameDay } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const habits = await Habit.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(habits);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();

    const habit = await Habit.create({
      ...body,
      userId: session.user.id,
      streak: 0,
      longestStreak: 0,
      completionLogs: [],
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { id, action, ...updateData } = body;

    if (!id) return NextResponse.json({ error: 'Missing habit ID' }, { status: 400 });

    const habit = await Habit.findOne({ _id: id, userId: session.user.id });
    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });

    // Handle normal updates (name, color, icon)
    if (action !== 'check-in') {
      const updated = await Habit.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      return NextResponse.json(updated);
    }

    // --- HANDLE CHECK-IN LOGIC ---
    
    // Prevent double check-ins on the same day
    const alreadyCheckedIn = habit.completionLogs.some((dateLog: Date) => isToday(dateLog));
    if (alreadyCheckedIn) {
      return NextResponse.json({ error: 'Already completed today' }, { status: 400 });
    }

    // Insert today (normalized to start of day to avoid time shifting issues)
    const todayLog = startOfDay(new Date());
    habit.completionLogs.push(todayLog);

    // Calculate dynamic streak directly from logs
    // Sort descending: newest first
    const sortedLogs = [...habit.completionLogs]
        .map(d => startOfDay(new Date(d)))
        .sort((a, b) => b.getTime() - a.getTime());

    // Remove duplicates just in case
    const uniqueLogs = sortedLogs.filter(
      (date, i, arr) => i === 0 || !isSameDay(date, arr[i - 1])
    );

    let newStreak = 0;
    let expectedDate = startOfDay(new Date()); // Start checking from today

    for (const logDate of uniqueLogs) {
      if (isSameDay(logDate, expectedDate)) {
        newStreak++;
        expectedDate = subDays(expectedDate, 1); // Move target to yesterday
      } else {
        // Gap detected
        break;
      }
    }

    habit.streak = newStreak;
    if (newStreak > habit.longestStreak) {
      habit.longestStreak = newStreak;
    }

    await habit.save();

    // Calculate XP Rewards
    let totalXpEarned = XP_REWARDS.HABIT_CHECK;
    
    // If multiple of 7, grant the streak bonus
    if (newStreak > 0 && newStreak % 7 === 0) {
      totalXpEarned += XP_REWARDS.HABIT_STREAK_7; // +50 XP
    }

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: totalXpEarned },
    });

    return NextResponse.json({
      habit,
      xpEarned: totalXpEarned,
      streakMilestone: newStreak > 0 && newStreak % 7 === 0
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const habit = await Habit.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!habit) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
