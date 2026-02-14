import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Скрипткин — разработка сайтов под ключ",
    template: "%s — Скрипткин",
  },
  description:
    "Студия «Скрипткин» проектирует, дизайнит и разворачивает сайты на современных технологиях: от прототипа до продакшена.",
  applicationName: "Скрипткин",
  keywords: [
    "разработка сайтов",
    "веб-студия",
    "Next.js",
    "дизайн",
    "фронтенд",
    "лендинги",
    "SaaS",
    "e-commerce",
  ],
  authors: [{ name: "Скрипткин" }],
  creator: "Скрипткин",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Скрипткин — разработка сайтов под ключ",
    description:
      "Студия «Скрипткин» проектирует, дизайнит и разворачивает сайты на современных технологиях: от прототипа до продакшена.",
    type: "website",
    locale: "ru_RU",
    siteName: "Скрипткин",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "Скрипткин — разработка сайтов под ключ",
    description:
      "Студия «Скрипткин» проектирует, дизайнит и разворачивает сайты на современных технологиях: от прототипа до продакшена.",
    images: [],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${manrope.variable} antialiased bg-background text-foreground`}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
