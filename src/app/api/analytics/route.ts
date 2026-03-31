import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Task from '@/models/Task';
import Habit from '@/models/Habit';
import Note from '@/models/Note';

// Build an array of the last N days as date strings "YYYY-MM-DD"
function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function toDateKey(date: Date | string): string {
  return new Date(date).toISOString().split('T')[0];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const userId = session.user.id;
    const days = lastNDays(14);
    const since = new Date(days[0]);

    // Fetch items created/completed in the last 14 days
    const [tasks, habits, notes] = await Promise.all([
      Task.find({ userId, status: 'done', updatedAt: { $gte: since } }).select('updatedAt').lean(),
      Habit.find({ userId }).select('completionLogs').lean(),
      Note.find({ userId, createdAt: { $gte: since } }).select('createdAt').lean(),
    ]);

    // Build per-day map
    type DayData = { date: string; tasks: number; habits: number; notes: number; total: number };
    const map = new Map<string, DayData>();
    days.forEach(d => map.set(d, { date: d, tasks: 0, habits: 0, notes: 0, total: 0 }));

    tasks.forEach((t: any) => {
      const key = toDateKey(t.updatedAt);
      const entry = map.get(key);
      if (entry) { entry.tasks++; entry.total++; }
    });

    habits.forEach((h: any) => {
      (h.completionLogs ?? []).forEach((log: Date) => {
        const key = toDateKey(log);
        const entry = map.get(key);
        if (entry) { entry.habits++; entry.total++; }
      });
    });

    notes.forEach((n: any) => {
      const key = toDateKey(n.createdAt);
      const entry = map.get(key);
      if (entry) { entry.notes++; entry.total++; }
    });

    const data = Array.from(map.values());

    // Today vs Yesterday
    const todayKey = toDateKey(new Date());
    const yesterdayKey = toDateKey(new Date(Date.now() - 86400000));
    const today = map.get(todayKey) ?? { total: 0, tasks: 0, habits: 0, notes: 0 };
    const yesterday = map.get(yesterdayKey) ?? { total: 0, tasks: 0, habits: 0, notes: 0 };

    // This week vs Last week
    const thisWeek = data.slice(7);
    const lastWeek = data.slice(0, 7);
    const thisWeekTotal = thisWeek.reduce((s, d) => s + d.total, 0);
    const lastWeekTotal = lastWeek.reduce((s, d) => s + d.total, 0);

    return NextResponse.json({
      daily: data,
      today,
      yesterday,
      thisWeekTotal,
      lastWeekTotal,
      thisWeek,
      lastWeek,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
