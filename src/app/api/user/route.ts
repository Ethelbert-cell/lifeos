import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { XP_REWARDS, isToday, isYesterday, levelFromXP } from '@/lib/utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let updated = false;

    // Daily Login Streak Logic
    if (!user.lastActiveDate || !isToday(user.lastActiveDate)) {
      if (user.lastActiveDate && isYesterday(user.lastActiveDate)) {
        user.streak += 1;
      } else {
        user.streak = 1; // Reset streak if missed a day
      }

      user.xp += XP_REWARDS.DAILY_LOGIN;
      user.lastActiveDate = new Date();
      updated = true;
    }

    if (updated) {
      await user.save();
    }

    // Return the fresh data so the client can sync its Zustand store
    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      xp: user.xp,
      level: levelFromXP(user.xp),
      streak: user.streak,
    });
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
    
    // Only allow updating specific fields
    const { name, image } = body;
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true }
    ).select('-__v');

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
