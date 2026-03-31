import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Achievement } from "@/models/Achievement";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const achievements = await Achievement.find({ userId: session.user.id })
    .sort({ unlockedAt: -1 })
    .lean();

  return NextResponse.json({ achievements });
}
