import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Instructor } from "@/models/Instructor";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const instructors = await Instructor.find({ isAvailable: true }).sort({ rating: -1 }).lean();
  return NextResponse.json({ instructors });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  const {
    name, bio, specialties = [], rating = 4.5,
    experience = 1, certifications = [], schedule = [],
    avatar, contactEmail,
  } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const instructor = await Instructor.create({
    name: name.trim(), bio, specialties, rating,
    experience, certifications, schedule,
    avatar, contactEmail,
    isAvailable: true,
  });

  return NextResponse.json({ instructor }, { status: 201 });
}
