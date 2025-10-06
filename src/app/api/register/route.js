import { NextResponse } from "next/sercer";
import { prisma } from "@lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/register
// Tar inn { email, username, password, displayName? } og oppretter bruker.
// - Validerer input
// - Sjekker at email/username er ledig
// - Lagrer bcrypt-hash i passwordHash

export async function POST(req) {
  try {
    const { email, username, password, displayName } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Mangler felter" }, { status: 400 });
    }
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { error: "bruker finnes allerede" },
        { status: 409 }
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, username, passwordHash, displayName },
      select: { id: true, email: true, username: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
