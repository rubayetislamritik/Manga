import { NextRequest, NextResponse } from "next/server";
import { getChapterPages } from "@/lib/mangadex";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { pages, dataSaver } = await getChapterPages(id);
    return NextResponse.json({ pages, dataSaver });
  } catch {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
