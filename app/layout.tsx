import type { Metadata } from "next";
import { Onest, Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "SkullFlame — онлайн-школа видеомонтажа",
  description:
    "Курсы монтажа Reels, Shorts и YouTube-роликов в Premiere Pro, DaVinci Resolve и CapCut. Тарифы PRO, MAX и ULTRA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
