"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Home,
  BookOpen,
  Heart,
  History,
  Globe,
  Star,
  TrendingUp,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Bookmark,
  BookMarked,
  Layers,
  Menu,
  Zap,
  Flame,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { MANGA_SOURCES, LANGUAGES, MangaSource } from "@/lib/sources";

interface MangaItem {
  id: string;
  title: string;
  cover: string;
  status: string;
  genres: string[];
  description: string;
  source: string;
  year?: number | null;
  contentRating: string;
  originalLanguage: string;
}

interface Chapter {
  id: string;
  title: string | null;
  volume: string | null;
  chapter: string | null;
  language: string;
  pages: number;
  publishAt: string;
  groups: string[];
}

interface MangaDetail extends MangaItem {
  author?: string | null;
  artist?: string | null;
  themes?: string[];
  availableLanguages?: string[];
  lastChapter?: string | null;
  lastVolume?: string | null;
}

interface HistoryItem {
  id: number;
  mangaId: string;
  mangaTitle: string;
  mangaCover: string | null;
  sourceId: string;
  chapterId: string;
  chapterTitle: string | null;
  chapterNumber: string | null;
  pageNumber: number | null;
  readAt: string;
}

interface FavoriteItem {
  id: number;
  mangaId: string;
  mangaTitle: string;
  mangaCover: string | null;
  sourceId: string;
  genres: string[] | null;
  status: string | null;
  addedAt: string;
}

type Tab = "home" | "sources" | "favorites" | "history" | "settings";
type HomeView = "popular" | "latest" | "search";

const STATUS_COLORS: Record<string, string> = {
  ongoing: "bg-emerald-500",
  completed: "bg-blue-500",
  hiatus: "bg-amber-500",
  cancelled: "bg-red-500",
};

const STATUS_EMOJI: Record<string, string> = {
  ongoing: "🟢",
  completed: "✅",
  hiatus: "⏸️",
  cancelled: "❌",
};

const GENRE_COLORS = [
  "bg-purple-600",
  "bg-pink-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-orange-600",
  "bg-cyan-600",
  "bg-rose-600",
  "bg-violet-600",
  "bg-amber-500",
  "bg-teal-600",
];

function genreColor(genre: string): string {
  let hash = 0;
  for (let i = 0; i < genre.length; i++) hash = genre.charCodeAt(i) + ((hash << 5) - hash);
  return GENRE_COLORS[Math.abs(hash) % GENRE_COLORS.length];
}

