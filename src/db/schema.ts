import { pgTable, text, timestamp, integer, boolean, jsonb, serial, varchar } from "drizzle-orm/pg-core";

export const readingHistory = pgTable("reading_history", {
  id: serial("id").primaryKey(),
  mangaId: varchar("manga_id", { length: 255 }).notNull(),
  mangaTitle: text("manga_title").notNull(),
  mangaCover: text("manga_cover"),
  sourceId: varchar("source_id", { length: 100 }).notNull(),
  chapterId: varchar("chapter_id", { length: 255 }).notNull(),
  chapterTitle: text("chapter_title"),
  chapterNumber: text("chapter_number"),
  pageNumber: integer("page_number").default(1),
  readAt: timestamp("read_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  mangaId: varchar("manga_id", { length: 255 }).notNull(),
  mangaTitle: text("manga_title").notNull(),
  mangaCover: text("manga_cover"),
  mangaDescription: text("manga_description"),
  sourceId: varchar("source_id", { length: 100 }).notNull(),
  genres: jsonb("genres"),
  status: varchar("status", { length: 50 }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  mangaId: varchar("manga_id", { length: 255 }).notNull(),
  sourceId: varchar("source_id", { length: 100 }).notNull(),
  chapterId: varchar("chapter_id", { length: 255 }).notNull(),
  pageNumber: integer("page_number").default(1).notNull(),
  totalPages: integer("total_pages"),
  completed: boolean("completed").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
