import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Note from '@/models/Note';
import User from '@/models/User';
import { XP_REWARDS } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    await connectDB();
    const query: any = { userId: session.user.id };

    if (q) {
      query.$text = { $search: q };
      const notes = await Note.find(query)
        .select({ score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
      return NextResponse.json(notes);
    } else {
      // Sort pinned first, then by last updated
      const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
      return NextResponse.json(notes);
    }
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

    const note = await Note.create({
      ...body,
      userId: session.user.id,
    });

    // Grant +10 XP for creating a note
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: XP_REWARDS.NOTE_CREATE },
    });

    return NextResponse.json(note, { status: 201 });
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

    if (!_id) return NextResponse.json({ error: 'Missing note ID' }, { status: 400 });

    const updatedNote = await Note.findOneAndUpdate(
      { _id, userId: session.user.id },
      { $set: updateData },
      { new: true }
    );

    if (!updatedNote) return NextResponse.json({ error: 'Note not found' }, { status: 404 });

    return NextResponse.json(updatedNote);
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
    
    // Optional: deduct XP to prevent create/delete spam
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { xp: -XP_REWARDS.NOTE_CREATE },
    });

    const note = await Note.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
