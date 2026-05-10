const MANGADEX_API = "https://api.mangadex.org";

export interface MDManga {
  id: string;
  type: string;
  attributes: {
    title: Record<string, string>;
    altTitles: Record<string, string>[];
    description: Record<string, string>;
    status: string;
    year: number | null;
    contentRating: string;
    tags: Array<{ id: string; attributes: { name: Record<string, string>; group: string } }>;
    lastVolume: string | null;
    lastChapter: string | null;
    originalLanguage: string;
    availableTranslatedLanguages: string[];
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      name?: string;
      fileName?: string;
      volume?: string;
      description?: string;
    };
  }>;
}

export interface MDChapter {
  id: string;
  attributes: {
    title: string | null;
    volume: string | null;
    chapter: string | null;
    translatedLanguage: string;
    pages: number;
    publishAt: string;
    readableAt: string;
    externalUrl: string | null;
  };
  relationships: Array<{ id: string; type: string; attributes?: { name?: string } }>;
}

function getTitle(manga: MDManga): string {
  const t = manga.attributes.title;
  return t.en || t.ja || t["ja-ro"] || Object.values(t)[0] || "Unknown";
}

function getCoverUrl(manga: MDManga): string {
  const coverRel = manga.relationships.find((r) => r.type === "cover_art");
  if (coverRel?.attributes?.fileName) {
    return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}.512.jpg`;
  }
  return "";
}

function getDescription(manga: MDManga): string {
  const d = manga.attributes.description;
  return d.en || d.ja || Object.values(d)[0] || "";
}

export interface MangaListItem {
  id: string;
  title: string;
  cover: string;
  status: string;
  genres: string[];
  description: string;
  source: string;
  rating?: string;
  year?: number | null;
  contentRating: string;
  originalLanguage: string;
}

export async function searchManga(
  query: string,
  limit = 20,
  offset = 0,
  langs?: string[]
): Promise<{ data: MangaListItem[]; total: number }> {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      "includes[]": "cover_art",
      "contentRating[]": "safe",
      "contentRating[1]": "suggestive",
    });

    if (query) {
      params.set("title", query);
    }

    if (langs && langs.length > 0) {
      langs.forEach((l) => params.append("availableTranslatedLanguage[]", l));
    }

    const res = await fetch(`${MANGADEX_API}/manga?${params}`, {
      headers: { "User-Agent": "MangaVerse/1.0" },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch manga");
    const json = await res.json();

    return {
      data: json.data.map((m: MDManga) => ({
        id: m.id,
        title: getTitle(m),
        cover: getCoverUrl(m),
        status: m.attributes.status,
        genres: m.attributes.tags
          .filter((t) => t.attributes.group === "genre")
          .map((t) => t.attributes.name.en || Object.values(t.attributes.name)[0]),
        description: getDescription(m),
        source: "MANGADEX",
        year: m.attributes.year,
        contentRating: m.attributes.contentRating,
        originalLanguage: m.attributes.originalLanguage,
      })),
      total: json.total || 0,
    };
  } catch {
    return { data: [], total: 0 };
  }
}

export async function getPopularManga(limit = 20): Promise<MangaListItem[]> {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      "includes[]": "cover_art",
      "contentRating[]": "safe",
      "contentRating[1]": "suggestive",
      "order[followedCount]": "desc",
    });

    const res = await fetch(`${MANGADEX_API}/manga?${params}`, {
      headers: { "User-Agent": "MangaVerse/1.0" },
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("Failed");
    const json = await res.json();

    return json.data.map((m: MDManga) => ({
      id: m.id,
      title: getTitle(m),
      cover: getCoverUrl(m),
      status: m.attributes.status,
      genres: m.attributes.tags
        .filter((t) => t.attributes.group === "genre")
        .map((t) => t.attributes.name.en || Object.values(t.attributes.name)[0]),
      description: getDescription(m),
      source: "MANGADEX",
      year: m.attributes.year,
      contentRating: m.attributes.contentRating,
      originalLanguage: m.attributes.originalLanguage,
    }));
  } catch {
    return [];
  }
}

export async function getLatestManga(limit = 20): Promise<MangaListItem[]> {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      "includes[]": "cover_art",
      "contentRating[]": "safe",
      "contentRating[1]": "suggestive",
      "order[latestUploadedChapter]": "desc",
    });

    const res = await fetch(`${MANGADEX_API}/manga?${params}`, {
      headers: { "User-Agent": "MangaVerse/1.0" },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed");
    const json = await res.json();

    return json.data.map((m: MDManga) => ({
      id: m.id,
      title: getTitle(m),
      cover: getCoverUrl(m),
      status: m.attributes.status,
      genres: m.attributes.tags
        .filter((t) => t.attributes.group === "genre")
        .map((t) => t.attributes.name.en || Object.values(t.attributes.name)[0]),
      description: getDescription(m),
      source: "MANGADEX",
      year: m.attributes.year,
      contentRating: m.attributes.contentRating,
      originalLanguage: m.attributes.originalLanguage,
    }));
  } catch {
    return [];
  }
}

export async function getMangaById(id: string): Promise<MDManga | null> {
  try {
    const res = await fetch(
      `${MANGADEX_API}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`,
      {
        headers: { "User-Agent": "MangaVerse/1.0" },
        next: { revalidate: 300 },
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function getMangaChapters(
  mangaId: string,
  lang = "en",
  limit = 100,
  offset = 0
): Promise<{ chapters: MDChapter[]; total: number }> {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
      "translatedLanguage[]": lang,
      "order[chapter]": "asc",
      "includes[]": "scanlation_group",
    });

    const res = await fetch(`${MANGADEX_API}/manga/${mangaId}/feed?${params}`, {
      headers: { "User-Agent": "MangaVerse/1.0" },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed");
    const json = await res.json();

    return {
      chapters: (json.data || []).filter((c: MDChapter) => !c.attributes.externalUrl),
      total: json.total || 0,
    };
  } catch {
    return { chapters: [], total: 0 };
  }
}

export async function getChapterPages(chapterId: string): Promise<{ pages: string[]; dataSaver: string[] }> {
  try {
    const res = await fetch(`${MANGADEX_API}/at-home/server/${chapterId}`, {
      headers: { "User-Agent": "MangaVerse/1.0" },
    });
    if (!res.ok) throw new Error("Failed");
    const json = await res.json();

    const baseUrl = json.baseUrl;
    const hash = json.chapter.hash;
    const data = json.chapter.data as string[];
    const dataSaver = json.chapter.dataSaver as string[];

    return {
      pages: data.map((f) => `${baseUrl}/data/${hash}/${f}`),
      dataSaver: dataSaver.map((f) => `${baseUrl}/data-saver/${hash}/${f}`),
    };
  } catch {
    return { pages: [], dataSaver: [] };
  }
}

export interface TagInfo {
  id: string;
  name: string;
  group: string;
}

export async function getMangaTags(): Promise<TagInfo[]> {
  try {
    const res = await fetch(`${MANGADEX_API}/manga/tag`, {
      headers: { "User-Agent": "MangaVerse/1.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.map((t: { id: string; attributes: { name: Record<string, string>; group: string } }) => ({
      id: t.id,
      name: t.attributes.name.en || Object.values(t.attributes.name)[0],
      group: t.attributes.group,
    }));
  } catch {
    return [];
  }
}

export { getTitle, getCoverUrl, getDescription };
