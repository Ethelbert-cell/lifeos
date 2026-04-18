import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { GymRoutine } from "@/models/GymRoutine";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const routines = await GymRoutine.find({ userId: session.user.id }).sort({ createdAt: 1 }).lean();
  
  return NextResponse.json({ routines });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const { name, icon, color, workoutType, targetDaysPerWeek, templateExercises } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const routine = await GymRoutine.create({
    userId: session.user.id,
    name: name.trim(),
    icon: icon || "🏋️",
    color: color || "#6366f1",
    workoutType: workoutType || "strength",
    targetDaysPerWeek: targetDaysPerWeek || 3,
    templateExercises: templateExercises || [],
  });

  return NextResponse.json({ routine });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await connectDB();
  await GymRoutine.findOneAndDelete({ _id: id, userId: session.user.id });

  return NextResponse.json({ ok: true });
}
