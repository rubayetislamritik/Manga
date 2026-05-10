import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const all = await db.select().from(favorites).orderBy(favorites.addedAt);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mangaId, mangaTitle, mangaCover, mangaDescription, sourceId, genres, status } = body;

    if (!mangaId || !mangaTitle || !sourceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if already exists
    const existing = await db.select().from(favorites).where(eq(favorites.mangaId, mangaId));
    if (existing.length > 0) {
      return NextResponse.json({ message: "Already in favorites", favorite: existing[0] });
    }

    const [inserted] = await db.insert(favorites).values({
      mangaId,
      mangaTitle,
      mangaCover: mangaCover || null,
      mangaDescription: mangaDescription || null,
      sourceId,
      genres: genres || null,
      status: status || null,
    }).returning();

    return NextResponse.json({ favorite: inserted }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const mangaId = searchParams.get("mangaId");

    if (!mangaId) {
      return NextResponse.json({ error: "mangaId required" }, { status: 400 });
    }

    await db.delete(favorites).where(eq(favorites.mangaId, mangaId));
    return NextResponse.json({ message: "Removed from favorites" });
  } catch {
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