function MangaCover({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-pink-950`}>
        <span className="text-4xl animate-wiggle">📚</span>
        <span className="text-purple-400 text-[0.6rem] font-extrabold mt-1 uppercase tracking-widest">No Cover</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setErrored(true)}
      sizes="(max-width: 768px) 150px, 200px"
      unoptimized
    />
  );
}

function MangaCard({ manga, onClick, isFav, onFavToggle }: {
  manga: MangaItem;
  onClick: () => void;
  isFav?: boolean;
  onFavToggle?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="manga-card-2d group animate-slide-up"
      onClick={onClick}
    >
      {/* Cover image panel */}
      <div className="relative aspect-[3/4] manga-panel" style={{ borderRadius: "12px 12px 0 0", borderBottom: "3px solid #0d0b1a" }}>
        <MangaCover src={manga.cover} alt={manga.title} className="w-full h-full" />
        {/* Dark gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        {/* Fav button */}
        {onFavToggle && (
          <button
            onClick={onFavToggle}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:scale-125 active:scale-90"
            style={{ background: isFav ? "#ec4899" : "rgba(0,0,0,0.7)", border: "2.5px solid #0d0b1a", boxShadow: "2px 2px 0 #0d0b1a" }}
          >
            <Heart size={13} className={isFav ? "fill-white text-white" : "text-white"} />
          </button>
        )}
        {/* Status badge */}
        {manga.status && (
          <span
            className={`absolute top-2 left-2 ${STATUS_COLORS[manga.status] || "bg-gray-600"} text-white text-[0.58rem] px-2 py-0.5 capitalize font-extrabold`}
            style={{ borderRadius: "6px", border: "2px solid #0d0b1a", boxShadow: "2px 2px 0 #0d0b1a" }}
          >
            {STATUS_EMOJI[manga.status] || ""} {manga.status}
          </span>
        )}
        {/* Hover title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-[0.7rem] font-extrabold line-clamp-2 drop-shadow-lg">{manga.title}</p>
        </div>
      </div>
      {/* Info panel */}
      <div className="p-2.5">
        <h3 className="text-white text-[0.72rem] font-extrabold line-clamp-2 leading-tight mb-1.5">
          {manga.title}
        </h3>
        {manga.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {manga.genres.slice(0, 2).map((g) => (
              <span key={g} className={`cartoon-tag genre-pill ${genreColor(g)} text-white`}>
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SourceCard({ source, onClick }: { source: MangaSource; onClick: () => void }) {
  const typeColor =
    source.type === "manhwa" ? "bg-blue-600" :
    source.type === "manhua" ? "bg-red-600" :
    source.type === "comics" ? "bg-amber-500" :
    "bg-purple-600";
  return (
    <div className="source-card group" onClick={onClick}>
      {/* Icon with bubble */}
      <div
        className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-xl text-2xl group-hover:animate-wiggle"
        style={{ background: "#13112a", border: "2.5px solid #2d2b50", boxShadow: "3px 3px 0 #0d0b1a" }}
      >
        {source.icon}
      </div>
      <h3 className="text-white font-extrabold text-xs truncate">{source.name}</h3>
      <p className="text-slate-500 text-[0.6rem] font-bold mt-0.5 truncate">{source.domain}</p>
      <div className="flex items-center justify-center gap-1 mt-2">
        <span className="text-sm">{source.langFlag}</span>
        <span className={`cartoon-tag ${typeColor} text-white capitalize`}>
          {source.type}
        </span>
      </div>
    </div>
  );
}

function LoadingSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="manga-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="manga-card-2d overflow-hidden" style={{ animationDelay: `${i * 40}ms` }}>
          <div className="aspect-[3/4] skeleton" style={{ borderRadius: "12px 12px 0 0" }} />
          <div className="p-2.5 space-y-2">
            <div className="skeleton h-3 rounded-lg w-full" />
            <div className="skeleton h-2 rounded-lg w-2/3" />
            <div className="flex gap-1">
              <div className="skeleton h-4 rounded-full w-12" />
              <div className="skeleton h-4 rounded-full w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MangaDetailModal({
  mangaId,
  onClose,
  onReadChapter,
  favorites,
  onFavToggle,
}: {
  mangaId: string;
  onClose: () => void;
  onReadChapter: (chapterId: string, chapterNum: string, manga: MangaDetail) => void;
  favorites: Set<string>;
  onFavToggle: (manga: MangaDetail) => void;
}) {
  const [manga, setManga] = useState<MangaDetail | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapLang, setChapLang] = useState("en");
  const [chapOffset, setChapOffset] = useState(0);
  const [totalChaps, setTotalChaps] = useState(0);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const LIMIT = 50;

  useEffect(() => {
    const loadManga = async () => {
      setLoading(true);
      try {
        const [detailRes, chapRes] = await Promise.all([
          fetch(`/api/manga/${mangaId}`),
          fetch(`/api/manga/${mangaId}/chapters?lang=${chapLang}&limit=${LIMIT}&offset=${chapOffset}`),
        ]);
        const detail = await detailRes.json();
        const chapData = await chapRes.json();
        setManga(detail);
        setChapters(chapData.chapters || []);
        setTotalChaps(chapData.total || 0);
      } finally {
        setLoading(false);
      }
    };
    loadManga();
  }, [mangaId, chapLang, chapOffset]);

  const displayChapters = showAllChapters ? chapters : chapters.slice(0, 15);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-6xl animate-wiggle">📖</div>
      </div>
    );
  }

  if (!manga) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="w-full sm:max-w-3xl max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl animate-slide-up"
        style={{ background: "#0b0919", border: "3px solid #3d2d70", boxShadow: "8px 8px 0 #0d0b1a" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <div className="h-40 sm:h-52 relative overflow-hidden rounded-t-3xl sm:rounded-t-2xl">
            {manga.cover ? (
              <Image src={manga.cover} alt={manga.title} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/50 to-transparent" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 border-2 border-white/20 text-white hover:bg-black/80 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-4">
            <div className="relative w-24 h-36 rounded-xl overflow-hidden border-3 border-purple-500 flex-shrink-0" style={{ border: "3px solid #a855f7" }}>
              <MangaCover src={manga.cover} alt={manga.title} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <h2 className="text-white font-extrabold text-xl leading-tight line-clamp-2">{manga.title}</h2>
              {manga.author && <p className="text-purple-300 text-sm font-bold mt-1">by {manga.author}</p>}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {manga.status && (
                  <span className={`${STATUS_COLORS[manga.status] || "bg-gray-500"} text-white text-xs font-extrabold px-2 py-0.5 rounded-full capitalize`}>
                    {manga.status}
                  </span>
                )}
                {manga.year && <span className="text-slate-300 text-xs font-bold">{manga.year}</span>}
                <span className="text-slate-300 text-xs font-bold capitalize">{manga.originalLanguage}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Actions */}
          <div className="flex gap-3">
            {chapters.length > 0 && (
              <button
                onClick={() => onReadChapter(chapters[0].id, chapters[0].chapter || "1", manga)}
                className="cartoon-btn flex-1 py-2.5 px-4 text-sm text-white flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
              >
                <BookOpen size={16} />
                Start Reading
              </button>
            )}
            <button
              onClick={() => onFavToggle(manga)}
              className={`cartoon-btn px-4 py-2.5 flex items-center gap-2 text-sm font-bold ${
                favorites.has(manga.id)
                  ? "text-white"
                  : "text-white"
              }`}
              style={{ background: favorites.has(manga.id) ? "#ec4899" : "#17152e", border: "2.5px solid #0d0b1a", boxShadow: "3px 3px 0 #0d0b1a" }}
            >
              <Heart size={16} className={favorites.has(manga.id) ? "fill-white" : ""} />
              {favorites.has(manga.id) ? "Saved ✓" : "Save"}
            </button>
          </div>

          {/* Genres */}
          {manga.genres && manga.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {manga.genres.map((g) => (
                <span key={g} className={`cartoon-tag ${genreColor(g)} text-white`}>{g}</span>
              ))}
              {manga.themes?.map((t) => (
                <span key={t} className="cartoon-tag bg-slate-600 text-white">{t}</span>
              ))}
            </div>
          )}

          {/* Description */}
          {manga.description && (
            <div>
              <p className="text-slate-300 text-sm font-semibold leading-relaxed line-clamp-4">
                {manga.description}
              </p>
            </div>
          )}

          {/* Language selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 text-[0.65rem] font-extrabold uppercase tracking-widest">Language:</span>
            {["en", "ja", "ko", "zh", "fr", "es", "pt", "ru"].map((l) => (
              <button
                key={l}
                onClick={() => { setChapLang(l); setChapOffset(0); }}
                className={`cartoon-btn px-3 py-1 text-xs font-extrabold`}
                style={chapLang === l
                  ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "white" }
                  : { background: "#13112a", color: "#94a3b8" }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Chapters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-extrabold text-base">
                📋 Chapters{" "}
                <span className="text-purple-400 text-sm">({totalChaps})</span>
              </h3>
              <div className="flex gap-2">
                {chapOffset > 0 && (
                  <button
                    onClick={() => setChapOffset(Math.max(0, chapOffset - LIMIT))}
                    className="cartoon-btn px-2 py-1 bg-slate-700 text-white"
                  >
                    <ChevronLeft size={14} />
                  </button>
                )}
                {chapOffset + LIMIT < totalChaps && (
                  <button
                    onClick={() => setChapOffset(chapOffset + LIMIT)}
                    className="cartoon-btn px-2 py-1 bg-slate-700 text-white"
                  >
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {chapters.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-bold">
                <div className="text-5xl mb-2 animate-bounce-sub">😢</div>
                <p className="font-extrabold">No chapters in {chapLang.toUpperCase()}</p>
                <p className="text-xs mt-1 text-slate-500">Try another language above!</p>
              </div>
            ) : (
              <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                {displayChapters.map((c) => (
                  <div
                    key={c.id}
                    className="chapter-item"
                    style={{ background: "#13112a" }}
                    onClick={() => onReadChapter(c.id, c.chapter || "?", manga)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="font-extrabold text-xs flex-shrink-0 px-2 py-0.5 rounded-md"
                        style={{ background: "#7c3aed", color: "white", border: "2px solid #0d0b1a", boxShadow: "2px 2px 0 #0d0b1a" }}
                      >
                        Ch.{c.chapter || "?"}
                      </span>
                      <span className="text-slate-300 text-xs font-semibold truncate">
                        {c.title || (c.volume ? `Vol.${c.volume}` : "")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-600 text-xs">{c.pages}p</span>
                      <BookOpen size={13} className="text-purple-500" />
                    </div>
                  </div>
                ))}
                {chapters.length > 15 && !showAllChapters && (
                  <button
                    onClick={() => setShowAllChapters(true)}
                    className="w-full text-center py-2 text-purple-400 text-sm font-bold hover:text-purple-300 flex items-center justify-center gap-1"
                  >
                    Show all {chapters.length} chapters <ChevronDown size={14} />
                  </button>
                )}
                {showAllChapters && (
                  <button
                    onClick={() => setShowAllChapters(false)}
                    className="w-full text-center py-2 text-purple-400 text-sm font-bold hover:text-purple-300 flex items-center justify-center gap-1"
                  >
                    Show less <ChevronUp size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Reader({
  chapterId,
  chapterNum,
  manga,
  allChapters,
  onClose,
  onSaveHistory,
}: {
  chapterId: string;
  chapterNum: string;
  manga: MangaDetail;
  allChapters: Chapter[];
  onClose: () => void;
  onSaveHistory: (chapterId: string, chapterNum: string, page: number) => void;
}) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [mode, setMode] = useState<"scroll" | "page">("scroll");
  const [zoom, setZoom] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [allPages, setAllPages] = useState<{ pages: string[]; dataSaver: string[] }>({ pages: [], dataSaver: [] });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentChapIdx = allChapters.findIndex((c) => c.id === chapterId);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chapter/${chapterId}/pages`);
        const data = await res.json();
        setAllPages(data);
        setPages(data.pages || []);
        setCurrentPage(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [chapterId]);

  useEffect(() => {
    setPages(dataSaver ? allPages.dataSaver : allPages.pages);
  }, [dataSaver, allPages]);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    const handleMove = () => {
      setShowControls(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchstart", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchstart", handleMove);
      clearTimeout(hideTimer);
    };
  }, []);

  // Save progress every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      onSaveHistory(chapterId, chapterNum, currentPage + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, [chapterId, chapterNum, currentPage, onSaveHistory]);

  const goToPage = (p: number) => {
    if (p >= 0 && p < pages.length) {
      setCurrentPage(p);
      if (containerRef.current) containerRef.current.scrollTop = 0;
    }
  };

  const [activeChapterId, setActiveChapterId] = useState(chapterId);
  const [activeChapterNum, setActiveChapterNum] = useState(chapterNum);

  const navigateChapter = useCallback(async (dir: "prev" | "next") => {
    const idx = allChapters.findIndex((c) => c.id === activeChapterId);
    const nextIdx = dir === "next" ? idx + 1 : idx - 1;
    if (nextIdx >= 0 && nextIdx < allChapters.length) {
      const ch = allChapters[nextIdx];
      setActiveChapterId(ch.id);
      setActiveChapterNum(ch.chapter || "?");
      setLoading(true);
      setCurrentPage(0);
      const res = await fetch(`/api/chapter/${ch.id}/pages`);
      const data = await res.json();
      setAllPages(data);
      setPages(dataSaver ? data.dataSaver : data.pages);
      setLoading(false);
    }
  }, [allChapters, activeChapterId, dataSaver]);

  const curChapIdx = allChapters.findIndex((c) => c.id === activeChapterId);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Top bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center gap-3 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)" }}
      >
        <button onClick={onClose} className="cartoon-btn p-2 text-white" style={{ background: "#17152e" }}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-extrabold text-sm truncate manga-title-font text-lg">{manga.title}</p>
          <p className="text-purple-300 text-xs font-extrabold">Chapter {activeChapterNum}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDataSaver(!dataSaver)}
            className={`cartoon-btn p-2 text-xs font-bold`}
            style={{ background: dataSaver ? "#16a34a" : "#17152e", color: "white" }}
            title="Data Saver"
          >
            {dataSaver ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <button
            onClick={() => setMode(mode === "scroll" ? "page" : "scroll")}
            className="cartoon-btn px-3 py-2 text-white text-xs font-extrabold"
            style={{ background: "#17152e" }}
          >
            {mode === "scroll" ? "📜 Scroll" : "📄 Page"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ paddingTop: "60px", paddingBottom: "70px" }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl animate-wiggle mb-4">📖</div>
              <p className="text-purple-300 font-bold">Loading pages...</p>
            </div>
          </div>
        ) : pages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-white font-bold">No pages available</p>
              <p className="text-slate-400 text-sm mt-1">This chapter might be externally hosted</p>
            </div>
          </div>
        ) : mode === "scroll" ? (
          <div className="reader-container" style={{ maxWidth: `${Math.min(900, (zoom / 100) * 900)}px`, margin: "0 auto" }}>
            {pages.map((url, i) => (
              <div key={i} className="w-full">
                <img
                  src={url}
                  alt={`Page ${i + 1}`}
                  className="w-full block"
                  loading={i < 3 ? "eager" : "lazy"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-full">
            {pages[currentPage] && (
              <img
                src={pages[currentPage]}
                alt={`Page ${currentPage + 1}`}
                style={{ maxHeight: "calc(100vh - 130px)", maxWidth: `${zoom}vw`, objectFit: "contain" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "";
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent px-4 py-3 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => navigateChapter("prev")}
            disabled={curChapIdx <= 0}
            className="cartoon-btn px-3 py-2 bg-slate-700 text-white text-xs font-bold disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <div className="flex-1 flex items-center gap-2">
            {mode === "page" && (
              <>
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 0} className="cartoon-btn p-2 bg-slate-700 text-white disabled:opacity-30">
                  <ChevronLeft size={14} />
                </button>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={pages.length - 1}
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pages.length - 1} className="cartoon-btn p-2 bg-slate-700 text-white disabled:opacity-30">
                  <ChevronRight size={14} />
                </button>
                <span className="text-white text-xs font-bold whitespace-nowrap">
                  {currentPage + 1}/{pages.length}
                </span>
              </>
            )}
            {mode === "scroll" && (
              <div className="flex-1 flex items-center justify-center gap-3">
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="cartoon-btn p-2 bg-slate-700 text-white">
                  <ZoomOut size={14} />
                </button>
                <span className="text-white text-xs font-bold">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="cartoon-btn p-2 bg-slate-700 text-white">
                  <ZoomIn size={14} />
                </button>
                <button onClick={() => setZoom(100)} className="cartoon-btn p-2 bg-slate-700 text-white">
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => navigateChapter("next")}
            disabled={curChapIdx >= allChapters.length - 1}
            className="cartoon-btn px-3 py-2 bg-purple-600 text-white text-xs font-bold disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SourceBrowser({ onSearch }: { onSearch: (q: string) => void }) {
  const [selected, setSelected] = useState<MangaSource | null>(null);

  if (selected) {
    return (
      <div className="cartoon-card p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setSelected(null)} className="cartoon-btn p-2 bg-slate-700 text-white">
            <ArrowLeft size={14} />
          </button>
          <div className="text-2xl">{selected.icon}</div>
          <div>
            <h3 className="text-white font-extrabold">{selected.name}</h3>
            <a href={`https://${selected.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs font-bold hover:underline">
              {selected.domain} ↗
            </a>
          </div>
          <div className="ml-auto flex gap-2">
            <span className={`cartoon-tag ${selected.type === "manhwa" ? "bg-blue-600" : selected.type === "manhua" ? "bg-red-600" : "bg-purple-600"} text-white capitalize`}>
              {selected.type}
            </span>
            <span className="text-2xl">{selected.langFlag}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { onSearch(selected.name); setSelected(null); }}
            className="cartoon-btn px-4 py-2 text-sm font-extrabold text-white flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            <Search size={14} /> Browse on MangaDex
          </button>
          <a
            href={`https://${selected.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cartoon-btn px-4 py-2 text-sm font-extrabold bg-slate-700 text-white flex items-center gap-2"
          >
            <Globe size={14} /> Visit Site
          </a>
        </div>
      </div>
    );
  }

  return null;
}

// =================== MAIN APP ===================

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [homeView, setHomeView] = useState<HomeView>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [mangas, setMangas] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMangaId, setSelectedMangaId] = useState<string | null>(null);
  const [reader, setReader] = useState<{
    chapterId: string;
    chapterNum: string;
    manga: MangaDetail;
    chapters: Chapter[];
  } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesList, setFavoritesList] = useState<FavoriteItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langFilter, setLangFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sourceSearch, setSourceSearch] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Load favorites
  useEffect(() => {
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data: FavoriteItem[]) => {
        setFavoritesList(data);
        setFavorites(new Set(data.map((f) => f.mangaId)));
      })
      .catch(() => {});
  }, []);

  // Load history
  const loadHistory = useCallback(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data: HistoryItem[]) => setHistory(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Load manga
  const loadManga = useCallback(async (query: string, view: HomeView) => {
    setLoading(true);
    try {
      const url = query
        ? `/api/manga/search?q=${encodeURIComponent(query)}&limit=24`
        : view === "latest"
        ? `/api/manga/search?type=latest&limit=24`
        : `/api/manga/search?type=popular&limit=24`;

      const res = await fetch(url);
      const data = await res.json();
      setMangas(data.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadManga(searchQuery, homeView);
  }, [searchQuery, homeView, loadManga]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setHomeView("search");
    setActiveTab("home");
  };

  const handleFavToggle = async (manga: MangaDetail | MangaItem) => {
    const isFav = favorites.has(manga.id);
    if (isFav) {
      await fetch(`/api/favorites?mangaId=${manga.id}`, { method: "DELETE" });
      setFavorites((prev) => {
        const s = new Set(prev);
        s.delete(manga.id);
        return s;
      });
      setFavoritesList((prev) => prev.filter((f) => f.mangaId !== manga.id));
      showNotif("💔 Removed from favorites");
    } else {
      const detail = manga as MangaDetail;
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mangaId: manga.id,
          mangaTitle: manga.title,
          mangaCover: manga.cover,
          mangaDescription: detail.description || "",
          sourceId: manga.source || "MANGADEX",
          genres: manga.genres,
          status: manga.status,
        }),
      });
      if (res.ok) {
        setFavorites((prev) => new Set([...prev, manga.id]));
        showNotif("❤️ Added to favorites!");
        // Reload favorites list
        fetch("/api/favorites")
          .then((r) => r.json())
          .then((data: FavoriteItem[]) => setFavoritesList(data))
          .catch(() => {});
      }
    }
  };

  const handleReadChapter = (chapterId: string, chapterNum: string, manga: MangaDetail, chapters: Chapter[]) => {
    setSelectedMangaId(null);
    setReader({ chapterId, chapterNum, manga, chapters });
  };

  const handleSaveHistory = useCallback(
    async (chapterId: string, chapterNum: string, page: number) => {
      if (!reader) return;
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mangaId: reader.manga.id,
          mangaTitle: reader.manga.title,
          mangaCover: reader.manga.cover,
          sourceId: reader.manga.source || "MANGADEX",
          chapterId,
          chapterTitle: null,
          chapterNumber: chapterNum,
          pageNumber: page,
        }),
      });
    },
    [reader]
  );

  // Filtered sources
  const filteredSources = MANGA_SOURCES.filter((s) => {
    const matchLang = langFilter === "all" || s.lang === langFilter;
    const matchType = typeFilter === "all" || s.type === typeFilter;
    const matchSearch = sourceSearch === "" || s.name.toLowerCase().includes(sourceSearch.toLowerCase()) || s.domain.toLowerCase().includes(sourceSearch.toLowerCase());
    return matchLang && matchType && matchSearch;
  });

  const navItems: { tab: Tab; icon: React.ReactNode; label: string; badge?: string }[] = [
    { tab: "home", icon: <Home size={20} />, label: "Home" },
    { tab: "sources", icon: <Globe size={20} />, label: "Sources", badge: `${MANGA_SOURCES.length}` },
    { tab: "favorites", icon: <Heart size={20} />, label: "Saved", badge: favorites.size > 0 ? String(favorites.size) : undefined },
    { tab: "history", icon: <History size={20} />, label: "History" },
    { tab: "settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#0f0f1a" }}>
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-60 border-r-2 border-purple-900/40 fixed top-0 left-0 h-full z-20"
        style={{ background: "#0b0919" }}>
        {/* Logo */}
        <div className="p-5 border-b-3 border-purple-900/40" style={{ borderBottom: "3px solid rgba(88,28,220,0.2)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl animate-wiggle"
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "3px solid #0d0b1a", boxShadow: "3px 3px 0 #0d0b1a" }}
            >
              <img src="/logo.svg" alt="MangaVerse" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="manga-title-font text-2xl gradient-text-purple leading-none">MangaVerse</h1>
              <p className="text-slate-500 text-[0.65rem] font-extrabold uppercase tracking-wider">Read. Explore. Discover.</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
              className={`sidebar-link w-full ${activeTab === item.tab ? "active" : ""}`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="badge-hot px-2">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Stats */}
        <div className="p-4" style={{ borderTop: "3px solid rgba(88,28,220,0.2)" }}>
          <div className="cartoon-card p-3 space-y-2.5">
            <p className="text-slate-500 text-[0.6rem] font-extrabold uppercase tracking-widest mb-2">Your Stats</p>
            {[
              { label: "Sources", val: MANGA_SOURCES.length, icon: "📚", color: "text-purple-400" },
              { label: "Saved", val: favorites.size, icon: "❤️", color: "text-pink-400" },
              { label: "Chapters Read", val: history.length, icon: "📖", color: "text-emerald-400" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold">{s.icon} {s.label}</span>
                <span className={`${s.color} font-extrabold text-sm`}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div className="w-64 h-full flex flex-col" style={{ background: "#0b0919", borderRight: "3px solid rgba(88,28,220,0.3)" }} onClick={e => e.stopPropagation()}>
              <div className="p-5 flex items-center gap-3" style={{ borderBottom: "3px solid rgba(88,28,220,0.2)" }}>
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "2.5px solid #0d0b1a", boxShadow: "3px 3px 0 #0d0b1a" }}
                >
                  <img src="/logo.svg" alt="MangaVerse" className="w-7 h-7" />
                </div>
                <h1 className="manga-title-font text-2xl gradient-text-purple">MangaVerse</h1>
                <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => { setActiveTab(item.tab); setSidebarOpen(false); }}
                    className={`sidebar-link w-full ${activeTab === item.tab ? "active" : ""}`}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && <span className="badge-count">{item.badge}</span>}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style={{ background: "rgba(11,9,25,0.96)", backdropFilter: "blur(16px)", borderBottom: "3px solid rgba(88,28,220,0.2)" }}>
          <button
            className="md:hidden cartoon-btn p-2 text-white"
            style={{ background: "#17152e" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-2">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "2px solid #0d0b1a", boxShadow: "2px 2px 0 #0d0b1a" }}
            >
              <img src="/logo.svg" alt="MangaVerse" className="w-6 h-6" />
            </div>
            <span className="manga-title-font text-xl gradient-text-purple">MangaVerse</span>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl flex gap-2 ml-auto">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search manga, manhwa, manhua..."
                className="cartoon-input w-full pl-9 pr-4 py-2.5 text-sm"
              />
            </div>
            <button type="submit" className="cartoon-btn px-4 py-2.5 text-sm text-white font-extrabold" style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}>
              Go!
            </button>
          </form>
        </header>

        {/* Content area */}
        <div className="flex-1 p-4 md:p-6">

          {/* HOME TAB */}
          {activeTab === "home" && (
            <div>
              {/* Hero banner */}
              {homeView !== "search" && !searchQuery && (
                <div className="hero-banner mb-6 p-6 md:p-8">
                  <div className="panel-dots absolute inset-0 rounded-2xl" />
                  <div className="speed-lines absolute inset-0 rounded-2xl" />
                  <div className="relative flex items-center gap-6">
                    <div className="animate-float flex-shrink-0 hidden sm:block">
                      <div
                        className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center rounded-2xl"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", border: "4px solid #0d0b1a", boxShadow: "6px 6px 0 #0d0b1a" }}
                      >
                        <img src="/logo.svg" alt="MangaVerse" className="w-16 h-16 md:w-20 md:h-20" />
                      </div>
                    </div>
                    <div>
                      <h1 className="manga-title-font text-4xl md:text-6xl gradient-text-purple mb-1">
                        MangaVerse!
                      </h1>
                      <p className="text-slate-300 font-bold text-sm md:text-base max-w-md">
                        Read manga from <span className="text-amber-400 font-extrabold">{MANGA_SOURCES.length}+ sources</span> in one place. No redirects, no ads, pure reading joy! ✨
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="cartoon-tag bg-purple-600 text-white">🗾 Manga</span>
                        <span className="cartoon-tag bg-blue-600 text-white">🇰🇷 Manhwa</span>
                        <span className="cartoon-tag bg-red-600 text-white">🇨🇳 Manhua</span>
                        <span className="cartoon-tag bg-amber-500 text-black">💥 Comics</span>
                      </div>
                    </div>
                  </div>
                  {/* Scrolling ticker */}
                  <div className="mt-4 ticker-wrap rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.3)", border: "2px solid rgba(124,58,237,0.3)", padding: "6px 0" }}>
                    <div className="ticker-content text-xs font-extrabold text-purple-300 whitespace-nowrap">
                      &nbsp;&nbsp;🔥 HOT: One Piece &bull; Jujutsu Kaisen &bull; Solo Leveling &bull; Chainsaw Man &bull; Demon Slayer &bull; Attack on Titan &bull; My Hero Academia &bull; Spy x Family &bull; Blue Lock &bull; Vinland Saga &bull; Berserk &bull; Bleach &bull; Naruto &bull; Dragon Ball &bull; Noblesse &bull; Tower of God &nbsp;&nbsp;🔥 HOT: One Piece &bull; Jujutsu Kaisen &bull; Solo Leveling &bull; Chainsaw Man &bull; Demon Slayer &bull; Attack on Titan &bull; My Hero Academia &bull; Spy x Family &bull; Blue Lock &bull; Vinland Saga &bull; Berserk &bull; Bleach &bull; Naruto &bull; Dragon Ball &bull; Noblesse &bull; Tower of God
                    </div>
                  </div>
                </div>
              )}

              {/* View tabs */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {searchQuery ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSearchQuery(""); setSearchInput(""); setHomeView("popular"); }}
                      className="cartoon-btn px-3 py-1.5 text-white text-sm font-bold flex items-center gap-1"
                      style={{ background: "#17152e" }}
                    >
                      <X size={14} /> Clear
                    </button>
                    <span className="text-slate-300 font-bold text-sm">
                      Results for &quot;<span className="text-purple-300">{searchQuery}</span>&quot;
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setHomeView("popular")}
                      className={`cartoon-btn px-4 py-2 text-sm font-extrabold flex items-center gap-1.5 ${homeView === "popular" ? "text-white" : "text-slate-300"}`}
                      style={homeView === "popular" ? { background: "linear-gradient(135deg, #7c3aed, #a855f7)" } : { background: "#17152e" }}
                    >
                      <TrendingUp size={15} /> Popular
                    </button>
                    <button
                      onClick={() => setHomeView("latest")}
                      className={`cartoon-btn px-4 py-2 text-sm font-extrabold flex items-center gap-1.5 ${homeView === "latest" ? "text-white" : "text-slate-300"}`}
                      style={homeView === "latest" ? { background: "linear-gradient(135deg, #f97316, #fbbf24)" } : { background: "#17152e" }}
                    >
                      <Clock size={15} /> Latest
                    </button>
                  </>
                )}
                {!loading && mangas.length > 0 && (
                  <span className="ml-auto text-slate-500 text-xs font-bold">
                    {mangas.length} results
                  </span>
                )}
              </div>

              {/* Manga grid */}
              {loading ? (
                <LoadingSkeleton count={12} />
              ) : mangas.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-7xl mb-4 animate-float">😕</div>
                  <h3 className="text-white font-extrabold text-xl mb-2">No manga found!</h3>
                  <p className="text-slate-400 font-bold">Try a different search term</p>
                </div>
              ) : (
                <div className="manga-grid">
                  {mangas.map((m) => (
                    <MangaCard
                      key={m.id}
                      manga={m}
                      onClick={() => setSelectedMangaId(m.id)}
                      isFav={favorites.has(m.id)}
                      onFavToggle={(e) => { e.stopPropagation(); handleFavToggle(m); }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SOURCES TAB */}
          {activeTab === "sources" && (
            <div>
              <div className="mb-6">
                <h2 className="manga-title-font text-3xl gradient-text-purple mb-1">All Sources 🌍</h2>
                <p className="text-slate-400 font-bold text-sm">
                  Browse {MANGA_SOURCES.length} manga sources from around the world
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-5">
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                  placeholder="🔍 Search sources..."
                  className="cartoon-input px-4 py-2 text-sm"
                />
                <select
                  value={langFilter}
                  onChange={(e) => setLangFilter(e.target.value)}
                  className="cartoon-input px-3 py-2 text-sm"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="cartoon-input px-3 py-2 text-sm"
                >
                  <option value="all">📚 All Types</option>
                  <option value="manga">🗾 Manga</option>
                  <option value="manhwa">🇰🇷 Manhwa</option>
                  <option value="manhua">🇨🇳 Manhua</option>
                  <option value="comics">💥 Comics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredSources.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    onClick={() => {
                      if (source.id === "MANGADEX") {
                        setActiveTab("home");
                        setHomeView("popular");
                        showNotif("📚 Browsing MangaDex!");
                      } else {
                        setSearchInput(source.name);
                        setSearchQuery(source.name);
                        setActiveTab("home");
                        showNotif(`🔍 Searching on ${source.name}...`);
                      }
                    }}
                  />
                ))}
              </div>

              {filteredSources.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-7xl mb-4 animate-float">🔍</div>
                  <h3 className="text-white font-extrabold text-xl">No sources found</h3>
                  <p className="text-slate-400 font-bold mt-1">Try different filters</p>
                </div>
              )}
            </div>
          )}

          {/* FAVORITES TAB */}
          {activeTab === "favorites" && (
            <div>
              <div className="mb-6">
                <h2 className="manga-title-font text-3xl gradient-text-purple mb-1">My Library ❤️</h2>
                <p className="text-slate-400 font-bold text-sm">{favoritesList.length} saved titles</p>
              </div>

              {favoritesList.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-7xl mb-4 animate-float">💔</div>
                  <h3 className="text-white font-extrabold text-xl mb-2">No favorites yet!</h3>
                  <p className="text-slate-400 font-bold mb-4">Start reading and save your favorites ❤️</p>
                  <button
                    onClick={() => setActiveTab("home")}
                    className="cartoon-btn px-6 py-3 text-white font-extrabold"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
                  >
                    Browse Manga 🚀
                  </button>
                </div>
              ) : (
                <div className="manga-grid">
                  {favoritesList.map((fav) => (
                    <MangaCard
                      key={fav.id}
                      manga={{
                        id: fav.mangaId,
                        title: fav.mangaTitle,
                        cover: fav.mangaCover || "",
                        status: fav.status || "",
                        genres: (fav.genres as string[]) || [],
                        description: "",
                        source: fav.sourceId,
                        contentRating: "safe",
                        originalLanguage: "en",
                      }}
                      onClick={() => setSelectedMangaId(fav.mangaId)}
                      isFav={true}
                      onFavToggle={(e) => {
                        e.stopPropagation();
                        handleFavToggle({
                          id: fav.mangaId,
                          title: fav.mangaTitle,
                          cover: fav.mangaCover || "",
                          status: fav.status || "",
                          genres: (fav.genres as string[]) || [],
                          description: "",
                          source: fav.sourceId,
                          contentRating: "safe",
                          originalLanguage: "en",
                        });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === "history" && (
            <div>
              <div className="mb-6">
                <h2 className="manga-title-font text-3xl gradient-text-purple mb-1">Reading History 📖</h2>
                <p className="text-slate-400 font-bold text-sm">{history.length} chapters read</p>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-7xl mb-4 animate-float">📕</div>
                  <h3 className="text-white font-extrabold text-xl mb-2">No reading history!</h3>
                  <p className="text-slate-400 font-bold mb-4">Start reading manga to track your progress</p>
                  <button
                    onClick={() => setActiveTab("home")}
                    className="cartoon-btn px-6 py-3 text-white font-extrabold"
                    style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
                  >
                    Start Reading! 🚀
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="cartoon-card p-3 flex items-center gap-3 cursor-pointer"
                      onClick={() => setSelectedMangaId(item.mangaId)}
                    >
                      <div className="relative w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 border-purple-700">
                        {item.mangaCover ? (
                          <Image src={item.mangaCover} alt={item.mangaTitle} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-xl">📚</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-extrabold text-sm truncate">{item.mangaTitle}</h3>
                        <p className="text-purple-300 text-xs font-bold">
                          Chapter {item.chapterNumber || "?"} · Page {item.pageNumber || 1}
                        </p>
                        <p className="text-slate-500 text-xs font-semibold mt-0.5">
                          {new Date(item.readAt).toLocaleDateString()} · {new Date(item.readAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <BookOpen size={18} className="text-purple-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="max-w-lg">
              <div className="mb-6">
                <h2 className="manga-title-font text-3xl gradient-text-purple mb-1">Settings ⚙️</h2>
                <p className="text-slate-400 font-bold text-sm">Customize your reading experience</p>
              </div>

              <div className="space-y-4">
                <div className="cartoon-card p-4">
                  <h3 className="text-white font-extrabold text-sm mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-purple-400" /> Reading
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm font-bold">Default reader mode</span>
                      <select className="cartoon-input px-3 py-1.5 text-sm">
                        <option value="scroll">📜 Scroll</option>
                        <option value="page">📄 Page by Page</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm font-bold">Default language</span>
                      <select className="cartoon-input px-3 py-1.5 text-sm">
                        <option value="en">🇬🇧 English</option>
                        <option value="ja">🇯🇵 Japanese</option>
                        <option value="ko">🇰🇷 Korean</option>
                        <option value="zh">🇨🇳 Chinese</option>
                        <option value="fr">🇫🇷 French</option>
                        <option value="es">🇪🇸 Spanish</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="cartoon-card p-4">
                  <h3 className="text-white font-extrabold text-sm mb-3 flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" /> About MangaVerse
                  </h3>
                  <div className="space-y-2 text-sm text-slate-300 font-semibold">
                    <p>📚 <span className="text-purple-300 font-extrabold">{MANGA_SOURCES.length}</span> manga sources integrated</p>
                    <p>🌍 <span className="text-green-400 font-extrabold">14</span> languages supported</p>
                    <p>🦊 Powered by <span className="text-orange-400 font-extrabold">Kotatsu Parsers</span> sources list</p>
                    <p>📡 Live data from <span className="text-blue-400 font-extrabold">MangaDex API</span></p>
                    <div className="mt-3 p-3 rounded-xl bg-purple-900/30 border border-purple-700/30">
                      <p className="text-purple-200 text-xs">
                        ⚠️ This app is for reading purposes only. Please support original manga creators and publishers!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="cartoon-card p-4">
                  <h3 className="text-white font-extrabold text-sm mb-3 flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" /> Stats
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Sources", value: MANGA_SOURCES.length, icon: "🌍", color: "text-purple-400" },
                      { label: "Favorites", value: favorites.size, icon: "❤️", color: "text-pink-400" },
                      { label: "History", value: history.length, icon: "📖", color: "text-green-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-3 rounded-xl bg-[#16213e] border border-purple-900/30">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className={`font-extrabold text-xl ${stat.color}`}>{stat.value}</div>
                        <div className="text-slate-400 text-xs font-bold">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom mobile nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex" style={{ background: "rgba(11,9,25,0.97)", borderTop: "3px solid rgba(88,28,220,0.25)" }}>
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-extrabold transition-all duration-150 ${
                activeTab === item.tab ? "text-purple-300" : "text-slate-600"
              }`}
            >
              <div className="relative">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-150 ${
                    activeTab === item.tab ? "" : ""
                  }`}
                  style={activeTab === item.tab ? { background: "linear-gradient(135deg,#7c3aed,#a855f7)", border: "2px solid #0d0b1a", boxShadow: "2px 2px 0 #0d0b1a" } : {}}
                >
                  {item.icon}
                </div>
                {item.badge && (
                  <span className="absolute -top-1 -right-2 badge-count text-[0.5rem] px-1">{item.badge}</span>
                )}
              </div>
              <span className="text-[0.6rem]">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      {/* Manga detail modal */}
      {selectedMangaId && (
        <MangaDetailModal
          mangaId={selectedMangaId}
          onClose={() => setSelectedMangaId(null)}
          onReadChapter={(chapterId, chapterNum, manga) => {
            // We need chapters for navigation
            fetch(`/api/manga/${manga.id}/chapters?lang=en&limit=500`)
              .then((r) => r.json())
              .then((data) => {
                handleReadChapter(chapterId, chapterNum, manga, data.chapters || []);
              });
          }}
          favorites={favorites}
          onFavToggle={handleFavToggle}
        />
      )}

      {/* Reader */}
      {reader && (
        <Reader
          chapterId={reader.chapterId}
          chapterNum={reader.chapterNum}
          manga={reader.manga}
          allChapters={reader.chapters}
          onClose={() => { setReader(null); loadHistory(); }}
          onSaveHistory={handleSaveHistory}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[200] notif-toast animate-pop-in">
          {notification}
        </div>
      )}
    </div>
  );
}
