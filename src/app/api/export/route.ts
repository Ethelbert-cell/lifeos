import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Task from '@/models/Task';
import Habit from '@/models/Habit';
import Note from '@/models/Note';
import Goal from '@/models/Goal';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const userId = session.user.id;

    const [tasks, habits, notes, goals, user] = await Promise.all([
      Task.find({ userId }).lean(),
      Habit.find({ userId }).lean(),
      Note.find({ userId }).lean(),
      Goal.find({ userId }).lean(),
      User.findById(userId).select('name email xp createdAt').lean(),
    ]);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile: user,
      stats: {
        totalTasks: tasks.length,
        totalHabits: habits.length,
        totalNotes: notes.length,
        totalGoals: goals.length,
      },
      tasks,
      habits,
      notes,
      goals,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="lifeos-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
