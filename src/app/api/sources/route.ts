import { NextResponse } from "next/server";
import { MANGA_SOURCES, LANGUAGES, CONTENT_TYPES } from "@/lib/sources";

export async function GET() {
  return NextResponse.json({
    sources: MANGA_SOURCES,
    languages: LANGUAGES,
    contentTypes: CONTENT_TYPES,
    total: MANGA_SOURCES.length,
  });
}
