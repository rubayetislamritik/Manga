import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { readingHistory, readingProgress } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  try {
    const history = await db
      .select()
      .from(readingHistory)
      .orderBy(desc(readingHistory.readAt))
      .limit(50);
    return NextResponse.json(history);
  } catch {
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mangaId, mangaTitle, mangaCover, sourceId, chapterId, chapterTitle, chapterNumber, pageNumber } = body;

    if (!mangaId || !chapterId || !sourceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert reading progress
    const existing = await db
      .select()
      .from(readingProgress)
      .where(and(eq(readingProgress.mangaId, mangaId), eq(readingProgress.chapterId, chapterId)));

    if (existing.length > 0) {
      await db
        .update(readingProgress)
        .set({ pageNumber: pageNumber || 1, updatedAt: new Date() })
        .where(eq(readingProgress.id, existing[0].id));
    } else {
      await db.insert(readingProgress).values({
        mangaId,
        sourceId,
        chapterId,
        pageNumber: pageNumber || 1,
      });
    }

    // Check if already in history for this chapter
    const existingHistory = await db
      .select()
      .from(readingHistory)
      .where(and(eq(readingHistory.mangaId, mangaId), eq(readingHistory.chapterId, chapterId)));

    if (existingHistory.length > 0) {
      await db
        .update(readingHistory)
        .set({ pageNumber: pageNumber || 1, updatedAt: new Date() })
        .where(eq(readingHistory.id, existingHistory[0].id));
    } else {
      await db.insert(readingHistory).values({
        mangaId,
        mangaTitle,
        mangaCover: mangaCover || null,
        sourceId,
        chapterId,
        chapterTitle: chapterTitle || null,
        chapterNumber: chapterNumber || null,
        pageNumber: pageNumber || 1,
      });
    }

    return NextResponse.json({ message: "History updated" });
  } catch {
    return NextResponse.json({ error: "Failed to update history" }, { status: 500 });
  }
}
