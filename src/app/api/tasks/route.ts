import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Task from '@/models/Task';
import User from '@/models/User';
import { XP_REWARDS } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const tasks = await Task.find({ userId: session.user.id }).sort({ order: 1 });
    return NextResponse.json(tasks);
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

    const maxOrderTask = await Task.findOne({ userId: session.user.id }).sort({ order: -1 });
    const order = maxOrderTask ? maxOrderTask.order + 1024 : 1024; // using gap spacing for DnD

    const task = await Task.create({
      ...body,
      userId: session.user.id,
      order,
    });

    return NextResponse.json(task, { status: 201 });
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

    // Handle bulk ordering for Kanban drag-and-drop
    if (body.bulkUpdate && Array.isArray(body.tasks)) {
      const updates = body.tasks.map((t: any) => ({
        updateOne: {
          filter: { _id: t._id, userId: session.user.id },
          update: { order: t.order, status: t.status },
        },
      }));
      await Task.bulkWrite(updates);
      return NextResponse.json({ success: true });
    }

    // Handle single update
    const { _id, ...updateData } = body;
    if (!_id) return NextResponse.json({ error: 'Missing task ID' }, { status: 400 });

    const existingTask = await Task.findOne({ _id, userId: session.user.id });
    if (!existingTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const wasDone = existingTask.status === 'done';
    const isNowDone = updateData.status === 'done';

    const updatedTask = await Task.findOneAndUpdate(
      { _id, userId: session.user.id },
      { $set: updateData },
      { new: true }
    );

    // Grant XP if newly completed
    if (!wasDone && isNowDone) {
      await User.findByIdAndUpdate(session.user.id, {
        $inc: { xp: XP_REWARDS.TASK_DONE },
      });
    }
    // Deduct XP if unchecked (prevents gamification cheating)
    else if (wasDone && !isNowDone) {
      await User.findByIdAndUpdate(session.user.id, {
        $inc: { xp: -XP_REWARDS.TASK_DONE },
      });
    }

    return NextResponse.json(updatedTask);
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
    const existingTask = await Task.findOne({ _id: id, userId: session.user.id });
    if (!existingTask) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Deduct XP if deleting an already completed task
    if (existingTask.status === 'done') {
      await User.findByIdAndUpdate(session.user.id, {
        $inc: { xp: -XP_REWARDS.TASK_DONE },
      });
    }

    await Task.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
