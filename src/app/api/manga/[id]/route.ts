import { NextRequest, NextResponse } from "next/server";
import { getMangaById, getTitle, getCoverUrl, getDescription } from "@/lib/mangadex";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const manga = await getMangaById(id);
    if (!manga) {
      return NextResponse.json({ error: "Manga not found" }, { status: 404 });
    }

    const author = manga.relationships.find((r) => r.type === "author");
    const artist = manga.relationships.find((r) => r.type === "artist");

    return NextResponse.json({
      id: manga.id,
      title: getTitle(manga),
      cover: getCoverUrl(manga),
      description: getDescription(manga),
      status: manga.attributes.status,
      year: manga.attributes.year,
      contentRating: manga.attributes.contentRating,
      originalLanguage: manga.attributes.originalLanguage,
      lastVolume: manga.attributes.lastVolume,
      lastChapter: manga.attributes.lastChapter,
      availableLanguages: manga.attributes.availableTranslatedLanguages,
      genres: manga.attributes.tags
        .filter((t) => t.attributes.group === "genre")
        .map((t) => t.attributes.name.en || Object.values(t.attributes.name)[0]),
      themes: manga.attributes.tags
        .filter((t) => t.attributes.group === "theme")
        .map((t) => t.attributes.name.en || Object.values(t.attributes.name)[0]),
      author: author?.attributes?.name || null,
      artist: artist?.attributes?.name || null,
      source: "MANGADEX",
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch manga" }, { status: 500 });
  }
}
