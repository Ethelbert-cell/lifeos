import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Task from '@/models/Task';
import Habit from '@/models/Habit';
import Goal from '@/models/Goal';
import { subDays, startOfDay } from 'date-fns';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const userId = new mongoose.Types.ObjectId(session.user.id);
    const sevenDaysAgo = startOfDay(subDays(new Date(), 7));

    // 1. Task Completion Rate (Last 7 Days)
    const taskStats = await Task.aggregate([
      { 
        $match: { 
          userId, 
          updatedAt: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    let completedTasks = 0;
    let otherTasks = 0;
    taskStats.forEach(stat => {
      if (stat._id === 'done') completedTasks = stat.count;
      else otherTasks += stat.count;
    });
    const totalRecentTasks = completedTasks + otherTasks;
    const taskCompletionRate = totalRecentTasks > 0 ? Math.round((completedTasks / totalRecentTasks) * 100) : 0;

    // 2. Active Habits Overview
    const activeHabits = await Habit.countDocuments({ userId });
    
    // 3. Active Goals Nearing Deadline (Next 14 days)
    const upcomingGoals = await Goal.find({
      userId,
      status: 'active',
      targetDate: { $gte: new Date(), $lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
    }).sort({ targetDate: 1 }).limit(3);

    return NextResponse.json({
      taskCompletionRate,
      completedTasks,
      totalRecentTasks,
      activeHabits,
      upcomingGoals
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
