import { NextRequest, NextResponse } from "next/server";
import { getMangaChapters } from "@/lib/mangadex";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const lang = searchParams.get("lang") || "en";
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const { chapters, total } = await getMangaChapters(id, lang, limit, offset);
    return NextResponse.json({
      chapters: chapters.map((c) => ({
        id: c.id,
        title: c.attributes.title,
        volume: c.attributes.volume,
        chapter: c.attributes.chapter,
        language: c.attributes.translatedLanguage,
        pages: c.attributes.pages,
        publishAt: c.attributes.publishAt,
        groups: c.relationships
          .filter((r) => r.type === "scanlation_group")
          .map((r) => r.attributes?.name || "Unknown"),
      })),
      total,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch chapters" }, { status: 500 });
  }
}
