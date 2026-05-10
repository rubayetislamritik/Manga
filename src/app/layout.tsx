import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "MangaVerse 📚 - Read Manga, Manhwa & Manhua Online Free",
  description:
    "The ultimate cartoon-style manga reader. Browse and read manga, manhwa, and manhua from 80+ sources in one beautiful app. No ads, no redirects!",
  keywords: ["manga", "manhwa", "manhua", "reader", "online", "free", "comics", "anime"],
  openGraph: {
    title: "MangaVerse - Read Manga Online",
    description: "80+ sources. Pure reading joy.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0d0b1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
