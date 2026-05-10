import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  // Only allow mangadex CDN
  const allowed = [
    "mangadex.org",
    "mangadex.network",
    "uploads.mangadex.org",
  ];

  try {
    const parsed = new URL(url);
    const isAllowed = allowed.some((host) => parsed.hostname.endsWith(host));
    if (!isAllowed) {
      return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
    }

    const res = await fetch(url, {
      headers: {
        "Referer": "https://mangadex.org",
        "User-Agent": "MangaVerse/1.0",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
}
