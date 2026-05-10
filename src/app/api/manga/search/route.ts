import { NextRequest, NextResponse } from "next/server";
import { searchManga, getPopularManga, getLatestManga } from "@/lib/mangadex";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "popular";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    if (query) {
      const result = await searchManga(query, limit, offset);
      return NextResponse.json(result);
    }

    if (type === "latest") {
      const data = await getLatestManga(limit);
      return NextResponse.json({ data, total: data.length });
    }

    const data = await getPopularManga(limit);
    return NextResponse.json({ data, total: data.length });
  } catch {
    return NextResponse.json({ error: "Failed to fetch manga" }, { status: 500 });
  }
}
