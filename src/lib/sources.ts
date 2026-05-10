export interface MangaSource {
  id: string;
  name: string;
  domain: string;
  lang: string;
  langFlag: string;
  icon: string;
  type: "manga" | "manhwa" | "manhua" | "comics" | "all";
  nsfw?: boolean;
  broken?: boolean;
  description?: string;
}

export const MANGA_SOURCES: MangaSource[] = [
  // === ENGLISH ===
  { id: "MANGADEX", name: "MangaDex", domain: "mangadex.org", lang: "en", langFlag: "🌐", icon: "📚", type: "all" },
  { id: "MANGAOWL", name: "MangaOwl", domain: "mangaowl.one", lang: "en", langFlag: "🇬🇧", icon: "🦉", type: "manga" },
  { id: "MANGAHERE", name: "MangaHere", domain: "mangahere.cc", lang: "en", langFlag: "🇬🇧", icon: "📖", type: "manga" },
  { id: "MANGAPARK", name: "MangaPark", domain: "mangapark.net", lang: "en", langFlag: "🇬🇧", icon: "🌳", type: "manga" },
  { id: "MANGANATO", name: "MangaNato", domain: "chapmanganato.to", lang: "en", langFlag: "🇬🇧", icon: "📕", type: "manga" },
  { id: "MANGAREADER_NET", name: "MangaReader", domain: "mangareader.to", lang: "en", langFlag: "🇬🇧", icon: "🔖", type: "manga" },
  { id: "MANGAKAKALOT", name: "MangaKakalot", domain: "mangakakalot.com", lang: "en", langFlag: "🇬🇧", icon: "📘", type: "manga" },
  { id: "ASURASCANS", name: "Asura Scans", domain: "asuracomic.net", lang: "en", langFlag: "🇬🇧", icon: "⚡", type: "manhwa" },
  { id: "REAPERSCANS", name: "Reaper Scans", domain: "reaperscans.com", lang: "en", langFlag: "🇬🇧", icon: "💀", type: "manhwa" },
  { id: "FLAMESCANS", name: "Flame Scans", domain: "flamecomics.xyz", lang: "en", langFlag: "🇬🇧", icon: "🔥", type: "manhwa" },
  { id: "LUMINOUSSCANS", name: "Luminous Scans", domain: "luminousscans.com", lang: "en", langFlag: "🇬🇧", icon: "✨", type: "manhwa" },
  { id: "VOIDSCANS", name: "Void Scans", domain: "void-scans.com", lang: "en", langFlag: "🇬🇧", icon: "🌌", type: "manhwa" },
  { id: "NIGHTSCANS", name: "Night Scans", domain: "nightscans.net", lang: "en", langFlag: "🇬🇧", icon: "🌙", type: "manhwa" },
  { id: "DRAKECOMIC", name: "Drake Comics", domain: "drakecomic.com", lang: "en", langFlag: "🇬🇧", icon: "🐉", type: "manhwa" },
  { id: "WEBTOONS", name: "WebToons", domain: "webtoons.com", lang: "en", langFlag: "🇬🇧", icon: "📱", type: "manhwa" },
  { id: "MANGABAT", name: "MangaBat", domain: "m.mangabat.com", lang: "en", langFlag: "🇬🇧", icon: "🦇", type: "manga" },
  { id: "ANIWAVE", name: "AniWave", domain: "aniwave.to", lang: "en", langFlag: "🇬🇧", icon: "🌊", type: "manga" },
  { id: "HARIMANGA", name: "HariManga", domain: "harimanga.com", lang: "en", langFlag: "🇬🇧", icon: "🌺", type: "manhwa" },
  { id: "BATO", name: "Bato.to", domain: "bato.to", lang: "en", langFlag: "🌐", icon: "🐸", type: "all" },
  { id: "DYNASTY_SCANS", name: "Dynasty Scans", domain: "dynasty-scans.com", lang: "en", langFlag: "🇬🇧", icon: "👑", type: "manga" },
  { id: "MANGA4LIFE", name: "Manga4Life", domain: "manga4life.com", lang: "en", langFlag: "🇬🇧", icon: "❤️", type: "manga" },
  { id: "MANGANELO", name: "Manganelo", domain: "manganelo.com", lang: "en", langFlag: "🇬🇧", icon: "🌸", type: "manga" },
  { id: "MANGAFREAK", name: "MangaFreak", domain: "w15.mangafreak.net", lang: "en", langFlag: "🇬🇧", icon: "⚡", type: "manga" },
  { id: "MANGATOWN", name: "MangaTown", domain: "www.mangatown.com", lang: "en", langFlag: "🇬🇧", icon: "🏙️", type: "manga" },
  { id: "READM", name: "ReadM", domain: "readm.org", lang: "en", langFlag: "🇬🇧", icon: "📚", type: "manga" },
  { id: "MANGACHAN", name: "Manga-Chan", domain: "manga-chan.com", lang: "en", langFlag: "🇬🇧", icon: "🎀", type: "manga" },
  { id: "TOONILY", name: "Toonily", domain: "toonily.com", lang: "en", langFlag: "🇬🇧", icon: "🎭", type: "manhwa" },
  { id: "ZINMANGA", name: "ZinManga", domain: "zinmanga.com", lang: "en", langFlag: "🇬🇧", icon: "⚡", type: "manga" },
  { id: "MANHWACLAN", name: "Manhwa Clan", domain: "manhwaclan.com", lang: "en", langFlag: "🇬🇧", icon: "⚔️", type: "manhwa" },
  { id: "ISEKAISCAN", name: "Isekai Scan", domain: "isekaiscan.com", lang: "en", langFlag: "🇬🇧", icon: "🗡️", type: "manhwa" },

  // === JAPANESE ===
  { id: "RAWKUMA", name: "RawKuma", domain: "rawkuma.com", lang: "ja", langFlag: "🇯🇵", icon: "🗾", type: "manga" },
  { id: "NICOMANGA", name: "NicoManga", domain: "nicomanga.com", lang: "ja", langFlag: "🇯🇵", icon: "🍣", type: "manga" },
  { id: "KLMANGA", name: "KLManga", domain: "klmanga.com", lang: "ja", langFlag: "🇯🇵", icon: "🌸", type: "manga" },
  { id: "CMCZIP", name: "CMCZip", domain: "cmczip.com", lang: "ja", langFlag: "🇯🇵", icon: "📦", type: "manga" },
  { id: "TWICEMANGA", name: "TwiceManga", domain: "twicemanga.com", lang: "ja", langFlag: "🇯🇵", icon: "✌️", type: "manga" },

  // === RUSSIAN ===
  { id: "REMANGA", name: "ReManga", domain: "remanga.org", lang: "ru", langFlag: "🇷🇺", icon: "📖", type: "manga" },
  { id: "MANGALIB", name: "MangaLib", domain: "mangalib.me", lang: "ru", langFlag: "🇷🇺", icon: "📚", type: "manga" },
  { id: "DESU", name: "Desu", domain: "desu.me", lang: "ru", langFlag: "🇷🇺", icon: "🎌", type: "manga" },
  { id: "MINTMANGA", name: "MintManga", domain: "mintmanga.live", lang: "ru", langFlag: "🇷🇺", icon: "🌿", type: "manga" },
  { id: "YAOICHAN", name: "YaoiChan", domain: "yaoi-chan.me", lang: "ru", langFlag: "🇷🇺", icon: "🌸", type: "manga" },
  { id: "SELFMANGA", name: "SelfManga", domain: "selfmanga.live", lang: "ru", langFlag: "🇷🇺", icon: "✍️", type: "manga" },

  // === CHINESE ===
  { id: "MANHUAREN", name: "ManHuaRen", domain: "www.manhuaren.com", lang: "zh", langFlag: "🇨🇳", icon: "🐉", type: "manhua" },
  { id: "COPYMANGA", name: "CopyManga", domain: "www.copymanga.site", lang: "zh", langFlag: "🇨🇳", icon: "📋", type: "manhua" },
  { id: "BAOZIMH", name: "BaoZiMH", domain: "www.baozimh.com", lang: "zh", langFlag: "🇨🇳", icon: "🥟", type: "manhua" },
  { id: "PANDA_MANGA_CN", name: "Panda Manga", domain: "www.manhuabei.com", lang: "zh", langFlag: "🇨🇳", icon: "🐼", type: "manhua" },
  { id: "MHGUI", name: "MHGui", domain: "www.mhgui.com", lang: "zh", langFlag: "🇨🇳", icon: "🎨", type: "manhua" },
  { id: "KOMIIC", name: "Komiic", domain: "komiic.com", lang: "zh", langFlag: "🇨🇳", icon: "📰", type: "manhua" },

  // === KOREAN ===
  { id: "NEWTOKI", name: "NewToki", domain: "newtoki.kr", lang: "ko", langFlag: "🇰🇷", icon: "🌙", type: "manhwa" },
  { id: "KAKAOPAGE", name: "KakaoPage", domain: "page.kakao.com", lang: "ko", langFlag: "🇰🇷", icon: "💬", type: "manhwa" },
  { id: "NAVER_WEBTOON", name: "Naver Webtoon", domain: "comic.naver.com", lang: "ko", langFlag: "🇰🇷", icon: "🟢", type: "manhwa" },
  { id: "LEZHIN_COMICS_KO", name: "Lezhin Comics", domain: "www.lezhin.com", lang: "ko", langFlag: "🇰🇷", icon: "💎", type: "manhwa" },

  // === FRENCH ===
  { id: "SCANTRAD", name: "Scantrad", domain: "scantrad.net", lang: "fr", langFlag: "🇫🇷", icon: "🥖", type: "manga" },
  { id: "JAPSCAN", name: "JapScan", domain: "www.japscan.lol", lang: "fr", langFlag: "🇫🇷", icon: "🗼", type: "manga" },
  { id: "SUSHI_SCAN", name: "Sushi Scan", domain: "sushiscan.net", lang: "fr", langFlag: "🇫🇷", icon: "🍱", type: "manga" },
  { id: "ANIME_SAMA", name: "Anime-Sama", domain: "anime-sama.fr", lang: "fr", langFlag: "🇫🇷", icon: "⭐", type: "manga" },

  // === SPANISH ===
  { id: "MANGASPROJECT", name: "MangasProject", domain: "mangas.pw", lang: "es", langFlag: "🇪🇸", icon: "💃", type: "manga" },
  { id: "HEAVENMANGA", name: "HeavenManga", domain: "heavenmanga.com", lang: "es", langFlag: "🇪🇸", icon: "😇", type: "manga" },
  { id: "TUMANGAONLINE", name: "TuMangaOnline", domain: "lectortmo.com", lang: "es", langFlag: "🇪🇸", icon: "📖", type: "manga" },
  { id: "INMANGA", name: "InManga", domain: "inmanga.com", lang: "es", langFlag: "🇪🇸", icon: "🌟", type: "manga" },
  { id: "LEERCAPITULO", name: "LeerCapitulo", domain: "leercapitulo.com", lang: "es", langFlag: "🇪🇸", icon: "📖", type: "manga" },

  // === PORTUGUESE ===
  { id: "MANGASCAN_PT", name: "MangaScan", domain: "mangascan.com.br", lang: "pt", langFlag: "🇧🇷", icon: "🎯", type: "manga" },
  { id: "BRMANGAS", name: "BRMangas", domain: "brmangas.net", lang: "pt", langFlag: "🇧🇷", icon: "🎭", type: "manga" },
  { id: "MANGAHOSTED", name: "MangaHosted", domain: "mangahosted.com", lang: "pt", langFlag: "🇧🇷", icon: "🏠", type: "manga" },
  { id: "TSUKI_ADVENTURES", name: "Tsuki Adventures", domain: "tsukimangas.com", lang: "pt", langFlag: "🇧🇷", icon: "🌙", type: "manga" },
  { id: "SLIMEREAD", name: "SlimeRead", domain: "slimeread.com", lang: "pt", langFlag: "🇧🇷", icon: "🟢", type: "manga" },

  // === TURKISH ===
  { id: "MANGASHIPPO", name: "MangaShippo", domain: "mangashippo.com", lang: "tr", langFlag: "🇹🇷", icon: "⚓", type: "manga" },
  { id: "TURKMANGA", name: "TurkManga", domain: "turkmanga.net", lang: "tr", langFlag: "🇹🇷", icon: "🌙", type: "manga" },
  { id: "MANGAGUN", name: "MangaGun", domain: "mangagun.com", lang: "tr", langFlag: "🇹🇷", icon: "💥", type: "manga" },

  // === ARABIC ===
  { id: "MANGA_ARAB", name: "Manga Arab", domain: "mangarabi.com", lang: "ar", langFlag: "🇸🇦", icon: "📜", type: "manga" },
  { id: "3ASQMANGA", name: "3ASQ Manga", domain: "3asq.org", lang: "ar", langFlag: "🇸🇦", icon: "🌙", type: "manga" },
  { id: "TEAM_X", name: "Team X", domain: "teamxmanga.com", lang: "ar", langFlag: "🇸🇦", icon: "❌", type: "manga" },
  { id: "GMANGA", name: "GManga", domain: "gmanga.org", lang: "ar", langFlag: "🇸🇦", icon: "🎯", type: "manga" },

  // === INDONESIAN ===
  { id: "KOMIKU", name: "Komiku", domain: "komiku.id", lang: "id", langFlag: "🇮🇩", icon: "🏝️", type: "manga" },
  { id: "KOMIKCAST", name: "KomikCast", domain: "komikcast.io", lang: "id", langFlag: "🇮🇩", icon: "📻", type: "manga" },
  { id: "WESTMANGA", name: "WestManga", domain: "westmanga.fun", lang: "id", langFlag: "🇮🇩", icon: "🌅", type: "manga" },
  { id: "KIRYUU", name: "Kiryuu", domain: "kiryuu.id", lang: "id", langFlag: "🇮🇩", icon: "🦋", type: "manga" },

  // === UKRAINIAN ===
  { id: "MANGALIB_UA", name: "MangaLib UA", domain: "mangalib.me", lang: "uk", langFlag: "🇺🇦", icon: "🌻", type: "manga" },
  { id: "COMICS_UA", name: "Comics UA", domain: "comics.ua", lang: "uk", langFlag: "🇺🇦", icon: "📘", type: "manga" },

  // === VIETNAMESE ===
  { id: "NETTRUYEN", name: "NetTruyen", domain: "nettruyen.com", lang: "vi", langFlag: "🇻🇳", icon: "⭐", type: "manga" },
  { id: "TRUYENQQ", name: "TruyenQQ", domain: "truyenqq.com.vn", lang: "vi", langFlag: "🇻🇳", icon: "⭐", type: "manga" },
  { id: "BLOGTRUYEN", name: "BlogTruyen", domain: "blogtruyen.vn", lang: "vi", langFlag: "🇻🇳", icon: "📝", type: "manga" },

  // === BELARUSIAN ===
  { id: "DESU_BE", name: "Desu.me (BE)", domain: "desu.me", lang: "be", langFlag: "🇧🇾", icon: "📖", type: "manga" },
];

export const LANGUAGES = [
  { code: "all", name: "All Languages", flag: "🌐" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
];

export const CONTENT_TYPES = [
  { code: "all", name: "All Types", icon: "📚" },
  { code: "manga", name: "Manga", icon: "🗾" },
  { code: "manhwa", name: "Manhwa", icon: "🇰🇷" },
  { code: "manhua", name: "Manhua", icon: "🇨🇳" },
  { code: "comics", name: "Comics", icon: "💥" },
];

export function getSourceById(id: string): MangaSource | undefined {
  return MANGA_SOURCES.find((s) => s.id === id);
}

export function getSourcesByLanguage(lang: string): MangaSource[] {
  if (lang === "all") return MANGA_SOURCES;
  return MANGA_SOURCES.filter((s) => s.lang === lang);
}
