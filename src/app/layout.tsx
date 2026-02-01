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
  title: "Скрипткин — разработка сайтов под ключ",
  description:
    "Студия «Скрипткин» проектирует, дизайнит и разворачивает сайты на современных технологиях: от прототипа до продакшена.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Скрипткин — разработка сайтов под ключ",
    description:
      "Студия «Скрипткин» проектирует, дизайнит и разворачивает сайты на современных технологиях: от прототипа до продакшена.",
    images: ["/logo.png"],
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
