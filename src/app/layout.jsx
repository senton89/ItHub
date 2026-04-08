import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "IThub — Справочник IT-ресурсов",
  description: "Аккуратная коллекция инструментов, платформ и материалов для разработчиков. Каталог ресурсов с элементами справочника.",
  keywords: ["IT", "ресурсы", "разработчики", "справочник", "инструменты", "документация"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
