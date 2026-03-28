import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Goal, { IMilestone } from '@/models/Goal';
import User from '@/models/User';
import { XP_REWARDS } from '@/lib/utils';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const goals = await Goal.find({ userId: session.user.id }).sort({ targetDate: 1, createdAt: -1 });
    return NextResponse.json(goals);
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

    const goal = await Goal.create({
      ...body,
      userId: session.user.id,
    });

    return NextResponse.json(goal, { status: 201 });
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
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 });

    const existingGoal = await Goal.findOne({ _id, userId: session.user.id });
    if (!existingGoal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 });

    // Track state prior to update for XP math
    const wasCompleted = existingGoal.status === 'completed';
    const oldMilestonesCompleted = existingGoal.milestones.filter(m => m.completed).length;

    // Apply the update
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id, userId: session.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedGoal) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

    // Calculate XP
    let xpToAward = 0;
    const isNowCompleted = updatedGoal.status === 'completed';
    const newMilestonesCompleted = updatedGoal.milestones.filter(m => m.completed).length;

    // Milestone Completion Logic (+20 XP per new milestone)
    if (newMilestonesCompleted > oldMilestonesCompleted) {
      const difference = newMilestonesCompleted - oldMilestonesCompleted;
      xpToAward += (difference * XP_REWARDS.GOAL_MILESTONE);
    } else if (newMilestonesCompleted < oldMilestonesCompleted) {
      // Deduct XP if they uncheck a milestone
      const difference = oldMilestonesCompleted - newMilestonesCompleted;
      xpToAward -= (difference * XP_REWARDS.GOAL_MILESTONE);
    }

    // Goal Completion Logic (+100 XP)
    if (!wasCompleted && isNowCompleted) {
      xpToAward += XP_REWARDS.GOAL_COMPLETE;
    } else if (wasCompleted && !isNowCompleted) {
      // Deduct XP if they uncheck the entire goal
      xpToAward -= XP_REWARDS.GOAL_COMPLETE;
    }

    // Apply total atomic XP delta if !== 0
    if (xpToAward !== 0) {
      await User.findByIdAndUpdate(session.user.id, {
        $inc: { xp: xpToAward }
      });
    }

    return NextResponse.json({
      goal: updatedGoal,
      xpDelta: xpToAward
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

    await connectDB();
    const existingGoal = await Goal.findOne({ _id: id, userId: session.user.id });
    if (!existingGoal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Optional deduction logic to prevent farming
    let xpDeduction = 0;
    if (existingGoal.status === 'completed') xpDeduction -= XP_REWARDS.GOAL_COMPLETE;
    const completedMilestones = existingGoal.milestones.filter(m => m.completed).length;
    xpDeduction -= (completedMilestones * XP_REWARDS.GOAL_MILESTONE);

    if (xpDeduction !== 0) {
      await User.findByIdAndUpdate(session.user.id, {
        $inc: { xp: xpDeduction }
      });
    }

    await Goal.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
